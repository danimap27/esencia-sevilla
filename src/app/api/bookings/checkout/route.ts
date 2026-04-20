import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe, createCheckoutSession } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { generateBookingId, calculatePrice } from '@/lib/utils';
import { APARTMENT, UPSELLS } from '@/data/apartment';
import { parseISO, format } from 'date-fns';

const bookingSchema = z.object({
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.number().int().min(1).max(APARTMENT.maxGuests),
  upsells: z.array(z.object({ id: z.string(), price: z.number(), name: z.string() })).optional().default([]),
  couponCode: z.string().optional(),
  locale: z.string().default('es'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { checkIn, checkOut, guests, upsells, couponCode, locale } = bookingSchema.parse(body);

    const checkInDate = parseISO(checkIn);
    const checkOutDate = parseISO(checkOut);

    // Check minimum stay
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / 86400000);
    if (nights < 2) {
      return NextResponse.json({ error: 'Minimum stay is 2 nights' }, { status: 400 });
    }

    // Check availability
    const { data: blocked } = await supabaseAdmin
      .from('blocked_dates')
      .select('date')
      .gte('date', checkIn)
      .lt('date', checkOut);

    if (blocked && blocked.length > 0) {
      return NextResponse.json({ error: 'Dates not available' }, { status: 409 });
    }

    // Validate coupon
    let couponDiscount = 0;
    if (couponCode) {
      const { data: coupon } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('active', true)
        .single();

      if (coupon) {
        const now = new Date();
        const validFrom = coupon.valid_from ? new Date(coupon.valid_from) : null;
        const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

        if ((!validFrom || validFrom <= now) && (!validUntil || validUntil >= now)) {
          if (!coupon.max_uses || coupon.uses_count < coupon.max_uses) {
            const priceCalc = calculatePrice(checkInDate, checkOutDate, guests);
            couponDiscount = coupon.discount_type === 'percent'
              ? Math.round(priceCalc.subtotal * (coupon.discount_value / 100))
              : Math.min(coupon.discount_value, priceCalc.subtotal);
          }
        }
      }
    }

    const upsellsTotal = upsells.reduce((s, u) => s + u.price, 0);
    const priceBreakdown = calculatePrice(checkInDate, checkOutDate, guests, upsellsTotal, 10, couponDiscount);

    const bookingRef = generateBookingId();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://esenciasevilla.com';

    // Create Stripe checkout session
    const upsellNames: Record<string, string> = {
      'airport-transfer': 'Traslado aeropuerto SVQ',
      'welcome-pack': 'Pack bienvenida local',
      'late-checkout': 'Late check-out hasta 14:00',
      'travel-cot': 'Cuna de viaje',
      'romantic-pack': 'Pack romántico (vino + flores)',
    };

    const session = await createCheckoutSession({
      checkIn,
      checkOut,
      guests,
      guestName: '',
      guestEmail: '',
      nights,
      pricePerNight: Math.round(APARTMENT.basePricePerNight * 0.9),
      cleaningFee: APARTMENT.cleaningFee,
      touristTax: Math.round(guests * nights * APARTMENT.touristTaxPerPersonNight * 100) / 100,
      upsells: upsells.map(u => ({ name: upsellNames[u.id] || u.name, price: u.price })),
      discount: couponDiscount,
      totalAmount: priceBreakdown.total,
      locale,
      bookingRef,
      successUrl: `${siteUrl}/${locale}/reserva-confirmada?ref=${bookingRef}&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${siteUrl}/${locale}#reservar`,
    });

    // Save pending booking to Supabase
    await supabaseAdmin.from('bookings').insert({
      booking_ref: bookingRef,
      check_in: checkIn,
      check_out: checkOut,
      guests,
      guest_name: '',
      guest_email: '',
      total_amount: priceBreakdown.total,
      status: 'pending',
      payment_intent_id: session.payment_intent,
      upsells: JSON.stringify(upsells),
      coupon_code: couponCode,
      discount_amount: couponDiscount,
      source: 'direct',
      locale,
    });

    return NextResponse.json({ url: session.url, bookingRef });
  } catch (error) {
    console.error('Checkout error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid booking data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Booking failed. Please try again.' }, { status: 500 });
  }
}

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export interface CreateCheckoutParams {
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  nights: number;
  pricePerNight: number;
  cleaningFee: number;
  touristTax: number;
  upsells: Array<{ name: string; price: number }>;
  discount: number;
  totalAmount: number;
  locale: string;
  bookingRef: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(params: CreateCheckoutParams) {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: 'eur',
        product_data: {
          name: `Esencia Sevilla — ${params.nights} noche${params.nights > 1 ? 's' : ''}`,
          description: `Check-in: ${params.checkIn} | Check-out: ${params.checkOut} | ${params.guests} huéspedes`,
          images: ['https://esenciasevilla.com/og-image.jpg'],
        },
        unit_amount: Math.round(params.pricePerNight * params.nights * 100),
      },
      quantity: 1,
    },
  ];

  if (params.cleaningFee > 0) {
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: { name: 'Tasa de limpieza' },
        unit_amount: Math.round(params.cleaningFee * 100),
      },
      quantity: 1,
    });
  }

  if (params.touristTax > 0) {
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: { name: 'Tasa turística (Junta de Andalucía)' },
        unit_amount: Math.round(params.touristTax * 100),
      },
      quantity: 1,
    });
  }

  for (const upsell of params.upsells) {
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: { name: upsell.name },
        unit_amount: Math.round(upsell.price * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    customer_email: params.guestEmail,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      booking_ref: params.bookingRef,
      check_in: params.checkIn,
      check_out: params.checkOut,
      guests: String(params.guests),
      guest_name: params.guestName,
      guest_email: params.guestEmail,
      locale: params.locale,
    },
    payment_intent_data: {
      description: `Esencia Sevilla — Ref: ${params.bookingRef}`,
      metadata: {
        booking_ref: params.bookingRef,
      },
    },
    locale: params.locale === 'es' ? 'es' : params.locale === 'fr' ? 'fr' : params.locale === 'de' ? 'de' : params.locale === 'it' ? 'it' : params.locale === 'pt' ? 'pt' : 'en',
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
  });

  return session;
}

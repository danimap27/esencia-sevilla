import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
import Stripe from 'stripe';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingRef = session.metadata?.booking_ref;
        const guestEmail = session.customer_email || '';
        const guestName = session.customer_details?.name || '';

        if (!bookingRef) break;

        // Update booking status in Supabase
        const { data: booking } = await supabaseAdmin
          .from('bookings')
          .update({
            status: 'confirmed',
            guest_email: guestEmail,
            guest_name: guestName,
            payment_intent_id: session.payment_intent,
            updated_at: new Date().toISOString(),
          })
          .eq('booking_ref', bookingRef)
          .select()
          .single();

        if (!booking) break;

        // Block the dates
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        const dates = [];
        let current = new Date(checkIn);
        while (current < checkOut) {
          dates.push({
            date: current.toISOString().split('T')[0],
            reason: `Reserva ${bookingRef}`,
            source: 'direct',
            booking_ref: bookingRef,
          });
          current.setDate(current.getDate() + 1);
        }

        await supabaseAdmin.from('blocked_dates').upsert(dates, { onConflict: 'date' });

        // Send confirmation email
        if (guestEmail) {
          await sendConfirmationEmail({
            email: guestEmail,
            name: guestName,
            bookingRef,
            checkIn: booking.check_in,
            checkOut: booking.check_out,
            guests: booking.guests,
            total: booking.total_amount,
            locale: booking.locale || 'es',
          });
        }

        // Send WhatsApp notification to owner
        await notifyOwner({ bookingRef, guestName, guestEmail, checkIn: booking.check_in, checkOut: booking.check_out });

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingRef = session.metadata?.booking_ref;
        if (bookingRef) {
          await supabaseAdmin
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('booking_ref', bookingRef)
            .eq('status', 'pending');
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

interface ConfirmationEmailParams {
  email: string;
  name: string;
  bookingRef: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  locale: string;
}

async function sendConfirmationEmail(params: ConfirmationEmailParams) {
  const { email, name, bookingRef, checkIn, checkOut, guests, total, locale } = params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://esenciasevilla.com';

  const subjects: Record<string, string> = {
    es: `✅ Reserva confirmada — Esencia Sevilla (Ref: ${bookingRef})`,
    en: `✅ Booking confirmed — Esencia Sevilla (Ref: ${bookingRef})`,
    fr: `✅ Réservation confirmée — Esencia Sevilla (Réf: ${bookingRef})`,
    de: `✅ Buchung bestätigt — Esencia Sevilla (Ref: ${bookingRef})`,
    it: `✅ Prenotazione confermata — Esencia Sevilla (Rif: ${bookingRef})`,
    pt: `✅ Reserva confirmada — Esencia Sevilla (Ref: ${bookingRef})`,
  };

  await resend.emails.send({
    from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
    to: email,
    subject: subjects[locale] || subjects.es,
    html: `
      <!DOCTYPE html>
      <html lang="${locale}">
      <head><meta charset="UTF-8"><title>Reserva Confirmada</title></head>
      <body style="font-family:Inter,sans-serif;background:#F7F0E3;margin:0;padding:20px;">
        <div style="max-width:600px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(43,30,21,0.1);">
          <div style="background:#C25A3A;padding:32px;text-align:center;">
            <h1 style="color:white;font-family:Georgia,serif;margin:0;font-size:28px;">Esencia Sevilla</h1>
            <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">Tu apartamento en Sevilla</p>
          </div>
          <div style="padding:32px;">
            <h2 style="color:#2B1E15;font-family:Georgia,serif;">¡Hola ${name}! 🌟</h2>
            <p style="color:#4A3728;">Tu reserva está confirmada. Aquí están los detalles:</p>

            <div style="background:#F7F0E3;border-radius:12px;padding:20px;margin:20px 0;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#6B5444;font-size:14px;">Referencia</td><td style="padding:8px 0;font-weight:600;text-align:right;">${bookingRef}</td></tr>
                <tr><td style="padding:8px 0;color:#6B5444;font-size:14px;">Check-in</td><td style="padding:8px 0;font-weight:600;text-align:right;">${checkIn} (desde las 16:00)</td></tr>
                <tr><td style="padding:8px 0;color:#6B5444;font-size:14px;">Check-out</td><td style="padding:8px 0;font-weight:600;text-align:right;">${checkOut} (antes de las 12:00)</td></tr>
                <tr><td style="padding:8px 0;color:#6B5444;font-size:14px;">Huéspedes</td><td style="padding:8px 0;font-weight:600;text-align:right;">${guests}</td></tr>
                <tr style="border-top:1px solid #EDE3D0;"><td style="padding:12px 0 8px;font-weight:600;">Total pagado</td><td style="padding:12px 0 8px;font-weight:700;color:#C25A3A;text-align:right;font-size:18px;">${total}€</td></tr>
              </table>
            </div>

            <div style="background:#2B1E15;border-radius:12px;padding:20px;margin:20px 0;color:white;">
              <h3 style="margin:0 0 12px;font-family:Georgia,serif;">📍 Dirección</h3>
              <p style="margin:0;opacity:0.8;">Imaginero Luis Álvarez Duarte, 7<br>41008 Sevilla, España</p>
            </div>

            <p style="color:#4A3728;font-size:14px;">
              <strong>Próximos pasos:</strong><br>
              • Recibirás las instrucciones de llegada y el código de acceso 24h antes del check-in<br>
              • Completa el pre-check-in online para agilizar tu llegada<br>
              • El libro de bienvenida digital te llegará antes de tu estancia
            </p>

            <div style="text-align:center;margin:28px 0;">
              <a href="${siteUrl}/${locale}/pre-checkin?ref=${bookingRef}"
                 style="display:inline-block;background:#C25A3A;color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:600;">
                Completar Pre-check-in
              </a>
            </div>
          </div>
          <div style="background:#F7F0E3;padding:20px;text-align:center;font-size:12px;color:#6B5444;">
            <p style="margin:0;">¿Preguntas? Escríbenos por WhatsApp al ${process.env.NEXT_PUBLIC_APARTMENT_PHONE}</p>
            <p style="margin:4px 0 0;">Nº Registro Turístico: ${process.env.NEXT_PUBLIC_REGISTRATION_NUMBER}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

async function notifyOwner(params: {
  bookingRef: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
}) {
  const { bookingRef, guestName, guestEmail, checkIn, checkOut } = params;
  // Twilio WhatsApp notification to owner
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const ownerWhatsApp = process.env.OWNER_WHATSAPP;
  const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM;

  if (!twilioSid || !twilioToken || !ownerWhatsApp || !fromWhatsApp) return;

  try {
    const message = `🏠 *Nueva reserva confirmada — Esencia Sevilla*\n\n📋 Ref: ${bookingRef}\n👤 Huésped: ${guestName}\n📧 Email: ${guestEmail}\n📅 Check-in: ${checkIn}\n📅 Check-out: ${checkOut}`;

    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ From: fromWhatsApp, To: ownerWhatsApp, Body: message }),
    });
  } catch (e) {
    console.error('WhatsApp notification error:', e);
  }
}

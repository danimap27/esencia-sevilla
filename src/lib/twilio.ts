/**
 * Twilio WhatsApp Cloud API client for guest notifications.
 * Uses Twilio's WhatsApp Business API.
 *
 * Messages:
 * - Booking confirmation
 * - Pre-check-in reminder (3 days before)
 * - Check-in day: access code + map
 * - Check-out day: thank you + review link
 */

const TWILIO_BASE_URL = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}`;

interface SendMessageParams {
  to: string;
  body: string;
}

export async function sendWhatsApp({ to, body }: SendMessageParams): Promise<{ success: boolean; error?: string }> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!sid || !token || !from) {
    console.warn('Twilio credentials not configured. WhatsApp message not sent.');
    return { success: false, error: 'Twilio not configured' };
  }

  try {
    const res = await fetch(`${TWILIO_BASE_URL}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: from,
        To: to,
        Body: body,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Twilio error:', errorData);
      return { success: false, error: errorData.message || 'Twilio API error' };
    }

    return { success: true };
  } catch (e) {
    console.error('Twilio fetch error:', e);
    return { success: false, error: String(e) };
  }
}

// Pre-built message templates
export const WHATSAPP_TEMPLATES = {
  confirmation: (bookingRef: string, checkIn: string, checkOut: string) =>
    `¡Reserva confirmada! 🌞\n\nEsencia Sevilla\nRef: ${bookingRef}\nEntrada: ${checkIn}\nSalida: ${checkOut}\n\nCompleta tu pre-check-in en: ${process.env.NEXT_PUBLIC_SITE_URL}/es/pre-checkin?ref=${bookingRef}`,

  reminder: (checkIn: string) =>
    `¡Tu estancia en Esencia Sevilla se acerca! 🌞\n\nEntrada: ${checkIn}\n\n¿No has completado el pre-check-in? Hazlo aquí: ${process.env.NEXT_PUBLIC_SITE_URL}/es/pre-checkin`,

  checkinDay: (accessCode: string) =>
    `¡Bienvenido a Esencia Sevilla! 🗝️\n\nCódigo de acceso: ${accessCode}\n\nInstrucciones de llegada: ${process.env.NEXT_PUBLIC_SITE_URL}/es/welcome-book\n\n¿Necesitas ayuda? Responde a este mensaje.`,

  checkoutDay: () =>
    `¡Gracias por elegir Esencia Sevilla! 💛\n\nEsperamos que hayas disfrutado tu estancia.\n\nDeja tu reseña: ${process.env.NEXT_PUBLIC_SITE_URL}/es#reseñas\n\n¡Vuelve pronto! 🌞`,
};
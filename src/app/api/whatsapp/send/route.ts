import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsApp, WHATSAPP_TEMPLATES } from '@/lib/twilio';

export async function POST(req: NextRequest) {
  try {
    const { type, to, bookingRef, checkIn, checkOut, accessCode } = await req.json();

    if (!to || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let body: string;
    switch (type) {
      case 'confirmation':
        body = WHATSAPP_TEMPLATES.confirmation(bookingRef || '', checkIn || '', checkOut || '');
        break;
      case 'reminder':
        body = WHATSAPP_TEMPLATES.reminder(checkIn || '');
        break;
      case 'checkin-day':
        body = WHATSAPP_TEMPLATES.checkinDay(accessCode || '');
        break;
      case 'checkout-day':
        body = WHATSAPP_TEMPLATES.checkoutDay();
        break;
      default:
        return NextResponse.json({ error: 'Invalid message type' }, { status: 400 });
    }

    const result = await sendWhatsApp({ to, body });

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
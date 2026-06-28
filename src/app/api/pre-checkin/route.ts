import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const {
      bookingRef,
      guests,
    } = await req.json();

    if (!bookingRef || !guests || !Array.isArray(guests) || guests.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate each guest has required fields
    for (const guest of guests) {
      if (!guest.firstName || !guest.lastName || !guest.documentType || !guest.documentNumber || !guest.nationality) {
        return NextResponse.json({ error: 'Incomplete guest data' }, { status: 400 });
      }
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Update booking with pre-check-in data
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        guest_name: `${guests[0].firstName} ${guests[0].lastName}`,
        guest_passport_type: guests[0].documentType,
        guest_passport_number: guests[0].documentNumber,
        guest_nationality: guests[0].nationality,
        guest_birthdate: guests[0].birthDate,
        estimated_arrival_time: guests[0].estimatedArrivalTime,
        special_needs: guests[0].specialNeeds,
        precheckin_completed: true,
        precheckin_completed_at: new Date().toISOString(),
      })
      .eq('booking_ref', bookingRef);

    if (updateError) {
      console.error('Supabase error:', updateError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Generate Parte de Viajeros data (SES.HOSPEDERIA format)
    const parteViajeros = guests.map((g: any) => ({
      nombre: g.firstName,
      apellidos: g.lastName,
      tipoDocumento: g.documentType,
      numeroDocumento: g.documentNumber,
      nacionalidad: g.nationality,
      fechaNacimiento: g.birthDate,
      fechaEntrada: new Date().toISOString().split('T')[0],
    }));

    return NextResponse.json({
      success: true,
      parteViajeros,
    });
  } catch (error) {
    console.error('Pre-checkin error:', error);
    return NextResponse.json({ error: 'Failed to submit pre-check-in' }, { status: 500 });
  }
}
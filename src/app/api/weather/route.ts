import { NextRequest, NextResponse } from 'next/server';
import { openMeteoUrl, mapOpenMeteo } from '@/lib/weather-codes';

// Open-Meteo API — free, no API key required
const SEVILLE_LAT = process.env.NEXT_PUBLIC_APARTMENT_LAT || '37.3968636';
const SEVILLE_LNG = process.env.NEXT_PUBLIC_APARTMENT_LNG || '-5.9742189';

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(openMeteoUrl(SEVILLE_LAT, SEVILLE_LNG), {
      next: { revalidate: 1800 }, // Cache 30 min
    });

    if (!res.ok) {
      throw new Error(`Open-Meteo error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(mapOpenMeteo(data));
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Weather data unavailable' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

// Open-Meteo API — free, no API key required
// Seville coordinates: 37.3886, -5.9823
const SEVILLE_LAT = process.env.NEXT_PUBLIC_APARTMENT_LAT || '37.3886';
const SEVILLE_LNG = process.env.NEXT_PUBLIC_APARTMENT_LNG || '-5.9823';

export async function GET(req: NextRequest) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${SEVILLE_LAT}&longitude=${SEVILLE_LNG}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe/Madrid&forecast_days=7`;

    const res = await fetch(url, {
      next: { revalidate: 1800 }, // Cache 30 min
    });

    if (!res.ok) {
      throw new Error(`Open-Meteo error: ${res.status}`);
    }

    const data = await res.json();

    // Map weather codes to readable descriptions + icons
    const weatherIcons: Record<number, { icon: string; es: string; en: string }> = {
      0: { icon: '☀️', es: 'Despejado', en: 'Clear sky' },
      1: { icon: '🌤️', es: 'Mayormente despejado', en: 'Mainly clear' },
      2: { icon: '⛅', es: 'Parcialmente nublado', en: 'Partly cloudy' },
      3: { icon: '☁️', es: 'Nublado', en: 'Overcast' },
      45: { icon: '🌫️', es: 'Niebla', en: 'Fog' },
      48: { icon: '🌫️', es: 'Niebla con escarcha', en: 'Rime fog' },
      51: { icon: '🌦️', es: 'Llovizna ligera', en: 'Light drizzle' },
      53: { icon: '🌦️', es: 'Llovizna', en: 'Drizzle' },
      55: { icon: '🌧️', es: 'Llovizna densa', en: 'Dense drizzle' },
      61: { icon: '🌧️', es: 'Lluvia ligera', en: 'Light rain' },
      63: { icon: '🌧️', es: 'Lluvia', en: 'Rain' },
      65: { icon: '🌧️', es: 'Lluvia fuerte', en: 'Heavy rain' },
      71: { icon: '🌨️', es: 'Nieve ligera', en: 'Light snow' },
      73: { icon: '🌨️', es: 'Nieve', en: 'Snow' },
      75: { icon: '❄️', es: 'Nieve fuerte', en: 'Heavy snow' },
      80: { icon: '🌧️', es: 'Aguaceros', en: 'Rain showers' },
      81: { icon: '🌧️', es: 'Aguaceros fuertes', en: 'Heavy showers' },
      82: { icon: '⛈️', es: 'Aguaceros violentos', en: 'Violent showers' },
      95: { icon: '⛈️', es: 'Tormenta', en: 'Thunderstorm' },
      96: { icon: '⛈️', es: 'Tormenta con granizo', en: 'Thunderstorm + hail' },
      99: { icon: '⛈️', es: 'Tormenta con granizo fuerte', en: 'Heavy thunderstorm' },
    };

    const currentCode = data.current?.weather_code ?? 0;
    const weatherInfo = weatherIcons[currentCode] || { icon: '🌤️', es: 'Despejado', en: 'Clear' };

    const result = {
      current: {
        temperature: Math.round(data.current?.temperature_2m ?? 20),
        weatherCode: currentCode,
        icon: weatherInfo.icon,
        description: weatherInfo.es,
        windSpeed: Math.round(data.current?.wind_speed_10m ?? 0),
        humidity: data.current?.relative_humidity_2m ?? 0,
      },
      forecast: data.daily?.time?.map((date: string, i: number) => ({
        date,
        maxTemp: Math.round(data.daily.temperature_2m_max[i]),
        minTemp: Math.round(data.daily.temperature_2m_min[i]),
        icon: (weatherIcons[data.daily.weather_code[i]] || { icon: '🌤️' }).icon,
        precipitation: data.daily.precipitation_probability_max[i] ?? 0,
      })) ?? [],
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Weather data unavailable' },
      { status: 500 }
    );
  }
}
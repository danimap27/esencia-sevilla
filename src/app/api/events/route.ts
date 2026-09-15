import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { SEVILLE_EVENTS } from '@/data/events';

// Lee data/events.json en runtime (lo actualiza el cron semanal de eventos).
// Fallback a los eventos hardcodeados si el fichero no existe o está corrupto.
export const dynamic = 'force-dynamic';

interface EventsFile {
  updatedAt?: string;
  source?: string;
  events?: unknown[];
}

export async function GET() {
  try {
    const file = path.join(process.cwd(), 'data', 'events.json');
    const raw = await fs.readFile(file, 'utf-8');
    const parsed = JSON.parse(raw) as EventsFile;

    if (Array.isArray(parsed.events) && parsed.events.length > 0) {
      return NextResponse.json(
        { events: parsed.events, updatedAt: parsed.updatedAt ?? null, source: parsed.source ?? 'file' },
        { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=600' } }
      );
    }
    throw new Error('events.json vacío o sin array events');
  } catch {
    return NextResponse.json(
      { events: SEVILLE_EVENTS, updatedAt: null, source: 'static-fallback' },
      { headers: { 'Cache-Control': 'public, max-age=300' } }
    );
  }
}

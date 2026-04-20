import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { format, addDays, parseISO } from 'date-fns';

// Cache availability for 5 minutes
const cache = new Map<string, { data: unknown; expires: number }>();

export async function GET(req: NextRequest) {
  const cacheKey = 'availability';
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json(cached.data);
  }

  try {
    // Get blocked dates from Supabase
    const today = format(new Date(), 'yyyy-MM-dd');
    const threeMonthsFromNow = format(addDays(new Date(), 120), 'yyyy-MM-dd');

    const { data: blockedFromDB, error } = await supabaseAdmin
      .from('blocked_dates')
      .select('date')
      .gte('date', today)
      .lte('date', threeMonthsFromNow);

    if (error) throw error;

    // Sync with iCal feeds (Booking.com + Airbnb)
    const icalBlockedDates = await syncICalFeeds();

    const allBlockedDates = [
      ...(blockedFromDB?.map(d => d.date) || []),
      ...icalBlockedDates,
    ];

    // Deduplicate
    const uniqueBlockedDates = [...new Set(allBlockedDates)];

    const responseData = { blockedDates: uniqueBlockedDates };
    cache.set(cacheKey, { data: responseData, expires: Date.now() + 5 * 60 * 1000 });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Availability API error:', error);

    // Return demo blocked dates as fallback
    const demo = [];
    const start = addDays(new Date(), 5);
    for (let i = 0; i < 4; i++) {
      demo.push(format(addDays(start, i), 'yyyy-MM-dd'));
    }
    // Add another block 3 weeks out
    const start2 = addDays(new Date(), 21);
    for (let i = 0; i < 3; i++) {
      demo.push(format(addDays(start2, i), 'yyyy-MM-dd'));
    }

    return NextResponse.json({ blockedDates: demo });
  }
}

async function syncICalFeeds(): Promise<string[]> {
  const blockedDates: string[] = [];

  const feeds = [
    process.env.ICAL_BOOKING_URL,
    process.env.ICAL_AIRBNB_URL,
  ].filter(Boolean) as string[];

  for (const feedUrl of feeds) {
    try {
      const res = await fetch(feedUrl, { next: { revalidate: 3600 } });
      const text = await res.text();
      const dates = parseICalBlocked(text);
      blockedDates.push(...dates);
    } catch (e) {
      console.error('iCal fetch error:', e);
    }
  }

  return blockedDates;
}

function parseICalBlocked(icalText: string): string[] {
  const blocked: string[] = [];
  const lines = icalText.split('\n');
  let inEvent = false;
  let dtstart = '';
  let dtend = '';
  let summary = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === 'BEGIN:VEVENT') {
      inEvent = true;
      dtstart = '';
      dtend = '';
      summary = '';
    } else if (trimmed === 'END:VEVENT') {
      if (inEvent && dtstart && dtend) {
        // Generate all dates in the range
        try {
          const start = new Date(dtstart.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
          const end = new Date(dtend.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
          let current = new Date(start);
          while (current < end) {
            blocked.push(format(current, 'yyyy-MM-dd'));
            current = addDays(current, 1);
          }
        } catch {}
      }
      inEvent = false;
    } else if (inEvent) {
      if (trimmed.startsWith('DTSTART')) {
        dtstart = trimmed.split(':')[1] || trimmed.split(';')[1]?.split(':')[1] || '';
      } else if (trimmed.startsWith('DTEND')) {
        dtend = trimmed.split(':')[1] || trimmed.split(';')[1]?.split(':')[1] || '';
      } else if (trimmed.startsWith('SUMMARY')) {
        summary = trimmed.replace('SUMMARY:', '');
      }
    }
  }

  return blocked;
}

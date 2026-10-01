'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { parseISO, format, type Locale as DateFnsLocale } from 'date-fns';
import { es, enUS, fr, de, it, pt } from 'date-fns/locale';
import { type Locale } from '@/i18n';
import { type SevilleEvent } from '@/types';
import { SEVILLE_EVENTS } from '@/data/events';

const DATE_FNS_LOCALES: Record<Locale, DateFnsLocale> = {
  es,
  en: enUS,
  fr,
  de,
  it,
  pt,
};

// Eventos en curso primero, luego próximos por fecha; nunca los ya terminados
function relevant(events: SevilleEvent[], limit: number): SevilleEvent[] {
  const todayISO = format(new Date(), 'yyyy-MM-dd');
  return [...events]
    .filter((e) => e.endDate >= todayISO)
    .sort((a, b) => {
      const aLive = a.startDate <= todayISO && a.endDate >= todayISO;
      const bLive = b.startDate <= todayISO && b.endDate >= todayISO;
      if (aLive !== bLive) return aLive ? -1 : 1;
      return a.startDate.localeCompare(b.startDate);
    })
    .slice(0, limit);
}

export default function GuideEvents({ limit = 6 }: { limit?: number }) {
  const t = useTranslations('guide');
  const locale = useLocale() as Locale;
  const [events, setEvents] = useState<SevilleEvent[]>(() => relevant(SEVILLE_EVENTS, limit));

  // Eventos dinámicos (data/events.json vía /api/events, actualizado por cron)
  useEffect(() => {
    let cancelled = false;
    fetch('/api/events')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: { events?: SevilleEvent[] }) => {
        if (!cancelled && Array.isArray(data.events) && data.events.length > 0) {
          setEvents(relevant(data.events, limit));
        }
      })
      .catch(() => {
        // Fallback silencioso a los eventos estáticos del bundle
      });
    return () => {
      cancelled = true;
    };
  }, [limit]);

  const dateFnsLocale = DATE_FNS_LOCALES[locale];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {events.map((event) => {
        const startDate = parseISO(event.startDate);
        const endDate = parseISO(event.endDate);
        const isSameDay = event.startDate === event.endDate;
        const dateLabel = isSameDay
          ? format(startDate, 'd MMM yyyy', { locale: dateFnsLocale })
          : `${format(startDate, 'd MMM yyyy', { locale: dateFnsLocale })} – ${format(endDate, 'd MMM yyyy', { locale: dateFnsLocale })}`;

        const title = event.title?.[locale] || event.title?.es || '';

        return (
          <div key={event.id} className="card group">
            {/* Foto del evento */}
            {event.image && (
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={event.image}
                  alt={title}
                  fill
                  unoptimized
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tinta/40 to-transparent" />
                {event.isHighSeason && (
                  <span className="absolute top-3 right-3 badge bg-terracota-500 text-white text-xs">★</span>
                )}
              </div>
            )}
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-serif text-lg text-tinta">{title}</h3>
                {event.isHighSeason && !event.image && (
                  <span className="badge bg-terracota-100 text-terracota-600 text-xs">★</span>
                )}
              </div>
              <p className="text-sm text-tinta/60">{dateLabel}</p>
              <p className="text-sm text-tinta/50 mt-2">{event.description?.[locale] || event.description?.es || ''}</p>
              {event.url && (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-terracota-500 mt-2 inline-block"
                >
                  {t('moreInfo')} ↗
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

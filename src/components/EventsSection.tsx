'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Calendar, ExternalLink, AlertCircle, Flame } from 'lucide-react';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { es, enUS, fr, de, it, pt } from 'date-fns/locale';
import { type Locale } from '@/i18n';
import { SEVILLE_EVENTS } from '@/data/events';
import { cn } from '@/lib/utils';

const DATE_FNS_LOCALES: Record<Locale, object> = {
  es, en: enUS, fr, de, it, pt,
};

const CATEGORY_COLORS: Record<string, string> = {
  festival: 'bg-ocre-100 text-ocre-700',
  culture: 'bg-azulejo-100 text-azulejo-700',
  music: 'bg-purple-100 text-purple-700',
  religious: 'bg-amber-100 text-amber-800',
  gastronomy: 'bg-green-100 text-green-700',
  sports: 'bg-blue-100 text-blue-700',
};

export default function EventsSection() {
  const t = useTranslations('events');
  const tBooking = useTranslations('booking');
  const locale = useLocale() as Locale;
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const dateFnsLocale = DATE_FNS_LOCALES[locale] as Parameters<typeof format>[2]['locale'];

  const now = new Date();

  const sortedEvents = [...SEVILLE_EVENTS].sort((a, b) =>
    parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()
  );

  const scrollToBooking = () => {
    document.querySelector('#reservar')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="eventos" className="py-16 md:py-24 bg-crema-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-subtitle mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((event) => {
            const startDate = parseISO(event.startDate);
            const endDate = parseISO(event.endDate);
            const isUpcoming = isAfter(endDate, now);
            const isNear = isAfter(endDate, now) && isBefore(startDate, addDays(now, 120));
            const isSameDay = event.startDate === event.endDate;

            return (
              <div
                key={event.id}
                className={cn(
                  'card overflow-hidden group transition-all duration-300 hover:-translate-y-1',
                  !isUpcoming && 'opacity-60'
                )}
                onMouseEnter={() => setHoveredId(event.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title[locale]}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tinta/60 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={cn('badge', CATEGORY_COLORS[event.category] || 'bg-white/20 text-white')}>
                      {event.category}
                    </span>
                    {event.isHighSeason && (
                      <span className="badge bg-terracota-500 text-white">
                        <Flame size={10} />
                        {t('highSeason').split(' — ')[0]}
                      </span>
                    )}
                  </div>

                  {/* Dates on image */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <Calendar size={14} className="text-ocre-300" />
                      <span>
                        {isSameDay
                          ? format(startDate, 'd MMMM yyyy', { locale: dateFnsLocale })
                          : `${format(startDate, 'd MMM', { locale: dateFnsLocale })} – ${format(endDate, 'd MMM yyyy', { locale: dateFnsLocale })}`
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-serif font-semibold text-tinta mb-2 line-clamp-2">
                    {event.title[locale]}
                  </h3>
                  <p className="text-sm text-tinta/70 line-clamp-3 mb-4">
                    {event.description[locale]}
                  </p>

                  {/* High season warning */}
                  {event.isHighSeason && isNear && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-terracota-50 border border-terracota-200 mb-4">
                      <AlertCircle size={14} className="text-terracota-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-terracota-700">{t('limitedAvailability')}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {event.url && (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-sm py-2 px-4 flex-1 text-center justify-center"
                      >
                        <ExternalLink size={14} />
                        {t('viewMore')}
                      </a>
                    )}
                    {isUpcoming && (
                      <button
                        onClick={scrollToBooking}
                        className="btn-primary text-sm py-2 px-4 flex-1 justify-center"
                      >
                        {t('bookForEvent')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Weather widget placeholder */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="card p-6 flex items-center gap-4">
            <div className="text-5xl">☀️</div>
            <div>
              <p className="font-semibold text-tinta">Sevilla ahora</p>
              <p className="text-3xl font-serif font-bold text-terracota-500">28°C</p>
              <p className="text-sm text-tinta/60">Despejado · Sensación 31°C</p>
            </div>
          </div>
          <div className="card p-6">
            <p className="font-semibold text-tinta mb-3">Próximos días</p>
            <div className="flex justify-between">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                <div key={day} className="text-center">
                  <p className="text-xs text-tinta/50 mb-1">{day}</p>
                  <span className="text-sm">{['☀️', '⛅', '☀️', '🌤️', '☀️', '☀️', '⛅'][i]}</span>
                  <p className="text-xs font-medium mt-1">{[28, 25, 29, 27, 30, 31, 26][i]}°</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

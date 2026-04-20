'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Star, ExternalLink, Quote } from 'lucide-react';
import { type Locale } from '@/i18n';
import { REVIEWS } from '@/data/reviews';
import { formatDate, getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

const SOURCE_ICONS: Record<string, string> = {
  google: '🔵',
  booking: '🏨',
  airbnb: '🔴',
  direct: '🏠',
};

export default function Reviews() {
  const t = useTranslations('reviews');
  const locale = useLocale() as Locale;
  const [expanded, setExpanded] = useState<string | null>(null);

  const avgRating = REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length;

  return (
    <section id="resenas" className="py-16 md:py-24 bg-crema">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="section-title">{t('title')}</h2>
            <p className="text-lg text-tinta-lighter">
              {t('subtitle', { count: REVIEWS.length })}
            </p>
          </div>

          {/* Overall rating */}
          <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-card border border-tinta/5">
            <div className="text-center">
              <div className="text-5xl font-serif font-bold text-terracota-500">
                {avgRating.toFixed(1)}
              </div>
              <div className="flex mt-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={14} fill={s <= Math.round(avgRating) ? '#C25A3A' : 'transparent'} stroke="#C25A3A" />
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium text-tinta">{t('overallRating')}</p>
              <p className="text-sm text-tinta/60">{t('basedOn', { count: REVIEWS.length })}</p>
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((review) => {
            const text = review.text[locale] || review.text.es;
            const isExpanded = expanded === review.id;
            const truncated = text.length > 200 && !isExpanded;

            return (
              <div
                key={review.id}
                className="card p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-200"
              >
                {/* Author + source */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-terracota-100 text-terracota-700 font-bold flex items-center justify-center text-sm font-mono">
                      {getInitials(review.author)}
                    </div>
                    <div>
                      <p className="font-medium text-tinta text-sm">{review.author}</p>
                      <p className="text-xs text-tinta/50 flex items-center gap-1">
                        <span>{review.countryFlag}</span>
                        <span>{review.country}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{SOURCE_ICONS[review.source]}</span>
                    <span className="text-xs text-tinta/40 capitalize">{review.source}</span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={14} fill="#C25A3A" stroke="#C25A3A" />
                  ))}
                </div>

                {/* Text */}
                <div className="relative">
                  <Quote size={20} className="text-terracota-200 absolute -top-1 -left-1" />
                  <p className={cn('text-sm text-tinta/80 leading-relaxed pl-4', truncated && 'line-clamp-3')}>
                    {text}
                  </p>
                  {text.length > 200 && (
                    <button
                      onClick={() => setExpanded(isExpanded ? null : review.id)}
                      className="mt-1 text-xs text-terracota-500 hover:text-terracota-700 font-medium"
                    >
                      {isExpanded ? 'Ver menos' : 'Leer más'}
                    </button>
                  )}
                </div>

                {/* Date */}
                <p className="text-xs text-tinta/40 mt-auto">
                  {formatDate(review.date, locale, 'MMMM yyyy')}
                </p>
              </div>
            );
          })}
        </div>

        {/* Leave review CTA */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a
            href="https://g.page/r/XXXXXXXX/review"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            🔵 <ExternalLink size={16} /> Dejar reseña en Google
          </a>
          <a
            href={`https://www.booking.com/Share-Skt5m9#tab-reviews`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            🏨 <ExternalLink size={16} /> Reseñar en Booking
          </a>
        </div>
      </div>
    </section>
  );
}

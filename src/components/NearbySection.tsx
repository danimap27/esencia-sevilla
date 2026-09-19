'use client';

import { useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Clock, Footprints, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { NEARBY } from '@/data/sights';
import { type Locale } from '@/i18n';
import { cn } from '@/lib/utils';

const CATEGORY_EMOJI: Record<string, string> = {
  supermarket: '🛒', convenience: '🏪', bakery: '🥖', pharmacy: '💊', tobacco: '🚬',
  bank: '🏦', atm: '💶', bus: '🚌', taxi: '🚕', tussam: '🚄',
  restaurant: '🍽️', bar: '🍺', fast_food: '🍔', laundry: '👕', cafe: '☕',
};

// orden de las categorías en los filtros
const CATEGORY_ORDER = [
  'supermarket', 'convenience', 'bakery', 'pharmacy', 'tobacco',
  'bus', 'taxi', 'tussam', 'bank', 'atm',
  'restaurant', 'bar', 'fast_food', 'laundry',
] as const;

export default function NearbySection() {
  const t = useTranslations('nearby');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;
  const [cat, setCat] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);

  const categories = useMemo(() => {
    const present = new Set(NEARBY.map((p) => p.category));
    return CATEGORY_ORDER.filter((c) => present.has(c));
  }, []);

  const VISIBLE_LIMIT = 9;
  const filteredItems = useMemo(
    () => NEARBY.filter((p) => cat === 'all' || p.category === cat),
    [cat]
  );
  const items = showAll ? filteredItems : filteredItems.slice(0, VISIBLE_LIMIT);

  return (
    <section id="cerca" className="py-16 md:py-24 bg-crema-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-subtitle mx-auto">{t('subtitle')}</p>
        </div>

        {/* Filtros por categoría */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setCat('all')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all border',
              cat === 'all'
                ? 'bg-terracota-500 text-white border-terracota-500'
                : 'bg-white text-tinta/60 border-tinta/10 hover:border-terracota-300'
            )}
          >
            {t('all')}
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all border',
                cat === c
                  ? 'bg-terracota-500 text-white border-terracota-500'
                  : 'bg-white text-tinta/60 border-tinta/10 hover:border-terracota-300'
              )}
            >
              <span className="mr-1.5">{CATEGORY_EMOJI[c]}</span>
              {t(`categories.${c}` as Parameters<typeof t>[0])}
            </button>
          ))}
        </div>

        {/* Grid de sitios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((place) => (
            <div key={place.id} className="card p-5 hover:-translate-y-1 transition-transform duration-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{CATEGORY_EMOJI[place.category] ?? '📍'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-tinta text-sm leading-snug">{place.name}</p>
                    {place.distance && (
                      <span className="badge bg-azulejo-100 text-azulejo-700 text-xs whitespace-nowrap flex-shrink-0">
                        <Footprints size={10} /> {place.distance}
                      </span>
                    )}
                  </div>
                  {place.description && (
                    <p className="text-xs text-tinta/65 mt-1 leading-relaxed">
                      {place.description[locale]}
                    </p>
                  )}
                  <div className="mt-2 space-y-0.5">
                    {place.address && (
                      <p className="text-xs text-tinta/55 flex items-center gap-1">
                        <MapPin size={11} className="flex-shrink-0" /> {place.address}
                      </p>
                    )}
                    {place.hours && (
                      <p className="text-xs text-tinta/55 flex items-center gap-1">
                        <Clock size={11} className="flex-shrink-0" /> {place.hours}
                      </p>
                    )}
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${place.lat},${place.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs text-azulejo-600 hover:text-azulejo-800"
                  >
                    <ExternalLink size={11} /> {t('openInMaps')}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ver más / Ver menos (sitios cercanos) */}
        {filteredItems.length > VISIBLE_LIMIT && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-tinta/10 text-azulejo-700 hover:border-terracota-300 hover:text-terracota-600 font-medium text-sm transition-all shadow-card"
            >
              {showAll ? (
                <>
                  <ChevronUp size={16} /> {tCommon('showLess')}
                </>
              ) : (
                <>
                  <ChevronDown size={16} /> {tCommon('showMore')} (+{filteredItems.length - VISIBLE_LIMIT})
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

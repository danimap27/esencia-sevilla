'use client';

import { useTranslations } from 'next-intl';
import { Check, X, TrendingDown } from 'lucide-react';
import { APARTMENT } from '@/data/apartment';
import { calculatePrice, getDynamicPrice, getDaysArray } from '@/lib/utils';
import { addDays } from 'date-fns';
import { useState, useEffect } from 'react';

export default function BookingComparison() {
  const t = useTranslations('comparison');
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    // Calculate savings for a sample 3-night stay
    const checkIn = addDays(new Date(), 7);
    const checkOut = addDays(checkIn, 3);
    const price = calculatePrice(checkIn, checkOut, 2, 0, 10);
    setSavings(price.savings || 0);
  }, []);

  const rows = [
    { key: 'price', direct: 'priceDirect', booking: 'priceBooking' },
    { key: 'cancellation', direct: 'cancellationDirect', booking: 'cancellationBooking' },
    { key: 'communication', direct: 'communicationDirect', booking: 'communicationBooking' },
    { key: 'extras', direct: 'extrasDirect', booking: 'extrasBooking' },
    { key: 'checkin', direct: 'checkinDirect', booking: 'checkinBooking' },
  ] as const;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-crema to-terracota-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-subtitle mx-auto">{t('subtitle')}</p>
        </div>

        {/* Savings highlight */}
        {savings > 0 && (
          <div className="flex items-center justify-center gap-3 mb-8 p-4 rounded-2xl bg-terracota-50 border border-terracota-200">
            <TrendingDown size={24} className="text-terracota-600" />
            <p className="text-lg font-serif text-tinta">
              <span className="font-bold text-terracota-600">{savings}€</span> de ahorro reservando directamente
            </p>
          </div>
        )}

        {/* Comparison table */}
        <div className="overflow-hidden rounded-2xl shadow-lg border border-tinta/10 bg-white">
          {/* Header */}
          <div className="grid grid-cols-3 bg-tinta text-crema">
            <div className="p-4 text-sm font-medium">{t('feature')}</div>
            <div className="p-4 text-center bg-terracota-500">
              <p className="font-serif font-bold text-lg">{t('direct')}</p>
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold mx-auto mt-1">ES</div>
            </div>
            <div className="p-4 text-center">
              <p className="font-medium text-sm">{t('booking')}</p>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, idx) => (
            <div
              key={row.key}
              className={`grid grid-cols-3 ${idx % 2 === 0 ? 'bg-white' : 'bg-crema/30'} border-t border-tinta/5`}
            >
              <div className="p-4 text-sm font-medium text-tinta/80 flex items-center">
                {t(`rows.${row.key}` as Parameters<typeof t>[0])}
              </div>
              <div className="p-4 text-center text-sm bg-terracota-50/50">
                <span className="text-tinta font-medium">
                  {t(`rows.${row.direct}` as Parameters<typeof t>[0])}
                </span>
              </div>
              <div className="p-4 text-center text-sm text-tinta/60">
                {t(`rows.${row.booking}` as Parameters<typeof t>[0])}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile card layout hint */}
        <p className="text-center text-xs text-tinta/40 mt-4">
          {APARTMENT.name} — {APARTMENT.registrationNumber}
        </p>
      </div>
    </section>
  );
}
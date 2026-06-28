'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function GuestCountdown({ checkInDate }: { checkInDate: string }) {
  const t = useTranslations('guestPortal');
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const checkIn = new Date(checkInDate);
    const now = new Date();
    const diff = Math.ceil((checkIn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    setDaysLeft(diff);
  }, [checkInDate]);

  if (daysLeft === null) return null;

  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-terracota-50 to-ocre-50 border border-terracota-100">
      <div className="w-14 h-14 rounded-2xl bg-terracota-500 flex items-center justify-center flex-shrink-0">
        <Calendar size={28} className="text-white" />
      </div>
      <div>
        {daysLeft > 0 ? (
          <p className="text-lg font-serif text-tinta font-bold">
            {t('countdown', { days: daysLeft })}
          </p>
        ) : daysLeft === 0 ? (
          <p className="text-lg font-serif text-terracota-600 font-bold">
            {t('countdownToday')}
          </p>
        ) : null}
        <p className="text-sm text-tinta/60">
          {new Date(checkInDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
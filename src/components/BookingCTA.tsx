'use client';

import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';
import { APARTMENT } from '@/data/apartment';

/**
 * Único punto de reserva de la web: redirige a Booking.com.
 * (La reserva directa con Stripe y los extras de pago están retirados.)
 */
export default function BookingCTA() {
  const t = useTranslations('bookingCta');

  return (
    <section id="reservar" className="py-16 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center">
        <h2 className="section-title">{t('title')}</h2>
        <p className="section-subtitle mx-auto">{t('text')}</p>
        <a
          href={APARTMENT.bookingComUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2 text-lg py-3.5 px-8 mt-6"
        >
          <ExternalLink size={18} />
          {t('button')}
        </a>
        <p className="text-sm text-tinta/50 mt-4">{t('note')}</p>
      </div>
    </section>
  );
}

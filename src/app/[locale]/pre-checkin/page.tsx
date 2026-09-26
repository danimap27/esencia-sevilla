import type { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { type Locale } from '@/i18n';
import { absoluteUrl } from '@/lib/utils';
import PreCheckinForm from '@/components/PreCheckinForm';
import GuestCountdown from '@/components/GuestCountdown';
import { APARTMENT } from '@/data/apartment';

export const metadata: Metadata = {
  title: 'Pre-check-in | Esencia Sevilla',
  description: 'Completa tu pre-check-in online para una llegada sin esperas.',
  robots: { index: false, follow: true },
};

export default async function PreCheckinPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { ref?: string; checkin?: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('guestPortal');

  return (
    <div className="min-h-screen bg-crema py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-xl bg-terracota-500 flex items-center justify-center font-serif font-bold text-white mx-auto mb-4 text-lg">
            ES
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-tinta mb-2">
            {t('preCheckin.pageTitle')}
          </h1>
          <p className="text-tinta/60 max-w-lg mx-auto">
            {t('preCheckin.pageIntro')}
          </p>
        </div>

        {/* Countdown (if checkin date provided) */}
        {searchParams.checkin && (
          <div className="mb-8">
            <GuestCountdown checkInDate={searchParams.checkin} />
          </div>
        )}

        {/* Pre-checkin form */}
        <PreCheckinForm bookingRef={searchParams.ref} />

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-tinta/50">
          <p>{APARTMENT.name} · {APARTMENT.registrationNumber}</p>
          <p className="mt-1">{APARTMENT.address}</p>
        </div>
      </div>
    </div>
  );
}
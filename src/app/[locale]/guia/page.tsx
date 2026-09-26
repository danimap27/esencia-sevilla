import type { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { absoluteUrl } from '@/lib/utils';
import { APARTMENT, EMERGENCY_CONTACTS, HOUSE_RULES } from '@/data/apartment';
import { SEVILLE_EVENTS } from '@/data/events';
import { TOURIST_ROUTES } from '@/data/routes';
import { type Locale } from '@/i18n';

const MapSection = dynamic(() => import('@/components/MapSection'), { ssr: false });
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false });
const WeatherWidget = dynamic(() => import('@/components/WeatherWidget'), { ssr: false });

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'seo' });
  return {
    title: t('guideTitle'),
    description: t('guideDescription'),
    robots: { index: true, follow: true },
    openGraph: {
      title: t('guideTitle'),
      description: t('guideDescription'),
      url: absoluteUrl(`/${locale}/guia`),
      type: 'website',
    },
  };
}

const LANG_FLAGS: Record<string, string> = {
  es: '🇪🇸', en: '🇬🇧', fr: '🇫🇷', de: '🇩🇪', it: '🇮🇹', pt: '🇵🇹',
};

const FEATURED_ROUTES = [
  'casco-antiguo',
  'rio-triana',
  'tapas-centro',
  'familia-maria-luisa',
  'familia-cuentos',
  'rincones-secretos',
];

export default async function GuidePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('guide');
  const tEmergency = await getTranslations('emergency');
  const loc = locale as Locale;

  const rules = t.raw('rules') as string[];
  const checkoutSteps = t.raw('checkoutSteps') as string[];
  const featured = FEATURED_ROUTES
    .map(id => TOURIST_ROUTES.find(r => r.id === id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  return (
    <div className="min-h-screen bg-crema">
      {/* Header */}
      <header className="bg-tinta text-crema py-5 px-6 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-terracota-500 flex items-center justify-center font-serif font-bold text-sm text-white">
              ES
            </div>
            <div>
              <p className="font-serif font-semibold">{t('headerTitle')}</p>
              <p className="text-xs text-crema/50">{APARTMENT.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge bg-green-500/20 text-green-300 text-xs hidden sm:inline-flex">
              📶 {t('offline')}
            </span>
            <Link href={`/${locale}`} className="text-xs text-crema/60 hover:text-crema">
              ← {t('back')}
            </Link>
          </div>
        </div>
      </header>

      {/* Prominent language selector */}
      <div className="bg-terracota-500 py-3 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="text-white text-xs font-medium mr-2">{t('langLabel')}</span>
          {Object.entries(LANG_FLAGS).map(([lang, flag]) => (
            <Link
              key={lang}
              href={`/${lang}/guia`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                locale === lang
                  ? 'bg-white text-terracota-600 shadow-sm'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {flag} {lang.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        {/* Welcome section */}
        <section className="text-center py-4">
          <h1 className="text-4xl md:text-5xl font-serif text-tinta mb-3">{t('welcomeTitle')}</h1>
          <p className="text-lg text-tinta/70 max-w-2xl mx-auto">{t('welcomeText')}</p>
        </section>

        {/* Quick info cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'wifi', icon: '📶', label: t('quickInfo.wifi'), value: APARTMENT.wifi },
            { key: 'checkin', icon: '🔑', label: t('quickInfo.checkin'), value: `${t('quickInfo.checkinFrom')} ${APARTMENT.checkInTime}` },
            { key: 'checkout', icon: '🧳', label: t('quickInfo.checkout'), value: `${t('quickInfo.checkoutBefore')} ${APARTMENT.checkOutTime}` },
            { key: 'emergency', icon: '📱', label: t('quickInfo.emergency'), value: '112' },
          ].map(({ key, icon, label, value }) => (
            <div key={key} className="card p-4 text-center">
              <div className="text-3xl mb-2">{icon}</div>
              <p className="text-xs text-tinta/50 uppercase tracking-wide mb-1">{label}</p>
              <p className="font-semibold text-tinta text-sm">{value}</p>
            </div>
          ))}
        </section>

        {/* Featured routes */}
        <section>
          <h2 className="text-3xl font-serif text-tinta mb-3">🧭 {t('routesTitle')}</h2>
          <p className="text-tinta/60 mb-6 max-w-3xl">{t('routesText')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map(route => (
              <Link
                key={route.id}
                href={`/${locale}/rutas/${route.id}`}
                className="card overflow-hidden hover:-translate-y-1 transition-transform group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={route.image}
                  alt={route.title[loc]}
                  className="w-full h-36 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="font-serif text-lg text-tinta mb-1">{route.title[loc]}</h3>
                  <p className="text-sm text-tinta/60 line-clamp-2 mb-3">{route.description[loc]}</p>
                  <span className="text-sm text-terracota-500 font-medium group-hover:underline">
                    {t('routeCta')} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href={`/${locale}#mapa`} className="text-terracota-500 hover:underline text-sm font-medium">
              {t('allRoutes')} ({TOURIST_ROUTES.length}) →
            </Link>
          </div>
        </section>

        {/* Apartment info */}
        <section className="card p-6 md:p-8">
          <h2 className="text-3xl font-serif text-tinta mb-5">🏠 {t('apartmentTitle')}</h2>
          <p className="text-tinta/70 mb-6 max-w-3xl">{t('apartmentText')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 bg-crema rounded-xl">
              <p className="text-xs text-tinta/50 uppercase tracking-wide mb-1">📍 {t('addressLabel')}</p>
              <p className="font-semibold text-tinta text-sm">{APARTMENT.address}</p>
            </div>
            <div className="p-4 bg-crema rounded-xl">
              <p className="text-xs text-tinta/50 uppercase tracking-wide mb-1">🚌 {t('arriveLabel')}</p>
              <p className="text-tinta/80 text-sm">{t('arriveText')}</p>
            </div>
            <div className="p-4 bg-crema rounded-xl">
              <p className="text-xs text-tinta/50 uppercase tracking-wide mb-1">💬 {t('contactLabel')}</p>
              <p className="text-tinta/80 text-sm mb-2">{t('contactText')}</p>
              <a
                href={`https://wa.me/${APARTMENT.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-semibold text-terracota-600 hover:underline"
              >
                WhatsApp: {APARTMENT.phone}
              </a>
            </div>
          </div>
        </section>

        {/* Weather widget */}
        <section>
          <h2 className="text-2xl font-serif text-tinta mb-4">{t('weatherTitle')}</h2>
          <WeatherWidget />
        </section>

        {/* Interactive map */}
        <section>
          <h2 className="text-3xl font-serif text-tinta mb-6">{t('mapTitle')}</h2>
          <MapSection />
        </section>

        {/* Events */}
        <section>
          <h2 className="text-3xl font-serif text-tinta mb-6">{t('eventsTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SEVILLE_EVENTS.slice(0, 6).map((event: any) => (
              <div key={event.id} className="card p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif text-lg text-tinta">{event.title?.[loc] || event.title?.es || ''}</h3>
                  {event.isHighSeason && (
                    <span className="badge bg-terracota-100 text-terracota-600 text-xs">★</span>
                  )}
                </div>
                <p className="text-sm text-tinta/60">{event.startDate} — {event.endDate}</p>
                <p className="text-sm text-tinta/50 mt-2">{event.description?.[loc] || event.description?.es || ''}</p>
                {event.url && (
                  <a href={event.url} target="_blank" rel="noopener noreferrer" className="text-sm text-terracota-500 mt-2 inline-block">
                    {t('moreInfo')} ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Emergency contacts */}
        <section>
          <h2 className="text-3xl font-serif text-tinta mb-6">{t('emergencyTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EMERGENCY_CONTACTS.map((contact) => (
              <a
                key={tEmergency(contact.nameKey)}
                href={`tel:${contact.phone}`}
                className="card p-4 flex items-center gap-4 hover:-translate-y-0.5 transition-transform"
              >
                <span className="text-3xl">{contact.icon}</span>
                <div>
                  <p className="font-semibold text-tinta">{tEmergency(contact.nameKey)}</p>
                  <p className="text-terracota-600 font-mono font-bold">{contact.phone}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* House rules summary */}
        <section className="card p-6">
          <h2 className="text-2xl font-serif text-tinta mb-4">{t('rulesTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {rules.map(rule => (
              <div key={rule} className="flex items-center gap-2 p-3 bg-crema rounded-xl">
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Check-out steps */}
        <section className="card p-6">
          <h2 className="text-2xl font-serif text-tinta mb-4">{t('checkoutTitle')}</h2>
          <ol className="space-y-3">
            {checkoutSteps.map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-7 h-7 rounded-full bg-terracota-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</span>
                <span className="text-tinta pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-tinta text-crema/60 text-center py-6 text-sm mt-12">
        <p>{APARTMENT.name} · {APARTMENT.address}</p>
        <p className="text-xs mt-1">{t('registryLabel')}: {APARTMENT.registrationNumber}</p>
      </footer>

      <ChatWidget />
    </div>
  );
}

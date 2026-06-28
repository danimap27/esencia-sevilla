import type { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { absoluteUrl } from '@/lib/utils';
import { APARTMENT, EMERGENCY_CONTACTS, HOUSE_RULES } from '@/data/apartment';
import { SEVILLE_EVENTS } from '@/data/events';
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

export default function GuidePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

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
              <p className="font-serif font-semibold">Guía Turística</p>
              <p className="text-xs text-crema/50">Esencia Sevilla</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge bg-green-500/20 text-green-300 text-xs hidden sm:inline-flex">
              📶 Offline
            </span>
            <Link href={`/${locale}`} className="text-xs text-crema/60 hover:text-crema">
              ← {locale === 'es' ? 'Volver' : 'Back'}
            </Link>
          </div>
        </div>
      </header>

      {/* Prominent language selector */}
      <div className="bg-terracota-500 py-3 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="text-white text-xs font-medium mr-2">
            {locale === 'es' ? 'Idioma:' : locale === 'en' ? 'Language:' : locale === 'fr' ? 'Langue:' :
             locale === 'de' ? 'Sprache:' : locale === 'it' ? 'Lingua:' : 'Idioma:'}
          </span>
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
          <h1 className="text-4xl md:text-5xl font-serif text-tinta mb-3">
            {locale === 'es' ? 'Bienvenido a Sevilla 🌟' :
             locale === 'en' ? 'Welcome to Seville 🌟' :
             locale === 'fr' ? 'Bienvenue à Séville 🌟' :
             locale === 'de' ? 'Willkommen in Sevilla 🌟' :
             locale === 'it' ? 'Benvenuto a Siviglia 🌟' :
             'Bem-vindo a Sevilha 🌟'}
          </h1>
          <p className="text-lg text-tinta/70 max-w-2xl mx-auto">
            {locale === 'es' ? 'Tu guía personal para descubrir lo mejor de la capital andaluza. Todo lo que necesitas, sin conexión.' :
             locale === 'en' ? 'Your personal guide to discover the best of the Andalusian capital. Everything you need, offline.' :
             locale === 'fr' ? 'Votre guide personnel pour découvrir la capitale andalouse. Tout ce dont vous avez besoin, hors ligne.' :
             locale === 'de' ? 'Ihr persönlicher Guide, um das Beste der andalusischen Hauptstadt zu entdecken. Alles, was Sie brauchen, offline.' :
             locale === 'it' ? 'La tua guida personale per scoprire il meglio della capitale andalusa. Tutto ciò di cui hai bisogno, offline.' :
             'O seu guia pessoal para descobrir o melhor da capital andaluz. Tudo o que precisa, offline.'}
          </p>
        </section>

        {/* Quick info cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '📶', label: 'WiFi', value: APARTMENT.wifi },
            { icon: '🔑', label: 'Check-in', value: `Desde ${APARTMENT.checkInTime}` },
            { icon: '🧳', label: 'Check-out', value: `Antes de ${APARTMENT.checkOutTime}` },
            { icon: '📱', label: 'Emergencias', value: '112' },
          ].map(({ icon, label, value }) => (
            <div key={label} className="card p-4 text-center">
              <div className="text-3xl mb-2">{icon}</div>
              <p className="text-xs text-tinta/50 uppercase tracking-wide mb-1">{label}</p>
              <p className="font-semibold text-tinta text-sm">{value}</p>
            </div>
          ))}
        </section>

        {/* Weather widget */}
        <section>
          <h2 className="text-2xl font-serif text-tinta mb-4">
            {locale === 'es' ? '☀️ Tiempo en Sevilla' :
             locale === 'en' ? '☀️ Weather in Seville' :
             locale === 'fr' ? '☀️ Météo à Séville' :
             locale === 'de' ? '☀️ Wetter in Sevilla' :
             locale === 'it' ? '☀️ Meteo a Siviglia' :
             '☀️ Tempo em Sevilha'}
          </h2>
          <WeatherWidget />
        </section>

        {/* Interactive map */}
        <section>
          <h2 className="text-3xl font-serif text-tinta mb-6">🗺️ {locale === 'es' ? 'Mapa de Sevilla' : 'Seville Map'}</h2>
          <MapSection />
        </section>

        {/* Events */}
        <section>
          <h2 className="text-3xl font-serif text-tinta mb-6">
            {locale === 'es' ? '🎭 Eventos en Sevilla' :
             locale === 'en' ? '🎭 Events in Seville' :
             locale === 'fr' ? '🎭 Événements à Séville' :
             locale === 'de' ? '🎭 Events in Sevilla' :
             locale === 'it' ? '🎭 Eventi a Siviglia' :
             '🎭 Eventos em Sevilha'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SEVILLE_EVENTS.slice(0, 6).map((event: any) => (
              <div key={event.id} className="card p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif text-lg text-tinta">{event.title?.[locale as Locale] || event.title?.es || ''}</h3>
                  {event.isHighSeason && (
                    <span className="badge bg-terracota-100 text-terracota-600 text-xs">★</span>
                  )}
                </div>
                <p className="text-sm text-tinta/60">{event.startDate} — {event.endDate}</p>
                <p className="text-sm text-tinta/50 mt-2">{event.description?.[locale as Locale] || event.description?.es || ''}</p>
                {event.url && (
                  <a href={event.url} target="_blank" rel="noopener noreferrer" className="text-sm text-terracota-500 mt-2 inline-block">
                    {locale === 'es' ? 'Más info →' : 'More info →'} ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Emergency contacts */}
        <section>
          <h2 className="text-3xl font-serif text-tinta mb-6">🚨 {locale === 'es' ? 'Contactos de Emergencia' : 'Emergency Contacts'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EMERGENCY_CONTACTS.map((contact) => (
              <a
                key={contact.name}
                href={`tel:${contact.phone}`}
                className="card p-4 flex items-center gap-4 hover:-translate-y-0.5 transition-transform"
              >
                <span className="text-3xl">{contact.icon}</span>
                <div>
                  <p className="font-semibold text-tinta">{contact.name}</p>
                  <p className="text-terracota-600 font-mono font-bold">{contact.phone}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* House rules summary */}
        <section className="card p-6">
          <h2 className="text-2xl font-serif text-tinta mb-4">📋 {locale === 'es' ? 'Normas de la Casa' : 'House Rules'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              '🚭 No fumar',
              '🐾 No mascotas',
              '🔇 Silencio 22:00',
              '👥 Máx. 4 huéspedes',
              '🎉 No fiestas',
              '🔑 Check-in autónomo',
            ].map(rule => (
              <div key={rule} className="flex items-center gap-2 p-3 bg-crema rounded-xl">
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Check-out steps */}
        <section className="card p-6">
          <h2 className="text-2xl font-serif text-tinta mb-4">✅ {locale === 'es' ? 'Check-out (antes 11:00)' : 'Check-out (before 11:00)'}</h2>
          <ol className="space-y-3">
            {[
              locale === 'es' ? 'Deja las llaves en la caja de seguridad' : 'Leave keys in the safety box',
              locale === 'es' ? 'Apaga todos los aires acondicionados' : 'Turn off all AC units',
              locale === 'es' ? 'Cierra ventanas y persianas' : 'Close windows and blinds',
              locale === 'es' ? 'Deja las toallas en el baño' : 'Leave towels in the bathroom',
              locale === 'es' ? 'Vacía la nevera' : 'Empty the fridge',
              locale === 'es' ? '¡Deja una reseña! 😊' : 'Leave a review! 😊',
            ].map((step, i) => (
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
        <p className="text-xs mt-1">Nº Registro: {APARTMENT.registrationNumber}</p>
      </footer>

      <ChatWidget />
    </div>
  );
}
import type { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { absoluteUrl } from '@/lib/utils';
import { APARTMENT, EMERGENCY_CONTACTS } from '@/data/apartment';
import { type Locale } from '@/i18n';

const MapSection = dynamic(() => import('@/components/MapSection'), { ssr: false });
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false });

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
          <div className="flex items-center gap-2">
            <span className="badge bg-green-500/20 text-green-300 text-xs">
              📶 Disponible offline
            </span>
            <Link href={`/${locale}`} className="text-xs text-crema/60 hover:text-crema">
              ← Volver al apartamento
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        {/* Welcome section */}
        <section className="text-center py-8">
          <h1 className="text-4xl md:text-5xl font-serif text-tinta mb-3">
            Bienvenido a Sevilla 🌟
          </h1>
          <p className="text-lg text-tinta/70 max-w-2xl mx-auto">
            Tu guía personal para descubrir lo mejor de la capital andaluza. Todo lo que necesitas, sin conexión.
          </p>
        </section>

        {/* Quick info (WiFi, check-in, check-out) */}
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

        {/* Interactive map */}
        <section>
          <h2 className="text-3xl font-serif text-tinta mb-6">🗺️ Mapa de Sevilla</h2>
          <MapSection />
        </section>

        {/* Emergency contacts */}
        <section>
          <h2 className="text-3xl font-serif text-tinta mb-6">🚨 Contactos de Emergencia</h2>
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
          <h2 className="text-2xl font-serif text-tinta mb-4">📋 Normas de la Casa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              '🚭 No fumar dentro del apartamento',
              '🐾 No se admiten mascotas',
              '🔇 Silencio a partir de las 22:00',
              '👥 Máximo 4 huéspedes',
              '🎉 No se permiten fiestas ni eventos',
              '🔑 Check-in autónomo — código en el WhatsApp',
            ].map(rule => (
              <div key={rule} className="flex items-center gap-2 p-3 bg-crema rounded-xl">
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Check-out steps */}
        <section className="card p-6">
          <h2 className="text-2xl font-serif text-tinta mb-4">✅ Check-out (antes de las 11:00)</h2>
          <ol className="space-y-3">
            {[
              'Deja las llaves en la caja de seguridad de la entrada',
              'Apaga todos los aires acondicionados',
              'Cierra todas las ventanas y persianas',
              'Deja las toallas usadas en el baño',
              'Vacía la nevera de tus alimentos',
              'Cierra la llave del gas si la usaste',
              '¡Gracias por tu visita! Deja una reseña 😊',
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

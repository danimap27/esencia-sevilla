'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Navigation, Plane, Train, Car } from 'lucide-react';
import { APARTMENT, NEARBY_LANDMARKS, ARRIVAL_INSTRUCTIONS } from '@/data/apartment';
import { cn } from '@/lib/utils';

type ArrivalType = 'airport' | 'train' | 'car';

const ARRIVAL_ICONS = {
  airport: Plane,
  train: Train,
  car: Car,
};

export default function LocationSection() {
  const t = useTranslations('location');
  const [activeArrival, setActiveArrival] = useState<ArrivalType>('airport');

  return (
    <section id="ubicacion" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-subtitle mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Map embed + address */}
          <div>
            {/* Mapa embebido de OpenStreetMap (sin API key, coherente con Leaflet del resto del sitio) */}
            <div className="rounded-2xl overflow-hidden shadow-medium border border-tinta/10 h-80 relative bg-crema-dark flex items-center justify-center">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${APARTMENT.lng - 0.004}%2C${APARTMENT.lat - 0.003}%2C${APARTMENT.lng + 0.004}%2C${APARTMENT.lat + 0.003}&layer=mapnik&marker=${APARTMENT.lat}%2C${APARTMENT.lng}`}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '16px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa de ${APARTMENT.name}`}
              />
            </div>

            {/* Address card */}
            <div className="mt-4 p-5 card">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-terracota-100 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-terracota-600" />
                </div>
                <div>
                  <p className="font-semibold text-tinta">{APARTMENT.name}</p>
                  <p className="text-sm text-tinta/70">{t('address')}</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(APARTMENT.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-sm text-terracota-500 hover:text-terracota-700 font-medium"
                  >
                    <Navigation size={14} />
                    Abrir en Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Nearby landmarks */}
            <div className="mt-4 p-5 card">
              <h3 className="font-semibold mb-3">Distancias a pie</h3>
              <div className="grid grid-cols-2 gap-2">
                {NEARBY_LANDMARKS.map((lm) => (
                  <div key={lm.name} className="flex items-center gap-2 text-sm">
                    <span>{lm.icon}</span>
                    <div>
                      <p className="font-medium text-tinta text-xs">{lm.name}</p>
                      <p className="text-tinta/50 text-xs">{lm.distance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: How to arrive */}
          <div>
            <h3 className="text-2xl font-serif mb-6">{t('howToArrive')}</h3>

            {/* Arrival tabs */}
            <div className="flex bg-crema rounded-2xl p-1.5 mb-6 gap-1">
              {(Object.keys(ARRIVAL_INSTRUCTIONS) as ArrivalType[]).map((type) => {
                const Icon = ARRIVAL_ICONS[type];
                const labels: Record<ArrivalType, string> = {
                  airport: t('fromAirport'),
                  train: t('fromStation'),
                  car: t('byCar'),
                };

                return (
                  <button
                    key={type}
                    onClick={() => setActiveArrival(type)}
                    className={cn(
                      'flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-medium transition-all',
                      activeArrival === type
                        ? 'bg-white shadow-soft text-terracota-600'
                        : 'text-tinta/60 hover:text-tinta'
                    )}
                  >
                    <Icon size={18} />
                    <span className="text-center leading-tight">{labels[type]}</span>
                  </button>
                );
              })}
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {ARRIVAL_INSTRUCTIONS[activeArrival].steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-terracota-500 text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-tinta">
                      {t(`arrivalSteps.${activeArrival}.step${i + 1}` as Parameters<typeof t>[0])}
                    </p>
                    {i < ARRIVAL_INSTRUCTIONS[activeArrival].steps.length - 1 && (
                      <div className="w-0.5 h-6 bg-terracota-200 ml-0 mt-3 relative left-[-1.1rem]" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Airport transfer CTA */}
            {activeArrival === 'airport' && (
              <div className="mt-6 p-5 rounded-2xl bg-terracota-50 border border-terracota-200">
                <p className="font-medium text-tinta mb-1">¿Prefieres un traslado privado?</p>
                <p className="text-sm text-tinta/70 mb-3">Recogida personalizada en el aeropuerto por 35€</p>
                <button
                  onClick={() => document.querySelector('#reservar')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-primary text-sm py-2"
                >
                  🚗 Añadir traslado al reservar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

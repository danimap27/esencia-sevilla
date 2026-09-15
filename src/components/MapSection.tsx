'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Route, Bus, Clock, Footprints, Filter, ExternalLink, Lightbulb, Timer } from 'lucide-react';
import { type Locale } from '@/i18n';
import { SIGHTS, NEARBY, BUS_LINES } from '@/data/sights';
import { TOURIST_ROUTES } from '@/data/routes';
import { APARTMENT } from '@/data/apartment';
import { cn, getRouteMapsUrl } from '@/lib/utils';

type Tab = 'map' | 'routes' | 'transport';
type SightCategory = 'all' | 'monument' | 'neighborhood' | 'culture' | 'food' | 'nature' | 'modern' | 'fun';

const CATEGORY_ICONS: Record<string, string> = {
  monument: '🏛️', neighborhood: '🏘️', culture: '🎭',
  food: '🍺', nature: '🌳', modern: '🏢', fun: '🎉',
};

export default function MapSection() {
  const t = useTranslations('map');
  const locale = useLocale() as Locale;
  const mapRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<Tab>('map');
  const [category, setCategory] = useState<SightCategory>('all');
  const [selectedSight, setSelectedSight] = useState<typeof SIGHTS[0] | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<typeof TOURIST_ROUTES[0] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const leafletMapRef = useRef<L.Map | null>(null);

  // Initialize Leaflet map
  useEffect(() => {
    if (tab !== 'map' || mapLoaded) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!mapRef.current || leafletMapRef.current) return;

      // Fix default marker icon
      delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      });

      const map = L.map(mapRef.current, {
        center: [APARTMENT.lat, APARTMENT.lng],
        zoom: 15,
        zoomControl: false,
      });
      leafletMapRef.current = map;

      L.control.zoom({ position: 'topright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Apartment marker (home icon)
      const homeIcon = L.divIcon({
        html: `<div style="background:#C25A3A;color:white;width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:16px;">
          <span style="transform:rotate(45deg)">🏠</span></div>`,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -45],
      });

      L.marker([APARTMENT.lat, APARTMENT.lng], { icon: homeIcon })
        .addTo(map)
        .bindPopup(`<strong>${APARTMENT.name}</strong><br/><small>${APARTMENT.address}</small>`)
        .openPopup();

      // Sight markers
      SIGHTS.forEach(sight => {
        const icon = L.divIcon({
          html: `<div style="background:#2A5A8C;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);font-size:14px;">${CATEGORY_ICONS[sight.category] || '📍'}</div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -20],
        });

        L.marker([sight.lat, sight.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width:200px;">
              <strong style="font-size:14px;">${sight.name}</strong>
              <p style="font-size:12px;color:#666;margin:4px 0;">${sight.description[locale].slice(0, 100)}...</p>
              <p style="font-size:11px;color:#C25A3A;">🎟️ ${sight.entrance}</p>
              <a href="https://maps.google.com/?q=${sight.lat},${sight.lng}" target="_blank"
                 style="font-size:11px;color:#2A5A8C;text-decoration:none;">🗺️ ${t('openInMaps')}</a>
            </div>
          `);
      });

      setMapLoaded(true);
    };

    initMap();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [tab, locale]);

  const categories: { key: SightCategory; label: string }[] = [
    'all', 'monument', 'neighborhood', 'culture', 'food', 'nature', 'modern', 'fun'
  ].map(key => ({ key: key as SightCategory, label: t(`categories.${key}` as Parameters<typeof t>[0]) }));

  return (
    <section id="mapa" className="py-16 md:py-24 bg-crema">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-subtitle mx-auto">{t('subtitle')}</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl p-1.5 shadow-card mb-8 gap-1 max-w-xl mx-auto">
          {(['map', 'routes', 'transport'] as Tab[]).map((tabId) => {
            const icons = { map: MapPin, routes: Route, transport: Bus };
            const Icon = icons[tabId];
            return (
              <button
                key={tabId}
                onClick={() => setTab(tabId)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all',
                  tab === tabId
                    ? 'bg-terracota-500 text-white shadow-soft'
                    : 'text-tinta/60 hover:text-tinta'
                )}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{t(`tabs.${tabId}` as Parameters<typeof t>[0])}</span>
              </button>
            );
          })}
        </div>

        {/* MAP TAB */}
        {tab === 'map' && (
          <div>
            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              {categories.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all border',
                    category === key
                      ? 'bg-terracota-500 text-white border-terracota-500'
                      : 'bg-white text-tinta/60 border-tinta/10 hover:border-terracota-300'
                  )}
                >
                  {key !== 'all' && <span className="mr-1.5">{CATEGORY_ICONS[key]}</span>}
                  {label}
                </button>
              ))}
            </div>

            <div className="relative">
              {/* Map container */}
              <div
                ref={mapRef}
                className="w-full rounded-2xl overflow-hidden shadow-medium border border-tinta/10"
                style={{ height: '500px' }}
              />

              {!mapLoaded && (
                <div className="absolute inset-0 rounded-2xl bg-crema-dark flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-tinta/50">
                    <MapPin size={32} className="animate-bounce text-terracota-400" />
                    <p>Cargando mapa...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sights list */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SIGHTS
                .filter(s => category === 'all' || s.category === category)
                .map(sight => (
                  <div
                    key={sight.id}
                    className="card p-4 cursor-pointer hover:-translate-y-1 transition-transform duration-200"
                    onClick={() => {
                      setSelectedSight(sight);
                      if (leafletMapRef.current) {
                        leafletMapRef.current.setView([sight.lat, sight.lng], 17);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{CATEGORY_ICONS[sight.category] || '📍'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-tinta text-sm">{sight.name}</p>
                        <p className="text-xs text-tinta/60 line-clamp-2 mt-0.5">
                          {sight.description[locale]}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {sight.walkMinutes && (
                            <span className="text-xs text-azulejo-600 flex items-center gap-1">
                              <Footprints size={10} /> {t('minutesWalk', { min: sight.walkMinutes })}
                            </span>
                          )}
                          <span className="text-xs text-terracota-600">
                            🎟️ {sight.entrance === 'Libre' || sight.entrance === 'Libre / Free' ? t('entranceFree') : sight.entrance}
                          </span>
                        </div>
                      </div>
                    </div>
                    {sight.url && (
                      <a
                        href={sight.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-xs text-azulejo-500 flex items-center gap-1 hover:text-azulejo-700"
                        onClick={e => e.stopPropagation()}
                      >
                        <ExternalLink size={10} /> {t('openInMaps')}
                      </a>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ROUTES TAB */}
        {tab === 'routes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOURIST_ROUTES.map(route => (
              <div
                key={route.id}
                className="card overflow-hidden cursor-pointer group hover:-translate-y-1 transition-all duration-200"
                onClick={() => setSelectedRoute(route)}
              >
                {route.image && (
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={route.image}
                      alt={route.title[locale]}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-tinta/50 to-transparent" />
                    <span className={cn(
                      'absolute top-3 left-3 badge text-xs backdrop-blur-sm',
                      'bg-white/90 text-azulejo-700'
                    )}>
                      {t(`routeCategories.${route.category}` as Parameters<typeof t>[0])}
                    </span>
                  </div>
                )}
                <div className="p-5">
                {!route.image && (
                <div className="flex items-start justify-between mb-3">
                  <span className={cn(
                    'badge text-xs',
                    'bg-azulejo-100 text-azulejo-700'
                  )}>
                    {t(`routeCategories.${route.category}` as Parameters<typeof t>[0])}
                  </span>
                </div>
                )}

                <h3 className="font-serif text-xl font-semibold text-tinta mb-2">
                  {route.title[locale]}
                </h3>
                <p className="text-sm text-tinta/70 line-clamp-2 mb-3">
                  {route.description[locale]}
                </p>

                <div className="flex items-center gap-4 text-sm text-tinta/60">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {route.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Route size={14} /> {route.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {route.stops.length} paradas
                  </span>
                  <span className={cn(
                    'ml-auto badge text-xs',
                    route.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    route.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  )}>
                    {route.difficulty}
                  </span>
                </div>

                <button className="mt-4 text-sm text-terracota-500 hover:text-terracota-700 font-medium flex items-center gap-1">
                  {t('routeDetails')} →
                </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TRANSPORT TAB */}
        {tab === 'transport' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-serif font-semibold mb-2 flex items-center gap-2">
                <Bus size={20} className="text-terracota-500" />
                {t('transport.title')}
              </h3>
              <p className="text-sm text-tinta/60 mb-6">{t('transport.nearestStop')}: Mateos Gago (2 min a pie)</p>

              <div className="space-y-4">
                {BUS_LINES.map(line => (
                  <div key={line.id} className="p-4 rounded-xl border border-tinta/10 hover:border-terracota-200 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-azulejo-100 text-azulejo-700 font-bold text-sm mb-2">
                          {line.id}
                        </span>
                        <p className="font-semibold text-tinta">{line.name}</p>
                        <p className="text-sm text-tinta/60">{line.destinations.join(' → ')}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-tinta/60">{t('transport.frequency')}</p>
                        <p className="font-medium text-tinta">{line.frequency}</p>
                        <p className="text-terracota-600 font-semibold mt-1">{line.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Multiviaje card info */}
            <div className="card p-6 bg-gradient-to-br from-azulejo-50 to-azulejo-100 border-azulejo-200">
              <h3 className="text-xl font-serif font-semibold mb-2">
                🎫 {t('transport.multiviaje')}
              </h3>
              <p className="text-sm text-tinta/70 mb-4">{t('transport.multiviajePrices')}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { viajes: '10 viajes', precio: '4,95€ (0,49€/viaje)' },
                  { viajes: 'Carga libre', precio: 'Desde 5€' },
                  { viajes: 'Tarjeta física', precio: '1,50€ (reembolsable)' },
                ].map(({ viajes, precio }) => (
                  <div key={viajes} className="p-3 bg-white rounded-xl shadow-card">
                    <p className="font-semibold text-azulejo-700 text-sm">{viajes}</p>
                    <p className="text-xs text-tinta/60">{precio}</p>
                  </div>
                ))}
              </div>
              <a
                href="https://www.tussam.es"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-4 text-sm text-azulejo-600 hover:text-azulejo-800 font-medium"
              >
                <ExternalLink size={14} />
                Horarios en tiempo real — TUSSAM.es
              </a>
            </div>
          </div>
        )}

        {/* Route detail modal */}
        {selectedRoute && (
          <div className="fixed inset-0 z-50 bg-tinta/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedRoute(null)}>
            <div className="bg-white rounded-3xl shadow-large max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-tinta">{selectedRoute.title[locale]}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-tinta/60">
                      <span className="flex items-center gap-1"><Clock size={14} /> {selectedRoute.duration}</span>
                      <span className="flex items-center gap-1"><Route size={14} /> {selectedRoute.distance}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedRoute(null)} className="p-2 hover:bg-crema rounded-xl transition-colors">
                    ✕
                  </button>
                </div>
                <p className="text-tinta/70 mb-6">{selectedRoute.description[locale]}</p>
                <div className="space-y-3">
                  {selectedRoute.stops.map((stop, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-terracota-500 text-white flex items-center justify-center text-xs font-bold">{i + 1}</div>
                        {i < selectedRoute.stops.length - 1 && <div className="w-0.5 h-full min-h-8 bg-terracota-200 mt-1" />}
                      </div>
                      <div className="pb-3 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-tinta text-sm">{stop.name}</p>
                          <a
                            href={`https://maps.google.com/?q=${stop.lat},${stop.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-azulejo-500 hover:text-azulejo-700 flex-shrink-0"
                            aria-label={`${stop.name} — Google Maps`}
                          >
                            <MapPin size={14} />
                          </a>
                        </div>
                        {stop.description && <p className="text-xs text-tinta/60 mt-0.5">{stop.description[locale]}</p>}
                        {stop.tip && (
                          <p className="text-xs text-ocre-700 bg-ocre-50 border border-ocre-200 rounded-lg px-2 py-1.5 mt-1.5 flex items-start gap-1.5">
                            <Lightbulb size={12} className="flex-shrink-0 mt-0.5" />
                            <span>{stop.tip[locale]}</span>
                          </p>
                        )}
                        {stop.bestTime && (
                          <p className="text-xs text-azulejo-600 mt-1 flex items-center gap-1">
                            <Timer size={12} />
                            <span>{t('bestTime')}: {stop.bestTime[locale]}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <a
                  href={getRouteMapsUrl(selectedRoute.stops)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-6 w-full justify-center"
                >
                  <ExternalLink size={16} />
                  {t('fullRoute')}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

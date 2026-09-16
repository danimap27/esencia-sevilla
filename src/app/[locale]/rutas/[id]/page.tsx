import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Clock, Route as RouteIcon, MapPin, ArrowLeft, ExternalLink, Lightbulb, Timer,
  BookOpen, Globe, Car, Bus, Footprints, Compass,
} from 'lucide-react';
import { type Locale, locales } from '@/i18n';
import { absoluteUrl, getRouteMapsUrl, cn } from '@/lib/utils';
import { TOURIST_ROUTES } from '@/data/routes';
import RouteMap from '@/components/RouteMapClient';
import { APARTMENT } from '@/data/apartment';

export function generateStaticParams() {
  return TOURIST_ROUTES.flatMap((route) =>
    locales.map((locale) => ({ locale, id: route.id }))
  );
}

export function generateMetadata({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}): Metadata {
  const route = TOURIST_ROUTES.find((r) => r.id === id);
  if (!route) return {};
  const title = route.title[locale as Locale] || route.title.es;
  const description = route.description[locale as Locale] || route.description.es;

  return {
    title: `${title} — Esencia Sevilla`,
    description,
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/${locale}/rutas/${id}`),
      type: 'article',
      images: route.image ? [{ url: route.image, width: 1200, height: 630, alt: title }] : undefined,
    },
    alternates: {
      canonical: absoluteUrl(`/${locale}/rutas/${id}`),
      languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(`/${l}/rutas/${id}`)])),
    },
  };
}

const TRANSPORT_ICONS = { walking: Footprints, public: Bus, car: Car } as const;

export default function RouteDetailPage({
  params: { locale, id },
}: {
  params: { locale: Locale; id: string };
}) {
  unstable_setRequestLocale(locale);
  const route = TOURIST_ROUTES.find((r) => r.id === id);
  if (!route) notFound();

  const TransportIcon = TRANSPORT_ICONS[route.transport ?? 'walking'];
  const related = TOURIST_ROUTES.filter((r) => r.category === route.category && r.id !== route.id).slice(0, 3);
  const fallbackRelated = TOURIST_ROUTES.filter((r) => r.id !== route.id).slice(0, 3);
  const relatedRoutes = related.length > 0 ? related : fallbackRelated;

  // curiosidades agregadas: tips + bestTime + historias de las paradas
  const curiosities = route.stops
    .map((stop) => ({ name: stop.name, tip: stop.tip?.[locale], history: stop.history?.[locale] }))
    .filter((c) => c.tip || c.history);

  const categoryLabel = (cat: string) => {
    const CATS: Record<string, Record<Locale, string>> = {
      classic: { es: 'Clásica', en: 'Classic', fr: 'Classique', de: 'Klassiker', it: 'Classica', pt: 'Clássica' },
      neighborhoods: { es: 'Barrios', en: 'Neighbourhoods', fr: 'Quartiers', de: 'Viertel', it: 'Quartieri', pt: 'Bairros' },
      romantic: { es: 'Romántica', en: 'Romantic', fr: 'Romantique', de: 'Romantisch', it: 'Romantica', pt: 'Romântica' },
      food: { es: 'Gastronomía', en: 'Food', fr: 'Gastronomie', de: 'Gastronomie', it: 'Gastronomia', pt: 'Gastronomia' },
      family: { es: 'Familiar', en: 'Family', fr: 'Famille', de: 'Familie', it: 'Famiglia', pt: 'Família' },
      culture: { es: 'Cultural', en: 'Culture', fr: 'Culture', de: 'Kultur', it: 'Cultura', pt: 'Cultura' },
      nature: { es: 'Naturaleza', en: 'Nature', fr: 'Nature', de: 'Natur', it: 'Natura', pt: 'Natureza' },
      shopping: { es: 'Compras', en: 'Shopping', fr: 'Shopping', de: 'Shopping', it: 'Shopping', pt: 'Compras' },
      photos: { es: 'Fotografía', en: 'Photography', fr: 'Photographie', de: 'Fotografie', it: 'Fotografia', pt: 'Fotografia' },
      history: { es: 'Historia', en: 'History', fr: 'Histoire', de: 'Geschichte', it: 'Storia', pt: 'História' },
      legends: { es: 'Leyendas', en: 'Legends', fr: 'Légendes', de: 'Legenden', it: 'Leggende', pt: 'Lendas' },
      art: { es: 'Arte', en: 'Art', fr: 'Art', de: 'Kunst', it: 'Arte', pt: 'Arte' },
      daytrip: { es: 'Excursión', en: 'Day trip', fr: 'Excursion', de: 'Ausflug', it: 'Escursione', pt: 'Excursão' },
      wine: { es: 'Vino', en: 'Wine', fr: 'Vin', de: 'Wein', it: 'Vino', pt: 'Vinho' },
      beach: { es: 'Playa', en: 'Beach', fr: 'Plage', de: 'Strand', it: 'Spiaggia', pt: 'Praia' },
    };
    return CATS[cat]?.[locale] ?? cat;
  };

  const transportLabel = (t: string) => {
    const T: Record<string, Record<Locale, string>> = {
      walking: { es: 'A pie', en: 'On foot', fr: 'À pied', de: 'Zu Fuß', it: 'A piedi', pt: 'A pé' },
      public: { es: 'Transporte público', en: 'Public transport', fr: 'Transports publics', de: 'Öffentliche Verkehrsmittel', it: 'Trasporto pubblico', pt: 'Transporte público' },
      car: { es: 'En coche', en: 'By car', fr: 'En voiture', de: 'Mit dem Auto', it: 'In auto', pt: 'De carro' },
    };
    return T[t]?.[locale] ?? t;
  };

  const LABELS: Record<string, Record<Locale, string>> = {
    back: { es: 'Todas las rutas', en: 'All routes', fr: 'Toutes les routes', de: 'Alle Routen', it: 'Tutti i percorsi', pt: 'Todas as rotas' },
    theRoute: { es: 'El recorrido', en: 'The route', fr: 'Le parcours', de: 'Die Route', it: 'Il percorso', pt: 'O percurso' },
    history: { es: 'Historia', en: 'History', fr: 'Histoire', de: 'Geschichte', it: 'Storia', pt: 'História' },
    tip: { es: 'Consejo', en: 'Tip', fr: 'Conseil', de: 'Tipp', it: 'Consiglio', pt: 'Conselho' },
    bestTime: { es: 'Mejor hora', en: 'Best time', fr: 'Meilleur moment', de: 'Beste Zeit', it: 'Orario migliore', pt: 'Melhor hora' },
    howToGet: { es: 'Cómo llegar y moverse', en: 'Getting there & around', fr: 'Comment venir', de: 'Anreise', it: 'Come arrivare', pt: 'Como chegar' },
    curiosities: { es: 'Curiosidades del camino', en: 'Curiosities along the way', fr: 'Curiosités', de: 'Kuriositäten', it: 'Curiosità', pt: 'Curiosidades' },
    stops: { es: 'paradas', en: 'stops', fr: 'arrêts', de: 'Stopps', it: 'tappe', pt: 'paragens' },
    fullRoute: { es: 'Abrir ruta completa a pie en Google Maps', en: 'Open full walking route in Google Maps', fr: 'Ouvrir l\'itinéraire complet à pied dans Google Maps', de: 'Komplette Route zu Fuß in Google Maps öffnen', it: 'Apri percorso completo a piedi in Google Maps', pt: 'Abrir rota completa a pé no Google Maps' },
    otherRoutes: { es: 'Sigue explorando', en: 'Keep exploring', fr: 'Continuez à explorer', de: 'Weiter entdecken', it: 'Continua a esplorare', pt: 'Continue a explorar' },
    bookNow: { es: 'Reservar estancia', en: 'Book your stay', fr: 'Réserver', de: 'Jetzt buchen', it: 'Prenota', pt: 'Reservar' },
    officialWeb: { es: 'Web oficial', en: 'Official website', fr: 'Site officiel', de: 'Offizielle Website', it: 'Sito ufficiale', pt: 'Site oficial' },
  };
  const L = (k: keyof typeof LABELS) => LABELS[k][locale];

  return (
    <main className="bg-crema">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] overflow-hidden">
        {route.image && (
          <Image
            src={route.image}
            alt={route.title[locale]}
            fill
            unoptimized
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-tinta/85 via-tinta/40 to-tinta/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 pb-10">
            <Link
              href={`/${locale}#mapa`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft size={16} /> {L('back')}
            </Link>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge bg-white/90 text-azulejo-700">{categoryLabel(route.category)}</span>
              <span className="badge bg-tinta/60 text-white backdrop-blur-sm">
                <TransportIcon size={12} /> {transportLabel(route.transport ?? 'walking')}
              </span>
              <span className="badge bg-ocre-500/90 text-white">
                {route.stops.length} {L('stops')}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-white max-w-3xl leading-tight mb-3">
              {route.title[locale]}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/85 text-sm">
              <span className="flex items-center gap-1.5"><Clock size={15} /> {route.duration}</span>
              <span className="flex items-center gap-1.5"><RouteIcon size={15} /> {route.distance}</span>
              <span className="flex items-center gap-1.5">
                <Compass size={15} />
                {route.difficulty === 'easy' ? '●' : route.difficulty === 'moderate' ? '●●' : '●●●'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12">
        {/* Intro */}
        <section className="mb-12">
          <p className="text-lg text-tinta/85 leading-relaxed">
            {route.intro?.[locale] ?? route.description[locale]}
          </p>
        </section>

        {/* Cómo llegar */}
        {route.transportDetails && (
          <section className="mb-12">
            <div className="card p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-azulejo-100 flex items-center justify-center flex-shrink-0">
                <TransportIcon size={22} className="text-azulejo-700" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-semibold text-tinta mb-1">{L('howToGet')}</h2>
                <p className="text-tinta/75 text-sm leading-relaxed">{route.transportDetails[locale]}</p>
              </div>
            </div>
          </section>
        )}

        {/* El recorrido */}
        <section className="mb-12">
          <h2 className="section-title text-left mb-8">{L('theRoute')}</h2>
          <div className="space-y-6">
            {route.stops.map((stop, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-terracota-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <h3 className="font-serif text-xl font-semibold text-tinta">{stop.name}</h3>
                      <div className="flex items-center gap-3">
                        {stop.url && (
                          <a
                            href={stop.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-azulejo-600 hover:text-azulejo-800 flex items-center gap-1"
                          >
                            <Globe size={13} /> {L('officialWeb')}
                          </a>
                        )}
                        <a
                          href={`https://maps.google.com/?q=${stop.lat},${stop.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-azulejo-600 hover:text-azulejo-800 flex items-center gap-1"
                        >
                          <MapPin size={13} /> Maps
                        </a>
                      </div>
                    </div>
                    {stop.description && (
                      <p className="text-tinta/75 mt-1.5 leading-relaxed">{stop.description[locale]}</p>
                    )}
                    {stop.history && (
                      <div className="mt-3 p-3 rounded-xl bg-crema-dark/70 border border-tinta/5 flex items-start gap-2">
                        <BookOpen size={15} className="text-azulejo-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-tinta/80 leading-relaxed">
                          <span className="font-semibold text-azulejo-800">{L('history')}: </span>
                          {stop.history[locale]}
                        </p>
                      </div>
                    )}
                    {stop.tip && (
                      <div className="mt-3 p-3 rounded-xl bg-ocre-50 border border-ocre-200 flex items-start gap-2">
                        <Lightbulb size={15} className="text-ocre-700 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-ocre-800 leading-relaxed">
                          <span className="font-semibold">{L('tip')}: </span>
                          {stop.tip[locale]}
                        </p>
                      </div>
                    )}
                    {stop.bestTime && (
                      <p className="text-xs text-azulejo-600 mt-2 flex items-center gap-1">
                        <Timer size={13} /> {L('bestTime')}: {stop.bestTime[locale]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Curiosidades */}
        {curiosities.length > 0 && (
          <section className="mb-12">
            <h2 className="section-title text-left mb-6">{L('curiosities')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {curiosities.map((c, i) => (
                <div key={i} className="card p-5 border-l-4 border-l-ocre-400">
                  <p className="font-semibold text-tinta text-sm mb-1">{c.name}</p>
                  <p className="text-sm text-tinta/75 leading-relaxed">{c.tip ?? c.history}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mapa con todas las paradas */}
        <section className="mb-12">
          <div className="rounded-2xl overflow-hidden shadow-medium border border-tinta/10" style={{ height: '440px' }}>
            <RouteMap stops={route.stops.map((s) => ({ name: s.name, lat: s.lat, lng: s.lng }))} />
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <a
              href={getRouteMapsUrl(route.stops)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 justify-center"
            >
              <ExternalLink size={16} /> {L('fullRoute')}
            </a>
            <Link href={`/${locale}#reservar`} className="btn-secondary flex-1 justify-center">
              {L('bookNow')}
            </Link>
          </div>
        </section>

        {/* Otras rutas */}
        {relatedRoutes.length > 0 && (
          <section>
            <h2 className="section-title text-left mb-6">{L('otherRoutes')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedRoutes.map((r) => (
                <Link key={r.id} href={`/${locale}/rutas/${r.id}`} className="card overflow-hidden group hover:-translate-y-1 transition-all duration-200">
                  {r.image && (
                    <div className="relative h-36 overflow-hidden">
                      <Image
                        src={r.image}
                        alt={r.title[locale]}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-tinta/50 to-transparent" />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-xs text-azulejo-600 mb-1">{categoryLabel(r.category)}</p>
                    <h3 className="font-serif font-semibold text-tinta leading-snug">{r.title[locale]}</h3>
                    <p className="text-xs text-tinta/60 mt-1.5 flex items-center gap-1">
                      <Clock size={12} /> {r.duration} · {r.stops.length} {L('stops')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

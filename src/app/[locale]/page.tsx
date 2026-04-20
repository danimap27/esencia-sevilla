import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { type Locale } from '@/i18n';
import { APARTMENT } from '@/data/apartment';
import { REVIEWS } from '@/data/reviews';
import { absoluteUrl } from '@/lib/utils';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';
import BookingSection from '@/components/BookingSection';
import FAQ from '@/components/FAQ';
import Reviews from '@/components/Reviews';
import EventsSection from '@/components/EventsSection';
import LocationSection from '@/components/LocationSection';
import Footer from '@/components/Footer';

const MapSection = dynamic(() => import('@/components/MapSection'), {
  ssr: false,
  loading: () => (
    <div className="py-24 flex items-center justify-center bg-crema">
      <div className="text-center text-tinta/40">
        <div className="w-12 h-12 border-4 border-terracota-200 border-t-terracota-500 rounded-full animate-spin mx-auto mb-3" />
        <p>Cargando mapa...</p>
      </div>
    </div>
  ),
});

const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false });

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'seo' });
  const avgRating = REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length;

  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    keywords: [
      'apartamento turístico Sevilla', 'alquiler Sevilla centro', 'piso turístico Sevilla',
      'tourist apartment Seville', 'vacation rental Seville', 'appartement Séville',
    ],
    openGraph: {
      title: t('homeTitle'),
      description: t('homeDescription'),
      url: absoluteUrl(`/${locale}`),
      siteName: APARTMENT.name,
      type: 'website',
      locale: locale,
      images: [
        {
          url: absoluteUrl('/og-image.jpg'),
          width: 1200,
          height: 630,
          alt: `${APARTMENT.name} — Apartamento turístico en el centro de Sevilla`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('homeTitle'),
      description: t('homeDescription'),
      images: [absoluteUrl('/og-image.jpg')],
    },
    alternates: {
      canonical: absoluteUrl(`/${locale}`),
      languages: {
        es: absoluteUrl('/es'),
        en: absoluteUrl('/en'),
        fr: absoluteUrl('/fr'),
        de: absoluteUrl('/de'),
        it: absoluteUrl('/it'),
        pt: absoluteUrl('/pt'),
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  };
}

// Schema.org JSON-LD structured data
function StructuredData({ locale }: { locale: Locale }) {
  const avgRating = REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length;

  const lodgingSchema = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': absoluteUrl(`/${locale}`),
    name: APARTMENT.name,
    description: 'Apartamento turístico en el corazón de Sevilla, a pasos de la Catedral y el Real Alcázar.',
    url: absoluteUrl(`/${locale}`),
    image: [absoluteUrl('/og-image.jpg'), absoluteUrl('/fotos/foto1.jpg')],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Imaginero Luis Alvarez Duarte N7',
      addressLocality: 'Sevilla',
      postalCode: '41008',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: APARTMENT.lat,
      longitude: APARTMENT.lng,
    },
    telephone: APARTMENT.phone,
    email: APARTMENT.email,
    priceRange: '€€',
    checkinTime: APARTMENT.checkInTime,
    checkoutTime: APARTMENT.checkOutTime,
    numberOfRooms: APARTMENT.bedrooms,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Air conditioning', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Kitchen', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Washing machine', value: true },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: REVIEWS.length,
      bestRating: '5',
      worstRating: '1',
    },
    review: REVIEWS.slice(0, 3).map(r => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: '5' },
      datePublished: r.date,
      reviewBody: r.text[locale as Locale],
    })),
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: APARTMENT.name,
    url: absoluteUrl('/'),
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: absoluteUrl(`/es/blog?q={search_term_string}`) },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    </>
  );
}

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <StructuredData locale={locale as Locale} />
      <Header />
      <main>
        <Hero />
        <Gallery />
        <BookingSection />
        <MapSection />
        <EventsSection />
        <Reviews />
        <LocationSection />
        <FAQ />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Star, Shield, Wifi, AirVent, MapPin, ChevronDown, TrendingDown } from 'lucide-react';
import { APARTMENT, NEARBY_LANDMARKS } from '@/data/apartment';
import { calculatePrice } from '@/lib/utils';
import { addDays } from 'date-fns';

const HERO_IMAGES = [
  { src: '/fotos/foto1.jpg', alt: 'Salón principal de Esencia Sevilla' },
  { src: '/fotos/foto2.jpg', alt: 'Dormitorio principal con cama king' },
  { src: '/fotos/foto3.jpg', alt: 'Cocina completamente equipada' },
  { src: '/fotos/foto4.jpg', alt: 'Baño con ducha y amenities' },
  { src: '/fotos/foto5.jpg', alt: 'Vista desde el balcón al barrio' },
];

const TRUST_BADGES = [
  { icon: Shield, key: 'checkin' },
  { icon: Wifi, key: 'wifi' },
  { icon: AirVent, key: 'ac' },
  { icon: MapPin, key: 'location' },
] as const;

export default function Hero({ onScrollToBooking }: { onScrollToBooking?: () => void }) {
  const t = useTranslations('hero');
  const tCommon = useTranslations('common');
  const [currentImage, setCurrentImage] = useState(0);
  const [savings, setSavings] = useState(0);

  // Calculate savings for a sample booking (3 nights, 2 guests)
  useEffect(() => {
    const checkIn = addDays(new Date(), 7);
    const checkOut = addDays(checkIn, 3);
    const price = calculatePrice(checkIn, checkOut, 2, 0, 10);
    setSavings(price.savings || 0);
  }, []);

  // Auto-advance hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const scrollToBooking = () => {
    onScrollToBooking?.();
    document.querySelector('#reservar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToGallery = () => {
    document.querySelector('#galeria')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-screen flex flex-col" id="inicio">
      {/* Background images */}
      <div className="absolute inset-0 overflow-hidden">
        {HERO_IMAGES.map((img, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: idx === currentImage ? 1 : 0 }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={idx === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-tinta/70 via-tinta/40 to-tinta/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-tinta/30 to-transparent" />
      </div>

      {/* Image indicator dots */}
      <div className="absolute bottom-32 md:bottom-40 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImage(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              idx === currentImage ? 'bg-white w-6' : 'bg-white/50'
            }`}
            aria-label={`Ver imagen ${idx + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Badge */}
        <div className="mb-6 animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium">
            <MapPin size={14} className="text-ocre-400" />
            {t('badge')}
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-white mb-4 max-w-2xl animate-slide-up-fade" style={{ animationDelay: '0.2s' }}>
          {t('headline')}
        </h1>

        <p className="text-xl text-white/80 max-w-xl mb-8 animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
          {t('subheadline')}
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-3 mb-8 animate-slide-up-fade" style={{ animationDelay: '0.4s' }}>
          {TRUST_BADGES.map(({ icon: Icon, key }) => (
            <div
              key={key}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm"
            >
              <Icon size={14} className="text-ocre-400" />
              <span>{t(`trustBadges.${key}` as Parameters<typeof t>[0])}</span>
            </div>
          ))}
        </div>

        {/* Rating + Savings row */}
        <div className="flex flex-wrap items-center gap-4 mb-10 animate-slide-up-fade" style={{ animationDelay: '0.5s' }}>
          {/* Stars rating */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} fill="currentColor" className="text-ocre-400" />
              ))}
            </div>
            <span className="text-white font-semibold">5.0</span>
            <span className="text-white/70 text-sm">{t('reviewsBadge', { count: 127 })}</span>
          </div>

          {/* Savings badge */}
          {savings > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-terracota-500/90 backdrop-blur-sm border border-terracota-400">
              <TrendingDown size={14} className="text-white" />
              <span className="text-white font-medium text-sm">
                {t('savingsBadge', { amount: savings })}
              </span>
              <span className="text-white/80 text-xs">{t('savingsDesc')}</span>
            </div>
          )}

          {/* Registration number */}
          <div className="text-white/60 text-xs flex items-center gap-1.5">
            <Shield size={12} />
            <span>{t('registrationLabel')}: {APARTMENT.registrationNumber}</span>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3 animate-slide-up-fade" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={scrollToBooking}
            className="btn-primary text-base py-3.5 px-8 text-lg shadow-large hover:scale-105 transition-transform"
          >
            {t('cta')}
          </button>
          <button
            onClick={scrollToGallery}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all text-lg"
          >
            {t('ctaSecondary')}
          </button>
        </div>

        {/* Nearby landmarks */}
        <div className="mt-10 flex flex-wrap gap-2 animate-slide-up-fade" style={{ animationDelay: '0.7s' }}>
          {NEARBY_LANDMARKS.slice(0, 4).map((landmark) => (
            <span
              key={landmark.name}
              className="text-xs text-white/60 flex items-center gap-1"
            >
              <span>{landmark.icon}</span>
              <span>{landmark.name}</span>
              <span className="text-ocre-400">·</span>
              <span>{landmark.distance}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
        <button
          onClick={() => document.querySelector('#galeria')?.scrollIntoView({ behavior: 'smooth' })}
          className="p-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
          aria-label="Scroll down"
        >
          <ChevronDown size={20} />
        </button>
      </div>
    </section>
  );
}

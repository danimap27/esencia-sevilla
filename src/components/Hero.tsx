'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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
  const [currentImage, setCurrentImage] = useState(0);
  const [savings, setSavings] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkIn = addDays(new Date(), 7);
    const checkOut = addDays(checkIn, 3);
    const price = calculatePrice(checkIn, checkOut, 2, 0, 10);
    setSavings(price.savings || 0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Parallax on mouse move (throttled con rAF)
  useEffect(() => {
    let rafId = 0;
    const handleMouse = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
      });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => {
      window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Parallax on scroll (throttled con rAF)
  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Partículas generadas una sola vez (estables entre renders, sin hydration mismatch)
  const particles = useMemo(
    () =>
      [...Array(20)].map((_, i) => ({
        id: i,
        left: (i * 37 + 13) % 100,
        top: (i * 53 + 29) % 100,
        duration: 3 + ((i * 7) % 40) / 10,
        delay: ((i * 11) % 30) / 10,
        opacity: 0.2 + ((i * 3) % 30) / 100,
      })),
    []
  );

  const scrollToBooking = () => {
    onScrollToBooking?.();
    document.querySelector('#reservar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToGallery = () => {
    document.querySelector('#galeria')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col overflow-hidden" id="inicio">
      {/* Mouse-follow glow */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-0 md:opacity-100 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(600px circle at ${50 + mousePos.x * 8}% ${50 + mousePos.y * 8}%, rgba(255,255,255,0.06) 0%, transparent 70%)`,
        }}
      />

      {/* Background images with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        {HERO_IMAGES.map((img, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: idx === currentImage ? 1 : 0,
              transform: `scale(${1 + scrollY * 0.0003}) translateY(${scrollY * (0.3 + idx * 0.05)}px)`,
            }}
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

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
                opacity: p.opacity,
              }}
            />
          ))}
        </div>
      </div>

      {/* Image indicator dots */}
      <div className="absolute bottom-32 md:bottom-40 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImage(idx)}
            className={`transition-all duration-500 rounded-full ${
              idx === currentImage ? 'bg-white w-8 h-1.5' : 'bg-white/40 w-1.5 h-1.5 hover:bg-white/60'
            }`}
            aria-label={`Ver imagen ${idx + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Badge */}
        <div className="mb-6 animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all duration-300">
            <MapPin size={14} className="text-ocre-400" />
            {t('badge')}
          </span>
        </div>

        {/* Main headline with text gradient */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white mb-4 max-w-3xl animate-slide-up-fade leading-[1.05]"
          style={{
            animationDelay: '0.2s',
            textShadow: '0 2px 40px rgba(0,0,0,0.3)',
          }}
        >
          {t('headline')}
        </h1>

        <p
          className="text-xl md:text-2xl text-white/80 max-w-xl mb-8 animate-slide-up-fade leading-relaxed"
          style={{ animationDelay: '0.3s' }}
        >
          {t('subheadline')}
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-3 mb-8 animate-slide-up-fade" style={{ animationDelay: '0.4s' }}>
          {TRUST_BADGES.map(({ icon: Icon, key }) => (
            <div
              key={key}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm hover:bg-white/15 transition-all duration-300"
            >
              <Icon size={14} className="text-ocre-400" />
              <span>{t(`trustBadges.${key}` as Parameters<typeof t>[0])}</span>
            </div>
          ))}
        </div>

        {/* Rating + Savings row */}
        <div className="flex flex-wrap items-center gap-4 mb-10 animate-slide-up-fade" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} fill="currentColor" className="text-ocre-400" />
              ))}
            </div>
            <span className="text-white font-semibold">5.0</span>
            <span className="text-white/70 text-sm">{t('reviewsBadge', { count: 127 })}</span>
          </div>

          {savings > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-terracota-500/90 backdrop-blur-sm border border-terracota-400 hover:bg-terracota-500 transition-all duration-300">
              <TrendingDown size={14} className="text-white" />
              <span className="text-white font-medium text-sm">
                {t('savingsBadge', { amount: savings })}
              </span>
              <span className="text-white/80 text-xs">{t('savingsDesc')}</span>
            </div>
          )}

          <div className="text-white/60 text-xs flex items-center gap-1.5">
            <Shield size={12} />
            <span>{t('registrationLabel')}: {APARTMENT.registrationNumber}</span>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3 animate-slide-up-fade" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={scrollToBooking}
            className="relative overflow-hidden group bg-gradient-to-r from-terracota-500 to-terracota-600 text-white text-lg py-3.5 px-8 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <span className="relative z-10">{t('cta')}</span>
            <span className="absolute inset-0 bg-gradient-to-r from-terracota-600 to-terracota-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          <button
            onClick={scrollToGallery}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-300 text-lg backdrop-blur-sm"
          >
            {t('ctaSecondary')}
          </button>
        </div>

        {/* Nearby landmarks */}
        <div className="mt-10 flex flex-wrap gap-2 animate-slide-up-fade" style={{ animationDelay: '0.7s' }}>
          {NEARBY_LANDMARKS.slice(0, 5).map((landmark) => (
            <span
              key={landmark.name}
              className="text-xs text-white/60 flex items-center gap-1 hover:text-white/80 transition-colors duration-200"
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={() => document.querySelector('#galeria')?.scrollIntoView({ behavior: 'smooth' })}
          className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 animate-bounce"
          aria-label="Scroll down"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Particle animation styles */}
      <style jsx>{`
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-30px) scale(1.5); opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}

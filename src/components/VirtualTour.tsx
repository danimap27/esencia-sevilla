'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { cn } from '@/lib/utils';

// Pannellum is loaded via script tag (CDN) to avoid SSR issues
const PANNELLUM_CSS = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
const PANNELLUM_JS = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';

interface TourScene {
  id: string;
  titleKey: string;
  image: string;
  yaw: number;
}

const TOUR_SCENES: TourScene[] = [
  {
    id: 'living-room',
    titleKey: 'livingRoom',
    image: '/tours-360/salon.jpg',
    yaw: 0,
  },
  {
    id: 'bedroom',
    titleKey: 'bedroom',
    image: '/tours-360/dormitorio.jpg',
    yaw: 90,
  },
  {
    id: 'kitchen',
    titleKey: 'kitchen',
    image: '/tours-360/cocina.jpg',
    yaw: 180,
  },
  {
    id: 'bathroom',
    titleKey: 'bathroom',
    image: '/tours-360/bano.jpg',
    yaw: 270,
  },
];

// Tour labels in 6 languages (local since they're UI-only labels)
const TOUR_LABELS: Record<string, Record<string, string>> = {
  es: { livingRoom: 'Salón', bedroom: 'Dormitorio', kitchen: 'Cocina', bathroom: 'Baño' },
  en: { livingRoom: 'Living Room', bedroom: 'Bedroom', kitchen: 'Kitchen', bathroom: 'Bathroom' },
  fr: { livingRoom: 'Salon', bedroom: 'Chambre', kitchen: 'Cuisine', bathroom: 'Salle de bain' },
  de: { livingRoom: 'Wohnzimmer', bedroom: 'Schlafzimmer', kitchen: 'Küche', bathroom: 'Badezimmer' },
  it: { livingRoom: 'Soggiorno', bedroom: 'Camera', kitchen: 'Cucina', bathroom: 'Bagno' },
  pt: { livingRoom: 'Sala', bedroom: 'Quarto', kitchen: 'Cozinha', bathroom: 'Casa de banho' },
};

export default function VirtualTour({ locale = 'es' }: { locale?: string }) {
  const t = useTranslations('gallery');
  const [isOpen, setIsOpen] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [pannellumLoaded, setPannellumLoaded] = useState(false);
  const viewerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load Pannellum scripts
  useEffect(() => {
    if (isOpen && !pannellumLoaded) {
      // Load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = PANNELLUM_CSS;
      document.head.appendChild(link);

      // Load JS
      const script = document.createElement('script');
      script.src = PANNELLUM_JS;
      script.async = true;
      script.onload = () => setPannellumLoaded(true);
      document.head.appendChild(script);
    }
  }, [isOpen, pannellumLoaded]);

  // Initialize viewer when loaded
  useEffect(() => {
    if (isOpen && pannellumLoaded && containerRef.current && window.pannellum) {
      const scene = TOUR_SCENES[currentScene];
      try {
        if (viewerRef.current) {
          viewerRef.current.destroy();
        }
        viewerRef.current = (window as any).pannellum.viewer(containerRef.current.id, {
          type: 'equirectangular',
          panorama: scene.image,
          autoLoad: true,
          autoRotate: false,
          compass: true,
          yaw: scene.yaw,
          hfov: 110,
          minHfov: 50,
          maxHfov: 150,
          showControls: true,
          onLoad: () => {},
          onError: (e: any) => {
            // If image not found, show placeholder
            console.warn('Tour image not found:', scene.image);
          },
        });
      } catch (e) {
        console.warn('Pannellum init error:', e);
      }
    }

    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch {}
        viewerRef.current = null;
      }
    };
  }, [isOpen, pannellumLoaded, currentScene]);

  const labels = TOUR_LABELS[locale] || TOUR_LABELS.es;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-tinta/90 hover:bg-tinta text-crema transition-colors text-sm font-medium"
      >
        <Expand size={18} className="text-terracota-400 group-hover:scale-110 transition-transform" />
        {t('virtualTour')}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[9998] bg-tinta flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-tinta/95 border-b border-crema/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-terracota-500 flex items-center justify-center font-serif font-bold text-sm text-white">
            ES
          </div>
          <h3 className="font-serif text-lg text-crema">
            {labels[TOUR_SCENES[currentScene].titleKey]}
          </h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-lg hover:bg-crema/10 transition-colors"
        >
          <X size={20} className="text-crema" />
        </button>
      </div>

      {/* Viewer */}
      <div className="flex-1 relative">
        <div
          id="pannellum-container"
          ref={containerRef}
          className="w-full h-full"
        />

        {/* Placeholder when image not available */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-crema/30">
            <p className="text-sm">📷 {locale === 'es' ? 'Sube fotos 360° en /public/tours-360/' : 'Upload 360° photos to /public/tours-360/'}</p>
          </div>
        </div>

        {/* Nav arrows */}
        <button
          onClick={() => setCurrentScene((prev) => (prev - 1 + TOUR_SCENES.length) % TOUR_SCENES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-crema/10 backdrop-blur-sm border border-crema/20 text-crema hover:bg-crema/20 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => setCurrentScene((prev) => (prev + 1) % TOUR_SCENES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-crema/10 backdrop-blur-sm border border-crema/20 text-crema hover:bg-crema/20 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Scene thumbnails */}
      <div className="flex items-center justify-center gap-2 p-4 bg-tinta/95 border-t border-crema/10 overflow-x-auto">
        {TOUR_SCENES.map((scene, idx) => (
          <button
            key={scene.id}
            onClick={() => setCurrentScene(idx)}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
              idx === currentScene
                ? 'bg-terracota-500 text-white'
                : 'bg-crema/10 text-crema/60 hover:bg-crema/20'
            )}
          >
            {labels[scene.titleKey]}
          </button>
        ))}
      </div>
    </div>
  );
}
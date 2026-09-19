'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { X, ChevronLeft, ChevronRight, Expand, Camera } from 'lucide-react';
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
    id: 'living-room-2',
    titleKey: 'livingRoom2',
    image: '/tours-360/salon-2.jpg',
    yaw: 0,
  },
  {
    id: 'bedroom',
    titleKey: 'bedroom',
    image: '/tours-360/dormitorio.jpg',
    yaw: 90,
  },
  {
    id: 'bedroom-2',
    titleKey: 'bedroom2',
    image: '/tours-360/dormitorio-2.jpg',
    yaw: 90,
  },
  {
    id: 'bedroom-3',
    titleKey: 'bedroom3',
    image: '/tours-360/dormitorio-3.jpg',
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
  es: { livingRoom: 'Salón', livingRoom2: 'Salón · 2', bedroom: 'Dormitorio', bedroom2: 'Dormitorio · 2', bedroom3: 'Dormitorio · 3', kitchen: 'Cocina', bathroom: 'Baño' },
  en: { livingRoom: 'Living Room', livingRoom2: 'Living Room · 2', bedroom: 'Bedroom', bedroom2: 'Bedroom · 2', bedroom3: 'Bedroom · 3', kitchen: 'Kitchen', bathroom: 'Bathroom' },
  fr: { livingRoom: 'Salon', livingRoom2: 'Salon · 2', bedroom: 'Chambre', bedroom2: 'Chambre · 2', bedroom3: 'Chambre · 3', kitchen: 'Cuisine', bathroom: 'Salle de bain' },
  de: { livingRoom: 'Wohnzimmer', livingRoom2: 'Wohnzimmer · 2', bedroom: 'Schlafzimmer', bedroom2: 'Schlafzimmer · 2', bedroom3: 'Schlafzimmer · 3', kitchen: 'Küche', bathroom: 'Badezimmer' },
  it: { livingRoom: 'Soggiorno', livingRoom2: 'Soggiorno · 2', bedroom: 'Camera', bedroom2: 'Camera · 2', bedroom3: 'Camera · 3', kitchen: 'Cucina', bathroom: 'Bagno' },
  pt: { livingRoom: 'Sala', livingRoom2: 'Sala · 2', bedroom: 'Quarto', bedroom2: 'Quarto · 2', bedroom3: 'Quarto · 3', kitchen: 'Cozinha', bathroom: 'Casa de banho' },
};

// Asynchronous existence check for the tour images (at least one must exist)
async function checkPhotosExist(): Promise<string[]> {
  const results = await Promise.all(
    TOUR_SCENES.map(async (scene) => {
      try {
        const res = await fetch(scene.image, { method: 'HEAD' });
        return res.ok ? scene.image : null;
      } catch {
        return null;
      }
    })
  );
  return results.filter((x): x is string => x !== null);
}

export default function VirtualTour({ locale = 'es' }: { locale?: string }) {
  const t = useTranslations('gallery');
  const [isOpen, setIsOpen] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [pannellumLoaded, setPannellumLoaded] = useState(false);
  const [availableScenes, setAvailableScenes] = useState<TourScene[] | null>(null); // null = checking
  const viewerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check which 360 photos exist on the server
  useEffect(() => {
    checkPhotosExist().then((existing) => {
      setAvailableScenes(TOUR_SCENES.filter((s) => existing.includes(s.image)));
    });
  }, []);

  const hasPhotos = (availableScenes?.length ?? 0) > 0;
  const scenes = availableScenes && availableScenes.length > 0 ? availableScenes : TOUR_SCENES;

  // Load Pannellum scripts
  useEffect(() => {
    if (isOpen && !pannellumLoaded) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = PANNELLUM_CSS;
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = PANNELLUM_JS;
      script.async = true;
      script.onload = () => setPannellumLoaded(true);
      document.head.appendChild(script);
    }
  }, [isOpen, pannellumLoaded]);

  // Initialize viewer when loaded
  useEffect(() => {
    if (isOpen && pannellumLoaded && hasPhotos && containerRef.current && (window as any).pannellum) {
      const scene = scenes[currentScene];
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
          onError: () => {
            console.warn('Tour image failed to load:', scene.image);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, pannellumLoaded, currentScene, hasPhotos]);

  const labels = TOUR_LABELS[locale] || TOUR_LABELS.es;

  // Without photos (checked) → disabled "coming soon" button
  if (availableScenes !== null && !hasPhotos) {
    return (
      <button
        disabled
        title={t('noPhotos')}
        className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-tinta/50 text-crema/60 cursor-not-allowed text-sm font-medium"
      >
        <Camera size={18} className="text-terracota-400/50" />
        {t('comingSoon')}
      </button>
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => availableScenes !== null && setIsOpen(true)}
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
            {labels[scenes[currentScene].titleKey]}
          </h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-lg hover:bg-crema/10 transition-colors"
          aria-label={t('close')}
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

        {/* Nav arrows */}
        <button
          onClick={() => setCurrentScene((prev) => (prev - 1 + scenes.length) % scenes.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-crema/10 backdrop-blur-sm border border-crema/20 text-crema hover:bg-crema/20 transition-colors"
          aria-label={t('prev')}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => setCurrentScene((prev) => (prev + 1) % scenes.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-crema/10 backdrop-blur-sm border border-crema/20 text-crema hover:bg-crema/20 transition-colors"
          aria-label={t('next')}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Scene thumbnails */}
      <div className="flex items-center justify-center gap-2 p-4 bg-tinta/95 border-t border-crema/10 overflow-x-auto">
        {scenes.map((scene, idx) => (
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

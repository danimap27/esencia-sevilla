'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { X, ChevronLeft, ChevronRight, Grid3X3, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const PHOTO_SRCS = [
  '/fotos/foto1.jpg', '/fotos/foto2.jpg', '/fotos/foto3.jpg', '/fotos/foto4.jpg',
  '/fotos/foto5.jpg', '/fotos/foto6.jpg', '/fotos/foto7.jpg', '/fotos/foto8.jpg',
  '/fotos/foto9.jpg', '/fotos/foto10.jpg', '/fotos/foto11.jpg', '/fotos/foto12.jpg',
];

export default function Gallery() {
  const t = useTranslations('gallery');
  const photoTexts = t.raw('photos') as { alt: string; caption: string }[];
  const PHOTOS = PHOTO_SRCS.map((src, i) => ({ src, alt: photoTexts[i]?.alt ?? '', caption: photoTexts[i]?.caption ?? '' }));
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayedPhotos = showAll ? PHOTOS : PHOTOS.slice(0, 9);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);

  const prev = () => {
    if (lightboxIdx !== null) {
      setLightboxIdx((lightboxIdx - 1 + PHOTOS.length) % PHOTOS.length);
    }
  };

  const next = () => {
    if (lightboxIdx !== null) {
      setLightboxIdx((lightboxIdx + 1) % PHOTOS.length);
    }
  };

  return (
    <section id="galeria" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="section-title">{t('title')}</h2>
            <p className="text-lg text-tinta-lighter">{t('subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn-secondary text-sm gap-2 hidden sm:inline-flex"
            >
              <Grid3X3 size={16} />
              {showAll ? 'Mostrar menos' : t('viewAll')}
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {displayedPhotos.map((photo, idx) => (
            <div
              key={idx}
              className={cn(
                'relative overflow-hidden rounded-xl cursor-pointer group',
                idx === 0 ? 'col-span-2 md:col-span-2 row-span-2' : '',
                'aspect-square'
              )}
              style={{ aspectRatio: idx === 0 ? '1.5/1' : '1/1' }}
              onClick={() => openLightbox(idx)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes={idx === 0 ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 50vw, 33vw'}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-tinta/0 group-hover:bg-tinta/30 transition-all duration-300 flex items-center justify-center">
                <Maximize2 size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {/* Caption on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-tinta/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-xs font-medium">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Show more button mobile */}
        {!showAll && PHOTOS.length > 9 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="btn-outline"
            >
              {t('viewAll')} ({PHOTOS.length} fotos)
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div className="fixed inset-0 z-[100] bg-tinta/95 backdrop-blur-sm flex items-center justify-center" onClick={closeLightbox}>
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
            onClick={closeLightbox}
            aria-label={t('close')}
          >
            <X size={24} />
          </button>

          {/* Image count */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightboxIdx + 1} / {PHOTOS.length}
          </div>

          {/* Prev button */}
          <button
            className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label={t('prev')}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Image */}
          <div className="relative w-full max-w-4xl max-h-[85vh] mx-12" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[4/3]">
              <Image
                src={PHOTOS[lightboxIdx].src}
                alt={PHOTOS[lightboxIdx].alt}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
            {/* Caption */}
            <p className="mt-3 text-center text-white/70 text-sm">
              {PHOTOS[lightboxIdx].caption}
            </p>
          </div>

          {/* Next button */}
          <button
            className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label={t('next')}
          >
            <ChevronRight size={24} />
          </button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-lg overflow-x-auto scrollbar-hidden px-4">
            {PHOTOS.map((photo, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setLightboxIdx(idx); }}
                className={cn(
                  'flex-shrink-0 w-12 h-12 relative rounded-lg overflow-hidden border-2 transition-all',
                  idx === lightboxIdx ? 'border-terracota-500' : 'border-transparent opacity-60 hover:opacity-100'
                )}
              >
                <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="48px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

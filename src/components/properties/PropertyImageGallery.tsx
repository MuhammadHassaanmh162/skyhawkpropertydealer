'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import type { PropertyImage } from '@/types/property';

interface PropertyImageGalleryProps {
  images: PropertyImage[];
  title: string;
}

export function PropertyImageGallery({ images, title }: PropertyImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const sorted = [...images].sort((a, b) => a.order - b.order);

  const prev = useCallback(() => setActiveIndex((i) => (i - 1 + sorted.length) % sorted.length), [sorted.length]);
  const next = useCallback(() => setActiveIndex((i) => (i + 1) % sorted.length), [sorted.length]);

  if (!sorted.length) {
    return (
      <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
        <span className="text-gray-400 text-sm">No images available</span>
      </div>
    );
  }

  return (
    <>
      {/* Main image */}
      <div
        className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 group cursor-pointer border border-gray-100"
        onClick={() => setLightboxOpen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Image
              src={sorted[activeIndex].url}
              alt={`${title} — image ${activeIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom hint — desktop hover only */}
        <div className="absolute top-3 right-3 hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
            <ZoomIn size={12} /> View full size
          </span>
        </div>

        {/* Counter */}
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
          {activeIndex + 1} / {sorted.length}
        </div>

        {/* Nav arrows — always visible on mobile, hover-reveal on desktop */}
        {sorted.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-card flex items-center justify-center text-gray-700 transition-all hover:bg-white hover:shadow-card-hover gallery-arrow"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-card flex items-center justify-center text-gray-700 transition-all hover:bg-white hover:shadow-card-hover gallery-arrow"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {sorted.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                i === activeIndex
                  ? 'border-gold-400 shadow-gold/30 shadow-sm'
                  : 'border-transparent opacity-60 hover:opacity-90 hover:border-gray-200'
              }`}
            >
              <Image src={img.url} alt={`Thumb ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={() => setLightboxOpen(false)}
            >
              <X size={20} />
            </button>

            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <Image
                  src={sorted[activeIndex].url}
                  alt={`${title} — image ${activeIndex + 1}`}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
            </motion.div>

            {sorted.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

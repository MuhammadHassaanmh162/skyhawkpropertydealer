'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Download, Images } from 'lucide-react';

import type { PropertyImage } from '@/types/property';

// Tiny warm-gray 1×1 SVG used as blur placeholder while images load
const BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNlZGU5ZTEiLz48L3N2Zz4=';

interface PropertyImageGalleryProps {
  images: PropertyImage[];
  title:  string;
}

/** Insert fl_attachment into a Cloudinary URL to force a browser download. */
function toDownloadUrl(url: string): string {
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/fl_attachment/');
  }
  return url;
}

const MAX_THUMBS = 5; // number of thumbnail slots (last becomes "+N" if overflow)

export function PropertyImageGallery({ images, title }: PropertyImageGalleryProps) {
  const [activeIndex,  setActiveIndex]  = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const sorted = [...images].sort((a, b) => a.order - b.order);

  const prev = useCallback(
    () => setActiveIndex((i) => (i - 1 + sorted.length) % sorted.length),
    [sorted.length],
  );
  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % sorted.length),
    [sorted.length],
  );

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     setLightboxOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, prev, next]);

  // ── empty state ──────────────────────────────────────────────────────────────
  if (!sorted.length) {
    return (
      <div className="w-full h-[260px] sm:h-[380px] bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
        <span className="text-gray-400 text-sm">No images available</span>
      </div>
    );
  }

  const thumbsToShow = sorted.slice(0, MAX_THUMBS);
  const overflow     = sorted.length - MAX_THUMBS; // how many hidden after the strip

  // ── main render ──────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Main image ── */}
      {/* All images are pre-rendered and stacked; CSS opacity swap = instant, zero re-fetch */}
      <div
        className="relative w-full h-[260px] sm:h-[400px] lg:h-[480px] rounded-2xl overflow-hidden bg-[#ede9e1] group cursor-pointer select-none"
        onClick={() => setLightboxOpen(true)}
      >
        {sorted.map((img, i) => (
          <div
            key={img.publicId ?? img.storagePath ?? img.url}
            className="absolute inset-0 transition-opacity duration-300"
            style={{ opacity: i === activeIndex ? 1 : 0, zIndex: i === activeIndex ? 1 : 0 }}
          >
            <Image
              src={img.url}
              alt={`${title} — photo ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 65vw, 800px"
              className="object-cover"
              priority={i === 0}
              loading={i === 0 ? 'eager' : 'lazy'}
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
            />
          </div>
        ))}

        {/* Gradient overlay (bottom) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* "View all photos" pill — bottom left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-medium pointer-events-none">
          <Images size={12} />
          {sorted.length} photo{sorted.length !== 1 ? 's' : ''} · tap to expand
        </div>

        {/* Counter — bottom right */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-medium pointer-events-none">
          {activeIndex + 1} / {sorted.length}
        </div>

        {/* Arrow buttons — always visible on mobile, hover-reveal on desktop */}
        {sorted.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-800 hover:bg-white transition-all gallery-arrow"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-800 hover:bg-white transition-all gallery-arrow"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* ── Thumbnail strip ── */}
      {sorted.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
          {thumbsToShow.map((img, i) => {
            const isActive  = i === activeIndex;
            const isOverflow = overflow > 0 && i === MAX_THUMBS - 1;

            return (
              <button
                key={img.publicId ?? img.storagePath ?? i}
                onClick={() => { setActiveIndex(i); if (isOverflow) setLightboxOpen(true); }}
                className={`relative shrink-0 w-[84px] h-[62px] sm:w-[100px] sm:h-[74px] rounded-xl overflow-hidden border-2 transition-all ${
                  isActive
                    ? 'border-gray-900 shadow-md opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-90 hover:border-gray-300'
                }`}
                aria-label={isOverflow ? `View all ${sorted.length} photos` : `Photo ${i + 1}`}
              >
                <Image
                  src={img.url}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
                {/* "+N more" overlay on the last thumbnail when there are hidden images */}
                {isOverflow && (
                  <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">+{overflow + 1}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Top bar */}
            <div
              className="flex items-center justify-between px-4 sm:px-6 py-4 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-white/70 text-sm font-medium">
                {activeIndex + 1} / {sorted.length}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={toDownloadUrl(sorted[activeIndex].url)}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                  title="Download image"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download size={15} />
                  <span className="hidden sm:inline">Download</span>
                </a>
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Main image area — all images stacked, CSS opacity for instant switching */}
            <div className="flex-1 flex items-center justify-center px-12 sm:px-16 min-h-0 relative overflow-hidden">
              {sorted.map((img, i) => (
                <div
                  key={img.publicId ?? img.storagePath ?? img.url}
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
                  style={{ opacity: i === activeIndex ? 1 : 0, zIndex: i === activeIndex ? 1 : 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={`${title} — photo ${i + 1}`}
                    className="block max-w-full max-h-[calc(100vh-200px)] object-contain rounded-xl shadow-2xl"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}

              {/* Lightbox arrows */}
              {sorted.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                    aria-label="Next"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox thumbnail strip */}
            {sorted.length > 1 && (
              <div
                className="flex items-center justify-center gap-2 px-4 py-4 overflow-x-auto shrink-0 scrollbar-none"
                onClick={(e) => e.stopPropagation()}
              >
                {sorted.map((img, i) => (
                  <button
                    key={img.publicId ?? img.storagePath ?? i}
                    onClick={() => setActiveIndex(i)}
                    className={`relative shrink-0 w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeIndex
                        ? 'border-white opacity-100'
                        : 'border-transparent opacity-40 hover:opacity-70'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`Thumb ${i + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Banner } from "@/types/database";

interface BannerCarouselProps {
  banners: Banner[];
}

const AUTOPLAY_INTERVAL = 5000;

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (isPaused || banners.length <= 1) return;

    const timer = setInterval(goToNext, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, goToNext, banners.length]);

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  const slideContent = (
    <div className="relative w-full overflow-hidden rounded-xl">
      <div className="relative aspect-[2.5/1] w-full sm:aspect-[3.5/1]">
        <img
          src={currentBanner.image_url}
          alt={currentBanner.title ?? "Banner promocional"}
          className="h-full w-full object-cover transition-opacity duration-500"
        />

        {(currentBanner.title || currentBanner.subtitle) && (
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent">
            <div className="w-full px-6 pb-8 sm:px-12 sm:pb-12">
              {currentBanner.title && (
                <h2 className="font-heading text-2xl font-bold text-white drop-shadow-lg sm:text-4xl">
                  {currentBanner.title}
                </h2>
              )}
              {currentBanner.subtitle && (
                <p className="mt-2 max-w-xl text-sm text-white/90 drop-shadow sm:text-base">
                  {currentBanner.subtitle}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section
      className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {currentBanner.link_url ? (
        <Link href={currentBanner.link_url} className="block">
          {slideContent}
        </Link>
      ) : (
        slideContent
      )}

      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              goToPrev();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
            aria-label="Banner anterior"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              goToNext();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
            aria-label="Banner siguiente"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                index === currentIndex
                  ? "scale-110 bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Ir al banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

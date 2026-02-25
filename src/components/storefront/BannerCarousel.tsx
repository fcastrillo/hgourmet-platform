"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Banner } from "@/types/database";

interface BannerCarouselProps {
  banners: Banner[];
}

const AUTOPLAY_INTERVAL = 5000;

function HeroSlide() {
  return (
    <div className="relative h-[500px] sm:h-[600px] w-full">
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <Image
          src="/images/logo.png"
          alt="HGourmet"
          width={160}
          height={80}
          className="mb-6 h-20 w-auto brightness-0 invert"
        />
        <h1 className="font-heading text-4xl font-bold sm:text-6xl">
          Ingredientes <span className="text-accent">premium</span> para tus
          creaciones
        </h1>
        <p className="mt-4 max-w-lg text-lg text-white/80">
          Hagamos magia, hagamos repostería
        </p>
        <Link
          href="/categorias"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3 font-heading text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent/90 hover:shadow-md"
        >
          Explora nuestro catálogo
          <svg
            className="h-4 w-4"
            width={16}
            height={16}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function BannerSlide({ banner }: { banner: Banner }) {
  const content = (
    <div className="relative h-[500px] sm:h-[600px] w-full overflow-hidden">
      <img
        src={banner.image_url}
        alt={banner.title ?? "Banner promocional"}
        className="h-full w-full object-cover transition-opacity duration-500"
      />
      {(banner.title || banner.subtitle) && (
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent">
          <div className="w-full px-6 pb-8 sm:px-12 sm:pb-12">
            {banner.title && (
              <h2 className="font-heading text-2xl font-bold text-white drop-shadow-lg sm:text-4xl">
                {banner.title}
              </h2>
            )}
            {banner.subtitle && (
              <p className="mt-2 max-w-xl text-sm text-white/90 drop-shadow sm:text-base">
                {banner.subtitle}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (banner.link_url) {
    return (
      <Link href={banner.link_url} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  // Slide 0 is always the static hero; banners follow in configured order
  const totalSlides = 1 + banners.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(goToNext, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, goToNext, totalSlides]);

  return (
    <section
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Active slide */}
      {currentIndex === 0 ? (
        <HeroSlide />
      ) : (
        <BannerSlide banner={banners[currentIndex - 1]} />
      )}

      {/* Navigation arrows — only visible when there are banners */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              goToPrev();
            }}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
            aria-label="Slide anterior"
          >
            <svg
              className="h-5 w-5"
              width={20}
              height={20}
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
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
            aria-label="Slide siguiente"
          >
            <svg
              className="h-5 w-5"
              width={20}
              height={20}
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
      {totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                index === currentIndex
                  ? "scale-110 bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

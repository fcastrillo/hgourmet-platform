"use client";

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

type GtagCommand = "config" | "event" | "js";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: GtagCommand, target: string | Date, params?: AnalyticsParams) => void;
  }
}

const PROD_HOSTS = new Set(["www.hgourmet.com.mx", "hgourmet.com.mx"]);
const DEMO_HOSTS = new Set(["demo.hgourmet.com.mx", "localhost", "127.0.0.1"]);

function normalizeHost(hostname: string): string {
  return hostname.trim().toLowerCase();
}

interface AnalyticsIds {
  productionId?: string;
  demoId?: string;
  fallbackId?: string;
}

export function resolveGaMeasurementId(hostname: string, ids: AnalyticsIds): string | null {
  const host = normalizeHost(hostname);
  const productionId = ids.productionId?.trim();
  const demoId = ids.demoId?.trim();
  const fallbackId = ids.fallbackId?.trim();

  if (PROD_HOSTS.has(host) && productionId) {
    return productionId;
  }

  if (DEMO_HOSTS.has(host) && demoId) {
    return demoId;
  }

  return fallbackId || null;
}

export function isDebugHost(hostname: string): boolean {
  return DEMO_HOSTS.has(normalizeHost(hostname));
}

export function shouldUseDebugMode(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return isDebugHost(window.location.hostname);
}

export function getGaMeasurementId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return resolveGaMeasurementId(window.location.hostname, {
    productionId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID_PRODUCTION,
    demoId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID_DEMO,
    fallbackId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  });
}

export function isAnalyticsEnabled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const featureFlag = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED;
  if (featureFlag?.toLowerCase() === "false") {
    return false;
  }

  return Boolean(getGaMeasurementId());
}

export function trackPageView(path: string): void {
  if (!isAnalyticsEnabled() || !window.gtag) {
    return;
  }

  const measurementId = getGaMeasurementId();
  if (!measurementId) {
    return;
  }

  window.gtag("config", measurementId, {
    page_path: path,
    ...(shouldUseDebugMode() ? { debug_mode: true } : {}),
  });
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}): void {
  if (!isAnalyticsEnabled() || !window.gtag) {
    return;
  }

  window.gtag("event", eventName, {
    ...params,
    ...(shouldUseDebugMode() ? { debug_mode: true } : {}),
  });
}


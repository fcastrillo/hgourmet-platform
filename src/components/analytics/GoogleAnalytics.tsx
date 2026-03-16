"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  getGaMeasurementId,
  isAnalyticsEnabled,
  shouldUseDebugMode,
} from "@/lib/analytics/ga";

export function GoogleAnalytics() {
  const [measurementId, setMeasurementId] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    if (!isAnalyticsEnabled()) {
      setMeasurementId(null);
      setDebugMode(false);
      return;
    }

    setMeasurementId(getGaMeasurementId());
    setDebugMode(shouldUseDebugMode());
  }, []);

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { debug_mode: ${debugMode} });
        `}
      </Script>
    </>
  );
}


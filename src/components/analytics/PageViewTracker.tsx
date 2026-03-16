"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics/ga";

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const query = searchParams?.toString();
    const fullPath = query ? `${pathname}?${query}` : pathname;

    if (previousPathRef.current === fullPath) {
      return;
    }

    previousPathRef.current = fullPath;
    trackPageView(fullPath);
  }, [pathname, searchParams]);

  return null;
}


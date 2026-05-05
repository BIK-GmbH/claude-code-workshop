import { useRef, type TouchEvent } from "react";

interface Options {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  /** Min horizontal distance in px (default 60) */
  threshold?: number;
  /** Max gesture duration in ms (default 800) */
  maxDuration?: number;
}

interface Handlers {
  onTouchStart: (e: TouchEvent<HTMLElement>) => void;
  onTouchEnd: (e: TouchEvent<HTMLElement>) => void;
}

/**
 * Touch-swipe handler for slide navigation.
 *
 * - Horizontal swipe with |dx| > threshold and within maxDuration triggers nav.
 * - Vertical-dominant swipes are ignored so users can scroll long slides.
 * - Slow drags (e.g. multi-finger pinch leftover) are ignored.
 */
export function useSwipeNav({
  onSwipeLeft,
  onSwipeRight,
  threshold = 60,
  maxDuration = 800,
}: Options): Handlers {
  const start = useRef<{ x: number; y: number; t: number } | null>(null);

  return {
    onTouchStart(e) {
      const t0 = e.touches[0];
      start.current = { x: t0.clientX, y: t0.clientY, t: Date.now() };
    },
    onTouchEnd(e) {
      const s = start.current;
      if (!s) return;
      start.current = null;
      const t1 = e.changedTouches[0];
      const dx = t1.clientX - s.x;
      const dy = t1.clientY - s.y;
      const dt = Date.now() - s.t;
      if (Math.abs(dx) < threshold) return;
      if (Math.abs(dy) > Math.abs(dx)) return;
      if (dt > maxDuration) return;
      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    },
  };
}

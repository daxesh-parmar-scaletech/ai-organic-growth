import { useEffect, useState } from 'react';

const MS_PER_CHAR = 42;
const TICK_MS = 36;
const MAX_DURATION_MS = 7500;

/**
 * Reveals `text` progressively so AI replies look like they're being typed
 * instead of appearing all at once. Paced per-character so it reads like
 * typing rather than a single fast reveal; long replies are capped so they
 * don't drag on forever.
 */
export function useTypewriter(text: string, enabled: boolean) {
  const [length, setLength] = useState(enabled ? 0 : text.length);

  useEffect(() => {
    if (!enabled) {
      setLength(text.length);
      return;
    }

    setLength(0);
    const duration = Math.min(text.length * MS_PER_CHAR, MAX_DURATION_MS);
    const steps = Math.max(1, Math.round(duration / TICK_MS));
    const charsPerTick = Math.max(1, Math.ceil(text.length / steps));

    const interval = setInterval(() => {
      setLength((prev) => {
        const next = prev + charsPerTick;
        if (next >= text.length) {
          clearInterval(interval);
          return text.length;
        }
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [enabled, text]);

  return {
    displayedText: text.slice(0, length),
    isTyping: enabled && length < text.length,
  };
}

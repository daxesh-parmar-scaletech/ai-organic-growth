/**
 * Bridge between the CSS token layer and Chart.js / canvas, which need literal
 * colour strings and cannot consume `var(--x)`.
 *
 * Before this, every chart hardcoded hex — which is why none of them could
 * follow the theme, and why `--chart-1..5` sat defined-but-unreferenced in
 * index.css. Values are read from computed style so there is exactly one source
 * of truth, and the fallbacks mean a typo'd variable name degrades to a visible
 * colour instead of a silently transparent mark.
 */
export interface ChartTokens {
  /** Ordinal magnitude ramp, darkest → lightest in light mode. */
  ink: [string, string, string, string, string];
  grid: string;
  tick: string;
  band: string;
  hairline: string;
  surface: string;
  positive: string;
  negative: string;
  warning: string;
  foreground: string;
  mutedForeground: string;
  fontSans: string;
  fontMono: string;
}

export type ThemeMode = "light" | "dark";

const FALLBACK: Record<ThemeMode, ChartTokens> = {
  light: {
    ink: ["#0D1117", "#353E4A", "#646E7C", "#939DAA", "#B9C1CB"],
    grid: "#E4E7EA",
    tick: "#6B7481",
    band: "#ECEDF0",
    hairline: "#8A939F",
    surface: "#FFFFFF",
    positive: "#0F7B4F",
    negative: "#B42318",
    warning: "#B54708",
    foreground: "#0B0D10",
    mutedForeground: "#5C6674",
    fontSans: "'IBM Plex Sans Variable', system-ui, sans-serif",
    fontMono: "'IBM Plex Mono', ui-monospace, monospace",
  },
  dark: {
    ink: ["#F2F4F7", "#BAC2CC", "#8A939F", "#5B6673", "#3D4550"],
    grid: "#242A31",
    tick: "#9AA3AF",
    band: "#2A2F36",
    hairline: "#5B6673",
    surface: "#15181C",
    positive: "#4ADE80",
    negative: "#FB7185",
    warning: "#FBBF5A",
    foreground: "#F2F4F7",
    mutedForeground: "#9AA3AF",
    fontSans: "'IBM Plex Sans Variable', system-ui, sans-serif",
    fontMono: "'IBM Plex Mono', ui-monospace, monospace",
  },
};

const cache = new Map<ThemeMode, ChartTokens>();

function readVar(style: CSSStyleDeclaration, name: string, fallback: string, mode: ThemeMode): string {
  const value = style.getPropertyValue(name).trim();
  if (value) return value;
  if (import.meta.env.DEV) {
    console.warn(`[chartTokens] --${name.replace(/^--/, "")} resolved empty in ${mode} mode; using fallback.`);
  }
  return fallback;
}

export function readChartTokens(mode: ThemeMode): ChartTokens {
  const cached = cache.get(mode);
  if (cached) return cached;

  const fb = FALLBACK[mode];
  if (typeof window === "undefined") return fb;

  const s = getComputedStyle(document.documentElement);
  const tokens: ChartTokens = {
    ink: [
      readVar(s, "--chart-1", fb.ink[0], mode),
      readVar(s, "--chart-2", fb.ink[1], mode),
      readVar(s, "--chart-3", fb.ink[2], mode),
      readVar(s, "--chart-4", fb.ink[3], mode),
      readVar(s, "--chart-5", fb.ink[4], mode),
    ],
    grid: readVar(s, "--chart-grid", fb.grid, mode),
    tick: readVar(s, "--chart-tick", fb.tick, mode),
    band: readVar(s, "--chart-band", fb.band, mode),
    hairline: readVar(s, "--chart-hairline", fb.hairline, mode),
    surface: readVar(s, "--card", fb.surface, mode),
    positive: readVar(s, "--positive", fb.positive, mode),
    negative: readVar(s, "--negative", fb.negative, mode),
    warning: readVar(s, "--warning", fb.warning, mode),
    foreground: readVar(s, "--foreground", fb.foreground, mode),
    mutedForeground: readVar(s, "--muted-foreground", fb.mutedForeground, mode),
    // Read rather than hardcoded, so a typeface change propagates to charts for
    // free and they can never drift from the surrounding UI.
    fontSans: readVar(s, "--font-sans", fb.fontSans, mode),
    fontMono: readVar(s, "--font-mono", fb.fontMono, mode),
  };

  cache.set(mode, tokens);
  return tokens;
}

/** Clears the memo — called when the theme class changes. */
export function invalidateChartTokens(): void {
  cache.clear();
}

/** Applies an alpha to a hex colour for area fills. */
export function withAlpha(hex: string, alpha: number): string {
  const h = hex.trim().replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = Number.parseInt(full, 16);
  if (!Number.isFinite(n) || full.length !== 6) return hex;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgb(${r} ${g} ${b} / ${alpha})`;
}

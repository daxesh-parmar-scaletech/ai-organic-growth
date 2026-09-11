import { Check, Copy, Globe } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useChartTheme } from "@/hooks/useChartTheme";
import type { BestKeywordCategory } from "@/types/bestKeywords";

interface KeywordSunburstChartProps {
  domain: string;
  categories: BestKeywordCategory[];
}

interface HoverInfo {
  x: number;
  y: number;
  title: string;
  subtitle: string;
  copyable: boolean;
  chancePct?: number;
}

const SIZE = 760;
const CENTER = SIZE / 2;
const HUB_RADIUS = 100;
const CATEGORY_INNER_RADIUS = HUB_RADIUS;
const CATEGORY_OUTER_RADIUS = 225;
const ITEM_INNER_RADIUS = CATEGORY_OUTER_RADIUS + 2;
const ITEM_OUTER_RADIUS = 355;
const GAP_DEG = 0.6;

/**
 * Ranking-chance bins.
 *
 * These are QUANTIZED rather than interpolated, and that is a legibility
 * requirement, not a simplification. Wedge labels sit on the wedge, so each
 * fill needs an ink at 4.5:1. Solving the crossover: white ink holds 4.5:1 only
 * while the fill is dark enough, and near-black ink only once it is light
 * enough — leaving a dead band around #707A88–#727C8A where NEITHER reaches
 * 4.5:1 (best available is 4.35). The previous continuous RGB lerp swept
 * straight through it. Discrete steps avoid it by construction.
 *
 * The thresholds mirror `chanceLabel()` below, so the colour can never
 * contradict the word shown in the tooltip.
 *
 * Measured (light / dark): High 10.83 / 10.52, Medium 5.17 / 6.09, Low 6.89 / 5.30.
 */
type ChanceBin = "High" | "Medium" | "Low";

const CHANCE_BINS: Record<ChanceBin, { light: string; dark: string; lightInk: string; darkInk: string }> = {
  High: { light: "#353E4A", dark: "#BAC2CC", lightInk: "#FFFFFF", darkInk: "#0D1117" },
  Medium: { light: "#646E7C", dark: "#8A939F", lightInk: "#FFFFFF", darkInk: "#0D1117" },
  Low: { light: "#939DAA", dark: "#5B6673", lightInk: "#0D1117", darkInk: "#F2F4F7" },
};

// Maps a keyword's relative score (0-1) to a rough "chance to rank" percentage.
// This is a heuristic derived from AI-inferred relevance to the page's content —
// not a measured probability from real Google ranking or search-volume data.
function chancePercent(t: number): number {
  return Math.round(35 + Math.min(1, Math.max(0, t)) * 60);
}

function binOf(chancePct: number): ChanceBin {
  if (chancePct >= 80) return "High";
  if (chancePct >= 55) return "Medium";
  return "Low";
}

function polarToCartesian(radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(angleRad),
    y: CENTER + radius * Math.sin(angleRad),
  };
}

function annularSectorPath(innerR: number, outerR: number, startDeg: number, endDeg: number): string {
  const outerStart = polarToCartesian(outerR, startDeg);
  const outerEnd = polarToCartesian(outerR, endDeg);
  const innerEnd = polarToCartesian(innerR, endDeg);
  const innerStart = polarToCartesian(innerR, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

// Text reads outward along the arc, flipped upright on the bottom half so it's never upside down.
function radialTextTransform(radius: number, angleDeg: number): string {
  const point = polarToCartesian(radius, angleDeg);
  const normalized = ((angleDeg % 360) + 360) % 360;
  const rotation = normalized >= 180 ? angleDeg + 90 : angleDeg - 90;
  return `translate(${point.x} ${point.y}) rotate(${rotation})`;
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export function KeywordSunburstChart({ domain, categories }: Readonly<KeywordSunburstChartProps>) {
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const { mode, tokens } = useChartTheme();
  const isDark = mode === "dark";
  const categorySpan = 360 / categories.length;

  // The structural inner ring is the darkest step in light mode and the
  // lightest in dark, so luminance moves monotonically outward — it reads as
  // depth rather than as a second magnitude scale.
  const hubInk = tokens.ink[0];
  const hubInkAlt = tokens.ink[1];
  const hubLabelInk = isDark ? "#0D1117" : "#FFFFFF";

  const { minVolume, maxVolume } = useMemo(() => {
    const volumes = categories.flatMap((category) => category.items.map((item) => item.volume));
    return { minVolume: Math.min(...volumes), maxVolume: Math.max(...volumes) };
  }, [categories]);

  const volumeRange = Math.max(1, maxVolume - minVolume);

  const chanceLabel = binOf;

  const handleCopyKeyword = async (keyword: string) => {
    try {
      await navigator.clipboard.writeText(keyword);
      setCopiedKeyword(keyword);
      toast.success(`Copied "${keyword}"`);
      setTimeout(() => setCopiedKeyword((current) => (current === keyword ? null : current)), 1400);
    } catch {
      toast.error("Couldn't copy — select and copy the text manually.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-2.5">
        {/* A discrete key, not a gradient strip: the encoding is now three
            bins, and a continuous legend would misrepresent it. */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <span className="text-2xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
            Chance to rank
          </span>
          {(["Low", "Medium", "High"] as const).map((bin) => (
            <span key={bin} className="flex items-center gap-1.5 text-xs text-foreground">
              <span
                className="size-2.5 shrink-0 rounded-[3px] border border-chart-hairline"
                style={{ backgroundColor: isDark ? CHANCE_BINS[bin].dark : CHANCE_BINS[bin].light }}
              />
              {bin} · {bin === "Low" ? "<55%" : bin === "Medium" ? "55–79%" : "≥80%"}
            </span>
          ))}
        </div>
        <p className="max-w-[60ch] text-center text-xs text-muted-foreground">
          Outer ring shows each keyword's AI-estimated chance of ranking. Inner ring groups keywords by
          topic. Select any keyword to copy it.
        </p>
      </div>

      <div className="relative w-full max-w-[760px]">
        {/* role="group", not "img": the wedges are focusable controls now, and
            an image role would hide them from assistive tech. */}
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width="100%"
          height="100%"
          role="group"
          aria-label={`AI-suggested keyword opportunities and estimated ranking chance for ${domain}`}
        >
          {/* No <defs>: the white/black sheen overlay, the green hub gradient
              and the drop-shadow glow are all gone. The sheen was the worst of
              them — a fixed-angle luminance wash over radially-arranged wedges
              made identical values read as different, actively corrupting a
              luminance-encoded channel. */}
          {categories.map((category, categoryIndex) => {
            const categoryStart = categoryIndex * categorySpan + GAP_DEG / 2;
            const categoryEnd = (categoryIndex + 1) * categorySpan - GAP_DEG / 2;
            const categoryMid = (categoryStart + categoryEnd) / 2;
            // Alternating structural banding: the inner ring groups, it does not
            // encode magnitude. The step is deliberately just-perceptible so it
            // reads as structure rather than as a second value scale.
            const categoryColor = categoryIndex % 2 === 0 ? hubInk : hubInkAlt;
            const itemSpan = categorySpan / category.items.length;
            const isCategoryHovered = hover?.title === category.title && hover.subtitle === "";

            return (
              <g key={category.id}>
                <path
                  d={annularSectorPath(CATEGORY_INNER_RADIUS, CATEGORY_OUTER_RADIUS, categoryStart, categoryEnd)}
                  fill={categoryColor}
                  stroke="var(--card)"
                  strokeWidth={isCategoryHovered ? 3 : 2}
                  className="cursor-pointer transition-[stroke-width] duration-150"
                  onMouseEnter={() => {
                    const { x, y } = polarToCartesian(CATEGORY_OUTER_RADIUS + 20, categoryMid);
                    setHover({ x, y, title: category.title, subtitle: "", copyable: false });
                  }}
                  onMouseLeave={() => setHover(null)}
                />
                <text
                  transform={radialTextTransform((CATEGORY_INNER_RADIUS + CATEGORY_OUTER_RADIUS) / 2, categoryMid)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={13}
                  fontWeight={600}
                  fill={hubLabelInk}
                  className="pointer-events-none"
                >
                  {truncate(category.title, 22)}
                </text>

                {category.items.map((item, itemIndex) => {
                  const itemStart = categoryIndex * categorySpan + itemIndex * itemSpan + GAP_DEG / 2;
                  const itemEnd = categoryIndex * categorySpan + (itemIndex + 1) * itemSpan - GAP_DEG / 2;
                  const itemMid = (itemStart + itemEnd) / 2;
                  const chanceT = (item.volume - minVolume) / volumeRange;
                  const chancePct = chancePercent(chanceT);
                  const bin = binOf(chancePct);
                  const swatch = CHANCE_BINS[bin];
                  const color = isDark ? swatch.dark : swatch.light;
                  // Ink flips per bin — see the dead-zone note above.
                  const labelInk = isDark ? swatch.darkInk : swatch.lightInk;
                  const isItemHovered = hover?.title === item.keyword && hover.subtitle === category.title;
                  const isCopied = copiedKeyword === item.keyword;

                  const showHover = () => {
                    const { x, y } = polarToCartesian(ITEM_OUTER_RADIUS + 20, itemMid);
                    setHover({ x, y, title: item.keyword, subtitle: category.title, copyable: true, chancePct });
                  };

                  return (
                    <g
                      key={item.keyword}
                      // The copy action was mouse-only: a bare <path> with an
                      // onClick and no tabIndex or key handler meant keyboard
                      // users could not copy a keyword at all.
                      tabIndex={0}
                      role="button"
                      aria-label={`${item.keyword} — ${category.title}, ${bin.toLowerCase()} chance to rank, about ${chancePct}%. Press Enter to copy.`}
                      className="cursor-pointer outline-none [&:focus-visible>path]:stroke-[3px]"
                      onFocus={showHover}
                      onBlur={() => setHover(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleCopyKeyword(item.keyword);
                        }
                      }}
                      onClick={() => handleCopyKeyword(item.keyword)}
                    >
                      <path
                        d={annularSectorPath(ITEM_INNER_RADIUS, ITEM_OUTER_RADIUS, itemStart, itemEnd)}
                        fill={color}
                        // Hover changes stroke only. The old 12px radial pop
                        // shifted neighbouring wedges' apparent boundaries.
                        stroke={isItemHovered || isCopied ? "var(--foreground)" : "var(--card)"}
                        strokeWidth={isItemHovered || isCopied ? 2.5 : 2}
                        className="transition-[stroke-width,stroke] duration-150"
                        onMouseEnter={showHover}
                        onMouseLeave={() => setHover(null)}
                      />
                      <text
                        transform={radialTextTransform((ITEM_INNER_RADIUS + ITEM_OUTER_RADIUS) / 2, itemMid)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={11}
                        fontWeight={500}
                        fill={labelInk}
                        className="pointer-events-none"
                      >
                        {isCopied ? "Copied" : truncate(item.keyword, 18)}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* The perpetually rotating dashed ring is gone. Non-user-triggered
              motion that runs forever adds no information and is one of the
              clearest tells of generated UI. */}
          <circle cx={CENTER} cy={CENTER} r={HUB_RADIUS - 8} fill="var(--card)" />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={HUB_RADIUS - 22}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1}
          />
          <g transform={`translate(${CENTER - 12} ${CENTER - 12})`}>
            <Globe className="size-6" color="var(--muted-foreground)" />
          </g>
        </svg>

        {hover ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-popover px-3.5 py-2.5 text-center shadow-lg"
            style={{
              left: `${Math.min(84, Math.max(16, (hover.x / SIZE) * 100))}%`,
              top: `${Math.max(8, (hover.y / SIZE) * 100)}%`,
              width: 200,
              whiteSpace: "normal",
            }}
          >
            <p className="text-sm leading-snug font-medium text-popover-foreground">{hover.title}</p>
            {hover.subtitle ? <p className="mt-0.5 text-2xs text-muted-foreground">{hover.subtitle}</p> : null}
            {hover.chancePct !== undefined ? (
              <p className="tabular mt-1 text-2xs font-medium text-foreground">
                {chanceLabel(hover.chancePct)} chance · ~{hover.chancePct}%
              </p>
            ) : null}
            {hover.copyable ? (
              <p className="mt-1 flex items-center justify-center gap-1 text-2xs text-muted-foreground">
                {copiedKeyword === hover.title ? (
                  <>
                    <Check className="size-3" aria-hidden="true" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3" aria-hidden="true" /> Select to copy
                  </>
                )}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

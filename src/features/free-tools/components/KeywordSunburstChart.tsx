import { Check, Copy, Globe } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
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
}

const SIZE = 760;
const CENTER = SIZE / 2;
const HUB_RADIUS = 100;
const CATEGORY_INNER_RADIUS = HUB_RADIUS;
const CATEGORY_OUTER_RADIUS = 225;
const ITEM_INNER_RADIUS = CATEGORY_OUTER_RADIUS + 2;
const ITEM_OUTER_RADIUS = 355;
const GAP_DEG = 0.6;
const HOVER_POP = 12;

// Dark brown -> warm orange -> light peach, matching a sunburst-style category wheel.
const CATEGORY_COLORS = [
  "#2b1608",
  "#4a2410",
  "#7a3813",
  "#a84a16",
  "#c85f1c",
  "#e07f2e",
  "#ef9c4c",
  "#f8c48a",
];

// Same palette, light-to-dark, used as a sequential ramp so the outer ring's
// color encodes each keyword's relative search volume rank rather than its category.
const VOLUME_COLOR_RAMP = [...CATEGORY_COLORS].reverse();

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
}

// t in [0,1]; 0 = lowest volume (lightest), 1 = highest volume (darkest).
function volumeColor(t: number): string {
  const clamped = Math.min(1, Math.max(0, t));
  const stops = VOLUME_COLOR_RAMP;
  const scaled = clamped * (stops.length - 1);
  const lowerIndex = Math.floor(scaled);
  const upperIndex = Math.min(stops.length - 1, lowerIndex + 1);
  const localT = scaled - lowerIndex;

  const lower = hexToRgb(stops[lowerIndex]);
  const upper = hexToRgb(stops[upperIndex]);
  const mixed: [number, number, number] = [
    lower[0] + (upper[0] - lower[0]) * localT,
    lower[1] + (upper[1] - lower[1]) * localT,
    lower[2] + (upper[2] - lower[2]) * localT,
  ];
  return rgbToHex(mixed);
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

export function KeywordSunburstChart({ domain, categories }: KeywordSunburstChartProps) {
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const categorySpan = 360 / categories.length;

  const { minVolume, maxVolume } = useMemo(() => {
    const volumes = categories.flatMap((category) => category.items.map((item) => item.volume));
    return { minVolume: Math.min(...volumes), maxVolume: Math.max(...volumes) };
  }, [categories]);

  const volumeRange = Math.max(1, maxVolume - minVolume);

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
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-muted-foreground">Lower search volume</span>
          <div
            className="h-2.5 w-40 rounded-full"
            style={{
              background: `linear-gradient(to right, ${VOLUME_COLOR_RAMP[0]}, ${VOLUME_COLOR_RAMP[VOLUME_COLOR_RAMP.length - 1]})`,
            }}
          />
          <span className="text-[11px] font-medium text-muted-foreground">Higher search volume</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Outer ring color ranks each keyword by estimated search volume · inner ring groups keywords by topic ·
          click any keyword to copy it
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-border pt-3">
          {categories.map((category, categoryIndex) => (
            <div key={category.id} className="flex items-center gap-1.5">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[categoryIndex % CATEGORY_COLORS.length] }}
              />
              <span className="text-[12px] text-foreground">{category.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full max-w-[760px]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width="100%"
          height="100%"
          role="img"
          aria-label={`Top keyword suggestions for ${domain}`}
        >
          <defs>
            <linearGradient id="wedge-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.22} />
              <stop offset="45%" stopColor="#ffffff" stopOpacity={0} />
              <stop offset="100%" stopColor="#000000" stopOpacity={0.12} />
            </linearGradient>
            <radialGradient id="hub-gradient" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#3fae7a" />
              <stop offset="100%" stopColor="var(--primary)" />
            </radialGradient>
            <filter id="wedge-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#000000" floodOpacity={0.35} />
            </filter>
          </defs>

          {categories.map((category, categoryIndex) => {
            const categoryStart = categoryIndex * categorySpan + GAP_DEG / 2;
            const categoryEnd = (categoryIndex + 1) * categorySpan - GAP_DEG / 2;
            const categoryMid = (categoryStart + categoryEnd) / 2;
            const categoryColor = CATEGORY_COLORS[categoryIndex % CATEGORY_COLORS.length];
            const itemSpan = categorySpan / category.items.length;
            const isCategoryHovered = hover?.title === category.title && hover.subtitle === "";

            return (
              <g key={category.id}>
                <path
                  d={annularSectorPath(CATEGORY_INNER_RADIUS, CATEGORY_OUTER_RADIUS, categoryStart, categoryEnd)}
                  fill={categoryColor}
                  stroke="var(--card)"
                  strokeWidth={isCategoryHovered ? 2.5 : 1.5}
                  filter={isCategoryHovered ? "url(#wedge-glow)" : undefined}
                  className="cursor-pointer transition-[stroke-width] duration-150"
                  onMouseEnter={() => {
                    const { x, y } = polarToCartesian(CATEGORY_OUTER_RADIUS + 20, categoryMid);
                    setHover({ x, y, title: category.title, subtitle: "", copyable: false });
                  }}
                  onMouseLeave={() => setHover(null)}
                />
                <path
                  d={annularSectorPath(CATEGORY_INNER_RADIUS, CATEGORY_OUTER_RADIUS, categoryStart, categoryEnd)}
                  fill="url(#wedge-sheen)"
                  className="pointer-events-none"
                />
                <text
                  transform={radialTextTransform((CATEGORY_INNER_RADIUS + CATEGORY_OUTER_RADIUS) / 2, categoryMid)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={14.5}
                  fontWeight={700}
                  fill="#fff"
                  className="pointer-events-none"
                >
                  {truncate(category.title, 24)}
                </text>

                {category.items.map((item, itemIndex) => {
                  const itemStart = categoryIndex * categorySpan + itemIndex * itemSpan + GAP_DEG / 2;
                  const itemEnd = categoryIndex * categorySpan + (itemIndex + 1) * itemSpan - GAP_DEG / 2;
                  const itemMid = (itemStart + itemEnd) / 2;
                  const volumeT = (item.volume - minVolume) / volumeRange;
                  const color = volumeColor(volumeT);
                  const isItemHovered = hover?.title === item.keyword && hover.subtitle === category.title;
                  const isCopied = copiedKeyword === item.keyword;

                  return (
                    <g key={item.keyword}>
                      <path
                        d={annularSectorPath(
                          ITEM_INNER_RADIUS,
                          ITEM_OUTER_RADIUS + (isItemHovered ? HOVER_POP : 0),
                          itemStart,
                          itemEnd,
                        )}
                        fill={isCopied ? "#2f9e64" : color}
                        stroke="var(--card)"
                        strokeWidth={isItemHovered ? 2.5 : 1.25}
                        filter={isItemHovered ? "url(#wedge-glow)" : undefined}
                        className="cursor-pointer transition-[stroke-width,fill] duration-150"
                        onMouseEnter={() => {
                          const { x, y } = polarToCartesian(ITEM_OUTER_RADIUS + 20, itemMid);
                          setHover({ x, y, title: item.keyword, subtitle: category.title, copyable: true });
                        }}
                        onMouseLeave={() => setHover(null)}
                        onClick={() => handleCopyKeyword(item.keyword)}
                      />
                      <path
                        d={annularSectorPath(
                          ITEM_INNER_RADIUS,
                          ITEM_OUTER_RADIUS + (isItemHovered ? HOVER_POP : 0),
                          itemStart,
                          itemEnd,
                        )}
                        fill="url(#wedge-sheen)"
                        className="pointer-events-none"
                      />
                      <text
                        transform={radialTextTransform((ITEM_INNER_RADIUS + ITEM_OUTER_RADIUS) / 2, itemMid)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={12}
                        fontWeight={600}
                        fill="#fff"
                        className="pointer-events-none"
                      >
                        {isCopied ? "✓ copied" : truncate(item.keyword, 20)}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          <g
            className="animate-spin origin-center [animation-duration:40s]"
            style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
          >
            <circle
              cx={CENTER}
              cy={CENTER}
              r={HUB_RADIUS - 14}
              fill="none"
              stroke="var(--primary)"
              strokeOpacity={0.35}
              strokeWidth={2}
              strokeDasharray="4 10"
            />
          </g>
          <circle cx={CENTER} cy={CENTER} r={HUB_RADIUS - 8} fill="var(--card)" />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={HUB_RADIUS - 24}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1}
          />
          <circle cx={CENTER} cy={CENTER} r={HUB_RADIUS - 38} fill="url(#hub-gradient)" />
          <g transform={`translate(${CENTER - 14} ${CENTER - 14})`}>
            <Globe className="size-7" color="var(--primary-foreground)" />
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
            <p className="text-[13px] font-semibold leading-snug text-popover-foreground">{hover.title}</p>
            {hover.subtitle ? (
              <p className="mt-0.5 text-[11px] text-muted-foreground">{hover.subtitle}</p>
            ) : null}
            {hover.copyable ? (
              <p className="mt-1 flex items-center justify-center gap-1 text-[10.5px] font-medium text-primary">
                {copiedKeyword === hover.title ? (
                  <>
                    <Check className="size-3" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3" /> Click to copy
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

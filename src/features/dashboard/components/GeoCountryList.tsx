import { cn } from "@/lib/utils";
import type { GeoDatum } from "@/types/geo";

interface GeoCountryListProps {
  data: GeoDatum[];
  onSelect: (geo: GeoDatum) => void;
}

export function GeoCountryList({ data, onSelect }: GeoCountryListProps) {
  const topCountries = data.slice(0, 8);
  const maxClicks = Math.max(...topCountries.map((g) => g.clicks));

  return (
    <div className="flex flex-col">
      <div className="mb-2 text-[11.5px] font-bold tracking-wider text-muted-foreground">TOP COUNTRIES</div>
      <div className="flex flex-col">
        {topCountries.map((geo) => (
          <button
            key={geo.country}
            type="button"
            onClick={() => onSelect(geo)}
            className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-muted"
          >
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: geo.belowAverageCtr ? "#E0900B" : "#12A150" }}
            />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex justify-between text-[13px]">
                <span className="truncate font-semibold">{geo.country}</span>
                <span className="font-mono font-bold">{geo.clicks.toLocaleString()}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", geo.belowAverageCtr ? "bg-brand-medium" : "bg-primary")}
                  style={{ width: `${(geo.clicks / maxClicks) * 100}%` }}
                />
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-auto pt-3 text-[11.5px] leading-relaxed text-muted-foreground">
        Circle size reflects clicks; amber markers flag regions with below-average CTR.
      </div>
    </div>
  );
}

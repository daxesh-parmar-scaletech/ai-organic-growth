import { cn } from "@/lib/utils";
import type { Keyword } from "@/types/keyword";

const COLUMNS = "grid-cols-[2.2fr_1fr_1fr_1fr_1fr_1fr]";

export function TopKeywordsTable({ keywords }: { keywords: Keyword[] }) {
  return (
    <>
      <div className={cn("grid gap-2 bg-muted/40 px-5.5 py-2.5 text-[11.5px] font-bold tracking-wide text-muted-foreground", COLUMNS)}>
        <div>QUERY</div>
        <div className="text-right">CLICKS</div>
        <div className="text-right">IMPR.</div>
        <div className="text-right">CTR</div>
        <div className="text-right">POSITION</div>
        <div className="text-right">CHANGE</div>
      </div>
      {keywords.map((keyword) => {
        const isPositive = keyword.delta.startsWith("+");
        return (
          <div
            key={keyword.query}
            className={cn("grid items-center gap-2 border-t border-border/70 px-5.5 py-3.5 text-[13.5px]", COLUMNS)}
          >
            <div className="truncate font-semibold">{keyword.query}</div>
            <div className="text-right font-mono">{keyword.clicks}</div>
            <div className="text-right font-mono text-muted-foreground">{keyword.impressions}</div>
            <div className="text-right font-mono text-muted-foreground">{keyword.ctr}</div>
            <div className="text-right font-mono font-bold">{keyword.position}</div>
            <div className="text-right">
              <span className={cn("font-mono", isPositive ? "text-primary" : "text-destructive")}>
                {keyword.delta}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
}

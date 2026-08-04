import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PageMetric } from "@/types/page";

const COLUMNS = "grid-cols-[1.9fr_1fr_1fr_1fr_1fr_1fr_auto]";

interface TopPagesTableProps {
  pages: PageMetric[];
  onRecommend: (page: string) => void;
}

export function TopPagesTable({ pages, onRecommend }: TopPagesTableProps) {
  return (
    <>
      <div className={cn("grid items-center gap-2 bg-muted/40 px-5.5 py-2.5 text-[11.5px] font-bold tracking-wide text-muted-foreground", COLUMNS)}>
        <div>PAGE</div>
        <div className="text-right">CLICKS</div>
        <div className="text-right">IMPR.</div>
        <div className="text-right">CTR</div>
        <div className="text-right">POSITION</div>
        <div className="text-right">CHANGE</div>
        <div />
      </div>
      {pages.map((page) => {
        const isPositive = page.delta.startsWith("+");
        return (
          <div
            key={page.page}
            className={cn("grid items-center gap-2 border-t border-border/70 px-5.5 py-3.5 text-[13.5px]", COLUMNS)}
          >
            <div className="truncate font-semibold">{page.page}</div>
            <div className="text-right font-mono">{page.clicks}</div>
            <div className="text-right font-mono text-muted-foreground">{page.impressions}</div>
            <div className="text-right font-mono text-muted-foreground">{page.ctr}</div>
            <div className="text-right font-mono font-bold">{page.position}</div>
            <div className="text-right">
              <span className={cn("font-mono", isPositive ? "text-primary" : "text-destructive")}>
                {page.delta}
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={() => onRecommend(page.page)}>
              <Sparkles className="size-3.5" />
              Recommend
            </Button>
          </div>
        );
      })}
    </>
  );
}

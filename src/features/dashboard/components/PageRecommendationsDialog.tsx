import { Code2, FileText, Loader2, Search, Sparkles, Users, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@/types/recommendation";

const PRIORITY_PILL: Record<Recommendation["priority"], string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-brand-medium/10 text-brand-medium",
  Low: "bg-brand-low/10 text-brand-low",
};

const CATEGORY_ICON: Record<string, typeof Search> = {
  SEO: Search,
  "Content Quality": FileText,
  "Technical SEO": Code2,
  "User Experience": Users,
  Performance: Zap,
};

interface PageRecommendationsDialogProps {
  pageUrl: string | null;
  recommendations: Recommendation[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onClose: () => void;
}

export function PageRecommendationsDialog({
  pageUrl,
  recommendations,
  isLoading,
  isError,
  onClose,
}: PageRecommendationsDialogProps) {
  const highPriorityCount = recommendations?.filter((r) => r.priority === "High").length ?? 0;

  return (
    <Dialog open={pageUrl !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[960px] sm:max-w-[960px]">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            <Sparkles className="size-4 text-brand-indigo" />
            AI recommendations
            {pageUrl ? <span className="truncate font-mono text-[13px] font-normal text-muted-foreground">{pageUrl}</span> : null}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center gap-3 py-14 text-muted-foreground">
            <Loader2 className="size-7 animate-spin" />
            <span className="text-sm">Analyzing this page across SEO, content, technical, UX & performance…</span>
          </div>
        ) : isError ? (
          <p className="py-10 text-center text-sm text-destructive">
            Couldn't generate recommendations for this page. Try again.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3.5">
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
                {recommendations?.length ?? 0} recommendations
              </span>
              {highPriorityCount > 0 ? (
                <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-bold text-destructive">
                  {highPriorityCount} high priority
                </span>
              ) : null}
            </div>

            <div className="grid max-h-[65vh] grid-cols-1 gap-3.5 overflow-y-auto pr-1 lg:grid-cols-2">
              {(recommendations ?? []).map((reco) => {
                const Icon = CATEGORY_ICON[reco.category] ?? Sparkles;
                return (
                  <div key={reco.id} className="flex flex-col rounded-xl border border-border p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-brand-indigo/10 text-brand-indigo">
                        <Icon className="size-3.5" />
                      </span>
                      <span className="text-[11.5px] font-bold tracking-wide text-muted-foreground uppercase">
                        {reco.category}
                      </span>
                      <span className={cn("ml-auto rounded-full px-2.5 py-0.5 text-[11px] font-bold", PRIORITY_PILL[reco.priority])}>
                        {reco.priority}
                      </span>
                    </div>

                    <div className="text-[14.5px] leading-snug font-bold">{reco.title}</div>
                    <div className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{reco.description}</div>

                    <div className="mt-2.5 flex gap-2">
                      <span className="rounded-[8px] bg-muted/60 px-2.5 py-1 text-[11.5px] font-semibold text-primary">
                        {reco.impact}
                      </span>
                      <span className="rounded-[8px] bg-muted/60 px-2.5 py-1 text-[11.5px] font-semibold text-muted-foreground">
                        {reco.effort} effort
                      </span>
                    </div>

                    <div className="mt-3 border-t border-border pt-3">
                      <div className="mb-1.5 text-[11px] font-bold tracking-wide text-muted-foreground">ACTION STEPS</div>
                      <ul className="flex flex-col gap-1.5">
                        {reco.steps.map((step) => (
                          <li key={step} className="flex gap-2 text-[13px] leading-relaxed">
                            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-foreground/60" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

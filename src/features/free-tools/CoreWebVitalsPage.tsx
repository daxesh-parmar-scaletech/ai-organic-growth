import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/common/SectionCard";
import { useCoreWebVitals } from "@/hooks/queries/useCoreWebVitals";
import { CoreWebVitalsCard } from "@/features/dashboard/components/CoreWebVitalsCard";

export function CoreWebVitalsPage() {
  const [pageUrl, setPageUrl] = useState("");
  const checkMutation = useCoreWebVitals();
  const canSubmit = pageUrl.trim().length > 0;

  const handleCheck = () => {
    if (!canSubmit) return;
    checkMutation.mutate(pageUrl.trim());
  };

  return (
    <div className="flex flex-col gap-4">

      <SectionCard title="Check Page Speed Insights">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-sm font-semibold text-foreground">Page URL</label>
            <Input
              value={pageUrl}
              onChange={(e) => setPageUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              placeholder="https://example.com/your-page/"
              className="h-9"
            />
          </div>
          <Button onClick={handleCheck} disabled={checkMutation.isPending || !canSubmit} className="h-9">
            {checkMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Check
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Powered by Google PageSpeed Insights — works for any public URL, no login required.
        </p>
      </SectionCard>

      {checkMutation.isError ? (
        <p className="text-sm text-destructive">Couldn't check this page. Try again.</p>
      ) : null}

      {checkMutation.isSuccess &&
      checkMutation.data.mobile.metrics.length === 0 &&
      checkMutation.data.desktop.metrics.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No Core Web Vitals data available for this page yet.
        </p>
      ) : null}

      {checkMutation.data &&
      (checkMutation.data.mobile.metrics.length > 0 || checkMutation.data.desktop.metrics.length > 0) ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CoreWebVitalsCard
            title="Mobile"
            score={checkMutation.data.mobile.score}
            metrics={checkMutation.data.mobile.metrics}
          />
          <CoreWebVitalsCard
            title="Desktop"
            score={checkMutation.data.desktop.score}
            metrics={checkMutation.data.desktop.metrics}
          />
        </div>
      ) : null}
    </div>
  );
}

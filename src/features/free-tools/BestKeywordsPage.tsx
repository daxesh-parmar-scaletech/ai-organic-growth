import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/common/SectionCard";
import { ToolPageHeader } from "@/features/free-tools/components/ToolPageHeader";
import { KeywordSunburstChart } from "@/features/free-tools/components/KeywordSunburstChart";
import { useBestKeywords } from "@/hooks/queries/useBestKeywords";

export function BestKeywordsPage() {
  const [url, setUrl] = useState("");
  const keywordsMutation = useBestKeywords();
  const result = keywordsMutation.data;
  const canSubmit = url.trim().length > 0 && !keywordsMutation.isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    keywordsMutation.mutate(url.trim());
  };

  return (
    <div className="flex flex-col gap-4">
      <ToolPageHeader
        title="Your Best Keywords"
        description="Enter any website URL to see the top keywords it ranks for on Google, grouped by topic."
      />

      <SectionCard title="Analyze a website">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-[13px] font-semibold text-foreground">Website URL</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="https://example.com"
              className="h-9"
            />
          </div>
          <Button onClick={handleSubmit} disabled={!canSubmit} className="h-9 gap-1.5">
            {keywordsMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            Get Keywords
          </Button>
        </div>
        {keywordsMutation.isPending ? (
          <p className="mt-2 text-[12.5px] text-muted-foreground">
            Analyzing the page and researching keywords — this can take a few seconds…
          </p>
        ) : null}
      </SectionCard>

      {keywordsMutation.isError ? (
        <p className="text-sm text-destructive">Couldn't fetch keywords for this URL. Check it and try again.</p>
      ) : null}

      {result ? (
        <SectionCard title={`Top keywords for ${result.domain}`}>
          <p className="-mt-2 mb-3 text-[12.5px] text-muted-foreground">
            {result.categories.length} topic groups ·{" "}
            {result.categories.reduce((sum, category) => sum + category.items.length, 0)} keywords
          </p>
          <KeywordSunburstChart domain={result.domain} categories={result.categories} />
        </SectionCard>
      ) : null}
    </div>
  );
}

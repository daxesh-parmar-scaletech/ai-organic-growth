import { Bot, Search, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/common/SectionCard";
import type { ContentRating } from "@/types/contentGeneration";

interface RatingsCardProps {
  seoRating: ContentRating;
  aeoRating: ContentRating;
  geoRating: ContentRating;
}

function scoreVariant(score: number): "secondary" | "outline" | "destructive" {
  if (score >= 80) return "secondary";
  if (score >= 60) return "outline";
  return "destructive";
}

function RatingRow({
  icon: Icon,
  label,
  fullLabel,
  rating,
}: {
  icon: LucideIcon;
  label: string;
  fullLabel: string;
  rating: ContentRating;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{label}</span>
          <span className="text-xs text-muted-foreground">({fullLabel})</span>
          <Badge variant={scoreVariant(rating.score)}>{rating.score}/100</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{rating.summary}</p>
      </div>
    </div>
  );
}

export function RatingsCard({ seoRating, aeoRating, geoRating }: RatingsCardProps) {
  return (
    <SectionCard title="Ranking Readiness">
      <p className="mb-3 text-sm text-muted-foreground">
        A quick read on how likely this content is to rank and get surfaced — across classic search, AI voice/answer
        assistants, and generative AI engines like ChatGPT or Perplexity.
      </p>
      <div className="flex flex-col gap-2.5">
        <RatingRow icon={Search} label="SEO Rating" fullLabel="Search Engine Optimization" rating={seoRating} />
        <RatingRow icon={Bot} label="AEO Rating" fullLabel="Answer Engine Optimization" rating={aeoRating} />
        <RatingRow icon={Sparkles} label="GEO Rating" fullLabel="Generative Engine Optimization" rating={geoRating} />
      </div>
    </SectionCard>
  );
}

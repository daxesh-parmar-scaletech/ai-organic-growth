import { useState } from "react";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import type { PageAuditResult } from "@/types/pageAudit";

function MetricBar({ label, value }: { label: string; value: number }) {
  const color = value >= 70 ? "bg-emerald-500" : value >= 40 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 text-[13px] text-foreground">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

export function ContentTab({ result }: { result: PageAuditResult }) {
  const [densityView, setDensityView] = useState<"oneWord" | "twoWord" | "threeWord">("oneWord");
  const readability = result.readability!;
  const stats = result.stats!;
  const density = result.wordDensity![densityView];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <SectionCard title="Readability">
        <p className="-mt-2 mb-3 text-[13px] text-foreground">
          Flesch Reading Score: <span className="font-bold text-orange-600">{readability.fleschScore}%</span>
        </p>
        <p className="-mt-2 mb-3 text-[12.5px] text-muted-foreground">
          Your flesch reading score of {readability.fleschScore} is considered {readability.fleschLabel}.
        </p>
        <div className="flex flex-col gap-2">
          <MetricBar label="Passive Voice" value={readability.passiveVoice} />
          <MetricBar label="Sentence Length" value={readability.sentenceLength} />
          <MetricBar label="Paragraph Length" value={readability.paragraphLength} />
          <MetricBar label="Word Complexity" value={readability.wordComplexity} />
          <MetricBar label="Transition Words" value={readability.transitionWords} />
        </div>
      </SectionCard>

      <SectionCard title="Stats">
        <div className="flex flex-col gap-1.5">
          <StatRow label="Word Count" value={stats.wordCount} />
          <StatRow label="Keyword Occurrences" value={stats.keywordOccurrences} />
          <StatRow label="Keyword Density" value={`${stats.keywordDensity.toFixed(1)}%`} />
          <StatRow label="Images" value={stats.images} />
          <StatRow label="Images With Alt Text" value={stats.imagesWithAltText} />
          <StatRow label="Links" value={stats.links} />
          <StatRow label="Paragraphs" value={stats.paragraphs} />
          <StatRow label="Sentences" value={stats.sentences} />
          <StatRow label="Transitioned Sentences" value={stats.transitionedSentences} />
        </div>
      </SectionCard>

      <SectionCard title="Word Density">
        <div className="mb-3 flex gap-1">
          <Button size="sm" variant={densityView === "oneWord" ? "default" : "outline"} onClick={() => setDensityView("oneWord")}>
            1 Word
          </Button>
          <Button size="sm" variant={densityView === "twoWord" ? "default" : "outline"} onClick={() => setDensityView("twoWord")}>
            2 Word
          </Button>
          <Button size="sm" variant={densityView === "threeWord" ? "default" : "outline"} onClick={() => setDensityView("threeWord")}>
            3 Word
          </Button>
        </div>
        <div className="flex flex-col gap-1.5">
          {density.map((entry) => (
            <div key={entry.word} className="flex items-center justify-between text-[13px]">
              <span className="text-foreground">{entry.word}</span>
              <span className="text-muted-foreground">
                {entry.count} ({entry.pct}%)
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Headings" className="lg:col-span-3">
        <div className="flex flex-col gap-2">
          {result.headings!.map((heading, index) => (
            <div
              key={`${heading.level}-${index}`}
              className="flex items-center gap-3"
              style={{ paddingLeft: `${(Number(heading.level.slice(1)) - 1) * 12}px` }}
            >
              <span className="w-8 shrink-0 text-[11.5px] font-bold uppercase text-muted-foreground">
                {heading.level}
              </span>
              <span className="flex-1 rounded-md border border-border bg-muted/30 px-3 py-1.5 text-[13px] text-foreground">
                {heading.text}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

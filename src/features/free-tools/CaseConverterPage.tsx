import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/common/SectionCard";
import { CopyButton } from "@/features/free-tools/components/CopyButton";
import { ToolPageHeader } from "@/features/free-tools/components/ToolPageHeader";
import { CASE_MODES, convertCase, type CaseMode } from "@/features/free-tools/lib/textCase";

export function CaseConverterPage() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<CaseMode>("upper");

  const output = useMemo(() => convertCase(mode, text), [mode, text]);
  const wordCount = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;

  return (
    <div className="flex flex-col gap-4">
      <ToolPageHeader
        title="Case Converter"
        description="Instantly convert your text to UPPERCASE, lowercase, Title Case, Sentence case, or aLtErNaTiNg case."
      />

      <SectionCard title="Your text">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here…"
          rows={8}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {text.length} characters · {wordCount} words
        </p>
      </SectionCard>

      <SectionCard title="Choose a case">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {CASE_MODES.map((m) => (
            <Button
              key={m.id}
              type="button"
              size="sm"
              variant={mode === m.id ? "default" : "outline"}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </Button>
          ))}
        </div>
        <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3">
          <p className="min-h-12 flex-1 whitespace-pre-wrap wrap-break-word text-sm text-foreground">
            {output || <span className="text-muted-foreground">Your converted text will appear here…</span>}
          </p>
          <CopyButton text={output} className="shrink-0" />
        </div>
      </SectionCard>
    </div>
  );
}

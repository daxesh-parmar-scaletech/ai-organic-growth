import { useMemo, useState } from "react";
import { SectionCard } from "@/components/common/SectionCard";
import { CopyButton } from "@/features/free-tools/components/CopyButton";
import { ToolPageHeader } from "@/features/free-tools/components/ToolPageHeader";
import { toSmallCaps, toSuperscript } from "@/features/free-tools/lib/smallText";

export function SmallTextGeneratorPage() {
  const [text, setText] = useState("");

  const smallCaps = useMemo(() => toSmallCaps(text), [text]);
  const superscript = useMemo(() => toSuperscript(text), [text]);

  return (
    <div className="flex flex-col gap-4">
      <ToolPageHeader
        title="Small Text Generator"
        description="Turn your text into ˢᵐᵃˡˡ Unicode styles you can paste anywhere — bios, captions, usernames. Runs entirely in your browser."
      />

      <SectionCard title="Your text">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here…"
          rows={4}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </SectionCard>

      <SectionCard title="ꜱᴍᴀʟʟ ᴄᴀᴘꜱ">
        <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3">
          <p className="min-h-12 flex-1 wrap-break-word text-sm text-foreground">
            {smallCaps || <span className="text-muted-foreground">Your small caps text will appear here…</span>}
          </p>
          <CopyButton text={smallCaps} className="shrink-0" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Note: "x" has no small-caps equivalent in Unicode, so it stays unchanged; "q" uses the closest lookalike character.</p>
      </SectionCard>

      <SectionCard title="ˢᵘᵖᵉʳˢᶜʳᶦᵖᵗ">
        <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3">
          <p className="min-h-12 flex-1 wrap-break-word text-sm text-foreground">
            {superscript || <span className="text-muted-foreground">Your superscript text will appear here…</span>}
          </p>
          <CopyButton text={superscript} className="shrink-0" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Note: "q" has no superscript equivalent in Unicode, so it stays unchanged.</p>
      </SectionCard>
    </div>
  );
}

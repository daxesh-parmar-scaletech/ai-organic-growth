import { HelpCircle } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { CopyButton } from "@/features/content-generation/components/CopyButton";
import type { Faq } from "@/types/contentGeneration";

interface FaqCardProps {
  faqs: Faq[];
  faqJsonLd: string;
}

export function FaqCard({ faqs, faqJsonLd }: FaqCardProps) {
  if (faqs.length === 0) return null;

  return (
    <SectionCard title="FAQs (Google Search rich snippet ready)">
      <p className="mb-3 text-sm text-muted-foreground">
        These questions are already included in the article above. Copying the schema snippet below and adding it
        to your page lets Google show them as an expandable FAQ dropdown directly on the search results page —
        taking up more space and boosting click-through rate.
      </p>
      <div className="mb-4 flex flex-col gap-2">
        {faqs.map((faq) => (
          <div key={faq.question} className="flex items-start gap-2 rounded-lg border border-border p-3">
            <HelpCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{faq.question}</p>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3">
        <div>
          <p className="text-sm font-medium text-foreground">FAQ Schema Markup</p>
          <p className="text-xs text-muted-foreground">
            Paste this snippet into your page's HTML (e.g. WordPress "Custom HTML" block, or your SEO plugin's
            "Schema"/"Custom Code" field) — no coding knowledge needed beyond copy-paste.
          </p>
        </div>
        <CopyButton text={faqJsonLd} label="Copy Schema" />
      </div>
    </SectionCard>
  );
}

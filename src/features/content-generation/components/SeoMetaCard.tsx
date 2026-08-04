import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/common/SectionCard";
import { CopyButton } from "@/features/content-generation/components/CopyButton";
import type { GeneratedContent } from "@/types/contentGeneration";

interface SeoMetaCardProps {
  content: GeneratedContent;
}

function MetaField({
  label,
  value,
  limit,
}: {
  label: string;
  value: string;
  limit?: number;
}) {
  const overLimit = limit ? value.length > limit : false;
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
        <div className="flex items-center gap-2">
          {limit ? (
            <span className={overLimit ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
              {value.length}/{limit}
            </span>
          ) : null}
          <CopyButton text={value} label="Copy" />
        </div>
      </div>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

export function SeoMetaCard({ content }: SeoMetaCardProps) {
  const allMetaText = `Blog Title: ${content.blogTitle}
Slug: ${content.slug}
Meta Title: ${content.metaTitle}
Meta Description: ${content.metaDescription}
Focus Keyword: ${content.focusKeyword}
Tags: ${content.tags.join(", ")}
Excerpt: ${content.excerpt}`;

  return (
    <SectionCard
      title="SEO Details (Rank Math ready)"
      action={<CopyButton text={allMetaText} label="Copy All Meta" />}
    >
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Focus keyword:</span>
        <Badge variant="secondary">{content.focusKeyword}</Badge>
        <span className="ml-3 text-xs text-muted-foreground">Tags:</span>
        {content.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <MetaField label="Blog Title" value={content.blogTitle} limit={60} />
        <MetaField label="URL Slug" value={content.slug} />
        <MetaField label="Meta Title" value={content.metaTitle} limit={60} />
        <MetaField label="Meta Description" value={content.metaDescription} limit={155} />
      </div>
      <div className="mt-3">
        <MetaField label="Excerpt / Subtitle" value={content.excerpt} />
      </div>
    </SectionCard>
  );
}

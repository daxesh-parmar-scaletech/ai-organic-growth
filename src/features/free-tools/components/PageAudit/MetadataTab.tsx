import { SectionCard } from "@/components/common/SectionCard";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/features/free-tools/components/CopyButton";
import type { PageAuditMetaField, PageAuditResult } from "@/types/pageAudit";

function MetaFieldCard({ title, field }: { title: string; field: PageAuditMetaField }) {
  return (
    <SectionCard title={title}>
      <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-[13px] text-foreground">
        {field.value}
      </div>
      <div className="mt-3 flex items-start gap-2">
        <Badge variant={field.status === "good" ? "default" : "destructive"}>
          {field.status === "good" ? "Looking Good!" : title}
        </Badge>
      </div>
      <p className="mt-2 text-[12.5px] text-muted-foreground">{field.note}</p>

      {field.suggestion ? (
        <div className="mt-3 flex flex-col gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Suggested Replacement</p>
          <p className="text-[13px] text-foreground">{field.suggestion}</p>
          <CopyButton text={field.suggestion} label="Copy suggestion" className="self-start" />
        </div>
      ) : null}
    </SectionCard>
  );
}

export function MetadataTab({ result }: { result: PageAuditResult }) {
  return (
    <div className="flex flex-col gap-4">
      <MetaFieldCard title="Meta Title" field={result.metaTitle!} />
      <MetaFieldCard title="Meta Description" field={result.metaDescription!} />

      <SectionCard title="All Meta Data">
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3">
          {result.allMetaData!.map((entry) => (
            <p key={entry.key} className="break-words text-[13px] text-foreground">
              <span className="font-semibold">{entry.key}</span> : {entry.value}
            </p>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/common/SectionCard";
import { CopyButton } from "@/features/free-tools/components/CopyButton";
import { ToolPageHeader } from "@/features/free-tools/components/ToolPageHeader";
import { useActiveProject } from "@/hooks/useActiveProject";
import { useGenerateTitles } from "@/hooks/queries/useTitleGenerator";

export function ArticleTitleGeneratorPage() {
  const project = useActiveProject();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const { mutate, data, isPending, isError } = useGenerateTitles(project.id);

  const canSubmit = keyword.trim().length > 0 && !isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    mutate(keyword.trim());
  };

  return (
    <div className="flex flex-col gap-4">
      <ToolPageHeader
        title="Article/Blog Title Generator"
        description="Enter a keyword and get 5 SEO-friendly article title ideas, then jump straight into generating the full article from one."
      />

      <SectionCard title="Enter a keyword">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. Nicotine Salt"
            disabled={isPending}
            className="sm:flex-1"
          />
          <Button type="submit" disabled={!canSubmit} className="gap-1.5 sm:w-auto">
            {isPending ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {isPending ? "Generating…" : "Generate Titles"}
          </Button>
        </form>
      </SectionCard>

      {isError ? <p className="text-sm text-destructive">Couldn't generate titles. Try again.</p> : null}

      {data && data.titles.length > 0 ? (
        <SectionCard title="Suggested titles">
          <div className="flex flex-col gap-2">
            {data.titles.map((title) => (
              <div
                key={title}
                className="flex flex-col items-start justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3 sm:flex-row sm:items-center"
              >
                <p className="flex-1 text-sm text-foreground">{title}</p>
                <div className="flex shrink-0 gap-2">
                  <CopyButton text={title} />
                  <Button
                    type="button"
                    size="sm"
                    className="gap-1.5"
                    onClick={() =>
                      navigate(`/app/${project.id}/content-generation`, { state: { articleTitle: title } })
                    }
                  >
                    <Sparkles className="size-4" />
                    Generate Article
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}

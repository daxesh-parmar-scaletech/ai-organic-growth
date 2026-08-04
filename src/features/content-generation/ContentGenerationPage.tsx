import { FileText } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ArticleContentCard } from "@/features/content-generation/components/ArticleContentCard";
import { ArticleEditChatCard } from "@/features/content-generation/components/ArticleEditChatCard";
import { DownloadDocumentButton } from "@/features/content-generation/components/DownloadDocumentButton";
import { FaqCard } from "@/features/content-generation/components/FaqCard";
import { ImagePromptCard } from "@/features/content-generation/components/ImagePromptCard";
import { PlagiarismCard } from "@/features/content-generation/components/PlagiarismCard";
import { RatingsCard } from "@/features/content-generation/components/RatingsCard";
import { SeoMetaCard } from "@/features/content-generation/components/SeoMetaCard";
import { UrlInputCard } from "@/features/content-generation/components/UrlInputCard";
import { useActiveProject } from "@/hooks/useActiveProject";
import { useGenerateContent } from "@/hooks/queries/useContentGeneration";
import type { GeneratedContent } from "@/types/contentGeneration";

export function ContentGenerationPage() {
  const project = useActiveProject();
  const { mutate, isPending, isError, error } = useGenerateContent(project.id);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <UrlInputCard
        onGenerate={(url) => mutate(url, { onSuccess: setContent })}
        isGenerating={isPending}
      />

      {isError ? (
        <EmptyState
          icon={FileText}
          title="Couldn't generate the article"
          description={error instanceof Error ? error.message : "Please check the URL and try again."}
        />
      ) : null}

      {!content && !isPending && !isError ? (
        <EmptyState
          icon={FileText}
          title="No article generated yet"
          description="Paste a product page URL above and click Generate Article to create a complete, SEO-optimized blog post ready to publish."
        />
      ) : null}

      {content ? (
        <>
          <div className="flex justify-end">
            <DownloadDocumentButton content={content} />
          </div>
          <SeoMetaCard content={content} />
          <RatingsCard seoRating={content.seoRating} aeoRating={content.aeoRating} geoRating={content.geoRating} />
          <ArticleContentCard content={content} onEditWithAi={() => setIsEditOpen(true)} />
          <ArticleEditChatCard
            projectId={project.id}
            content={content}
            onContentChange={setContent}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
          />
          <PlagiarismCard projectId={project.id} contentHtml={content.contentHtml} />
          <FaqCard faqs={content.faqs} faqJsonLd={content.faqJsonLd} />
          <ImagePromptCard imagePrompt={content.imagePrompt} />
        </>
      ) : null}
    </div>
  );
}

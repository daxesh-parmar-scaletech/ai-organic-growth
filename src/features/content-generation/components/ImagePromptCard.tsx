import { ImageIcon } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { CopyButton } from "@/features/content-generation/components/CopyButton";

interface ImagePromptCardProps {
  imagePrompt: string;
}

export function ImagePromptCard({ imagePrompt }: ImagePromptCardProps) {
  return (
    <SectionCard title="Suggested Image Prompt" action={<CopyButton text={imagePrompt} label="Copy Prompt" />}>
      <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
        <ImageIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <p className="text-sm text-foreground">{imagePrompt}</p>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Copy this prompt and paste it into ChatGPT, Claude, Midjourney, or any other AI image tool to generate a
        matching featured image for this article.
      </p>
    </SectionCard>
  );
}

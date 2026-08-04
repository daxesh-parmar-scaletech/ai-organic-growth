import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/common/SectionCard";

interface UrlInputCardProps {
  onGenerate: (url: string) => void;
  isGenerating: boolean;
}

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function UrlInputCard({ onGenerate, isGenerating }: UrlInputCardProps) {
  const [url, setUrl] = useState("");
  const [touched, setTouched] = useState(false);

  const valid = isValidUrl(url.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid || isGenerating) return;
    onGenerate(url.trim());
  };

  return (
    <SectionCard title="Generate a blog post from a product page">
      <p className="mb-3 text-sm text-muted-foreground">
        Paste any product page URL from your site. We'll read the page and write a complete, SEO-ready blog
        article built to drive traffic straight to that product — ready to copy-paste into your website.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="https://yourstore.com/products/example-product"
          aria-invalid={touched && !valid && url.length > 0}
          disabled={isGenerating}
          className="sm:flex-1"
        />
        <Button type="submit" disabled={!valid || isGenerating} className="gap-1.5 sm:w-auto">
          {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {isGenerating ? "Generating…" : "Generate Article"}
        </Button>
      </form>
      {touched && !valid && url.length > 0 ? (
        <p className="mt-2 text-xs text-destructive">Enter a full URL, e.g. https://yourstore.com/products/...</p>
      ) : null}
    </SectionCard>
  );
}

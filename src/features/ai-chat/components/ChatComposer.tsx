import { SendHorizontal } from "lucide-react";
import type { KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { ChatSuggestions } from "@/features/ai-chat/components/ChatSuggestions";

interface ChatComposerProps {
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onSuggestion: (question: string) => void;
  disabled: boolean;
}

export function ChatComposer({ draft, onDraftChange, onSend, onSuggestion, disabled }: ChatComposerProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="shrink-0 border-t border-border p-4">
      <ChatSuggestions onSelect={onSuggestion} disabled={disabled} />
      <div className="flex items-center gap-2.5 rounded-xl border border-border py-1 pr-1 pl-3.5">
        <Input
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask about your SEO performance…"
          className="border-none bg-transparent shadow-none focus-visible:ring-0"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={disabled || !draft.trim()}
          className="flex size-[38px] shrink-0 items-center justify-center rounded-[9px] bg-primary text-primary-foreground disabled:opacity-50"
        >
          <SendHorizontal className="size-[18px]" />
        </button>
      </div>
    </div>
  );
}

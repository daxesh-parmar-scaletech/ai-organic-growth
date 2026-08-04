import { chatSuggestionsMock } from "@/mocks/data/chat.mock";

export function ChatSuggestions({ onSelect, disabled }: { onSelect: (question: string) => void; disabled: boolean }) {
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {chatSuggestionsMock.map((suggestion) => (
        <button
          key={suggestion.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(suggestion.question)}
          className="rounded-full border border-border bg-muted px-3.5 py-1.5 text-[12.5px] font-semibold text-muted-foreground hover:bg-muted/70 disabled:opacity-50"
        >
          {suggestion.label}
        </button>
      ))}
    </div>
  );
}

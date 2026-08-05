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
          className="cursor-pointer rounded-full border border-border bg-muted px-3.5 py-1.5 text-[12.5px] font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:bg-muted disabled:hover:text-muted-foreground"
        >
          {suggestion.label}
        </button>
      ))}
    </div>
  );
}

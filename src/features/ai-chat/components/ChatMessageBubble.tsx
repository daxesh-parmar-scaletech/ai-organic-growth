import { Bot, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isAi = message.role === "ai";

  return (
    <div className={cn("flex items-start gap-2.5", isAi ? "" : "flex-row-reverse")}>
      {isAi ? (
        <span className="mt-0.5 flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-primary text-primary-foreground">
          <Bot className="size-4" />
        </span>
      ) : null}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed whitespace-pre-wrap",
          isAi ? "rounded-tl-sm bg-muted text-foreground" : "rounded-tr-sm bg-primary text-primary-foreground",
        )}
      >
        <div>{message.text}</div>
        {message.actions && message.actions.length > 0 ? (
          <div className="mt-3 flex flex-col gap-2 border-t border-black/10 pt-3">
            {message.actions.map((action) => (
              <div key={action} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2.4} />
                <span className="text-[13px] leading-relaxed">{action}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

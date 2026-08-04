import { useEffect, useRef } from "react";
import { Bot } from "lucide-react";
import { ChatMessageBubble } from "@/features/ai-chat/components/ChatMessageBubble";
import type { ChatMessage } from "@/types/chat";

interface ChatMessageListProps {
  messages: ChatMessage[];
  isThinking: boolean;
}

export function ChatMessageList({ messages, isThinking }: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, isThinking]);

  return (
    <div ref={scrollRef} className="flex flex-1 flex-col gap-4 overflow-y-auto p-5.5">
      {messages.map((message) => (
        <ChatMessageBubble key={message.id} message={message} />
      ))}
      {isThinking ? (
        <div className="flex items-start gap-2.5">
          <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-primary text-primary-foreground">
            <Bot className="size-4" />
          </span>
          <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-muted px-4 py-3.5">
            <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground" />
            <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.2s]" />
            <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.4s]" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

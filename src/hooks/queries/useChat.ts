import { useMutation } from "@tanstack/react-query";
import { sendChatMessage } from "@/services/chat.service";

interface SendChatMessageInput {
  projectId: string;
  text: string;
  domain: string;
}

export function useSendChatMessage() {
  return useMutation({
    mutationFn: ({ projectId, text, domain }: SendChatMessageInput) => sendChatMessage(projectId, text, domain),
  });
}

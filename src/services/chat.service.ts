import { API_CONFIG } from "@/lib/api-endpoints";
import { USE_MOCKS, mockDelay } from "@/lib/mockDelay";
import { getAiReply } from "@/mocks/data/chat.mock";
import httpService from "@/services/http.service";
import type { ChatMessage } from "@/types/chat";

// Future backend contract: POST /projects/:id/chat { text } -> ChatMessage (role: "ai")

export async function sendChatMessage(projectId: string, text: string, domain: string): Promise<ChatMessage> {
  if (USE_MOCKS) {
    const reply = getAiReply(text, domain);
    return mockDelay(
      { id: `msg-${Date.now()}`, role: "ai", text: reply.text, actions: reply.actions },
      950,
    );
  }
  return httpService.post<ChatMessage>(API_CONFIG.chat(projectId), { text });
}

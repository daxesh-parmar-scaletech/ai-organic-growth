export type ChatRole = "user" | "ai";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  actions?: string[];
}

export interface ChatSuggestion {
  id: string;
  label: string;
  question: string;
}

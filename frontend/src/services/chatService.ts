import { chatApi } from "@/api/chatApi";
import type { ChatMessage, ChatResponse } from "@/types/chat";

// The API is stateless, so the client carries the conversation. Cap it so the
// prompt - and the latency - stay bounded on long conversations.
const HISTORY_LIMIT = 10;

export const chatService = {
  sendMessage: async (
    message: string,
    history: ChatMessage[]
  ): Promise<ChatResponse> => {
    return chatApi.sendMessage({
      message: message.trim(),
      history: history.slice(-HISTORY_LIMIT).map(({ role, content }) => ({
        role,
        content,
      })),
    });
  },
};

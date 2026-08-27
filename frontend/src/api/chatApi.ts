import { apiClient } from "./client";
import type { ChatRequest, ChatResponse } from "@/types/chat";

export const chatApi = {
  sendMessage: async (payload: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post<ChatResponse>(
      "/chat",
      payload
    );

    return response.data;
  },
};

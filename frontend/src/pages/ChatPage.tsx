import { useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatService } from "@/services/chatService";
import type { ChatMessage } from "@/types/chat";
import chatImage from "@/assets/images/ChatPage.jpg";

interface Bubble extends ChatMessage {
  id: string;
}

const GREETING: Bubble = {
  id: "greeting",
  role: "assistant",
  content: "👋 Hello! Where would you like to travel?",
};

const newId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function ChatPage() {
  const [messages, setMessages] = useState<Bubble[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const send = async () => {
    const message = input.trim();

    if (!message || isLoading) {
      return;
    }

    setError(null);
    setInput("");
    setIsLoading(true);

    const history = messages;

    setMessages([
      ...history,
      {
        id: newId(),
        role: "user",
        content: message,
      },
    ]);

    try {
      const response = await chatService.sendMessage(message, history);

      setMessages((current) => [
        ...current,
        {
          id: newId(),
          role: "assistant",
          content: response.reply,
        },
      ]);
    } catch (err) {
      console.error(err);

      // Drop the unanswered question and give the text back, so nothing the
      // traveller typed is lost and they can retry with one keystroke.
      setMessages(history);
      setInput(message);

      setError(
        "We couldn't reach the travel assistant. Please try again in a moment."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  };

  return (
    <div
      className="relative min-h-[calc(100vh-64px)] bg-cover bg-fixed bg-center"
      style={{
        backgroundImage: `url(${chatImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          AI Travel Assistant ✈️
        </h1>

        <p className="mt-3 text-lg text-white/80">
          Ask anything about destinations, weather, hotels, visas and travel
          tips.
        </p>

        <div className="mt-8 flex h-[65vh] min-h-100 flex-col rounded-2xl border border-white/40 bg-white/90 shadow-xl backdrop-blur">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold">Travel Assistant</h2>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-1.5 rounded-2xl bg-muted px-4 py-4"
                  aria-label="Travel assistant is typing"
                >
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t p-4">
            {error && (
              <p className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex items-end gap-3">
              <Textarea
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about destinations, hotels, weather..."
                className="max-h-40 min-h-11 resize-none bg-white"
              />

              <Button
                size="icon"
                onClick={() => void send()}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Enter to send, Shift + Enter for a new line.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

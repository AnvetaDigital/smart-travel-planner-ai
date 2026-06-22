import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import chatImage from "@/assets/images/ChatPage.jpg";

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-64px)] bg-linear-to-br from-sky-50 via-blue-100 to-cyan-100">
      <div className="mx-auto grid h-full max-w-7xl grid-cols-1 lg:grid-cols-2 gap-8 px-6 py-6">

        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-sky-900">
            AI Travel Assistant ✈️
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Ask anything about destinations, weather,
            hotels, visas, itineraries and travel tips.
          </p>

          <img
            src={chatImage}
            alt="Travel Chat"
            className="mt-2 h-100 w-full rounded-2xl object-cover shadow-xl"
          />
        </div>

        <div className="flex flex-col rounded-2xl border bg-white shadow-xl">

          <div className="border-b px-6 py-4">
            <h2 className="font-semibold text-sky-700">
              Travel Assistant
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-md rounded-2xl bg-sky-100 p-4">
              👋 Hello! Where would you like to travel?
            </div>
          </div>

          <div className="border-t p-4">
            <div className="flex gap-3">
              <Input
                placeholder="Ask about destinations, hotels, weather..."
              />

              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
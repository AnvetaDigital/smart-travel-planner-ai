import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import travelImage from "@/assets/images/travel.jpg";


export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-125">
        <img
          src={travelImage}
          alt="Travel destination"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <div className="max-w-4xl text-center text-white">
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
              Plan Smarter Trips With AI
            </h1>

            <p className="mt-6 text-lg text-gray-200">
              Discover destinations, generate itineraries,
              check weather, and chat with your personal
              AI travel assistant.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg">
                Start Planning
              </Button>

              <Button
                variant="secondary"
                size="lg"
              >
                Explore Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 bg-color-palegoldenrod sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>AI Itinerary</CardTitle>
            </CardHeader>

            <CardContent>
              Generate personalized travel plans based on
              budget, duration, and interests.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Travel Chatbot</CardTitle>
            </CardHeader>

            <CardContent>
              Ask questions and get travel recommendations
              instantly.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weather Insights</CardTitle>
            </CardHeader>

            <CardContent>
              Get destination weather forecasts and
              preparation tips.
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
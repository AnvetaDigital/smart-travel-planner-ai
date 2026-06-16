import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, MessageCircle, CloudSun } from "lucide-react";
import travelImage from "@/assets/images/plane2.jpg";
import FlyingPlane from "@/components/animations/FlyingPlane";

const features = [
  {
    title: "AI Itinerary",
    description:
      "Generate personalized travel plans based on budget, duration and interests.",
    icon: Map,
  },
  {
    title: "Travel Chatbot",
    description:
      "Get destination recommendations and travel guidance instantly.",
    icon: MessageCircle,
  },
  {
    title: "Weather Insights",
    description: "Stay prepared with weather forecasts and travel tips.",
    icon: CloudSun,
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-125">
        <img
          src={travelImage}
          alt="Travel destination"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <FlyingPlane />

        <div className="relative z-10 flex h-full items-center justify-center px-4 pt-24">
          <div className="max-w-4xl text-center text-white">
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
              Plan Smarter Trips With AI
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200">
              Discover destinations, generate itineraries, check weather, and
              chat with your personal AI travel assistant.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="px-8">
                Start Planning
              </Button>

              <Button variant="secondary" size="lg">
                Explore Features
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="bg-slate-300 py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Why Choose Smart Travel Planner?
            </h2>

            <p className="mt-4 text-muted-foreground">
              Everything you need to plan memorable trips.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card
                  key={feature.title}
                  className="
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-xl
            "
                >
                  <CardHeader>
                    <Icon className="mb-4 h-8 w-8" />

                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>

                  <CardContent>{feature.description}</CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="bg-sky-100 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready To Plan Your Next Adventure?
          </h2>

          <p className="mt-4 text-muted-foreground">
            Create personalized travel experiences in minutes.
          </p>

          <Button size="lg" className="mt-8 px-8">
            Start Planning Today
          </Button>
        </div>
      </section>
    </div>
  );
}

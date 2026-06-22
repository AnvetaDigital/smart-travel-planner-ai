import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dashboardImage from "@/assets/images/Dashboard.jpg";

export default function Dashboard() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${dashboardImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 text-white">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome Back 👋
            </h1>

            <p className="text-slate-200">
              Plan and manage your trips with AI assistance.
            </p>
          </div>

          <Link to="/trips/create">
            <Button>Create New Trip</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle>Total Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle>Upcoming Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle>Saved Destinations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle>Your Trips</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground">
                No trips created yet.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
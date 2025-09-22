import { MarketWatch } from "./market-watch";
import { WeatherCard } from "./weather-card";

export function DashboardHome() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          Welcome to AgriAssist
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your all-in-one farming companion. Here's a look at today's conditions.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <WeatherCard />
        </div>
        <div className="lg:col-span-2">
          <MarketWatch />
        </div>
      </div>
    </div>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Cloud,
  CloudDrizzle,
  CloudSun,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";
import { Separator } from "./ui/separator";

const forecast = [
  { day: "Tue", icon: <CloudSun className="w-6 h-6 text-yellow-400" />, temp: "29°C" },
  { day: "Wed", icon: <CloudDrizzle className="w-6 h-6 text-blue-400" />, temp: "26°C" },
  { day: "Thu", icon: <Cloud className="w-6 h-6 text-gray-400" />, temp: "27°C" },
  { day: "Fri", icon: <Sun className="w-6 h-6 text-orange-400" />, temp: "32°C" },
  { day: "Sat", icon: <Sun className="w-6 h-6 text-orange-400" />, temp: "33°C" },
];

export function WeatherCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Weather</CardTitle>
        <CardDescription>Punjab, India. This is mock data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sun className="w-16 h-16 text-orange-400" />
            <div>
              <div className="text-5xl font-bold">31°C</div>
              <div className="text-muted-foreground">Sunny</div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-right">
            <div className="flex items-center justify-end gap-2">
              <Thermometer className="w-4 h-4 text-muted-foreground" />
              <span>Feels like 34°C</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Wind className="w-4 h-4 text-muted-foreground" />
              <span>5 km/h</span>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="mb-4 font-semibold text-center">Weekly Forecast</h4>
          <div className="flex justify-between">
            {forecast.map((item) => (
              <div key={item.day} className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{item.day}</span>
                {item.icon}
                <span className="font-bold">{item.temp}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

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
  Loader,
  AlertCircle
} from "lucide-react";
import { Separator } from "./ui/separator";
import { useLanguage } from "@/context/language-context";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const forecast = [
  { day: "Tue", icon: <CloudSun className="w-6 h-6 text-yellow-400" />, temp: "29°C" },
  { day: "Wed", icon: <CloudDrizzle className="w-6 h-6 text-blue-400" />, temp: "26°C" },
  { day: "Thu", icon: <Cloud className="w-6 h-6 text-gray-400" />, temp: "27°C" },
  { day: "Fri", icon: <Sun className="w-6 h-6 text-orange-400" />, temp: "32°C" },
  { day: "Sat", icon: <Sun className="w-6 h-6 text-orange-400" />, temp: "33°C" },
];

const dayMapping: { [key: string]: string } = {
  "Tue": "tue",
  "Wed": "wed",
  "Thu": "thu",
  "Fri": "fri",
  "Sat": "sat"
};

export function WeatherCard() {
  const { t } = useLanguage();
  const [location, setLocation] = useState<{city: string, state: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Using a free reverse geocoding service. In a real app, you'd use a robust API.
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            const { city, state } = data.address;
            setLocation({ city, state });
          } catch (err) {
            setError(t('locationFetchError'));
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setError(t('locationAccessDenied'));
          setLoading(false);
        }
      );
    } else {
      setError(t('geolocationNotSupported'));
      setLoading(false);
    }
  }, [t]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('todaysWeather')}</CardTitle>
        <CardDescription>
          {loading ? t('fetchingLocation') : error ? error : `${location?.city}, ${location?.state}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        )}
        {error && !loading && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>{t('weatherError')}</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        {!loading && !error && location && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Sun className="w-16 h-16 text-orange-400" />
                <div>
                  <div className="text-5xl font-bold">31°C</div>
                  <div className="text-muted-foreground">{t('sunny')}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-right">
                <div className="flex items-center justify-end gap-2">
                  <Thermometer className="w-4 h-4 text-muted-foreground" />
                  <span>{t('feelsLike')} 34°C</span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Wind className="w-4 h-4 text-muted-foreground" />
                  <span>5 km/h</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="mb-4 font-semibold text-center">{t('weeklyForecast')}</h4>
              <div className="flex justify-between">
                {forecast.map((item) => (
                  <div key={item.day} className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">{t(dayMapping[item.day])}</span>
                    {item.icon}
                    <span className="font-bold">{item.temp}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

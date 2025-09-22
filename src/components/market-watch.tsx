"use client";

import {
  Apple,
  AreaChart,
  Carrot,
  LeafyGreen,
  Minus,
  Sprout,
  TrendingDown,
  TrendingUp,
  Wheat,
  Loader,
  AlertCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";
import { useLanguage } from "@/context/language-context";
import { getMarketPrices } from "@/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Skeleton } from "./ui/skeleton";

type Crop = {
  cropName: string;
  price: number;
  change: number;
  location: string;
};

const cropIconMapping: { [key: string]: React.ReactNode } = {
  wheat: <Wheat className="w-5 h-5 text-yellow-600" />,
  rice: <Sprout className="w-5 h-5 text-green-600" />,
  carrot: <Carrot className="w-5 h-5 text-orange-500" />,
  apple: <Apple className="w-5 h-5 text-red-500" />,
  spinach: <LeafyGreen className="w-5 h-5 text-green-700" />,
  default: <Sprout className="w-5 h-5 text-primary" />,
};

const getCropIcon = (cropName: string) => {
  const lowerCaseCrop = cropName.toLowerCase();
  for (const key in cropIconMapping) {
    if (lowerCaseCrop.includes(key)) {
      return cropIconMapping[key];
    }
  }
  return cropIconMapping.default;
};

export function MarketWatch() {
  const { t, language } = useLanguage();
  const [marketData, setMarketData] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = (latitude: number, longitude: number) => {
      setLoading(true);
      getMarketPrices({ latitude, longitude, language })
        .then((res) => {
          if (res.success && res.data) {
            setMarketData(res.data.marketData);
          } else {
            setError(res.error || t("marketDataFetchError"));
          }
        })
        .catch((err) => {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError(t("marketDataFetchError"));
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchMarketData(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError(t("locationAccessDenied"));
          setLoading(false);
        }
      );
    } else {
      setError(t("geolocationNotSupported"));
      setLoading(false);
    }
  }, [t, language]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AreaChart className="w-6 h-6" />
          {t("marketPrices")}
        </CardTitle>
        <CardDescription>{t("marketPricesDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-5 h-5 rounded-full" />
                  <Skeleton className="w-24 h-5" />
                </div>
                <Skeleton className="w-16 h-5" />
                <Skeleton className="w-20 h-5" />
                <Skeleton className="w-16 h-5" />
              </div>
            ))}
          </div>
        )}
        {error && !loading && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>{t("marketDataError")}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!loading && !error && marketData.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("crop")}</TableHead>
                <TableHead className="text-right">{t("price")} (₹)</TableHead>
                <TableHead className="text-right">{t("change")}</TableHead>
                <TableHead>{t("location")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketData.map((crop) => (
                <TableRow key={`${crop.cropName}-${crop.location}`}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {getCropIcon(crop.cropName)}
                      <span>{crop.cropName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {crop.price.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        crop.change > 0
                          ? "default"
                          : crop.change < 0
                          ? "destructive"
                          : "secondary"
                      }
                      className="flex items-center justify-center gap-1 w-[70px] bg-opacity-20 border-opacity-40"
                    >
                      {crop.change > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : crop.change < 0 ? (
                        <TrendingDown className="w-4 h-4" />
                      ) : (
                        <Minus className="w-4 h-4" />
                      )}
                      {crop.change.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell>{crop.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

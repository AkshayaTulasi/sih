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
} from "lucide-react";

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

type Crop = {
  name: string;
  icon: React.ReactNode;
  price: number;
  change: number;
  location: string;
};

const marketData: Crop[] = [
  {
    name: "Wheat",
    icon: <Wheat className="w-5 h-5 text-yellow-600" />,
    price: 2250.75,
    change: 1.5,
    location: "Punjab",
  },
  {
    name: "Rice (Basmati)",
    icon: <Sprout className="w-5 h-5 text-green-600" />,
    price: 3500.5,
    change: -0.8,
    location: "Haryana",
  },
  {
    name: "Carrots",
    icon: <Carrot className="w-5 h-5 text-orange-500" />,
    price: 1800.0,
    change: 2.1,
    location: "Uttar Pradesh",
  },
  {
    name: "Apples",
    icon: <Apple className="w-5 h-5 text-red-500" />,
    price: 8500.0,
    change: 0.0,
    location: "Himachal",
  },
  {
    name: "Spinach",
    icon: <LeafyGreen className="w-5 h-5 text-green-700" />,
    price: 1200.25,
    change: -3.2,
    location: "Local Mandi",
  },
];

export function MarketWatch() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AreaChart className="w-6 h-6" />
          Market Prices (per Quintal)
        </CardTitle>
        <CardDescription>
          Live prices from various markets. This is mock data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Crop</TableHead>
              <TableHead className="text-right">Price (₹)</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {marketData.map((crop) => (
              <TableRow key={crop.name}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    {crop.icon}
                    <span>{crop.name}</span>
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
      </CardContent>
    </Card>
  );
}

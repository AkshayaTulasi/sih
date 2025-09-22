"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { GenerateCropRecommendationOutput } from "@/ai/flows/generate-crop-recommendation";
import { getCropRecommendation } from "@/lib/actions";
import {
  cropRecommendationSchema,
  type CropRecommendationFormInput,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";

export function CropAdvisory() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateCropRecommendationOutput | null>(
    null
  );
  const { toast } = useToast();

  const form = useForm<CropRecommendationFormInput>({
    resolver: zodResolver(cropRecommendationSchema),
    defaultValues: {
      location: "",
      soilType: "",
      weatherConditions: "",
      growingExperience: "",
      preferences: "",
    },
  });

  async function onSubmit(values: CropRecommendationFormInput) {
    setLoading(true);
    setResult(null);

    const res = await getCropRecommendation(values);

    if (res.success && res.data) {
      setResult(res.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.error || "Failed to get crop recommendation.",
      });
    }

    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          AI-Powered Crop Advisory
        </h1>
        <p className="mt-2 text-muted-foreground">
          Fill in the details below to get a personalized crop recommendation.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Punjab, India" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="soilType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soil Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Alluvial, Clay" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="weatherConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Weather Conditions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Hot and humid, 25°C"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe the current temperature, humidity, and recent
                      rainfall.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="growingExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farming Experience</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Preferences (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Interested in cash crops, vegetables, or fruits."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                {loading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Send />
                )}
                Get Recommendation
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
         <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="w-1/3 h-8" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-2/3 h-6" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="animate-in fade-in">
          <CardHeader>
            <CardTitle className="text-primary">
              Recommendation: {result.cropRecommendation}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="mb-2 font-semibold">Reasoning:</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {result.reasoning}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

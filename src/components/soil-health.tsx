"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  soilHealthSchema,
  type SoilHealthFormInput,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { useLanguage } from "@/context/language-context";
import { getFertilizerRecommendation } from "@/lib/actions";
import { GetFertilizerRecommendationOutput } from "@/ai/flows/get-fertilizer-recommendation";

export function SoilHealth() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GetFertilizerRecommendationOutput | null>(
    null
  );
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const form = useForm<SoilHealthFormInput>({
    resolver: zodResolver(soilHealthSchema),
    defaultValues: {
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
      ph: 7,
      targetCrop: "",
    },
  });

  async function onSubmit(values: SoilHealthFormInput) {
    setLoading(true);
    setResult(null);

    const res = await getFertilizerRecommendation({...values, language});

    if (res.success && res.data) {
      setResult(res.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.error || "Failed to get fertilizer recommendation.",
      });
    }

    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          {t('soilHealth')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t('soilHealthDescription')}
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nitrogen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('nitrogenLevel')}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phosphorus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('phosphorusLevel')}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="potassium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('potassiumLevel')}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="ph"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('phLevel')}</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="targetCrop"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('targetCrop')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('targetCropPlaceholder')} {...field} />
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
                {t('getFertilizerRecommendation')}
              </Button>
            </form>
          </Form>.
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
              {t('fertilizerRecommendation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {result.recommendation}
            </p>
            <h3 className="mt-4 mb-2 font-semibold">{t('reasoning')}:</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {result.reasoning}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

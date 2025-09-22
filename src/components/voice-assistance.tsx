"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Volume2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  voiceAssistanceSchema,
  type VoiceAssistanceFormInput,
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import { convertTextToSpeech } from "@/lib/actions";

export function VoiceAssistance() {
  const [loading, setLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<VoiceAssistanceFormInput>({
    resolver: zodResolver(voiceAssistanceSchema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: VoiceAssistanceFormInput) {
    setLoading(true);
    setAudioSrc(null);

    const res = await convertTextToSpeech(values);

    if (res.success && res.data) {
      setAudioSrc(res.data.audioDataUri);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.error || "Failed to generate audio.",
      });
    }

    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          {t('voiceAssistance')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t('voiceAssistanceDescription')}
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('textToSpeak')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('textToSpeakPlaceholder')}
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
                  <Volume2 />
                )}
                {t('speak')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {audioSrc && (
        <Card className="animate-in fade-in">
          <CardHeader>
            <CardTitle>{t('audioPlayback')}</CardTitle>
          </CardHeader>
          <CardContent>
            <audio controls autoPlay className="w-full">
              <source src={audioSrc} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

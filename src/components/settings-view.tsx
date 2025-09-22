"use client";

import { Languages, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./ui/textarea";
import { useLanguage } from "@/context/language-context";

export function SettingsView() {
  const { toast } = useToast();
  const { language, setLanguage, t, languages } = useLanguage();

  const handleFeedback = (type: "positive" | "negative") => {
    toast({
      title: t('feedbackSubmitted'),
      description: t('feedbackSubmittedDescription', { type: t(type) }),
    });
  };
  
  const handleSuggestionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: t('suggestionSent'),
      description: t('suggestionSentDescription'),
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          {t('settingsAndFeedback')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t('settingsAndFeedbackDescription')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages />
            {t('language')}
          </CardTitle>
          <CardDescription>
            {t('languageDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full md:w-1/2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare />
            {t('feedback')}
          </CardTitle>
          <CardDescription>
            {t('feedbackDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <span>{t('wasThisHelpful')}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleFeedback("positive")}
            >
              <ThumbsUp className="w-5 h-5 text-green-500" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleFeedback("negative")}
            >
              <ThumbsDown className="w-5 h-5 text-red-500" />
            </Button>
          </div>
          <form className="space-y-4" onSubmit={handleSuggestionSubmit}>
            <div>
              <Label htmlFor="suggestion">{t('haveASuggestion')}</Label>
              <Textarea
                id="suggestion"
                placeholder={t('suggestionPlaceholder')}
                className="mt-2"
              />
            </div>
            <Button type="submit">{t('sendSuggestion')}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

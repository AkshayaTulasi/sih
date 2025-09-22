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

export function SettingsView() {
  const { toast } = useToast();

  const handleFeedback = (type: "positive" | "negative") => {
    toast({
      title: "Feedback Submitted",
      description: `Thank you for your ${type} feedback!`,
    });
  };
  
  const handleSuggestionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Suggestion Sent",
      description: "Thank you! We've received your suggestion.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          Settings & Feedback
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your preferences and help us improve AgriAssist.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages />
            Language
          </CardTitle>
          <CardDescription>
            Choose your preferred language for the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full md:w-1/2">
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi" disabled>
                  हिन्दी (Coming Soon)
                </SelectItem>
                <SelectItem value="bn" disabled>
                  বাংলা (Coming Soon)
                </SelectItem>
                <SelectItem value="te" disabled>
                  తెలుగు (Coming Soon)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare />
            Feedback
          </CardTitle>
          <CardDescription>
            Let us know if you find this app helpful.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <span>Was this helpful?</span>
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
              <Label htmlFor="suggestion">Have a suggestion?</Label>
              <Textarea
                id="suggestion"
                placeholder="Tell us how we can improve..."
                className="mt-2"
              />
            </div>
            <Button type="submit">Send Suggestion</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

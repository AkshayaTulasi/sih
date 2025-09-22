"use client";

import { Mic, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";

export function AppHeader() {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleVoiceClick = () => {
    toast({
      title: t('voiceSupport'),
      description: t('voiceSupportComingSoon'),
    });
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary/10">
          <Sprout className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">
          AgriAssist
        </h1>
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Voice commands"
        onClick={handleVoiceClick}
      >
        <Mic className="w-6 h-6" />
      </Button>
    </header>
  );
}

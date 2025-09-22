"use client";

import { Bug, LayoutDashboard, Settings, Sprout } from "lucide-react";

import { AppHeader } from "@/components/app-header";
import { CropAdvisory } from "@/components/crop-advisory";
import { DashboardHome } from "@/components/dashboard-home";
import { PestDetection } from "@/components/pest-detection";
import { SettingsView } from "@/components/settings-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="border-b">
            <TabsList className="grid w-full grid-cols-4 h-auto rounded-none bg-background/80 backdrop-blur-sm p-2 md:w-auto md:mx-auto">
              <TabsTrigger value="dashboard">
                <LayoutDashboard className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="advisory">
                <Sprout className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">Crop Advisory</span>
              </TabsTrigger>
              <TabsTrigger value="pest">
                <Bug className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">Pest Detection</span>
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="p-4 md:p-6 lg:p-8">
            <DashboardHome />
          </TabsContent>
          <TabsContent value="advisory" className="p-4 md:p-6 lg:p-8">
            <CropAdvisory />
          </TabsContent>
          <TabsContent value="pest" className="p-4 md:p-6 lg:p-8">
            <PestDetection />
          </TabsContent>
          <TabsContent value="settings" className="p-4 md:p-6 lg:p-8">
            <SettingsView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { WelcomePopup } from "@/components/WelcomePopup";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "@/pages/Home";
import CommunitySolver from "@/pages/CommunitySolver";
import LostFound from "@/pages/LostFound";
import CareerCompass from "@/pages/CareerCompass";
import AboutMe from "@/pages/AboutMe";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/community-solver" component={CommunitySolver} />
      <Route path="/lost-found" component={LostFound} />
      <Route path="/career-compass" component={CareerCompass} />
      <Route path="/about" component={AboutMe} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <WelcomePopup />

      {/* Fixed sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content — offset right on desktop to clear sidebar */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        <TopBar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
        {/* pt-14 clears the fixed TopBar */}
        <main className="flex-1 pt-14">
          <Router />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppLayout />
          </WouterRouter>
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

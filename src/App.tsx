import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FeaturesPage from "./pages/FeaturesPage";
import StudyAbroad from "./pages/StudyAbroad";
import About from "./pages/About";
import Auth from "./pages/Auth";
import AIBuddy from "./pages/AIBuddy";
import Materials from "./pages/Materials";
import MockTests from "./pages/MockTests";
import Analytics from "./pages/Analytics";
import Gamified from "./pages/Gamified";
import PracticeModule from "./pages/PracticeModule";
import GamePlay from "./pages/GamePlay";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import TestTaking from "./pages/TestTaking";
import WritingPractice from "./pages/WritingPractice";
import ListeningPractice from "./pages/ListeningPractice";
import SpeakingPractice from "./pages/SpeakingPractice";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/study-abroad" element={<StudyAbroad />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/ai-buddy" element={<AIBuddy />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/practice" element={<PracticeModule />} />
          <Route path="/writing-practice" element={<WritingPractice />} />
          <Route path="/listening-practice" element={<ListeningPractice />} />
          <Route path="/speaking-practice" element={<SpeakingPractice />} />
          <Route path="/mock-tests" element={<MockTests />} />
          <Route path="/test-taking" element={<TestTaking />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
          <Route path="/gamified" element={<Gamified />} />
          <Route path="/gameplay" element={<GamePlay />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

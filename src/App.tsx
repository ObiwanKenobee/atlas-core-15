import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AtlasShell } from "@/components/layout/AtlasShell";
import Overview from "./pages/Overview";
import Risk from "./pages/Risk";
import Health from "./pages/Health";
import Recommendations from "./pages/Recommendations";
import Simulation from "./pages/Simulation";
import TalentFlow from "./pages/TalentFlow";
import StructureEquity from "./pages/StructureEquity";
import Cases from "./pages/Cases";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AtlasShell />}>
            <Route path="/" element={<Overview />} />
            <Route path="/risk" element={<Risk />} />
            <Route path="/health" element={<Health />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/talent-flow" element={<TalentFlow />} />
            <Route path="/structure" element={<StructureEquity />} />
            <Route path="/cases" element={<Cases />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

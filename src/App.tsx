import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AtlasShell } from "@/components/layout/AtlasShell";
import Overview from "./pages/Overview";
import Risk from "./pages/Risk";
import Health from "./pages/Health";
import Recommendations from "./pages/Recommendations";
import Simulation from "./pages/Simulation";
import TalentFlow from "./pages/TalentFlow";
import StructureEquity from "./pages/StructureEquity";
import Economics from "./pages/Economics";
import Cases from "./pages/Cases";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route element={<ProtectedRoute><AtlasShell /></ProtectedRoute>}>
              <Route path="/" element={<Overview />} />
              <Route path="/risk" element={<Risk />} />
              <Route path="/health" element={<Health />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/simulation" element={<Simulation />} />
              <Route path="/talent-flow" element={<TalentFlow />} />
              <Route path="/structure" element={<StructureEquity />} />
              <Route path="/economics" element={<Economics />} />
              <Route path="/cases" element={<Cases />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

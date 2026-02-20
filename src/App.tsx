import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import YieldPrediction from "./pages/YieldPrediction";
import DiseaseDetection from "./pages/DiseaseDetection";
import MandiPrices from "./pages/MandiPrices";
import SoilDetection from "./pages/SoilDetection"; // Import the new soil page
import EquipmentRentals from "./pages/EquipmentRentals";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/yield-prediction" element={<YieldPrediction />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
          <Route path="/mandi-prices" element={<MandiPrices />} />
          
          {/* New Hackathon Feature: Soil Analyzer */}
          <Route path="/soil-detection" element={<SoilDetection />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          <Route path="/equipment-rentals" element={<EquipmentRentals />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LiveWallpaper from "@/components/LiveWallpaper";
import FertilizerModal from "@/components/FertilizerModal";
import {
  Sprout, ArrowLeft, ChevronRight, Thermometer, Droplets,
  Wind, BarChart3, Loader2, CheckCircle2
} from "lucide-react";

const CROPS = [
  "Wheat", "Rice", "Maize", "Sugarcane", "Cotton",
  "Soybean", "Groundnut", "Mustard", "Barley", "Chickpea",
];

const SOIL_TYPES = ["Alluvial", "Black (Regur)", "Red & Yellow", "Laterite", "Arid/Desert", "Forest & Mountain", "Peaty & Marshy"];

const STATES = [
  "Andhra Pradesh", "Bihar", "Gujarat", "Haryana", "Karnataka",
  "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal",
];

type ResultType = {
  crop: string;
  yield: string;
  unit: string;
  confidence: number;
  advice: string[];
  rating: "excellent" | "good" | "average" | "poor";
};

const ratingColors = {
  excellent: "text-emerald-400",
  good: "text-green-400",
  average: "text-yellow-400",
  poor: "text-red-400",
};

const ratingLabels = {
  excellent: "Excellent Yield Expected",
  good: "Good Yield Expected",
  average: "Average Yield Expected",
  poor: "Below Average — Action Needed",
};

function simulateResult(crop: string, soil: string, rainfall: number, temp: number): ResultType {
  const score = (rainfall / 200) * 0.4 + (temp > 15 && temp < 35 ? 0.6 : 0.2) + (soil === "Alluvial" ? 0.3 : 0.1);
  const baseYield = { Wheat: 3.2, Rice: 4.5, Maize: 3.8, Sugarcane: 65, Cotton: 1.8, Soybean: 2.1, Groundnut: 1.9, Mustard: 1.5, Barley: 2.8, Chickpea: 1.3 }[crop] || 2.5;
  const factor = 0.7 + score * 0.6;
  const yieldVal = (baseYield * factor).toFixed(1);
  const rating: ResultType["rating"] = score > 0.7 ? "excellent" : score > 0.5 ? "good" : score > 0.3 ? "average" : "poor";
  return {
    crop,
    yield: yieldVal,
    unit: crop === "Sugarcane" ? "tons/acre" : "tons/hectare",
    confidence: Math.min(95, Math.round(60 + score * 40)),
    rating,
    advice: [
      score < 0.5 ? "Consider supplemental irrigation to compensate for low rainfall." : "Rainfall levels are adequate for this crop.",
      temp < 15 ? "Low temperatures may affect germination — consider delayed sowing." : temp > 35 ? "High temperatures detected — ensure adequate soil moisture." : "Temperature range is optimal for this crop.",
      soil === "Alluvial" ? "Alluvial soil is highly suitable — maintain organic matter levels." : "Consider adding organic compost to improve soil structure.",
    ],
  };
}

export default function YieldPrediction() {
  const navigate = useNavigate();
  const [showFertilizerModal, setShowFertilizerModal] = useState(false);
  const [crop, setCrop] = useState("");
  const [soil, setSoil] = useState("");
  const [state, setState] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [temp, setTemp] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);

  const canPredict = crop && soil && state && rainfall && temp && area;

  const handlePredict = () => {
    if (!canPredict) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(simulateResult(crop, soil, Number(rainfall), Number(temp)));
      setLoading(false);
    }, 2200);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="fixed inset-0 z-0" style={{ background: "linear-gradient(to bottom, hsl(158 55% 5% / 0.75) 0%, hsl(158 35% 6% / 0.9) 60%, hsl(158 35% 6% / 1) 100%)" }} />
      <LiveWallpaper />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-border/30 backdrop-blur-sm">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-body text-sm">Back</span>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Sprout className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">Nethra</span>
          </div>
          <div className="w-16" />
        </nav>

        <main className="flex-1 px-6 md:px-12 py-12 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-primary text-xs font-body font-medium mb-3">
              <Sprout className="w-3.5 h-3.5" />
              <span>AI-Powered Analysis</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Yield Prediction</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3">
              Yield <span className="gradient-text">Prediction</span>
            </h1>
            <p className="text-muted-foreground font-body max-w-xl">
              Enter your farm's details to get an AI-powered crop yield forecast based on soil conditions, weather patterns, and historical data.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3 glass-card rounded-2xl p-8 border border-border/60">
              <h2 className="font-display font-semibold text-xl text-foreground mb-6">Farm Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Crop */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wide">Crop Type</label>
                  <select
                    value={crop} onChange={e => setCrop(e.target.value)}
                    className="bg-background/60 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  >
                    <option value="">Select crop</option>
                    {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Soil */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wide">Soil Type</label>
                  <select
                    value={soil} onChange={e => setSoil(e.target.value)}
                    className="bg-background/60 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  >
                    <option value="">Select soil</option>
                    {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* State */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wide">State / Region</label>
                  <select
                    value={state} onChange={e => setState(e.target.value)}
                    className="bg-background/60 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  >
                    <option value="">Select state</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Area */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wide">Farm Area (hectares)</label>
                  <input
                    type="number" min="0.1" step="0.1"
                    value={area} onChange={e => setArea(e.target.value)}
                    placeholder="e.g. 2.5"
                    className="bg-background/60 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>

                {/* Rainfall */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Droplets className="w-3 h-3" /> Annual Rainfall (mm)
                  </label>
                  <input
                    type="number" min="0"
                    value={rainfall} onChange={e => setRainfall(e.target.value)}
                    placeholder="e.g. 800"
                    className="bg-background/60 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>

                {/* Temp */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Thermometer className="w-3 h-3" /> Avg Temperature (°C)
                  </label>
                  <input
                    type="number"
                    value={temp} onChange={e => setTemp(e.target.value)}
                    placeholder="e.g. 25"
                    className="bg-background/60 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={handlePredict}
                disabled={!canPredict || loading}
                className="mt-8 w-full py-3.5 rounded-xl font-body font-medium text-sm text-primary-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: "var(--gradient-primary)" }}
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing your farm data...</>
                ) : (
                  <><BarChart3 className="w-4 h-4" /> Predict Yield</>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowFertilizerModal(true)}
                disabled={loading}
                className="mt-3 w-full py-2 rounded-xl font-body text-sm border border-border/40 text-foreground bg-background/20 hover:bg-background/30 transition-colors"
              >
                Recommend Fertilizer
              </button>
            </div>

            {/* Results */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {!result && !loading && (
                <div className="glass-card rounded-2xl p-8 border border-border/40 flex flex-col items-center justify-center text-center gap-4 min-h-[280px]">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Sprout className="w-7 h-7 text-primary/50" />
                  </div>
                  <p className="text-muted-foreground font-body text-sm">Fill in the form and click <span className="text-foreground font-medium">Predict Yield</span> to see your forecast.</p>
                </div>
              )}

              {loading && (
                <div className="glass-card rounded-2xl p-8 border border-border/40 flex flex-col items-center justify-center gap-4 min-h-[280px]">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-muted-foreground font-body text-sm text-center">Running AI model on your farm data…</p>
                </div>
              )}

              {result && !loading && (
                <>
                  <div className="glass-card rounded-2xl p-7 border border-primary/30">
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-xs font-body text-muted-foreground uppercase tracking-wide">Predicted Yield</span>
                      <span className={`text-xs font-body font-medium ${ratingColors[result.rating]}`}>{ratingLabels[result.rating]}</span>
                    </div>
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-5xl font-display font-bold text-foreground">{result.yield}</span>
                      <span className="text-muted-foreground font-body text-sm mb-2">{result.unit}</span>
                    </div>
                    <p className="text-xs font-body text-muted-foreground mb-5">{result.crop} · {area} ha · AI Confidence: {result.confidence}%</p>

                    {/* Confidence bar */}
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${result.confidence}%`, background: "var(--gradient-primary)" }}
                      />
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-7 border border-border/40">
                    <h3 className="text-sm font-display font-semibold text-foreground mb-4">Agronomist Advice</h3>
                    <ul className="flex flex-col gap-3">
                      {result.advice.map((tip, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span className="text-xs font-body text-muted-foreground leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>

        <footer className="px-6 md:px-12 py-6 border-t border-border/30 text-center">
          <p className="text-xs font-body text-muted-foreground">© 2024 Nethra — Empowering farmers with intelligent technology.</p>
        </footer>
      </div>
      <FertilizerModal isOpen={showFertilizerModal} onClose={() => setShowFertilizerModal(false)} />
    </div>
  );
}
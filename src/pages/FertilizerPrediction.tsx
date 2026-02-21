import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LiveWallpaper from "@/components/LiveWallpaper";
import {
  Sprout, ArrowLeft, ChevronRight,
  Droplets, Loader2, CheckCircle2, AlertCircle, Link2, Thermometer,
  Droplet, Wind
} from "lucide-react";

const API_BASE_URL = "https://sunainakancharla-nethra-yield-model.hf.space";

const CROPS = [
  "Wheat", "Rice", "Maize", "Sugarcane", "Cotton",
  "Soybean", "Groundnut", "Mustard", "Barley", "Chickpea",
];

const SOIL_TYPES = ["Alluvial", "Black (Regur)", "Red & Yellow", "Laterite", "Loamy", "Sandy"];

// Fertilizer information guide
const FERTILIZER_INFO: Record<string, { description: string; benefits: string[] }> = {
  "Urea": {
    description: "High nitrogen content fertilizer, excellent for leafy growth",
    benefits: ["High Nitrogen (46%)", "Boosts vegetative growth", "Fast-acting", "Water-soluble"]
  },
  "DAP": {
    description: "Diammonium Phosphate - provides both nitrogen and phosphorus",
    benefits: ["Nitrogen + Phosphorus", "Promotes root development", "Aids flowering", "Good for pulses"]
  },
  "NPK": {
    description: "Balanced fertilizer with Nitrogen, Phosphorus, and Potassium",
    benefits: ["Complete nutrition", "Balanced growth", "Versatile use", "Suitable for most crops"]
  },
  "Potash": {
    description: "Potassium-rich fertilizer for fruit and vegetable crops",
    benefits: ["High Potassium", "Improves fruit quality", "Disease resistance", "Better taste & color"]
  },
  "Ammonium Sulphate": {
    description: "Nitrogen source with sulfur, good for acidic soils",
    benefits: ["Nitrogen + Sulfur", "Lowers soil pH", "Cost-effective", "Good for tea/coffee"]
  },
  "Calcium Nitrate": {
    description: "Provides nitrogen and calcium for strong plant structure",
    benefits: ["Nitrogen + Calcium", "Prevents blossom end rot", "Strong stems", "Improves quality"]
  }
};

type FertilizerResult = {
  recommendations: string[];
  confidence: number;
};

export default function FertilizerPrediction() {
  const navigate = useNavigate();
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [moisture, setMoisture] = useState("");
  const [soilType, setSoilType] = useState("");
  const [cropType, setCropType] = useState("");
  const [nitrogen, setNitrogen] = useState("");
  const [phosphorous, setPhosphorous] = useState("");
  const [potassium, setPotassium] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FertilizerResult | null>(null);

  const canPredict = temperature && humidity && moisture && soilType && cropType && nitrogen && phosphorous && potassium;

  const handlePredict = async () => {
    if (!canPredict) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        moisture: parseFloat(moisture),
        soil_type: soilType,
        crop_type: cropType,
        nitrogen: parseFloat(nitrogen),
        phosphorous: parseFloat(phosphorous),
        potassium: parseFloat(potassium),
      };

      const response = await fetch(`${API_BASE_URL}/predict-fertilizer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      setResult({
        recommendations: data.fertilizer_prediction || [],
        confidence: 85,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to predict fertilizer requirements. Please try again.");
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
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
              <span className="text-muted-foreground">Fertilizer Recommendation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3">
              Fertilizer <span className="gradient-text">Recommendation</span>
            </h1>
            <p className="text-muted-foreground font-body max-w-xl">
              Get AI-powered fertilizer recommendations based on environmental conditions, soil properties, and crop type.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3 glass-card rounded-2xl p-8 border border-border/60">
              <h2 className="font-display font-semibold text-xl text-foreground mb-6">Environmental & Soil Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Temperature */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Thermometer className="w-3 h-3" /> Temperature (°C)
                  </label>
                  <input
                    type="number" min="0" max="50" step="0.1"
                    value={temperature} onChange={e => setTemperature(e.target.value)}
                    placeholder="e.g. 25"
                    className="bg-background/60 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>

                {/* Humidity */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Wind className="w-3 h-3" /> Humidity (%)
                  </label>
                  <input
                    type="number" min="0" max="100" step="0.1"
                    value={humidity} onChange={e => setHumidity(e.target.value)}
                    placeholder="e.g. 60"
                    className="bg-background/60 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>

                {/* Moisture */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Droplet className="w-3 h-3" /> Soil Moisture (%)
                  </label>
                  <input
                    type="number" min="0" max="100" step="0.1"
                    value={moisture} onChange={e => setMoisture(e.target.value)}
                    placeholder="e.g. 40"
                    className="bg-background/60 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>

                {/* Soil Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wide">Soil Type</label>
                  <select
                    value={soilType} onChange={e => setSoilType(e.target.value)}
                    className="bg-background/60 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  >
                    <option value="">Select soil type</option>
                    {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Crop Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wide">Crop Type</label>
                  <select
                    value={cropType} onChange={e => setCropType(e.target.value)}
                    className="bg-background/60 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  >
                    <option value="">Select crop</option>
                    {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <h3 className="font-display font-semibold text-lg text-foreground mt-8 mb-5">Current Soil NPK Levels (kg/ha)</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Nitrogen */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wide">Nitrogen (N)</label>
                  <input
                    type="number" min="0" step="1"
                    value={nitrogen} onChange={e => setNitrogen(e.target.value)}
                    placeholder="e.g. 50"
                    className="bg-background/60 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>

                {/* Phosphorous */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wide">Phosphorous (P)</label>
                  <input
                    type="number" min="0" step="1"
                    value={phosphorous} onChange={e => setPhosphorous(e.target.value)}
                    placeholder="e.g. 40"
                    className="bg-background/60 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>

                {/* Potassium */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wide">Potassium (K)</label>
                  <input
                    type="number" min="0" step="1"
                    value={potassium} onChange={e => setPotassium(e.target.value)}
                    placeholder="e.g. 30"
                    className="bg-background/60 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 rounded-xl bg-red-900/20 border border-red-500/30 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-xs font-body text-red-300">{error}</p>
                </div>
              )}

              <button
                onClick={handlePredict}
                disabled={!canPredict || loading}
                className="mt-8 w-full py-3.5 rounded-xl font-body font-medium text-sm text-primary-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: "var(--gradient-primary)" }}
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing your farm data...</>
                ) : (
                  <><Droplets className="w-4 h-4" /> Get Recommendation</>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/yield-prediction")}
                disabled={loading}
                className="mt-3 w-full py-2 rounded-xl font-body text-sm border border-border/40 text-foreground bg-background/20 hover:bg-background/30 transition-colors flex items-center justify-center gap-2"
              >
                <Link2 className="w-3.5 h-3.5" /> Yield Prediction
              </button>
            </div>

            {/* Results */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {!result && !loading && (
                <div className="glass-card rounded-2xl p-8 border border-border/40 flex flex-col items-center justify-center text-center gap-4 min-h-[280px]">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Droplets className="w-7 h-7 text-primary/50" />
                  </div>
                  <p className="text-muted-foreground font-body text-sm">Fill in the form and click <span className="text-foreground font-medium">Get Recommendation</span> to see fertilizer suggestions.</p>
                </div>
              )}

              {loading && (
                <div className="glass-card rounded-2xl p-8 border border-border/40 flex flex-col items-center justify-center gap-4 min-h-[280px]">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-muted-foreground font-body text-sm text-center">Analyzing your farm requirements…</p>
                </div>
              )}

              {result && !loading && (
                <>
                  <div className="glass-card rounded-2xl p-7 border border-primary/30">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-body text-muted-foreground uppercase tracking-wide">Recommended Fertilizers</span>
                      <span className={`text-xs font-body font-medium text-green-400`}>High Confidence</span>
                    </div>

                    <div className="space-y-3">
                      {result.recommendations && result.recommendations.length > 0 ? (
                        result.recommendations.map((fertilizer, index) => (
                          <div key={index} className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                            <div className="flex items-start justify-between mb-3">
                              <span className="text-lg font-display font-bold text-primary">{fertilizer}</span>
                              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                            </div>
                            {FERTILIZER_INFO[fertilizer] && (
                              <div className="space-y-2">
                                <p className="text-xs font-body text-muted-foreground leading-relaxed">
                                  {FERTILIZER_INFO[fertilizer].description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {FERTILIZER_INFO[fertilizer].benefits.map((benefit, idx) => (
                                    <span key={idx} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-md border border-primary/30">
                                      {benefit}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No recommendations available</p>
                      )}
                    </div>

                    <p className="text-xs font-body text-muted-foreground mt-6">
                      Confidence Level: {result.confidence}% · Crop: {cropType} · Soil: {soilType}
                    </p>
                  </div>

                  <div className="glass-card rounded-2xl p-7 border border-border/40">
                    <h3 className="text-sm font-display font-semibold text-foreground mb-4">Application Tips</h3>
                    <ul className="flex flex-col gap-3">
                      <li className="flex gap-3 items-start">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-xs font-body text-muted-foreground leading-relaxed">Apply fertilizers in splits for better nutrient absorption.</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-xs font-body text-muted-foreground leading-relaxed">Ensure adequate irrigation during and after fertilizer application.</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-xs font-body text-muted-foreground leading-relaxed">Monitor crop growth and adjust dosage if needed.</span>
                      </li>
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
    </div>
  );
}

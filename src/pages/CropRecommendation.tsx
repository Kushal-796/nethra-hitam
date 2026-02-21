import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LiveWallpaper from "@/components/LiveWallpaper";
import { Loader2, Sprout, Thermometer, Droplets, Wind, AlertCircle, CheckCircle2 } from "lucide-react";

const API_BASE_URL = "https://sunainakancharla-nethra-yield-model.hf.space";

interface PredictionResult {
  crop_recommendation: string;
  scaled_values: number[];
  confidence?: number;
}

export function CropRecommendation() {
  const navigate = useNavigate();
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [nitrogen, setNitrogen] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);

  const canPredict =
    temperature.trim() !== "" &&
    humidity.trim() !== "" &&
    rainfall.trim() !== "" &&
    nitrogen.trim() !== "";

  const handlePredict = async () => {
    if (!canPredict) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/predict-new-model`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperature: parseFloat(temperature),
          humidity: parseFloat(humidity),
          rainfall: parseFloat(rainfall),
          nitrogen: parseFloat(nitrogen),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get crop recommendation");
      }

      const data = await response.json();
      setResult({
        crop_recommendation: data.crop_recommendation || "Unknown",
        scaled_values: data.scaled_values?.[0] || [],
        confidence: data.confidence || 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTemperature("");
    setHumidity("");
    setRainfall("");
    setNitrogen("");
    setResult(null);
    setError("");
  };

  const getScaledValueColor = (value: number) => {
    if (value < -0.5) return "bg-red-500/20 text-red-600";
    if (value < 0) return "bg-orange-500/20 text-orange-600";
    if (value < 0.5) return "bg-yellow-500/20 text-yellow-600";
    return "bg-green-500/20 text-green-600";
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-black via-slate-900 to-black overflow-hidden">
      <LiveWallpaper />

      <div className="relative z-10 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sprout className="w-8 h-8 text-emerald-400" />
              <h1 className="text-4xl sm:text-5xl font-display font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                Crop Recommendation
              </h1>
            </div>
            <p className="text-base text-muted-foreground">
              Get AI-powered crop recommendations based on environmental conditions
            </p>
          </div>

          {/* Form Card */}
          <div className="glass-card rounded-3xl p-8 border border-emerald-500/30 backdrop-blur-xl bg-slate-900/50 mb-8">
            <div className="space-y-6">
              {/* Temperature Input */}
              <div>
                <label className="text-sm font-body text-muted-foreground uppercase tracking-wide flex items-center gap-2 mb-2">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="e.g., 25"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-emerald-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                />
              </div>

              {/* Humidity Input */}
              <div>
                <label className="text-sm font-body text-muted-foreground uppercase tracking-wide flex items-center gap-2 mb-2">
                  <Wind className="w-4 h-4 text-blue-400" />
                  Humidity (%)
                </label>
                <input
                  type="number"
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.value)}
                  placeholder="e.g., 60"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-emerald-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                />
              </div>

              {/* Rainfall Input */}
              <div>
                <label className="text-sm font-body text-muted-foreground uppercase tracking-wide flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  Rainfall (mm)
                </label>
                <input
                  type="number"
                  value={rainfall}
                  onChange={(e) => setRainfall(e.target.value)}
                  placeholder="e.g., 120"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-emerald-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                />
              </div>

              {/* Nitrogen Input */}
              <div>
                <label className="text-sm font-body text-muted-foreground uppercase tracking-wide mb-2 block">
                  Nitrogen (kg/ha)
                </label>
                <input
                  type="number"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(e.target.value)}
                  placeholder="e.g., 40"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-emerald-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-red-400">{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handlePredict}
                  disabled={!canPredict || loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-body font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sprout className="w-5 h-5" />
                      Get Recommendation
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-white font-body font-semibold rounded-xl border border-slate-600/50 transition-all duration-300"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Results Card */}
          {result && !loading && (
            <div className="space-y-6">
              {/* Crop Recommendation */}
              <div className="glass-card rounded-2xl p-7 border border-emerald-500/50 backdrop-blur-xl bg-emerald-950/30">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-body text-emerald-300 uppercase tracking-wider">
                      Recommended Crop
                    </span>
                    <p className="text-3xl sm:text-4xl font-display font-bold text-emerald-300 mt-2">
                      {result.crop_recommendation}
                    </p>
                    <p className="text-sm text-emerald-200/70 mt-3">
                      Based on your environmental conditions, this crop is most suitable for cultivation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Scaled Values */}
              {result.scaled_values && result.scaled_values.length > 0 && (
                <div className="glass-card rounded-2xl p-7 border border-emerald-500/30 backdrop-blur-xl bg-slate-900/50">
                  <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">
                    Normalized Parameters
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                    {result.scaled_values.map((value, index) => {
                      const params = ["Temperature", "Humidity", "Rainfall", "Nitrogen"];
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-xl border transition-all ${getScaledValueColor(
                            value
                          )} border-opacity-30`}
                        >
                          <p className="text-xs font-body opacity-75 uppercase tracking-wide">
                            {params[index] || `Param ${index + 1}`}
                          </p>
                          <p className="text-2xl font-display font-bold mt-2">
                            {value.toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    📊 Normalized values show how each parameter performs relative to standard ranges. Higher positive values indicate favorable conditions.
                  </p>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => navigate("/yield-prediction")}
                  className="flex-1 px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-white font-body font-semibold rounded-xl border border-slate-600/50 transition-all"
                >
                  Yield Prediction
                </button>
                <button
                  onClick={() => navigate("/predict-fertilizer")}
                  className="flex-1 px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-white font-body font-semibold rounded-xl border border-slate-600/50 transition-all"
                >
                  Fertilizer Recommendation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

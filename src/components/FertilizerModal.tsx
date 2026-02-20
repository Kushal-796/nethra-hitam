import React, { useEffect, useRef, useState } from "react";
import { predictFertilizer } from "@/services/mlApi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function FertilizerModal({ isOpen, onClose }: Props) {
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
  const [result, setResult] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      // reset when modal closed
      reset();
    }
    // intentionally only when isOpen changes
  }, [isOpen]);

  function reset() {
    setTemperature("");
    setHumidity("");
    setMoisture("");
    setSoilType("");
    setCropType("");
    setNitrogen("");
    setPhosphorous("");
    setPotassium("");
    setError(null);
    setResult(null);
    setLoading(false);
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }

  function validate() {
    if (
      temperature === "" ||
      humidity === "" ||
      moisture === "" ||
      soilType.trim() === "" ||
      cropType.trim() === "" ||
      nitrogen === "" ||
      phosphorous === "" ||
      potassium === ""
    ) {
      setError("Please fill in all fields.");
      return false;
    }
    // numeric checks
    const nums = [temperature, humidity, moisture, nitrogen, phosphorous, potassium].map(Number);
    if (nums.some((n) => Number.isNaN(n))) {
      setError("Please enter valid numbers for numeric fields.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    setResult(null);

    if (!validate()) return;

    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    const payload = {
      temperature: Number(temperature),
      humidity: Number(humidity),
      moisture: Number(moisture),
      soil_type: soilType,
      crop_type: cropType,
      nitrogen: Number(nitrogen),
      phosphorous: Number(phosphorous),
      potassium: Number(potassium),
    };

    try {
      const json = await predictFertilizer(payload, controller.signal);
      // expected format { "fertilizer_prediction": ["Urea"] }
      const pred = json && json.fertilizer_prediction && Array.isArray(json.fertilizer_prediction) ? json.fertilizer_prediction[0] : null;
      if (!pred) {
        throw new Error("Unexpected API response format");
      }
      if (mountedRef.current) setResult(String(pred));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err ?? "Request failed");
      const suggest = /cors|CORS|Cross-Origin/i.test(msg) ? " If you see CORS errors enable CORSMiddleware in your FastAPI backend." : "";
      if (mountedRef.current) setError(`${msg}${suggest}`);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg bg-card border border-border/40 rounded-2xl p-6 z-10"
        aria-modal
        role="dialog"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Fertilizer Prediction</h3>
          <button type="button" onClick={onClose} className="text-sm text-muted-foreground">Close</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col text-sm">
            Temperature
            <input type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} className="mt-1 p-2 rounded border" />
          </label>
          <label className="flex flex-col text-sm">
            Humidity
            <input type="number" value={humidity} onChange={(e) => setHumidity(e.target.value)} className="mt-1 p-2 rounded border" />
          </label>

          <label className="flex flex-col text-sm">
            Moisture
            <input type="number" value={moisture} onChange={(e) => setMoisture(e.target.value)} className="mt-1 p-2 rounded border" />
          </label>
          <label className="flex flex-col text-sm">
            Soil Type
            <input value={soilType} onChange={(e) => setSoilType(e.target.value)} className="mt-1 p-2 rounded border" />
          </label>

          <label className="flex flex-col text-sm">
            Crop Type
            <input value={cropType} onChange={(e) => setCropType(e.target.value)} className="mt-1 p-2 rounded border" />
          </label>
          <label className="flex flex-col text-sm">
            Nitrogen
            <input type="number" value={nitrogen} onChange={(e) => setNitrogen(e.target.value)} className="mt-1 p-2 rounded border" />
          </label>

          <label className="flex flex-col text-sm">
            Phosphorous
            <input type="number" value={phosphorous} onChange={(e) => setPhosphorous(e.target.value)} className="mt-1 p-2 rounded border" />
          </label>
          <label className="flex flex-col text-sm">
            Potassium
            <input type="number" value={potassium} onChange={(e) => setPotassium(e.target.value)} className="mt-1 p-2 rounded border" />
          </label>
        </div>

        {error && <div className="mt-4 text-sm text-red-400">{error}</div>}

        {result && (
          <div className="mt-4 p-3 rounded bg-emerald-900/10 border border-emerald-500/20">
            <div className="text-sm text-muted-foreground">Recommended Fertilizer</div>
            <div className="text-lg font-semibold mt-1">{result}</div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-muted/10 border" disabled={loading}>Cancel</button>
          <button type="submit" className="px-4 py-2 rounded bg-primary text-white" disabled={loading}>
            {loading ? "Predicting…" : "Predict"}
          </button>
        </div>
      </form>
    </div>
  );
}

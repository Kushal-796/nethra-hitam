import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LiveWallpaper from "@/components/LiveWallpaper";
import {
  Sprout,
  ArrowLeft,
  Upload,
  ScanSearch,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  X
} from "lucide-react";

type Severity = "low" | "medium" | "high";

interface Disease {
  name: string;
  confidence: number;
  severity: Severity;
  description: string;
  treatment: string[];
  prevention: string[];
}

const severityConfig = {
  low: {
    color: "text-emerald-400",
    icon: CheckCircle2,
    label: "Healthy / Low Risk",
    bg: "bg-emerald-500/10 border-emerald-500/20"
  },
  medium: {
    color: "text-yellow-400",
    icon: AlertTriangle,
    label: "Moderate Disease",
    bg: "bg-yellow-500/10 border-yellow-500/20"
  },
  high: {
    color: "text-red-400",
    icon: XCircle,
    label: "Severe Infection",
    bg: "bg-red-500/10 border-red-500/20"
  }
};

export default function DiseaseDetection() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Disease | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzePlant = async () => {
  if (!preview) return;

  setLoading(true);

  try {
    const base64Image = preview;

    const response = await fetch("http://localhost:8000/health", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image.split(",")[1] })
    });

    const data = await response.json();
    console.log("FULL RESPONSE:", data);

    if (!data?.result) {
      alert("Invalid API response.");
      setLoading(false);
      return;
    }

    const diseaseSuggestions = data.result?.disease?.suggestions;

    if (!diseaseSuggestions || diseaseSuggestions.length === 0) {
      setResult({
        name: "Healthy Plant",
        confidence: Math.round((data.result.is_plant?.probability || 0.9) * 100),
        severity: "low",
        description: "No visible disease detected.",
        treatment: [],
        prevention: [
          "Maintain proper watering schedule",
          "Ensure adequate sunlight",
          "Monitor leaves weekly"
        ]
      });
    } else {
      const disease = diseaseSuggestions[0];
      const confidence = Math.round((disease.probability || 0.5) * 100);

      let severity: Severity = "medium";
      if (confidence > 80) severity = "high";
      else if (confidence < 50) severity = "low";

      setResult({
        name: disease.name,
        confidence,
        severity,
        description: disease.details?.description?.value || "Disease detected.",
        treatment: disease.details?.treatment?.chemical || ["Apply recommended fungicide"],
        prevention: [
          "Avoid overwatering",
          "Ensure proper drainage",
          "Use certified seeds"
        ]
      });
    }

  } catch (err) {
    console.error(err);
    alert("Error analyzing plant.");
  }

  setLoading(false);
};
  const clearImage = () => {
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const SeverityIcon = result
    ? severityConfig[result.severity].icon
    : CheckCircle2;

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <LiveWallpaper />

      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-border/30 backdrop-blur-sm">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-2.5">
            <Sprout className="w-4 h-4 text-primary" />
            <span className="font-bold text-lg text-foreground">Nethra</span>
          </div>

          <div className="w-16" />
        </nav>

        <main className="flex-1 px-6 md:px-12 py-12 max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* LEFT SIDE */}
            <div className="flex flex-col gap-5">
              <div
                onClick={() => !preview && fileInputRef.current?.click()}
                className="glass-card rounded-2xl border-2 border-dashed border-border/50 min-h-[320px] flex items-center justify-center relative cursor-pointer"
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Uploaded crop"
                      className="w-full h-full object-cover rounded-xl max-h-[320px]"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearImage();
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto mb-3 text-accent" />
                    Upload leaf image
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFile(e.target.files[0])
                  }
                />
              </div>

              <button
                onClick={analyzePlant}
                disabled={!preview || loading}
                className="py-3 rounded-xl text-white font-medium disabled:opacity-40"
                style={{ background: "var(--gradient-primary)" }}
              >
                {loading ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Run AI Diagnosis"
                )}
              </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col gap-5">
              {!result && !loading && (
                <div className="glass-card rounded-2xl p-8 text-center text-muted-foreground">
                  Upload image to see results.
                </div>
              )}

              {loading && (
                <div className="glass-card rounded-2xl p-8 text-center">
                  <Loader2 className="animate-spin mx-auto mb-3" />
                  Analyzing...
                </div>
              )}

              {result && (
                <div
                  className={`glass-card rounded-2xl p-6 border ${severityConfig[result.severity].bg}`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{result.name}</h2>
                    <div
                      className={`flex items-center gap-2 ${severityConfig[result.severity].color}`}
                    >
                      <SeverityIcon className="w-4 h-4" />
                      {severityConfig[result.severity].label}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {result.description}
                  </p>

                  <div className="text-sm mb-4">
                    Confidence: {result.confidence}%
                  </div>

                  {result.treatment.length > 0 && (
                    <>
                      <h3 className="font-semibold mb-2">Treatment</h3>
                      <ul className="list-disc ml-5 text-sm mb-4">
                        {result.treatment.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  <h3 className="font-semibold mb-2">Prevention</h3>
                  <ul className="list-disc ml-5 text-sm">
                    {result.prevention.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
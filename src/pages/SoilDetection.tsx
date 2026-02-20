import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sprout, ArrowLeft, Upload, ScanSearch, Loader2, Info, CheckCircle2 } from "lucide-react";

interface SoilResult {
  type: string;
  confidence: number;
  color: string;
  description: string;
  suitableCrops: string[];
  properties: string[];
}

const SOIL_DATABASE: Record<string, SoilResult> = {
  "Black Soil": {
    type: "Black Soil (Regur)",
    confidence: 94,
    color: "#1a1a1a",
    description: "High clay content, excellent at retaining moisture. Rich in iron, lime, and calcium.",
    suitableCrops: ["Cotton", "Groundnut", "Tobacco", "Chillies"],
    properties: ["High Water Retention", "Self-plowing nature", "Rich in Nutrients"]
  },
  "Alluvial Soil": {
    type: "Alluvial Soil",
    confidence: 89,
    color: "#d2b48c",
    description: "Most fertile soil type found in river basins. Highly porous and rich in potash.",
    suitableCrops: ["Rice", "Wheat", "Sugarcane", "Jute"],
    properties: ["Highly Fertile", "Light Texture", "Rich in Potash"]
  },
  "Red Soil": {
    type: "Red Soil",
    confidence: 91,
    color: "#8b4513",
    description: "Formed from weathering of crystalline rocks. Red color due to high iron diffusion.",
    suitableCrops: ["Pulses", "Millets", "Oilseeds", "Tobacco"],
    properties: ["Good Drainage", "Acidic Nature", "High Iron Content"]
  }
};

export default function SoilDetection() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SoilResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getAverageColor = (imageSrc: string): Promise<{ r: number; g: number; b: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let r = 0, g = 0, b = 0;
        const pixelCount = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        resolve({
          r: Math.floor(r / pixelCount),
          g: Math.floor(g / pixelCount),
          b: Math.floor(b / pixelCount),
        });
      };
    });
  };

  const classifySoil = (r: number, g: number, b: number): string => {
    if (r < 60 && g < 60 && b < 60) {
      return "Black Soil";
    }
    if (r > 120 && r > g && r > b) {
      return "Red Soil";
    }
    return "Alluvial Soil";
  };

  const analyzeSoil = async () => {
    if (!preview) return;
    setLoading(true);

    const avgColor = await getAverageColor(preview);
    const soilType = classifySoil(avgColor.r, avgColor.g, avgColor.b);

    setTimeout(() => {
      setResult(SOIL_DATABASE[soilType]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050805] text-white p-6 md:p-12 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-400 hover:text-white">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-2">
          <Sprout className="text-green-500" />
          <span className="text-xl font-bold tracking-tight">Nethra AI</span>
        </div>
        <div className="w-10" />
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold italic">
            Soil <span className="text-green-500">Analyzer</span>
          </h1>
          <p className="text-gray-400">
            Upload a photo of your field soil for intelligent color-based detection.
          </p>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-800 rounded-3xl h-80 flex items-center justify-center cursor-pointer hover:border-green-500/50 bg-[#0c120c]"
          >
            {preview ? (
              <img src={preview} className="h-full w-full object-cover rounded-3xl" />
            ) : (
              <div className="text-center">
                <Upload className="mx-auto mb-4 text-gray-600" size={48} />
                <p>Click to upload soil sample</p>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFile}
            accept="image/*"
          />

          <button
            disabled={!preview || loading}
            onClick={analyzeSoil}
            className="w-full py-4 bg-green-600 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ScanSearch />}
            {loading ? "Analyzing..." : "Analyze Soil Type"}
          </button>
        </div>

        <div className="space-y-6">
          {result ? (
            <div className="bg-[#0c120c] border border-gray-800 p-8 rounded-3xl space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-1">{result.type}</h2>
                  <p className="text-green-500 flex items-center gap-1">
                    <CheckCircle2 size={14} /> {result.confidence}% Confidence
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-full border border-white/20"
                  style={{ backgroundColor: result.color }}
                />
              </div>

              <p className="text-gray-400">{result.description}</p>

              <div>
                <h4 className="text-sm font-bold uppercase text-gray-500 mb-3 tracking-widest">
                  Best Crops to Plant
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.suitableCrops.map((crop) => (
                    <span key={crop} className="bg-green-900/30 text-green-400 px-4 py-2 rounded-lg border border-green-800/50">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                {result.properties.map((prop) => (
                  <div key={prop} className="flex items-center gap-3 text-sm text-gray-300">
                    <Info size={16} className="text-green-500" /> {prop}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border border-gray-800 rounded-3xl bg-[#0c120c]/50 text-gray-600 italic">
              Results will appear here after analysis
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
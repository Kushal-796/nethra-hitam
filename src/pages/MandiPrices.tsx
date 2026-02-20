import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import LiveWallpaper from "@/components/LiveWallpaper";
import {
  Sprout, ArrowLeft, ChevronRight, TrendingUp, TrendingDown,
  Minus, Search, RefreshCw, MapPin, Clock
} from "lucide-react";

interface MandiEntry {
  crop: string;
  variety: string;
  mandi: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change: number;
  lastUpdated: string;
}

const MANDI_DATA: MandiEntry[] = [
  { crop: "Wheat", variety: "Lokwan", mandi: "Azadpur", state: "Delhi", minPrice: 2100, maxPrice: 2380, modalPrice: 2240, unit: "₹/quintal", trend: "up", change: 2.3, lastUpdated: "2h ago" },
  { crop: "Rice", variety: "Basmati", mandi: "Karnal", state: "Haryana", minPrice: 3200, maxPrice: 3800, modalPrice: 3550, unit: "₹/quintal", trend: "up", change: 1.5, lastUpdated: "1h ago" },
  { crop: "Maize", variety: "Hybrid", mandi: "Davangere", state: "Karnataka", minPrice: 1480, maxPrice: 1760, modalPrice: 1620, unit: "₹/quintal", trend: "down", change: -0.8, lastUpdated: "3h ago" },
  { crop: "Cotton", variety: "Long Staple", mandi: "Rajkot", state: "Gujarat", minPrice: 6200, maxPrice: 6950, modalPrice: 6600, unit: "₹/quintal", trend: "stable", change: 0.1, lastUpdated: "2h ago" },
  { crop: "Soybean", variety: "Yellow", mandi: "Indore", state: "Madhya Pradesh", minPrice: 3900, maxPrice: 4350, modalPrice: 4100, unit: "₹/quintal", trend: "up", change: 3.1, lastUpdated: "1h ago" },
  { crop: "Groundnut", variety: "Bold", mandi: "Junagadh", state: "Gujarat", minPrice: 5100, maxPrice: 5680, modalPrice: 5400, unit: "₹/quintal", trend: "down", change: -1.2, lastUpdated: "4h ago" },
  { crop: "Mustard", variety: "Yellow", mandi: "Alwar", state: "Rajasthan", minPrice: 4800, maxPrice: 5350, modalPrice: 5100, unit: "₹/quintal", trend: "up", change: 0.9, lastUpdated: "2h ago" },
  { crop: "Chickpea", variety: "Desi", mandi: "Gulbarga", state: "Karnataka", minPrice: 4200, maxPrice: 4900, modalPrice: 4550, unit: "₹/quintal", trend: "stable", change: 0.0, lastUpdated: "5h ago" },
  { crop: "Sugarcane", variety: "CO-86032", mandi: "Meerut", state: "Uttar Pradesh", minPrice: 290, maxPrice: 340, modalPrice: 315, unit: "₹/quintal", trend: "stable", change: 0.0, lastUpdated: "6h ago" },
  { crop: "Tomato", variety: "Hybrid", mandi: "Kolar", state: "Karnataka", minPrice: 800, maxPrice: 1600, modalPrice: 1200, unit: "₹/quintal", trend: "up", change: 18.5, lastUpdated: "30m ago" },
  { crop: "Onion", variety: "Red", mandi: "Lasalgaon", state: "Maharashtra", minPrice: 550, maxPrice: 950, modalPrice: 750, unit: "₹/quintal", trend: "down", change: -5.2, lastUpdated: "1h ago" },
  { crop: "Potato", variety: "Kufri Jyoti", mandi: "Agra", state: "Uttar Pradesh", minPrice: 600, maxPrice: 950, modalPrice: 780, unit: "₹/quintal", trend: "down", change: -2.1, lastUpdated: "2h ago" },
  { crop: "Barley", variety: "Six Row", mandi: "Jaipur", state: "Rajasthan", minPrice: 1600, maxPrice: 1900, modalPrice: 1750, unit: "₹/quintal", trend: "up", change: 1.1, lastUpdated: "3h ago" },
  { crop: "Turmeric", variety: "Erode", mandi: "Erode", state: "Tamil Nadu", minPrice: 7200, maxPrice: 8500, modalPrice: 7900, unit: "₹/quintal", trend: "up", change: 4.3, lastUpdated: "1h ago" },
  { crop: "Chilli", variety: "Teja", mandi: "Guntur", state: "Andhra Pradesh", minPrice: 8000, maxPrice: 12000, modalPrice: 10000, unit: "₹/quintal", trend: "up", change: 6.8, lastUpdated: "2h ago" },
];

const ALL_STATES = Array.from(new Set(MANDI_DATA.map(d => d.state))).sort();
const ALL_CROPS = Array.from(new Set(MANDI_DATA.map(d => d.crop))).sort();

const trendConfig = {
  up: { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  down: { icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10" },
  stable: { icon: Minus, color: "text-muted-foreground", bg: "bg-muted/50" },
};

export default function MandiPrices() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedCrop, setSelectedCrop] = useState("All Crops");
  const [sortBy, setSortBy] = useState<"crop" | "price" | "change">("crop");

  const filtered = useMemo(() => {
    return MANDI_DATA
      .filter(d => {
        const q = search.toLowerCase();
        const matchSearch = !q || d.crop.toLowerCase().includes(q) || d.mandi.toLowerCase().includes(q) || d.state.toLowerCase().includes(q);
        const matchState = selectedState === "All States" || d.state === selectedState;
        const matchCrop = selectedCrop === "All Crops" || d.crop === selectedCrop;
        return matchSearch && matchState && matchCrop;
      })
      .sort((a, b) => {
        if (sortBy === "price") return b.modalPrice - a.modalPrice;
        if (sortBy === "change") return b.change - a.change;
        return a.crop.localeCompare(b.crop);
      });
  }, [search, selectedState, selectedCrop, sortBy]);

  const avgChange = MANDI_DATA.reduce((s, d) => s + d.change, 0) / MANDI_DATA.length;
  const gainers = MANDI_DATA.filter(d => d.trend === "up").length;
  const losers = MANDI_DATA.filter(d => d.trend === "down").length;

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

        <main className="flex-1 px-6 md:px-12 py-12 max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-body font-medium mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Live Market Data</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Mandi Prices</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3">
                  Mandi <span className="gradient-text">Prices</span>
                </h1>
                <p className="text-muted-foreground font-body max-w-lg">
                  Real-time commodity prices from mandis across India. Compare rates and sell at the right time.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-body text-muted-foreground glass-card border border-border/40 rounded-xl px-4 py-2.5 shrink-0">
                <RefreshCw className="w-3.5 h-3.5 text-primary" />
                <span>Live — Updated 30m ago</span>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Commodities", value: MANDI_DATA.length, suffix: "tracked", color: "text-foreground" },
              { label: "Gainers today", value: gainers, suffix: "crops ↑", color: "text-emerald-400" },
              { label: "Market Avg Δ", value: `${avgChange > 0 ? "+" : ""}${avgChange.toFixed(1)}%`, suffix: "today", color: avgChange > 0 ? "text-emerald-400" : "text-red-400" },
            ].map(stat => (
              <div key={stat.label} className="glass-card rounded-xl p-5 border border-border/40 text-center">
                <p className="text-xs font-body text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs font-body text-muted-foreground">{stat.suffix}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search crop, mandi, or state…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-background/60 border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>
            <select value={selectedState} onChange={e => setSelectedState(e.target.value)}
              className="bg-background/60 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground focus:outline-none focus:border-primary/60 transition-colors">
              <option>All States</option>
              {ALL_STATES.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)}
              className="bg-background/60 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground focus:outline-none focus:border-primary/60 transition-colors">
              <option>All Crops</option>
              {ALL_CROPS.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="bg-background/60 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground focus:outline-none focus:border-primary/60 transition-colors">
              <option value="crop">Sort: Crop A–Z</option>
              <option value="price">Sort: Price ↓</option>
              <option value="change">Sort: Change ↓</option>
            </select>
          </div>

          {/* Table */}
          <div className="glass-card rounded-2xl border border-border/60 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-border/40 bg-muted/20">
              <div className="col-span-3 text-xs font-body font-medium text-muted-foreground uppercase tracking-wide">Crop & Mandi</div>
              <div className="col-span-2 text-xs font-body font-medium text-muted-foreground uppercase tracking-wide hidden sm:block">State</div>
              <div className="col-span-2 text-xs font-body font-medium text-muted-foreground uppercase tracking-wide text-right">Min / Max</div>
              <div className="col-span-2 text-xs font-body font-medium text-muted-foreground uppercase tracking-wide text-right">Modal Price</div>
              <div className="col-span-2 text-xs font-body font-medium text-muted-foreground uppercase tracking-wide text-right">Change</div>
              <div className="col-span-1 text-xs font-body font-medium text-muted-foreground uppercase tracking-wide text-right hidden md:block">Updated</div>
            </div>

            {filtered.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground font-body text-sm">No results found for your filters.</div>
            ) : (
              filtered.map((entry, idx) => {
                const Trend = trendConfig[entry.trend].icon;
                return (
                  <div
                    key={`${entry.crop}-${entry.mandi}`}
                    className={`grid grid-cols-12 gap-3 px-5 py-4 items-center border-b border-border/20 hover:bg-primary/5 transition-colors ${idx % 2 === 0 ? "" : "bg-muted/5"}`}
                  >
                    <div className="col-span-3">
                      <p className="text-sm font-body font-medium text-foreground">{entry.crop}</p>
                      <p className="text-xs font-body text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5" />{entry.mandi} · {entry.variety}
                      </p>
                    </div>
                    <div className="col-span-2 hidden sm:block">
                      <span className="text-xs font-body text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-lg">{entry.state}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="text-xs font-body text-muted-foreground">₹{entry.minPrice.toLocaleString()}</p>
                      <p className="text-xs font-body text-muted-foreground">₹{entry.maxPrice.toLocaleString()}</p>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="text-sm font-body font-semibold text-foreground">₹{entry.modalPrice.toLocaleString()}</p>
                      <p className="text-xs font-body text-muted-foreground">{entry.unit}</p>
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-body font-medium ${trendConfig[entry.trend].color} ${trendConfig[entry.trend].bg}`}>
                        <Trend className="w-3 h-3" />
                        {entry.change > 0 ? "+" : ""}{entry.change}%
                      </div>
                    </div>
                    <div className="col-span-1 text-right hidden md:flex justify-end items-center gap-1 text-xs font-body text-muted-foreground/60">
                      <Clock className="w-2.5 h-2.5" />{entry.lastUpdated}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <p className="text-xs font-body text-muted-foreground mt-4 text-center">
            Prices sourced from Agmarknet & NAFED. Data is indicative and updated periodically.
          </p>
        </main>

        <footer className="px-6 md:px-12 py-6 border-t border-border/30 text-center">
          <p className="text-xs font-body text-muted-foreground">© 2024 Nethra — Empowering farmers with intelligent technology.</p>
        </footer>
      </div>
    </div>
  );
}

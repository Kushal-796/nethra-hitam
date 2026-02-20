import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LiveWallpaper from "@/components/LiveWallpaper";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import TiltCard from "@/components/TiltCard";
import FloatingParticles from "@/components/FloatingParticles";
import {
  Sprout, Search, Filter, Tractor, Wrench, Droplets,
  MapPin, Star, Clock, ShoppingCart, Package, Plus, ChevronDown,
  X, Check, IndianRupee, Tag, Truck, Phone, Mail, Calendar,
  Heart, Eye, Shield, BadgeCheck, Fuel, Gauge, Users,
  Sparkles, ArrowRight, ChevronRight, Zap,
} from "lucide-react";

/* ───────────────────── types ───────────────────── */
type Category = "all" | "tractors" | "harvesters" | "tillers" | "irrigation" | "vehicles" | "tools" | "sprayers";
type ListingType = "rent" | "buy" | "both";

interface Equipment {
  id: number; name: string; category: Category; description: string;
  rentPrice: number; buyPrice: number; listingType: ListingType;
  location: string; owner: string; rating: number; reviews: number;
  available: boolean; featured: boolean;
  specs: { label: string; value: string }[];
  images: number; hp?: string; fuelType?: string; year?: number;
}

/* ───────────────────── data ───────────────────── */
const CATEGORIES: { key: Category; label: string; icon: typeof Tractor }[] = [
  { key: "all", label: "All Equipment", icon: Package },
  { key: "tractors", label: "Tractors", icon: Tractor },
  { key: "harvesters", label: "Harvesters", icon: Wrench },
  { key: "tillers", label: "Tillers", icon: Wrench },
  { key: "irrigation", label: "Irrigation", icon: Droplets },
  { key: "vehicles", label: "Vehicles", icon: Truck },
  { key: "tools", label: "Tools", icon: Wrench },
  { key: "sprayers", label: "Sprayers", icon: Fuel },
];

const categoryGradients: Record<string, string> = {
  tractors: "from-emerald-600/40 to-green-800/60",
  harvesters: "from-amber-600/40 to-yellow-800/60",
  tillers: "from-orange-600/40 to-red-800/60",
  irrigation: "from-sky-600/40 to-cyan-800/60",
  vehicles: "from-violet-600/40 to-purple-800/60",
  tools: "from-pink-600/40 to-rose-800/60",
  sprayers: "from-teal-600/40 to-emerald-800/60",
};

const MOCK_EQUIPMENT: Equipment[] = [
  { id: 1, name: "Mahindra 575 DI Tractor", category: "tractors", description: "45 HP tractor with power steering ideal for ploughing, harrowing, and transportation.", rentPrice: 1800, buyPrice: 650000, listingType: "both", location: "Pune, Maharashtra", owner: "Rajesh Patil", rating: 4.8, reviews: 24, available: true, featured: true, hp: "45 HP", fuelType: "Diesel", year: 2022, images: 4, specs: [{ label: "Engine", value: "3-Cylinder, 2730cc" }, { label: "Transmission", value: "8F + 2R" }, { label: "PTO", value: "540 RPM" }, { label: "Hydraulics", value: "1500 kg lift" }] },
  { id: 2, name: "Swaraj 744 FE Tractor", category: "tractors", description: "48 HP tractor with advanced hydraulics for paddy and sugarcane farming.", rentPrice: 2200, buyPrice: 720000, listingType: "both", location: "Nashik, Maharashtra", owner: "Suresh Kumar", rating: 4.6, reviews: 18, available: true, featured: false, hp: "48 HP", fuelType: "Diesel", year: 2023, images: 3, specs: [{ label: "Engine", value: "3-Cylinder, 2980cc" }, { label: "Transmission", value: "8F + 2R" }, { label: "PTO", value: "540 RPM" }, { label: "Hydraulics", value: "1800 kg lift" }] },
  { id: 3, name: "Mini Combine Harvester", category: "harvesters", description: "Compact combine harvester for wheat and rice with 7ft cutting width.", rentPrice: 5500, buyPrice: 1450000, listingType: "rent", location: "Ludhiana, Punjab", owner: "Gurpreet Singh", rating: 4.9, reviews: 31, available: true, featured: true, hp: "65 HP", fuelType: "Diesel", year: 2023, images: 5, specs: [{ label: "Cutting Width", value: "7 ft" }, { label: "Grain Tank", value: "1200 liters" }, { label: "Threshing", value: "Axial Flow" }, { label: "Cleaning", value: "Multi-fan sieve" }] },
  { id: 4, name: "Rotavator 5ft", category: "tillers", description: "Heavy-duty rotavator for seed bed preparation. 42 blades.", rentPrice: 900, buyPrice: 85000, listingType: "both", location: "Nagpur, Maharashtra", owner: "Anil Deshmukh", rating: 4.5, reviews: 12, available: true, featured: false, fuelType: "PTO Driven", year: 2023, images: 2, specs: [{ label: "Width", value: "5 ft" }, { label: "Blades", value: "42 L-Type" }, { label: "Depth", value: "Up to 9 in" }, { label: "Required HP", value: "35+ HP" }] },
  { id: 5, name: "Solar Irrigation Pump 5HP", category: "irrigation", description: "Solar-powered submersible pump with controller. No fuel cost.", rentPrice: 700, buyPrice: 180000, listingType: "buy", location: "Jaipur, Rajasthan", owner: "Vikram Sharma", rating: 4.7, reviews: 42, available: true, featured: true, hp: "5 HP", fuelType: "Solar", year: 2024, images: 3, specs: [{ label: "Flow Rate", value: "120 LPM" }, { label: "Head", value: "50 meters" }, { label: "Panel", value: "6 x 335W" }, { label: "Coverage", value: "5 acres" }] },
  { id: 6, name: "Bolero Pickup Truck", category: "vehicles", description: "Sturdy pickup for transporting crops, fertilizers, and equipment. 1.7 ton.", rentPrice: 1500, buyPrice: 890000, listingType: "rent", location: "Indore, MP", owner: "Mohan Yadav", rating: 4.4, reviews: 15, available: false, featured: false, fuelType: "Diesel", year: 2021, images: 3, specs: [{ label: "Payload", value: "1.7 ton" }, { label: "Engine", value: "1493cc CRDe" }, { label: "Mileage", value: "16 km/l" }, { label: "Drive", value: "4x2" }] },
  { id: 7, name: "Knapsack Sprayer 16L", category: "sprayers", description: "Battery-operated backpack sprayer for pesticide and fertilizer application.", rentPrice: 150, buyPrice: 3500, listingType: "both", location: "Hyderabad, Telangana", owner: "Krishna Reddy", rating: 4.3, reviews: 56, available: true, featured: false, fuelType: "Battery", year: 2024, images: 2, specs: [{ label: "Tank", value: "16 liters" }, { label: "Battery", value: "12V 8Ah" }, { label: "Pressure", value: "2-4 bar" }, { label: "Spray Range", value: "2-4 m" }] },
  { id: 8, name: "Seed Drill Machine", category: "tools", description: "9-row seed drill for precision sowing. Reduces seed wastage by 20%.", rentPrice: 800, buyPrice: 45000, listingType: "both", location: "Kanpur, UP", owner: "Ram Prasad", rating: 4.6, reviews: 9, available: true, featured: false, fuelType: "PTO Driven", year: 2023, images: 2, specs: [{ label: "Rows", value: "9" }, { label: "Row Spacing", value: "Adjustable" }, { label: "Seed Box", value: "45 kg" }, { label: "Required HP", value: "35+ HP" }] },
  { id: 9, name: "Boom Sprayer 500L", category: "sprayers", description: "Tractor-mounted boom sprayer with 12m spray width.", rentPrice: 1200, buyPrice: 120000, listingType: "rent", location: "Amravati, Maharashtra", owner: "Ganesh Wagh", rating: 4.8, reviews: 21, available: true, featured: true, fuelType: "PTO Driven", year: 2023, images: 3, specs: [{ label: "Tank", value: "500 liters" }, { label: "Boom Width", value: "12 m" }, { label: "Nozzles", value: "24 flat-fan" }, { label: "Required HP", value: "35+ HP" }] },
  { id: 10, name: "Power Weeder", category: "tools", description: "Petrol-powered inter-cultivation weeder for removing weeds between rows.", rentPrice: 500, buyPrice: 32000, listingType: "both", location: "Coimbatore, TN", owner: "Murugan S", rating: 4.2, reviews: 17, available: true, featured: false, hp: "3.5 HP", fuelType: "Petrol", year: 2024, images: 2, specs: [{ label: "Engine", value: "3.5 HP 4-stroke" }, { label: "Working Width", value: "600mm" }, { label: "Depth", value: "5 in" }, { label: "Weight", value: "38 kg" }] },
  { id: 11, name: "Drip Irrigation Kit", category: "irrigation", description: "Complete drip irrigation system for 1 acre covering row crops.", rentPrice: 400, buyPrice: 25000, listingType: "buy", location: "Sangli, Maharashtra", owner: "Manoj Kulkarni", rating: 4.5, reviews: 33, available: true, featured: false, fuelType: "N/A", year: 2024, images: 2, specs: [{ label: "Coverage", value: "1 acre" }, { label: "Drippers", value: "2 LPH inline" }, { label: "Lateral", value: "16mm LLDPE" }, { label: "Filter", value: "Screen filter" }] },
  { id: 12, name: "Brush Cutter", category: "tools", description: "43cc petrol brush cutter for grass, weeds, and small shrub clearing.", rentPrice: 250, buyPrice: 8500, listingType: "both", location: "Mysuru, Karnataka", owner: "Praveen Gowda", rating: 4.4, reviews: 28, available: true, featured: false, hp: "2 HP", fuelType: "Petrol", year: 2024, images: 2, specs: [{ label: "Engine", value: "43cc 2-stroke" }, { label: "Cutting Dia", value: "255mm" }, { label: "Shaft", value: "Split shaft" }, { label: "Weight", value: "7.5 kg" }] },
];

const formatPrice = (p: number) => `₹${p < 1000 ? p : p.toLocaleString("en-IN")}`;

/* ───────────────────── component ───────────────────── */
export default function EquipmentRentals() {
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"rating" | "priceAsc" | "priceDsc">("rating");
  const [selectedEq, setSelectedEq] = useState<Equipment | null>(null);

  const filtered = useMemo(() => {
    let data = [...MOCK_EQUIPMENT];
    if (category !== "all") data = data.filter((e) => e.category === category);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((e) => e.name.toLowerCase().includes(q) || e.location.toLowerCase().includes(q) || e.owner.toLowerCase().includes(q));
    }
    if (sort === "rating") data.sort((a, b) => b.rating - a.rating);
    else if (sort === "priceAsc") data.sort((a, b) => a.rentPrice - b.rentPrice);
    else data.sort((a, b) => b.rentPrice - a.rentPrice);
    return data;
  }, [category, search, sort]);

  const totalEquipment = MOCK_EQUIPMENT.length;
  const availableCount = MOCK_EQUIPMENT.filter((e) => e.available).length;
  const avgRating = (MOCK_EQUIPMENT.reduce((s, e) => s + e.rating, 0) / MOCK_EQUIPMENT.length).toFixed(1);

  /* ─── Equipment Card ─── */
  const EquipmentCard = ({ eq, idx }: { eq: Equipment; idx: number }) => {
    const grad = categoryGradients[eq.category] || "from-emerald-600/40 to-green-800/60";
    const CatIcon = CATEGORIES.find((c) => c.key === eq.category)?.icon || Package;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05, duration: 0.35 }}
      >
        <TiltCard
          className="glass-card rounded-2xl border border-border/50 overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-shadow duration-500 h-full cursor-pointer"
        >
          <div onClick={() => setSelectedEq(eq)}>
            {/* Image placeholder gradient */}
            <div className={`relative h-44 bg-gradient-to-br ${grad} flex items-center justify-center overflow-hidden`}>
              <CatIcon className="w-16 h-16 text-white/20" />
              {/* Animated shimmer */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-[200%] transition-transform duration-1000" />
              </div>
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {eq.featured && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/80 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-sm">
                    <Sparkles className="w-2.5 h-2.5" /> Featured
                  </span>
                )}
                {!eq.available && (
                  <span className="px-2 py-0.5 rounded-md bg-red-500/80 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    Booked
                  </span>
                )}
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border ${eq.listingType === "both" ? "bg-emerald-500/80 text-white border-emerald-400/30" :
                    eq.listingType === "rent" ? "bg-sky-500/80 text-white border-sky-400/30" :
                      "bg-violet-500/80 text-white border-violet-400/30"
                  }`}>
                  {eq.listingType === "both" ? "Rent & Buy" : eq.listingType === "rent" ? "For Rent" : "For Sale"}
                </span>
              </div>
              {/* Year badge */}
              {eq.year && (
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-[10px] text-white/80 font-medium flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5" /> {eq.year}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">{eq.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 shrink-0" /> <span className="truncate">{eq.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 shrink-0">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-amber-400">{eq.rating}</span>
                  <span className="text-[9px] text-muted-foreground/60">({eq.reviews})</span>
                </div>
              </div>

              <p className="text-xs font-body text-muted-foreground leading-relaxed mb-4 line-clamp-2">{eq.description}</p>

              {/* Specs pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {eq.hp && (
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/15 text-[10px] text-primary font-medium flex items-center gap-1">
                    <Gauge className="w-2.5 h-2.5" /> {eq.hp}
                  </span>
                )}
                {eq.fuelType && (
                  <span className="px-2 py-0.5 rounded-md bg-muted/30 border border-border/20 text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                    <Fuel className="w-2.5 h-2.5" /> {eq.fuelType}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-end justify-between pt-3 border-t border-border/20">
                <div>
                  {(eq.listingType === "rent" || eq.listingType === "both") && (
                    <div className="text-lg font-display font-bold text-primary">{formatPrice(eq.rentPrice)}<span className="text-xs text-muted-foreground font-normal">/day</span></div>
                  )}
                  {(eq.listingType === "buy" || eq.listingType === "both") && (
                    <div className="text-xs text-muted-foreground">Buy: <span className="font-semibold text-foreground">{formatPrice(eq.buyPrice)}</span></div>
                  )}
                </div>
                <div className="group/btn flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  View Details <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </TiltCard>
      </motion.div>
    );
  };

  /* ─── Detail Modal ─── */
  const DetailModal = () => {
    if (!selectedEq) return null;
    const eq = selectedEq;
    const grad = categoryGradients[eq.category] || "from-emerald-600/40 to-green-800/60";
    const CatIcon = CATEGORIES.find((c) => c.key === eq.category)?.icon || Package;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedEq(null)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-card border border-border/60 rounded-2xl overflow-hidden max-h-[85vh] overflow-y-auto scrollbar-thin"
        >
          {/* Hero */}
          <div className={`relative h-48 bg-gradient-to-br ${grad} flex items-center justify-center`}>
            <CatIcon className="w-24 h-24 text-white/15" />
            <button
              onClick={() => setSelectedEq(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            {/* Badges */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              {eq.featured && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/80 text-white text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                  <Sparkles className="w-3 h-3" /> Featured
                </span>
              )}
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-sm text-white ${eq.available ? "bg-emerald-500/80" : "bg-red-500/80"
                }`}>
                {eq.available ? "Available" : "Booked"}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-display font-bold text-foreground mb-1">{eq.name}</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{eq.location}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{eq.owner}</span>
                  {eq.year && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{eq.year}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 shrink-0">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-amber-400">{eq.rating}</span>
                <span className="text-xs text-muted-foreground">({eq.reviews})</span>
              </div>
            </div>

            <p className="text-sm font-body text-muted-foreground leading-relaxed">{eq.description}</p>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-3">
              {(eq.listingType === "rent" || eq.listingType === "both") && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/15">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Rent Price</span>
                  <span className="text-xl font-display font-bold text-primary">{formatPrice(eq.rentPrice)}</span>
                  <span className="text-xs text-muted-foreground">/day</span>
                </div>
              )}
              {(eq.listingType === "buy" || eq.listingType === "both") && (
                <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/15">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Buy Price</span>
                  <span className="text-xl font-display font-bold text-violet-400">{formatPrice(eq.buyPrice)}</span>
                </div>
              )}
            </div>

            {/* Specs */}
            <div>
              <h3 className="text-sm font-display font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-primary" /> Specifications
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {eq.specs.map((s) => (
                  <div key={s.label} className="p-3 rounded-lg bg-muted/20 border border-border/15 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
                      <div className="text-xs font-semibold text-foreground">{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/20">
              <button className="py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-emerald-500 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                <Phone className="w-4 h-4" /> Call Owner
              </button>
              <button className="py-3 rounded-xl text-sm font-semibold text-foreground border border-border/40 bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center gap-2 transition-all">
                <Mail className="w-4 h-4 text-muted-foreground" /> Send Message
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: "var(--gradient-hero)" }}>
      <LiveWallpaper />
      <FloatingParticles count={20} />
      <div className="fixed inset-0 z-0" style={{ background: "linear-gradient(to bottom, hsl(158 55% 5% / 0.7) 0%, hsl(158 35% 6% / 0.85) 60%, hsl(158 35% 6% / 1) 100%)" }} />
      <Navbar />

      <div className="relative z-10 pt-24 pb-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                <span className="text-xs font-body font-medium text-orange-400 tracking-wide">Equipment Marketplace</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-3">
                Resource <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">Rentals</span>
              </h1>
              <p className="text-muted-foreground font-body max-w-lg mx-auto">
                Rent or buy farm equipment from nearby farmers. Compare prices, check specs, and book instantly.
              </p>
            </div>
          </ScrollReveal>

          {/* Stats strip */}
          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { label: "Listed Equipment", value: totalEquipment, icon: Package, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
                { label: "Available Now", value: availableCount, icon: BadgeCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                { label: "Avg Rating", value: avgRating, icon: Star, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
              ].map((s) => (
                <motion.div key={s.label} whileHover={{ y: -3 }} className={`glass-card rounded-xl p-4 border ${s.border} group transition-all duration-300`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <s.icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <div>
                      <div className="text-xl font-display font-bold text-foreground">{s.value}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          {/* Category tabs */}
          <ScrollReveal delay={0.15}>
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all duration-200 ${category === c.key
                      ? "bg-primary/15 border-primary/30 text-primary"
                      : "bg-transparent border-border/30 text-muted-foreground hover:text-foreground hover:border-border/50"
                    }`}>
                  <c.icon className="w-3.5 h-3.5" />
                  {c.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Search & filters */}
          <ScrollReveal delay={0.2}>
            <div className="glass-card rounded-2xl border border-border/60 p-5 mb-8 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <input
                  type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search equipment, location, or owner..."
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-muted/40 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/40 transition-all"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors">
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-muted-foreground/50" />
                {(["rating", "priceAsc", "priceDsc"] as const).map((s) => (
                  <button
                    key={s} onClick={() => setSort(s)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${sort === s ? "bg-orange-500/15 border-orange-500/30 text-orange-400" : "bg-transparent border-border/30 text-muted-foreground hover:text-foreground"
                      }`}>
                    {s === "rating" ? "★ Rating" : s === "priceAsc" ? "Price ↑" : "Price ↓"}
                  </button>
                ))}
                <span className="ml-2 text-xs text-muted-foreground">{filtered.length} results</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Equipment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((eq, idx) => (
              <EquipmentCard key={eq.id} eq={eq} idx={idx} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <Search className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-lg font-display font-semibold text-foreground mb-2">No equipment found</p>
              <p className="text-sm font-body text-muted-foreground">Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedEq && <DetailModal />}
      </AnimatePresence>
    </div>
  );
}

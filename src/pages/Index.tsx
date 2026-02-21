import { useNavigate } from "react-router-dom";
import LiveWallpaper from "@/components/LiveWallpaper";
import { Truck, Droplets } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import {
  Sprout,
  ScanSearch,
  TrendingUp,
  Shovel,
  Leaf,
  CloudRain,
} from "lucide-react";
import agroHero from "@/assets/agro-hero.jpg";

const features = [
  {
    icon: Sprout,
    title: "Yield Prediction",
    description:
      "AI-powered crop yield forecasting using soil data, weather patterns, and historical harvest records. Plan smarter, harvest better.",
    badge: "AI Powered",
    accent: "green" as const,
    delay: 100,
    href: "/yield-prediction",
  },
  {
    icon: Droplets,
    title: "Fertilizer Recommendation",
    description:
      "Get AI-powered fertilizer recommendations based on your soil type, crop, location, and farming practices. Optimize nutrient application.",
    badge: "AI Powered",
    accent: "green" as const,
    delay: 150,
    href: "/predict-fertilizer",
  },
  {
    icon: Leaf,
    title: "Crop Recommendation",
    description:
      "Get personalized crop recommendations based on temperature, humidity, rainfall, and nitrogen levels. Find the best crop for your conditions.",
    badge: "AI Powered",
    accent: "green" as const,
    delay: 175,
    href: "/predict-new-model",
  },
  {
    icon: ScanSearch,
    title: "Disease Detection",
    description:
      "Upload photos of your crops and get instant disease diagnosis with treatment recommendations powered by computer vision.",
    badge: "Image AI",
    accent: "gold" as const,
    delay: 200,
    href: "/disease-detection",
  },
  {
    icon: TrendingUp,
    title: "Mandi Prices",
    description:
      "Real-time commodity prices from mandis across India. Compare rates, track trends, and sell at the right time for maximum profit.",
    badge: "Live Data",
    accent: "rain" as const,
    delay: 300,
    href: "/mandi-prices",
  },
  {
    icon: Shovel, // Replaced Plus with Shovel icon for soil detection
    title: "Soil Detection",
    description:
      "Identify soil types (Black, Red, Alluvial) via physical analysis and get instant crop suitability reports for your field.",
    badge: "New",
    accent: "soil" as const,
    delay: 400,
    href: "/soil-detection", // Linked to your new route
  },
  {
  icon: Truck,
  title: "Equipment Rentals",
  description:
    "Rent tractors, harvesters, trucks and essential farming tools near you. Reduce costs and access machinery when you need it.",
  badge: "New",
  accent: "green" as const,
  delay: 500,
  href: "/equipment-rentals",
}
];

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: "var(--gradient-hero)" }}>
      {/* Hero background image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${agroHero})`,
          opacity: 0.15,
        }}
      />

      {/* Live canvas wallpaper (rain + leaves) */}
      <LiveWallpaper />

      {/* Dark overlay */}
      <div className="fixed inset-0 z-0" style={{ background: "linear-gradient(to bottom, hsl(158 55% 5% / 0.7) 0%, hsl(158 35% 6% / 0.85) 60%, hsl(158 35% 6% / 1) 100%)" }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-border/30 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Nethra - The Vision for Smart Farming
            </span>
          </div>
          <button
            onClick={() => navigate("/yield-prediction")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/15 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/25 transition-all">
            <CloudRain className="w-4 h-4" />
            Get Started
          </button>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center px-6 py-24 md:py-36 gap-6">
          {/* Tag */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium font-body animate-float-up">
            <Leaf className="w-3.5 h-3.5" />
            Smart Agriculture Platform
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-7xl font-display font-bold text-foreground max-w-4xl leading-tight animate-float-up"
            style={{ animationDelay: "100ms" }}
          >
            Grow Smarter,<br />
            <span className="gradient-text">Harvest Better</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl text-muted-foreground font-body max-w-2xl leading-relaxed animate-float-up"
            style={{ animationDelay: "200ms" }}
          >
            Empowering India's farmers with the vision of smart farming through AI and live data.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 mt-2 animate-float-up"
            style={{ animationDelay: "300ms" }}
          >
            <button 
              onClick={() => navigate("/yield-prediction")}
              className="px-8 py-3.5 rounded-xl font-medium font-body text-sm text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}>
              Start Predicting
            </button>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="px-6 md:px-12 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
                Powered by <span className="gradient-text">Intelligence</span>
              </h2>
              <p className="text-muted-foreground font-body text-base max-w-xl mx-auto">
                Everything you need to make data-driven decisions for your farm.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  onClick={() => feature.href && navigate(feature.href)}
                  className={feature.href ? "cursor-pointer" : ""}
                >
                  <FeatureCard {...feature} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About / Footer */}
        <footer id="about" className="mt-auto px-6 md:px-12 py-10 border-t border-border/30">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Sprout className="w-4 h-4 text-primary" />
              </div>
              <span className="font-display font-bold text-base text-foreground">
                Nethra
              </span>
            </div>
            <p className="text-xs font-body text-muted-foreground text-center">
              © 2024 Nethra. Empowering farmers with intelligent technology.
            </p>
            <div className="flex items-center gap-1 text-xs font-body text-muted-foreground">
              <CloudRain className="w-3.5 h-3.5 text-primary" />
              <span>Built for India's farmers</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
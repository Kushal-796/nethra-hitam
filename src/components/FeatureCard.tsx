import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  comingSoon?: boolean;
  accent?: "green" | "gold" | "rain" | "soil";
  delay?: number;
}

const accentStyles = {
  green: {
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
    borderHover: "hover:border-primary/50",
    glow: "hover:shadow-[0_0_30px_hsl(138_50%_38%_/_0.3)]",
    badgeBg: "bg-primary/20 text-primary border-primary/30",
  },
  gold: {
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
    borderHover: "hover:border-accent/50",
    glow: "hover:shadow-[0_0_30px_hsl(42_85%_55%_/_0.3)]",
    badgeBg: "bg-accent/20 text-accent border-accent/30",
  },
  rain: {
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-400",
    borderHover: "hover:border-sky-500/50",
    glow: "hover:shadow-[0_0_30px_hsl(200_60%_55%_/_0.3)]",
    badgeBg: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  },
  soil: {
    iconBg: "bg-amber-700/20",
    iconColor: "text-amber-500",
    borderHover: "hover:border-amber-600/50",
    glow: "hover:shadow-[0_0_30px_hsl(35_70%_45%_/_0.25)]",
    badgeBg: "bg-amber-700/20 text-amber-400 border-amber-700/30",
  },
};

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  badge,
  comingSoon = false,
  accent = "green",
  delay = 0,
}: FeatureCardProps) {
  const styles = accentStyles[accent];

  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-7 flex flex-col gap-5",
        "border border-border/60 transition-all duration-400 cursor-pointer",
        styles.borderHover,
        styles.glow,
        "group relative overflow-hidden",
        comingSoon && "opacity-75"
      )}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Shimmer overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="animate-shimmer absolute inset-0 rounded-2xl" />
      </div>

      {/* Icon */}
      <div
        className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center",
          styles.iconBg,
          "border border-white/5 transition-transform duration-300 group-hover:scale-110"
        )}
      >
        <Icon className={cn("w-7 h-7", styles.iconColor)} strokeWidth={1.6} />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-xl font-display font-semibold text-foreground">
            {title}
          </h3>
          {badge && (
            <span
              className={cn(
                "text-xs px-2.5 py-0.5 rounded-full border font-body font-medium",
                styles.badgeBg
              )}
            >
              {badge}
            </span>
          )}
          {comingSoon && (
            <span className="text-xs px-2.5 py-0.5 rounded-full border font-body font-medium bg-muted text-muted-foreground border-border">
              Coming Soon
            </span>
          )}
        </div>
        <p className="text-muted-foreground leading-relaxed font-body text-sm">
          {description}
        </p>
      </div>

      {/* Arrow */}
      {!comingSoon && (
        <div className="mt-auto pt-2 flex items-center gap-2 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          <span>Explore</span>
          <svg
            className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      )}

      {comingSoon && (
        <div className="mt-auto pt-2 flex items-center gap-2 text-xs font-medium text-muted-foreground/50">
          <span>In development</span>
        </div>
      )}
    </div>
  );
}

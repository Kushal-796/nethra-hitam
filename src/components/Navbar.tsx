import { useNavigate } from "react-router-dom";
import { Sprout, CloudRain } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-border/30 backdrop-blur-sm">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
          <Sprout className="w-5 h-5 text-primary" />
        </div>
        <span className="font-display font-bold text-xl text-foreground">Nethra</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/yield-prediction")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/15 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/25 transition-all"
        >
          <CloudRain className="w-4 h-4" />
          Get Started
        </button>
      </div>
    </nav>
  );
}

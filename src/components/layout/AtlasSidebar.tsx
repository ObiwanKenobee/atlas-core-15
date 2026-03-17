import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ShieldAlert, HeartPulse, Lightbulb, FlaskConical,
  GitBranch, Network, Briefcase,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/", label: "Overview", icon: LayoutDashboard },
  { path: "/risk", label: "Risk", icon: ShieldAlert },
  { path: "/talent-flow", label: "Talent Flow", icon: GitBranch },
  { path: "/health", label: "Health", icon: HeartPulse },
  { path: "/structure", label: "Structure", icon: Network },
  { path: "/simulation", label: "Simulation Lab", icon: FlaskConical },
  { path: "/recommendations", label: "Recommendations", icon: Lightbulb },
  { path: "/cases", label: "Cases", icon: Briefcase },
];

export function AtlasSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className="h-screen sticky top-0 flex flex-col bg-surface-0/50 border-r border-white/[0.08] backdrop-blur-sm z-30 overflow-hidden"
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-white/[0.06]">
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-[10px] font-display font-bold text-primary-foreground">AS</span>
            </div>
            <span className="font-display text-sm font-medium tracking-tight text-foreground">Atlas Sanctum</span>
          </motion.div>
        )}
        {collapsed && (
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center mx-auto">
            <span className="text-[10px] font-display font-bold text-primary-foreground">AS</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-display uppercase tracking-wider atlas-transition-fast
                ${active
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-secondary-foreground hover:bg-accent/50"
                }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-white/[0.06]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 text-muted-foreground hover:text-foreground atlas-transition-fast rounded-md hover:bg-accent/50"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}

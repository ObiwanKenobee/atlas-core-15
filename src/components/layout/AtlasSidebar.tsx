import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ShieldAlert, HeartPulse, Lightbulb, FlaskConical,
  GitBranch, Network, Briefcase, DollarSign,
  ChevronLeft, ChevronRight, LogOut, Shield,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRole, type UserRole } from "@/hooks/useRole";

const allNavItems = [
  { path: "/", label: "Overview", icon: LayoutDashboard, roles: ["admin", "operator", "executive"] as UserRole[] },
  { path: "/risk", label: "Risk", icon: ShieldAlert, roles: ["admin", "operator", "executive"] as UserRole[] },
  { path: "/talent-flow", label: "Talent Flow", icon: GitBranch, roles: ["admin", "operator", "executive"] as UserRole[] },
  { path: "/health", label: "Health", icon: HeartPulse, roles: ["admin", "operator", "executive"] as UserRole[] },
  { path: "/economics", label: "Economics", icon: DollarSign, roles: ["admin", "executive"] as UserRole[] },
  { path: "/structure", label: "Structure", icon: Network, roles: ["admin", "executive"] as UserRole[] },
  { path: "/simulation", label: "Simulation Lab", icon: FlaskConical, roles: ["admin", "operator", "executive"] as UserRole[] },
  { path: "/recommendations", label: "Recommendations", icon: Lightbulb, roles: ["admin", "operator", "executive"] as UserRole[] },
  { path: "/cases", label: "Cases", icon: Briefcase, roles: ["admin", "operator"] as UserRole[] },
];

const roleBadge: Record<UserRole, { label: string; class: string }> = {
  admin: { label: "Admin", class: "bg-stress-critical/20 text-stress-critical" },
  operator: { label: "Operator", class: "bg-primary/20 text-primary" },
  executive: { label: "Executive", class: "bg-simulation/20 text-simulation" },
};

export function AtlasSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { role } = useRole();

  const navItems = allNavItems.filter(item => item.roles.includes(role));
  const badge = roleBadge[role];

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className="h-screen sticky top-0 flex flex-col bg-surface-0/50 border-r border-white/[0.08] backdrop-blur-sm z-30 overflow-hidden"
    >
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

      <nav className="flex-1 py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-display uppercase tracking-wider atlas-transition-fast
                ${active ? "bg-accent text-foreground" : "text-muted-foreground hover:text-secondary-foreground hover:bg-accent/50"}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-white/[0.06] space-y-1">
        {!collapsed && (
          <>
            <div className="px-3 py-1 flex items-center gap-2">
              <Shield className="w-3 h-3 text-muted-foreground" />
              <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-display ${badge.class}`}>{badge.label}</span>
            </div>
            {user && (
              <div className="px-3 py-1 text-[10px] text-muted-foreground font-display truncate">{user.email}</div>
            )}
          </>
        )}
        <button onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground atlas-transition-fast rounded-md hover:bg-accent/50 text-xs font-display">
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
        <button onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 text-muted-foreground hover:text-foreground atlas-transition-fast rounded-md hover:bg-accent/50">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}

import { AtlasSidebar } from "./AtlasSidebar";
import { Outlet } from "react-router-dom";
import { globalKPIs } from "@/data/mock-data";
import { MetricCard } from "@/components/atlas/MetricCard";

export function AtlasShell() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AtlasSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global KPI Strip — L1 */}
        <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-background/80 backdrop-blur-md">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-display">Global Workforce Telemetry</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-stress-stable animate-pulse-glow" />
                <span className="text-[10px] text-muted-foreground font-display tabular-nums">Live • 12,847 entities</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {globalKPIs.map((kpi, i) => (
                <MetricCard key={kpi.id} metric={kpi} index={i} />
              ))}
            </div>
          </div>
        </header>

        {/* Main workspace — L2 */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { defaultSimVariables } from "@/data/mock-data";
import { SimulationPanel } from "@/components/atlas/SimulationPanel";
import { FlaskConical } from "lucide-react";

export default function SimulationPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <FlaskConical className="w-5 h-5 text-muted-foreground" />
        <div>
          <h1 className="text-lg font-display font-medium">Simulation Lab</h1>
          <p className="text-xs text-muted-foreground">Test interventions before deployment — observe projected impact across risk, cost, burnout, and equity</p>
        </div>
      </div>

      <SimulationPanel initialVariables={defaultSimVariables} />
    </motion.div>
  );
}

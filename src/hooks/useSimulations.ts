import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { SimulationVariable } from "@/types/atlas";

export interface SavedScenario {
  id: string;
  name: string;
  variables: SimulationVariable[];
  outputs: Record<string, number>;
  confidence_bands: Record<string, number>;
  created_at: string | null;
}

export function useSimulations() {
  const { user } = useAuth();
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScenarios = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("simulation_scenarios")
      .select("*")
      .order("created_at", { ascending: false });
    setScenarios(
      (data || []).map(d => ({
        ...d,
        variables: d.variables as unknown as SimulationVariable[],
        outputs: d.outputs as unknown as Record<string, number>,
        confidence_bands: d.confidence_bands as unknown as Record<string, number>,
      }))
    );
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchScenarios(); }, [fetchScenarios]);

  useEffect(() => {
    const channel = supabase
      .channel("simulations-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "simulation_scenarios" }, () => fetchScenarios())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchScenarios]);

  const saveScenario = async (name: string, variables: SimulationVariable[], outputs: Record<string, number>) => {
    if (!user) return;
    const { error } = await supabase.from("simulation_scenarios").insert({
      name,
      user_id: user.id,
      variables: variables as unknown as Record<string, unknown>[],
      outputs: outputs as unknown as Record<string, unknown>,
      confidence_bands: { low: 0.6, mid: 0.8, high: 0.95 },
    });
    if (error) throw error;
  };

  const deleteScenario = async (id: string) => {
    const { error } = await supabase.from("simulation_scenarios").delete().eq("id", id);
    if (error) throw error;
  };

  return { scenarios, loading, saveScenario, deleteScenario, refetch: fetchScenarios };
}

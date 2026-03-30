import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/integrations/supabase/types";

type CaseRow = Tables<"cases">;
type DecisionRow = Tables<"case_decisions">;

export interface CaseWithDecisions extends CaseRow {
  decisions: DecisionRow[];
}

export function useCases() {
  const { user } = useAuth();
  const [cases, setCases] = useState<CaseWithDecisions[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = useCallback(async () => {
    if (!user) return;
    const { data: casesData } = await supabase
      .from("cases")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: decisionsData } = await supabase
      .from("case_decisions")
      .select("*")
      .order("decided_at", { ascending: true });

    const merged = (casesData || []).map(c => ({
      ...c,
      decisions: (decisionsData || []).filter(d => d.case_id === c.id),
    }));
    setCases(merged);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel("cases-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "cases" }, () => fetchCases())
      .on("postgres_changes", { event: "*", schema: "public", table: "case_decisions" }, () => fetchCases())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchCases]);

  const createCase = async (title: string, summary: string, priority: string) => {
    if (!user) return;
    const { error } = await supabase.from("cases").insert({
      title,
      summary,
      priority,
      user_id: user.id,
    });
    if (error) throw error;
  };

  const updateCase = async (id: string, updates: Partial<CaseRow>) => {
    const { error } = await supabase.from("cases").update(updates).eq("id", id);
    if (error) throw error;
  };

  const addDecision = async (caseId: string, action: string, rationale: string, decisionOwner: string) => {
    if (!user) return;
    const { error } = await supabase.from("case_decisions").insert({
      case_id: caseId,
      user_id: user.id,
      action,
      rationale,
      decision_owner: decisionOwner,
    });
    if (error) throw error;
  };

  const deleteCase = async (id: string) => {
    const { error } = await supabase.from("cases").delete().eq("id", id);
    if (error) throw error;
  };

  return { cases, loading, createCase, updateCase, addDecision, deleteCase, refetch: fetchCases };
}

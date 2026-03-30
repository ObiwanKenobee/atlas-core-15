import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type UserRole = "admin" | "operator" | "executive";

export function useRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>("operator");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setRole((data?.role as UserRole) || "operator");
        setLoading(false);
      });
  }, [user]);

  const defaultRoute = role === "executive" ? "/" : role === "admin" ? "/cases" : "/risk";

  return { role, loading, defaultRoute };
}

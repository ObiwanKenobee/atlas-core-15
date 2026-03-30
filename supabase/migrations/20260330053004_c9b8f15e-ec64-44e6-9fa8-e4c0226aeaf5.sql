
-- Cases table
CREATE TABLE public.cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  case_number text NOT NULL DEFAULT 'CASE-' || substr(gen_random_uuid()::text, 1, 6),
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'monitoring')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  owner text NOT NULL DEFAULT '',
  affected_entities text[] DEFAULT '{}',
  evidence_count integer DEFAULT 0,
  simulations_run integer DEFAULT 0,
  outcome text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Case decisions table
CREATE TABLE public.case_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action text NOT NULL,
  rationale text NOT NULL DEFAULT '',
  decision_owner text NOT NULL DEFAULT '',
  decided_at timestamptz DEFAULT now()
);

-- Simulation scenarios table
CREATE TABLE public.simulation_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  variables jsonb NOT NULL DEFAULT '[]',
  outputs jsonb NOT NULL DEFAULT '{}',
  confidence_bands jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Saved recommendations table
CREATE TABLE public.saved_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recommendation_id text NOT NULL,
  title text NOT NULL,
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'implemented')),
  created_at timestamptz DEFAULT now()
);

-- Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  role text DEFAULT 'operator',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for cases
CREATE POLICY "Users can view own cases" ON public.cases FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can create own cases" ON public.cases FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own cases" ON public.cases FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own cases" ON public.cases FOR DELETE TO authenticated USING (user_id = auth.uid());

-- RLS policies for case_decisions
CREATE POLICY "Users can view decisions on own cases" ON public.case_decisions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can create decisions" ON public.case_decisions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- RLS policies for simulation_scenarios
CREATE POLICY "Users can view own simulations" ON public.simulation_scenarios FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can create simulations" ON public.simulation_scenarios FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own simulations" ON public.simulation_scenarios FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own simulations" ON public.simulation_scenarios FOR DELETE TO authenticated USING (user_id = auth.uid());

-- RLS policies for saved_recommendations
CREATE POLICY "Users can view own saved recs" ON public.saved_recommendations FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can save recs" ON public.saved_recommendations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own saved recs" ON public.saved_recommendations FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for cases and simulation_scenarios
ALTER PUBLICATION supabase_realtime ADD TABLE public.cases;
ALTER PUBLICATION supabase_realtime ADD TABLE public.simulation_scenarios;

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ShieldAlert, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      }
    } else {
      const { error } = await signUp(email, password, displayName);
      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Check your email", description: "We sent you a verification link to confirm your account." });
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span className="text-xs font-display font-bold text-primary-foreground">AS</span>
          </div>
          <span className="font-display text-lg font-medium tracking-tight text-foreground">Atlas Sanctum</span>
        </div>

        <div className="glass-surface-solid rounded-lg p-6">
          <h1 className="text-sm font-display font-medium text-foreground mb-1">
            {isLogin ? "Sign In" : "Create Account"}
          </h1>
          <p className="text-[11px] text-muted-foreground mb-6">
            {isLogin ? "Access the workforce intelligence platform" : "Join the operational intelligence network"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-display block mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full bg-muted border border-white/[0.08] rounded-md px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>
            )}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-display block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-muted border border-white/[0.08] rounded-md px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="operator@atlas.io"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-display block mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-muted border border-white/[0.08] rounded-md px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-display uppercase tracking-wider bg-primary text-primary-foreground rounded-md hover:bg-primary/80 atlas-transition-fast disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-3 h-3 animate-spin" />}
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[11px] text-muted-foreground hover:text-foreground atlas-transition-fast"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-[10px] text-muted-foreground">
          <ShieldAlert className="w-3 h-3" />
          <span className="font-display">Secure • Encrypted • Role-based access</span>
        </div>
      </motion.div>
    </div>
  );
}

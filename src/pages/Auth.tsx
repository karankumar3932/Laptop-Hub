import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Laptop, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Mode = "login" | "signup" | "forgot";

const Auth = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) toast.error(error.message);
      else {
        toast.success("Welcome back! 🎉");
        navigate("/");
      }
    } else if (mode === "signup") {
      const { error } = await signUp(email, password, displayName);
      if (error) toast.error(error.message);
      else {
        toast.success("Account created! You can now sign in.");
        setMode("login");
      }
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) toast.error(error.message);
      else toast.success("Password reset link sent to your email!");
    }
    setLoading(false);
  };

  const title =
    mode === "login" ? "Sign in to your account" :
    mode === "signup" ? "Create a new account" :
    "Reset your password";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <Laptop className="h-8 w-8 text-primary" />
            <span className="font-heading text-2xl font-bold text-foreground">
              Laptop<span className="text-gradient">Hub</span>
            </span>
          </Link>
          <h2 className="mt-6 font-heading text-2xl font-bold text-foreground">{title}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-6">
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  placeholder="Your name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-sm font-medium text-muted-foreground">Password</label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Please wait..." :
              mode === "login" ? "Sign In" :
              mode === "signup" ? "Sign Up" :
              "Send Reset Link"}
          </button>

          {mode === "forgot" ? (
            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <button type="button" onClick={() => setMode("login")} className="font-medium text-primary hover:underline">
                Back to Sign In
              </button>
            </p>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-medium text-primary hover:underline"
              >
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;

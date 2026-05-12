import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Flame } from "lucide-react";

export function AuthForm() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast.success("Welcome to Reality Slap!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Logged in.");
      }
      navigate({ to: "/" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-gradient-brand shadow-clay text-3xl">
          ⚔️
        </div>
        <h1 className="text-4xl font-display text-foreground">Reality Slap</h1>
        <p className="text-muted-foreground">Sign in to get slapped with reality.</p>
      </div>

      <div className="rounded-3xl bg-card p-6 shadow-clay">
        <Tabs value={mode} onValueChange={(v) => setMode(v as "signin" | "signup")}>
          <TabsList className="grid grid-cols-2 w-full bg-muted rounded-2xl p-1 mb-5">
            <TabsTrigger value="signin" className="rounded-xl">Sign in</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-xl">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value={mode}>
            <form onSubmit={handle} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl shadow-clay-inset bg-input/40 border-border/60 h-11"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-2xl shadow-clay-inset bg-input/40 border-border/60 h-11"
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                disabled={busy}
                className="w-full h-12 rounded-2xl bg-gradient-brand text-accent-foreground font-bold text-base shadow-clay hover:scale-[1.02] active:scale-[0.99] transition-transform"
              >
                <Flame className="mr-1.5 h-4 w-4" />
                {busy ? "Loading…" : mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

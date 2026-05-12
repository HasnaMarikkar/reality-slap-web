import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

export function Navbar({ guest = false }: { guest?: boolean }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (guest) return;
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [guest]);

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out.");
    navigate({ to: "/login" });
  };

  const initial = (email?.[0] ?? "?").toUpperCase();

  return (
    <nav className="w-full">
      <div className="mx-auto max-w-2xl flex items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-2xl bg-gradient-brand shadow-clay-sm flex items-center justify-center text-lg">
            ⚔️
          </div>
          <span className="font-display text-xl text-foreground">Reality Slap</span>
        </div>
        {guest && (
          <Button
            asChild
            className="h-10 px-4 rounded-2xl bg-gradient-brand text-accent-foreground font-bold shadow-clay-sm hover:scale-105 transition-transform"
          >
            <Link to="/login">
              <LogIn className="mr-1.5 h-4 w-4" />
              Sign in
            </Link>
          </Button>
        )}
        {!guest && email && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-10 w-10 rounded-2xl bg-card shadow-clay-sm font-semibold text-accent hover:bg-card hover:scale-105 transition-transform p-0"
              >
                {initial}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl shadow-clay border-border bg-card">
              <DropdownMenuLabel className="text-xs text-muted-foreground truncate max-w-[200px]">
                {email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="rounded-xl cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}

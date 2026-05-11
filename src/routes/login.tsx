import { createFileRoute, redirect } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuthForm } from "@/components/AuthForm";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { title: "Sign in — Reality Slap" },
      { name: "description", content: "Sign in or create an account to start getting roasted." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <Toaster position="top-center" richColors />
      <AuthForm />
    </main>
  );
}

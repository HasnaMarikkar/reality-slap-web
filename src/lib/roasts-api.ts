import { supabase } from "@/integrations/supabase/client";

export type Roast = {
  id: string;
  user_input: string;
  roast: string;
  reality_check: string;
  advice: string;
  created_at: string;
};

export async function listRoasts(): Promise<Roast[]> {
  const { data, error } = await supabase
    .from("roasts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Roast[];
}

export async function updateRoast(
  id: string,
  patch: Pick<Roast, "roast" | "reality_check" | "advice">
): Promise<Roast> {
  const { data, error } = await supabase
    .from("roasts")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Roast;
}

export async function deleteRoast(id: string): Promise<void> {
  const { error } = await supabase.from("roasts").delete().eq("id", id);
  if (error) throw error;
}

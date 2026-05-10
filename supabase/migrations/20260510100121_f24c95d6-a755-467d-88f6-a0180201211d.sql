CREATE TABLE public.roasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_input TEXT NOT NULL CHECK (char_length(user_input) BETWEEN 1 AND 500),
  roast TEXT NOT NULL,
  reality_check TEXT NOT NULL,
  advice TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX roasts_created_at_idx ON public.roasts (created_at DESC);

ALTER TABLE public.roasts ENABLE ROW LEVEL SECURITY;

-- Single-user, no-auth app: permissive policies for anon + authenticated
CREATE POLICY "Anyone can read roasts" ON public.roasts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert roasts" ON public.roasts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update roasts" ON public.roasts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete roasts" ON public.roasts FOR DELETE USING (true);
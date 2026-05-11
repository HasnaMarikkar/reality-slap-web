
-- Wipe rows that have no owner
DELETE FROM public.roasts;

-- Add user_id (owner)
ALTER TABLE public.roasts
  ADD COLUMN user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX idx_roasts_user_created ON public.roasts (user_id, created_at DESC);

-- Replace permissive policies with owner-scoped ones
DROP POLICY IF EXISTS "Anyone can read roasts" ON public.roasts;
DROP POLICY IF EXISTS "Anyone can insert roasts" ON public.roasts;
DROP POLICY IF EXISTS "Anyone can update roasts" ON public.roasts;
DROP POLICY IF EXISTS "Anyone can delete roasts" ON public.roasts;

CREATE POLICY "Users can view own roasts"
  ON public.roasts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own roasts"
  ON public.roasts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own roasts"
  ON public.roasts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own roasts"
  ON public.roasts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

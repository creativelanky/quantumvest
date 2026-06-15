-- ============================================================
-- QuantumVest — Supabase database schema
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. PROFILES
-- Auto-populated when a user registers (via trigger below).
CREATE TABLE IF NOT EXISTS public.profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name        TEXT DEFAULT '',
  email            TEXT DEFAULT '',
  country          TEXT DEFAULT '',
  plan             TEXT DEFAULT 'None',
  balance          NUMERIC(15, 2) DEFAULT 0,
  profit           NUMERIC(15, 2) DEFAULT 0,
  kyc_status       TEXT DEFAULT 'None'  CHECK (kyc_status IN ('None', 'Pending', 'Verified')),
  kyc_doc_type     TEXT,
  kyc_submitted_at TIMESTAMPTZ,
  is_suspended     BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- 2. TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.transactions (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK (type IN ('Deposit', 'Withdrawal')),
  amount     NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  method     TEXT NOT NULL,
  status     TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Rejected')),
  note       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- 2b. MESSAGES — admin ↔ user support chat
CREATE TABLE IF NOT EXISTS public.messages (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender     TEXT NOT NULL CHECK (sender IN ('admin', 'user')),
  content    TEXT NOT NULL,
  read       BOOLEAN DEFAULT FALSE,
  edited_at  TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- If the table already exists from an earlier version, add the edit column:
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS edited_at TIMESTAMPTZ;

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = user_id);


-- 3. TRIGGER: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- DONE. Your database is ready.
--
-- Next steps in Supabase Dashboard:
--   Authentication → Settings → disable "Confirm email" during dev
--   (re-enable before going live)
-- ============================================================

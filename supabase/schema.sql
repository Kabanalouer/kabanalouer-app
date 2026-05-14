-- ============================================
-- KABANALOUER — Script SQL Phase 1
-- Coller dans Supabase > SQL Editor > New query
-- ============================================

-- Table users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('host', 'traveler')),
  name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table listings
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  description TEXT,
  region TEXT,
  address TEXT,
  capacity INTEGER DEFAULT 2,
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  price_low NUMERIC(10,2),
  price_high NUMERIC(10,2),
  price_peak NUMERIC(10,2),
  amenities JSONB DEFAULT '[]',
  photos JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT FALSE,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table availability
CREATE TABLE IF NOT EXISTS public.availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  is_blocked BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(listing_id, date)
);

-- Table messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table favorites
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Politiques users
CREATE POLICY "Les utilisateurs voient leur propre profil" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs modifient leur propre profil" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Insertion lors de l'inscription" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Politiques listings (public en lecture, privé en écriture)
CREATE POLICY "Tout le monde voit les listings publiés" ON public.listings
  FOR SELECT USING (is_published = TRUE OR host_id = auth.uid());

CREATE POLICY "Les hôtes gèrent leurs listings" ON public.listings
  FOR ALL USING (host_id = auth.uid());

-- Politiques availability
CREATE POLICY "Tout le monde voit les disponibilités" ON public.availability
  FOR SELECT USING (TRUE);

CREATE POLICY "Les hôtes gèrent leurs disponibilités" ON public.availability
  FOR ALL USING (
    listing_id IN (SELECT id FROM public.listings WHERE host_id = auth.uid())
  );

-- Politiques messages
CREATE POLICY "Les utilisateurs voient leurs messages" ON public.messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Les utilisateurs envoient des messages" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Les destinataires marquent comme lu" ON public.messages
  FOR UPDATE USING (receiver_id = auth.uid());

-- Politiques reviews
CREATE POLICY "Tout le monde voit les avis" ON public.reviews
  FOR SELECT USING (TRUE);

CREATE POLICY "Les voyageurs laissent des avis" ON public.reviews
  FOR INSERT WITH CHECK (author_id = auth.uid());

-- Politiques favorites
CREATE POLICY "Les utilisateurs gèrent leurs favoris" ON public.favorites
  FOR ALL USING (user_id = auth.uid());

-- Politiques subscriptions
CREATE POLICY "Les utilisateurs voient leur abonnement" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- ============================================
-- FONCTION : créer le profil automatiquement
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'traveler')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Déclencher la fonction à chaque nouvel utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

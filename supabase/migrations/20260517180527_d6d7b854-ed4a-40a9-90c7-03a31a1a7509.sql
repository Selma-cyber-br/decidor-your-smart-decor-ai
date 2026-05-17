
-- Enums
CREATE TYPE public.app_role AS ENUM ('client', 'fournisseur', 'admin');
CREATE TYPE public.project_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ai_projects
CREATE TABLE public.ai_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_type TEXT NOT NULL,
  dimensions JSONB NOT NULL DEFAULT '{}'::jsonb,
  style TEXT NOT NULL,
  palette JSONB NOT NULL DEFAULT '[]'::jsonb,
  budget_dzd INTEGER,
  source_image_url TEXT,
  status public.project_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_projects_all_own" ON public.ai_projects FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- generated_designs
CREATE TABLE public.generated_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.ai_projects(id) ON DELETE CASCADE,
  variant_index INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  elements JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.generated_designs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "designs_select_own" ON public.generated_designs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.ai_projects p WHERE p.id = project_id AND p.user_id = auth.uid()));
CREATE POLICY "designs_insert_own" ON public.generated_designs FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.ai_projects p WHERE p.id = project_id AND p.user_id = auth.uid()));

-- Trigger: auto-create profile + client role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'client');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('room-photos', 'room-photos', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('generated-designs', 'generated-designs', false);

-- Storage policies: users access only their own folder (user_id as first path segment)
CREATE POLICY "room_photos_user_all" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'room-photos' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'room-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "generated_designs_user_select" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'generated-designs' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "generated_designs_user_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'generated-designs' AND auth.uid()::text = (storage.foldername(name))[1]);

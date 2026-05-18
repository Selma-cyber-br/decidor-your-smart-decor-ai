
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TYPE public.supplier_type AS ENUM ('fournisseur', 'artisan');
CREATE TYPE public.supplier_plan AS ENUM ('gratuit', 'premium');
CREATE TYPE public.supplier_payment AS ENUM ('baridimob', 'dhahabia', 'none');
CREATE TYPE public.supplier_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.supplier_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  type supplier_type NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  plan supplier_plan NOT NULL DEFAULT 'gratuit',
  payment_method supplier_payment NOT NULL DEFAULT 'none',
  payment_reference text,
  registre_commerce text NOT NULL,
  category text NOT NULL,
  artisan_type text,
  city text NOT NULL,
  product_photos jsonb NOT NULL DEFAULT '[]'::jsonb,
  work_samples jsonb NOT NULL DEFAULT '[]'::jsonb,
  status supplier_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.supplier_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "supplier_app_select_own" ON public.supplier_applications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "supplier_app_insert_own" ON public.supplier_applications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "supplier_app_update_own" ON public.supplier_applications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER supplier_app_updated
  BEFORE UPDATE ON public.supplier_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO storage.buckets (id, name, public) VALUES ('supplier-assets', 'supplier-assets', false)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "supplier_assets_select_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'supplier-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "supplier_assets_insert_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'supplier-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "supplier_assets_update_own" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'supplier-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "supplier_assets_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'supplier-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const photoSchema = z.object({
  // data URL base64
  data: z.string().min(20),
  name: z.string().min(1).max(120),
});

const submitInput = z.object({
  type: z.enum(["fournisseur", "artisan"]),
  first_name: z.string().min(1).max(80),
  last_name: z.string().min(1).max(80),
  phone: z.string().min(6).max(30),
  plan: z.enum(["gratuit", "premium"]),
  payment_method: z.enum(["baridimob", "dhahabia", "none"]),
  payment_reference: z.string().max(120).optional(),
  registre_commerce: z.string().min(3).max(60),
  category: z.string().min(1).max(60),
  artisan_type: z.string().max(80).optional(),
  city: z.string().min(1).max(80),
  product_photos: z.array(photoSchema).max(10),
  work_samples: z.array(photoSchema).max(10),
});

async function uploadPhotos(
  supabase: { storage: { from: (b: string) => { upload: (k: string, b: Buffer, o: { contentType: string; upsert: boolean }) => Promise<{ error: { message: string } | null }> } } },
  userId: string,
  prefix: string,
  photos: Array<{ data: string; name: string }>,
): Promise<string[]> {
  const keys: string[] = [];
  for (let i = 0; i < photos.length; i++) {
    const m = /^data:(image\/[a-z]+);base64,(.+)$/.exec(photos[i].data);
    if (!m) continue;
    const mime = m[1];
    const ext = mime.split("/")[1] ?? "jpg";
    const bytes = Buffer.from(m[2], "base64");
    const key = `${userId}/${prefix}-${Date.now()}-${i}.${ext}`;
    const up = await supabase.storage.from("supplier-assets").upload(key, bytes, {
      contentType: mime,
      upsert: false,
    });
    if (up.error) throw new Error(`Upload: ${up.error.message}`);
    keys.push(key);
  }
  return keys;
}

export const submitSupplierApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => submitInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const productKeys = await uploadPhotos(supabase, userId, "product", data.product_photos);
    const workKeys = await uploadPhotos(supabase, userId, "work", data.work_samples);

    const { data: row, error } = await supabase
      .from("supplier_applications")
      .upsert(
        {
          user_id: userId,
          type: data.type,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          plan: data.plan,
          payment_method: data.payment_method,
          payment_reference: data.payment_reference ?? null,
          registre_commerce: data.registre_commerce,
          category: data.category,
          artisan_type: data.artisan_type ?? null,
          city: data.city,
          product_photos: productKeys as never,
          work_samples: workKeys as never,
          status: "pending",
        },
        { onConflict: "user_id" },
      )
      .select("id")
      .single();

    if (error || !row) throw new Error(error?.message ?? "Erreur d'enregistrement");
    return { id: row.id };
  });

export const getMySupplierApplication = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("supplier_applications")
      .select("id, type, first_name, plan, status, created_at, category, city")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { application: data };
  });

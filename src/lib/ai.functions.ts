import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

// ============================================================
// generateDesigns — uploads source photo, calls Gemini 3 times,
// extracts decor element list, persists project + 3 designs.
// ============================================================

const generateInput = z.object({
  roomType: z.string().min(1),
  roomTypePromptEn: z.string().min(1),
  style: z.string().min(1),
  stylePromptEn: z.string().min(1),
  palette: z.object({
    slug: z.string(),
    name_fr: z.string(),
    colors: z.array(z.string()).min(2).max(8),
  }),
  dimensions: z.object({
    length: z.number().min(1).max(50),
    width: z.number().min(1).max(50),
    height: z.number().min(2).max(10),
  }),
  budget: z.number().min(0).max(100_000_000),
  // base64 data URL of the uploaded source image
  sourceImageBase64: z.string().min(20),
});

type DecorElement = {
  name_fr: string;
  category: string;
  estimated_price_dzd: number;
  description: string;
};

async function callGeminiImage(prompt: string, sourceImageBase64: string): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY missing");

  const res = await fetch(LOVABLE_AI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.1-flash-image-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: sourceImageBase64 } },
          ],
        },
      ],
      modalities: ["image", "text"],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("Rate limit IA — réessayez dans un instant.");
    if (res.status === 402) throw new Error("Crédits IA épuisés. Ajoutez des crédits dans Lovable.");
    throw new Error(`Erreur IA (${res.status}): ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  const imageUrl: string | undefined =
    data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!imageUrl) throw new Error("Aucune image reçue de l'IA.");
  return imageUrl;
}

async function extractElements(
  designImageBase64: string,
  style: string,
  palette: string,
  budget: number,
): Promise<DecorElement[]> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY missing");

  const budgetLine = budget > 0
    ? `Prix réalistes pour le marché algérien en DZD. Total des prix proche du budget: ${budget} DZD.`
    : `Prix réalistes pour le marché algérien en DZD (gamme moyenne/premium).`;
  const sys = `Tu es un designer d'intérieur algérien. Tu reçois une image de pièce décorée. Tu extrais la liste complète des éléments visibles (peinture, carrelage, mobilier, luminaires, textiles, accessoires). Réponds STRICTEMENT en JSON valide, format: {"elements":[{"name_fr":"...","category":"peinture|carrelage|mobilier|lustre|tapis|rideaux|parquet|cuisine|accessoire","estimated_price_dzd":12000,"description":"courte"}]}. ${budgetLine} Style: ${style}. Palette: ${palette}. Minimum 5 éléments, maximum 12.`;

  const res = await fetch(LOVABLE_AI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: sys },
        {
          role: "user",
          content: [
            { type: "text", text: "Liste tous les éléments du décor visibles." },
            { type: "image_url", image_url: { url: designImageBase64 } },
          ],
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) return [];
  const data = await res.json();
  try {
    const raw = data?.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.elements)) return parsed.elements;
  } catch {
    // best effort
  }
  return [];
}

function buildImagePrompt(p: {
  roomTypePromptEn: string;
  stylePromptEn: string;
  paletteHex: string[];
  dimensions: { length: number; width: number; height: number };
  budget: number;
  variantSeed: string;
}): string {
  const paletteStr = p.paletteHex.join(", ");
  return `Photorealistic interior design of a ${p.roomTypePromptEn}.
CRITICAL — STRUCTURAL PRESERVATION:
- Keep EXACT positions of walls, windows, doors, ceiling height as in the source photo.
- Keep the same camera perspective and viewpoint.
- Window placement, door placement, structural beams: UNCHANGED.
- Real-world proportions: room is ${p.dimensions.length}m long × ${p.dimensions.width}m wide × ${p.dimensions.height}m high. All furniture must scale correctly.

DESIGN BRIEF:
- Style: ${p.stylePromptEn}.
- Color palette (use these exact tones): ${paletteStr}.
- Budget tier: ~${p.budget.toLocaleString("fr-DZ")} DZD — choose materials/furniture matching this Algerian market budget.
- Variant direction: ${p.variantSeed}.

OUTPUT: a single hyper-realistic photographic render of the redesigned room, 4K quality, professional interior photography lighting, sharp focus, natural materials and textures. No text, no labels, no watermarks.`;
}

export const generateDesigns = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => generateInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // 1. Upload source image to storage
    const m = /^data:(image\/[a-z]+);base64,(.+)$/.exec(data.sourceImageBase64);
    if (!m) throw new Error("Image source invalide (format attendu: data URL base64).");
    const mime = m[1];
    const ext = mime.split("/")[1] ?? "jpg";
    const sourceBytes = Buffer.from(m[2], "base64");
    const sourceKey = `${userId}/${Date.now()}-source.${ext}`;
    const upSrc = await supabase.storage
      .from("room-photos")
      .upload(sourceKey, sourceBytes, { contentType: mime, upsert: false });
    if (upSrc.error) throw new Error(`Upload photo: ${upSrc.error.message}`);

    // 2. Create project row
    const projIns = await supabase
      .from("ai_projects")
      .insert({
        user_id: userId,
        room_type: data.roomType,
        style: data.style,
        palette: data.palette as never,
        dimensions: data.dimensions as never,
        budget_dzd: data.budget,
        source_image_url: sourceKey,
        status: "processing",
      })
      .select("id")
      .single();
    if (projIns.error || !projIns.data) throw new Error(`DB: ${projIns.error?.message}`);
    const projectId = projIns.data.id;

    // 3. Generate 3 variants in parallel
    const variantSeeds = [
      "warm cozy interpretation, soft natural lighting, inviting atmosphere",
      "bold dramatic interpretation, statement pieces, strong contrasts",
      "refined elegant interpretation, balanced symmetry, sophisticated details",
    ];

    const designs = await Promise.all(
      variantSeeds.map(async (seed, i) => {
        const prompt = buildImagePrompt({
          roomTypePromptEn: data.roomTypePromptEn,
          stylePromptEn: data.stylePromptEn,
          paletteHex: data.palette.colors,
          dimensions: data.dimensions,
          budget: data.budget,
          variantSeed: seed,
        });

        const generatedDataUrl = await callGeminiImage(prompt, data.sourceImageBase64);

        // Upload generated image
        const gm = /^data:(image\/[a-z]+);base64,(.+)$/.exec(generatedDataUrl);
        let imageKey = "";
        if (gm) {
          const gMime = gm[1];
          const gExt = gMime.split("/")[1] ?? "png";
          const gBytes = Buffer.from(gm[2], "base64");
          imageKey = `${userId}/${projectId}-v${i + 1}.${gExt}`;
          const upG = await supabase.storage
            .from("generated-designs")
            .upload(imageKey, gBytes, { contentType: gMime, upsert: true });
          if (upG.error) throw new Error(`Upload design: ${upG.error.message}`);
        }

        // Extract elements (best effort)
        const elements = await extractElements(
          generatedDataUrl,
          data.stylePromptEn,
          data.palette.name_fr,
          data.budget,
        );

        const insD = await supabase
          .from("generated_designs")
          .insert({
            project_id: projectId,
            variant_index: i + 1,
            image_url: imageKey,
            elements: elements as never,
          })
          .select("id")
          .single();
        if (insD.error) throw new Error(`DB design: ${insD.error.message}`);

        return { variantIndex: i + 1, imageKey, elements };
      }),
    );

    await supabase.from("ai_projects").update({ status: "completed" }).eq("id", projectId);

    return { projectId, designs };
  });

// ============================================================
// getMyProjects — list user's projects with signed thumbnails
// ============================================================
export const getMyProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("ai_projects")
      .select("id, room_type, style, budget_dzd, status, created_at, generated_designs(id, variant_index, image_url)")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);

    const projects = await Promise.all(
      (data ?? []).map(async (p) => {
        const firstKey = p.generated_designs?.[0]?.image_url;
        let thumb: string | null = null;
        if (firstKey) {
          const signed = await supabase.storage
            .from("generated-designs")
            .createSignedUrl(firstKey, 60 * 60 * 24 * 7);
          thumb = signed.data?.signedUrl ?? null;
        }
        return {
          id: p.id,
          room_type: p.room_type,
          style: p.style,
          budget_dzd: p.budget_dzd,
          status: p.status,
          created_at: p.created_at,
          thumbnail: thumb,
        };
      }),
    );
    return { projects };
  });

// ============================================================
// getProjectDetail — full project with all designs + signed URLs
// ============================================================
export const getProjectDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: proj, error } = await supabase
      .from("ai_projects")
      .select("id, room_type, style, palette, dimensions, budget_dzd, source_image_url, status, created_at, generated_designs(id, variant_index, image_url, elements)")
      .eq("id", data.id)
      .single();
    if (error || !proj) throw new Error(error?.message ?? "Projet introuvable");

    const designs = await Promise.all(
      (proj.generated_designs ?? [])
        .sort((a, b) => a.variant_index - b.variant_index)
        .map(async (d) => {
          const signed = await supabase.storage
            .from("generated-designs")
            .createSignedUrl(d.image_url, 60 * 60 * 24 * 7);
          return {
            id: d.id,
            variant_index: d.variant_index,
            image_url: signed.data?.signedUrl ?? "",
            elements: d.elements as unknown as DecorElement[],
          };
        }),
    );

    return {
      id: proj.id,
      room_type: proj.room_type,
      style: proj.style,
      palette: proj.palette,
      dimensions: proj.dimensions,
      budget_dzd: proj.budget_dzd,
      status: proj.status,
      created_at: proj.created_at,
      designs,
    };
  });

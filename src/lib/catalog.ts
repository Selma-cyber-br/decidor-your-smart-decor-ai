import peinture from "@/assets/cat-peinture.jpg";
import carrelage from "@/assets/cat-carrelage.jpg";
import mobilier from "@/assets/cat-mobilier.jpg";
import lustre from "@/assets/cat-lustre.jpg";
import tapis from "@/assets/cat-tapis.jpg";
import cuisine from "@/assets/cat-cuisine.jpg";
import parquet from "@/assets/cat-parquet.jpg";
import rideaux from "@/assets/cat-rideaux.jpg";

import pPeinture2 from "@/assets/p-peinture-2.jpg";
import pPeinture3 from "@/assets/p-peinture-3.jpg";
import pCarrelage2 from "@/assets/p-carrelage-2.jpg";
import pCarrelage3 from "@/assets/p-carrelage-3.jpg";
import pMobilier2 from "@/assets/p-mobilier-2.jpg";
import pMobilier3 from "@/assets/p-mobilier-3.jpg";
import pLustre2 from "@/assets/p-lustre-2.jpg";
import pLustre3 from "@/assets/p-lustre-3.jpg";
import pTapis2 from "@/assets/p-tapis-2.jpg";
import pTapis3 from "@/assets/p-tapis-3.jpg";
import pCuisine2 from "@/assets/p-cuisine-2.jpg";
import pCuisine3 from "@/assets/p-cuisine-3.jpg";
import pParquet2 from "@/assets/p-parquet-2.jpg";
import pParquet3 from "@/assets/p-parquet-3.jpg";
import pRideaux2 from "@/assets/p-rideaux-2.jpg";
import pRideaux3 from "@/assets/p-rideaux-3.jpg";

export type Category = {
  slug: string;
  name_fr: string;
  name_ar: string;
  image: string;
};

export type ProductVariant = {
  id: string;
  name_fr: string;
  name_ar: string;
  price: number;
  image: string;
};

export type Product = {
  id: string;
  slug: string;
  category: string;
  name_fr: string;
  name_ar: string;
  description_fr: string;
  description_ar: string;
  price: number;
  image: string;
  images: string[];
  dimensions?: string;
  stock: number;
  delivery_fr: string;
  delivery_ar: string;
  variants: ProductVariant[];
};

export const categories: Category[] = [
  { slug: "peinture", name_fr: "Peinture murale", name_ar: "طلاء الجدران", image: peinture },
  { slug: "carrelage", name_fr: "Carrelage & Faïence", name_ar: "البلاط والسيراميك", image: carrelage },
  { slug: "mobilier", name_fr: "Mobilier", name_ar: "الأثاث", image: mobilier },
  { slug: "lustre", name_fr: "Lustres & Éclairage", name_ar: "الثريات والإضاءة", image: lustre },
  { slug: "tapis", name_fr: "Tapis", name_ar: "السجاد", image: tapis },
  { slug: "cuisine", name_fr: "Cuisine équipée", name_ar: "المطبخ المجهز", image: cuisine },
  { slug: "parquet", name_fr: "Parquet & Sol", name_ar: "الباركيه والأرضيات", image: parquet },
  { slug: "rideaux", name_fr: "Rideaux", name_ar: "الستائر", image: rideaux },
];

const mk = (
  id: string,
  slug: string,
  category: string,
  name_fr: string,
  name_ar: string,
  description_fr: string,
  description_ar: string,
  price: number,
  image: string,
  dimensions: string,
  stock: number,
  variants: ProductVariant[],
): Product => ({
  id, slug, category, name_fr, name_ar, description_fr, description_ar,
  price, image, images: [image], dimensions, stock,
  delivery_fr: "Livraison Algérie · 4-10 jours",
  delivery_ar: "التوصيل إلى الجزائر · ٤-١٠ أيام",
  variants,
});

export const products: Product[] = [
  // === PEINTURE ===
  mk("p-pe-1", "peinture-mauve-velours", "peinture",
    "Peinture Mauve Velours", "طلاء الموف المخملي",
    "Peinture mate haut de gamme, finition velours. Couvre 12m² par pot. Sans odeur, séchage rapide.",
    "طلاء غير لامع فاخر بلمسة مخملية. يغطي ١٢ م² لكل علبة. بدون رائحة، يجف بسرعة.",
    4800, peinture, "Pot 2.5L · 12m²/pot", 42, [
      { id: "p-pe-1-v1", name_fr: "Mauve profond", name_ar: "موف عميق", price: 4800, image: peinture },
      { id: "p-pe-1-v2", name_fr: "Lavande douce", name_ar: "خزامى ناعم", price: 4800, image: peinture },
      { id: "p-pe-1-v3", name_fr: "Ivoire", name_ar: "عاجي", price: 4500, image: peinture },
    ]),
  mk("p-pe-2", "peinture-bleu-nuit", "peinture",
    "Peinture Bleu Nuit Mat", "طلاء أزرق ليلي مطفي",
    "Bleu profond intemporel pour pièces premium. Lessivable. Garantie 10 ans.",
    "أزرق عميق خالد للغرف الفاخرة. قابل للغسل. ضمان ١٠ سنوات.",
    5200, pPeinture2, "Pot 2.5L · 12m²/pot", 28, [
      { id: "p-pe-2-v1", name_fr: "Bleu nuit", name_ar: "أزرق ليلي", price: 5200, image: pPeinture2 },
      { id: "p-pe-2-v2", name_fr: "Bleu canard", name_ar: "أزرق بطي", price: 5200, image: pPeinture2 },
    ]),
  mk("p-pe-3", "peinture-terracotta", "peinture",
    "Peinture Terracotta Méditerranéen", "طلاء تيراكوتا متوسطي",
    "Teinte chaude inspirée de la Méditerranée. Idéale salon et chambre. Pigments naturels.",
    "لون دافئ مستوحى من المتوسط. مثالي للصالون والغرف. أصباغ طبيعية.",
    5000, pPeinture3, "Pot 2.5L · 12m²/pot", 35, [
      { id: "p-pe-3-v1", name_fr: "Terracotta", name_ar: "تيراكوتا", price: 5000, image: pPeinture3 },
      { id: "p-pe-3-v2", name_fr: "Sable doré", name_ar: "رملي ذهبي", price: 4900, image: pPeinture3 },
    ]),

  // === CARRELAGE ===
  mk("p-ca-1", "carrelage-marbre-blanc", "carrelage",
    "Carrelage Marbre Blanc 60×60", "بلاط رخامي أبيض ٦٠×٦٠",
    "Grès cérame imitation marbre, finition polie. Idéal salon, salle de bain.",
    "بلاط بورسلين بمظهر الرخام، لمسة مصقولة. مثالي للصالون والحمام.",
    3200, carrelage, "60×60 cm · 1.44m²/boîte", 320, [
      { id: "p-ca-1-v1", name_fr: "Blanc Carrara", name_ar: "كرارا أبيض", price: 3200, image: carrelage },
      { id: "p-ca-1-v2", name_fr: "Beige Travertin", name_ar: "ترافرتين بيج", price: 3400, image: carrelage },
      { id: "p-ca-1-v3", name_fr: "Noir Marquina", name_ar: "أسود ماركينا", price: 3800, image: carrelage },
    ]),
  mk("p-ca-2", "zellige-emeraude", "carrelage",
    "Zellige Émeraude 10×10", "زليج أخضر زمردي ١٠×١٠",
    "Zellige marocain artisanal, vert émeraude. Pour cuisine, hammam, salle de bain.",
    "زليج مغربي حرفي، أخضر زمردي. للمطبخ والحمام.",
    6800, pCarrelage2, "10×10 cm · 1m²/boîte", 95, [
      { id: "p-ca-2-v1", name_fr: "Émeraude", name_ar: "زمردي", price: 6800, image: pCarrelage2 },
      { id: "p-ca-2-v2", name_fr: "Bleu Majorelle", name_ar: "أزرق ماجوريل", price: 6800, image: pCarrelage2 },
      { id: "p-ca-2-v3", name_fr: "Blanc cassé", name_ar: "أبيض مكسور", price: 6500, image: pCarrelage2 },
    ]),
  mk("p-ca-3", "terrazzo-hexagonal-or", "carrelage",
    "Terrazzo Hexagonal Or", "تيرازو سداسي ذهبي",
    "Carreaux hexagonaux terrazzo, paillettes or sur fond crème. Élégance moderne.",
    "بلاط سداسي تيرازو، رقائق ذهبية على خلفية كريمية. أناقة عصرية.",
    5400, pCarrelage3, "Hexagone 20cm · 1m²/boîte", 60, [
      { id: "p-ca-3-v1", name_fr: "Crème & Or", name_ar: "كريمي وذهبي", price: 5400, image: pCarrelage3 },
      { id: "p-ca-3-v2", name_fr: "Ivoire & Cuivre", name_ar: "عاجي ونحاسي", price: 5400, image: pCarrelage3 },
    ]),

  // === MOBILIER ===
  mk("p-mo-1", "canape-velours-courbe", "mobilier",
    "Canapé Velours Courbé", "أريكة مخملية منحنية",
    "Canapé 3 places en velours premium, structure bois massif. Confort enveloppant.",
    "أريكة ٣ مقاعد من المخمل الفاخر، هيكل خشبي صلب.",
    285000, mobilier, "220 × 95 × 85 cm", 6, [
      { id: "p-mo-1-v1", name_fr: "Mauve profond", name_ar: "موف عميق", price: 285000, image: mobilier },
      { id: "p-mo-1-v2", name_fr: "Ivoire", name_ar: "عاجي", price: 295000, image: mobilier },
      { id: "p-mo-1-v3", name_fr: "Anthracite", name_ar: "فحمي", price: 285000, image: mobilier },
    ]),
  mk("p-mo-2", "table-noyer-arabesque", "mobilier",
    "Table à manger Noyer Arabesque", "طاولة طعام جوز عربية",
    "Table 8 personnes en noyer massif, incrustations laiton, inspiration arabo-islamique.",
    "طاولة ٨ أشخاص من خشب الجوز الصلب، تطعيمات نحاسية، مستوحاة من الفن العربي الإسلامي.",
    340000, pMobilier2, "240 × 110 × 75 cm", 4, [
      { id: "p-mo-2-v1", name_fr: "Noyer naturel", name_ar: "جوز طبيعي", price: 340000, image: pMobilier2 },
      { id: "p-mo-2-v2", name_fr: "Noyer foncé", name_ar: "جوز غامق", price: 355000, image: pMobilier2 },
    ]),
  mk("p-mo-3", "fauteuil-boucle-chene", "mobilier",
    "Fauteuil Bouclé Chêne", "كرسي بوكليه بلوط",
    "Fauteuil scandinave, tissu bouclé beige, pieds chêne clair. Confort premium.",
    "كرسي إسكندنافي، نسيج بوكليه بيج، أرجل بلوط فاتح. راحة فاخرة.",
    78000, pMobilier3, "75 × 80 × 78 cm", 18, [
      { id: "p-mo-3-v1", name_fr: "Beige bouclé", name_ar: "بيج بوكليه", price: 78000, image: pMobilier3 },
      { id: "p-mo-3-v2", name_fr: "Ivoire bouclé", name_ar: "عاجي بوكليه", price: 78000, image: pMobilier3 },
      { id: "p-mo-3-v3", name_fr: "Sauge bouclé", name_ar: "ميرمية بوكليه", price: 82000, image: pMobilier3 },
    ]),

  // === LUSTRE ===
  mk("p-lu-1", "lustre-cristal-imperial", "lustre",
    "Lustre Cristal Impérial", "ثريا كريستالية إمبراطورية",
    "Lustre 12 lumières en cristal taillé, finition or champagne.",
    "ثريا ١٢ ضوء من الكريستال المقطوع، لمسة ذهب شامبانيا.",
    145000, lustre, "Ø 80 × H 100 cm · 12 ampoules", 8, [
      { id: "p-lu-1-v1", name_fr: "Or Champagne", name_ar: "ذهب شامبانيا", price: 145000, image: lustre },
      { id: "p-lu-1-v2", name_fr: "Argent", name_ar: "فضي", price: 138000, image: lustre },
    ]),
  mk("p-lu-2", "suspension-laiton-dome", "lustre",
    "Suspension Laiton Dôme", "تعليقة قبة نحاسية",
    "Suspension minimaliste laiton brossé, design moderne. Idéale îlot de cuisine.",
    "تعليقة بسيطة من النحاس المصقول، تصميم عصري. مثالية لجزيرة المطبخ.",
    14500, pLustre2, "Ø 30 × H 25 cm · 1 ampoule E27", 32, [
      { id: "p-lu-2-v1", name_fr: "Laiton brossé", name_ar: "نحاس مصقول", price: 14500, image: pLustre2 },
      { id: "p-lu-2-v2", name_fr: "Noir mat", name_ar: "أسود مطفي", price: 13800, image: pLustre2 },
    ]),
  mk("p-lu-3", "lanterne-marocaine-laiton", "lustre",
    "Lanterne Marocaine Laiton", "فانوس مغربي نحاسي",
    "Lanterne ajourée en laiton, motifs géométriques arabesque. Lumière chaude tamisée.",
    "فانوس مفرغ من النحاس، نقوش هندسية أرابيسك. ضوء دافئ خافت.",
    22000, pLustre3, "Ø 25 × H 60 cm · 1 ampoule", 24, [
      { id: "p-lu-3-v1", name_fr: "Laiton doré", name_ar: "نحاسي ذهبي", price: 22000, image: pLustre3 },
      { id: "p-lu-3-v2", name_fr: "Cuivre antique", name_ar: "نحاس عتيق", price: 23500, image: pLustre3 },
      { id: "p-lu-3-v3", name_fr: "Argent oxydé", name_ar: "فضي مؤكسد", price: 22500, image: pLustre3 },
    ]),

  // === TAPIS ===
  mk("p-ta-1", "tapis-berbere-laine", "tapis",
    "Tapis Berbère Laine 200×290", "سجاد بربري صوف",
    "Tapis tissé main en pure laine, motifs traditionnels. Artisanat algérien.",
    "سجاد منسوج يدوياً من الصوف النقي، نقوش تقليدية. حرفية جزائرية.",
    58000, tapis, "200 × 290 cm", 14, [
      { id: "p-ta-1-v1", name_fr: "Mauve & Champagne", name_ar: "موف وشامبانيا", price: 58000, image: tapis },
      { id: "p-ta-1-v2", name_fr: "Ivoire & Or", name_ar: "عاجي وذهب", price: 62000, image: tapis },
      { id: "p-ta-1-v3", name_fr: "Terracotta", name_ar: "تيراكوتا", price: 56000, image: tapis },
    ]),
  mk("p-ta-2", "tapis-geometrique-terracotta", "tapis",
    "Tapis Géométrique Terracotta Ø160", "سجاد هندسي تيراكوتا",
    "Tapis rond moderne, motifs géométriques. Polyester doux, facile d'entretien.",
    "سجاد دائري عصري، نقوش هندسية. بوليستر ناعم، سهل العناية.",
    19500, pTapis2, "Ø 160 cm", 28, [
      { id: "p-ta-2-v1", name_fr: "Terracotta & crème", name_ar: "تيراكوتا وكريمي", price: 19500, image: pTapis2 },
      { id: "p-ta-2-v2", name_fr: "Mauve & ivoire", name_ar: "موف وعاجي", price: 19500, image: pTapis2 },
    ]),
  mk("p-ta-3", "tapis-persan-medaillon", "tapis",
    "Tapis Persan Médaillon Royal", "سجاد فارسي ميدالية ملكية",
    "Tapis bordeaux et or, médaillon central, style oriental classique. Pour grand salon.",
    "سجاد بوردو وذهبي، ميدالية مركزية، طراز شرقي كلاسيكي.",
    125000, pTapis3, "250 × 350 cm", 6, [
      { id: "p-ta-3-v1", name_fr: "Bordeaux & Or", name_ar: "بوردو وذهبي", price: 125000, image: pTapis3 },
      { id: "p-ta-3-v2", name_fr: "Bleu nuit & Or", name_ar: "أزرق ليلي وذهبي", price: 130000, image: pTapis3 },
    ]),

  // === CUISINE ===
  mk("p-cu-1", "cuisine-elegance-3m", "cuisine",
    "Cuisine Équipée Élégance 3m", "مطبخ مجهز إليجانس ٣م",
    "Façade laquée ivoire, poignées or champagne, plan de travail quartz. Installation incluse.",
    "واجهة عاجية لامعة، مقابض ذهب شامبانيا، سطح كوارتز. التركيب مشمول.",
    420000, cuisine, "3m linéaire · Installation incluse", 4, [
      { id: "p-cu-1-v1", name_fr: "Ivoire / Or", name_ar: "عاجي / ذهب", price: 420000, image: cuisine },
      { id: "p-cu-1-v2", name_fr: "Anthracite / Or", name_ar: "فحمي / ذهب", price: 445000, image: cuisine },
    ]),
  mk("p-cu-2", "cuisine-noir-mat-laiton", "cuisine",
    "Cuisine Noir Mat Laiton 3.5m", "مطبخ أسود مطفي نحاسي",
    "Cuisine moderne façades noir mat, poignées laiton, plan quartz blanc. Pose pro incluse.",
    "مطبخ عصري واجهات سوداء مطفية، مقابض نحاسية، سطح كوارتز أبيض.",
    495000, pCuisine2, "3.5m linéaire · Pose incluse", 3, [
      { id: "p-cu-2-v1", name_fr: "Noir mat / Laiton", name_ar: "أسود مطفي / نحاسي", price: 495000, image: pCuisine2 },
    ]),
  mk("p-cu-3", "cuisine-mediterraneenne-creme", "cuisine",
    "Cuisine Méditerranéenne Crème", "مطبخ متوسطي كريمي",
    "Cuisine classique façades crème moulurées, crédence zellige terracotta. Authentique.",
    "مطبخ كلاسيكي واجهات كريمية مزخرفة، خلفية زليج تيراكوتا. أصيل.",
    465000, pCuisine3, "3m linéaire · Pose incluse", 4, [
      { id: "p-cu-3-v1", name_fr: "Crème / Terracotta", name_ar: "كريمي / تيراكوتا", price: 465000, image: pCuisine3 },
      { id: "p-cu-3-v2", name_fr: "Ivoire / Vert sauge", name_ar: "عاجي / أخضر ميرمية", price: 475000, image: pCuisine3 },
    ]),

  // === PARQUET ===
  mk("p-pa-1", "parquet-chevron-chene", "parquet",
    "Parquet Chêne Chevron", "باركيه بلوط شيفرون",
    "Parquet massif chêne français, pose chevron. Finition huilée. Garantie 25 ans.",
    "باركيه بلوط فرنسي صلب، تركيب شيفرون. لمسة زيتية. ضمان ٢٥ سنة.",
    7800, parquet, "Lame 90×600 mm · 1m²/boîte", 180, [
      { id: "p-pa-1-v1", name_fr: "Chêne naturel", name_ar: "بلوط طبيعي", price: 7800, image: parquet },
      { id: "p-pa-1-v2", name_fr: "Chêne fumé", name_ar: "بلوط مدخن", price: 8400, image: parquet },
    ]),
  mk("p-pa-2", "parquet-noyer-large", "parquet",
    "Parquet Noyer Large Lame", "باركيه جوز عريض",
    "Parquet contrecollé noyer, lame large 200mm. Aspect chaleureux, finition mate.",
    "باركيه نصف صلب من الجوز، شرائح عريضة. مظهر دافئ.",
    6500, pParquet2, "Lame 200×1200 mm · 2.16m²/boîte", 240, [
      { id: "p-pa-2-v1", name_fr: "Noyer doré", name_ar: "جوز ذهبي", price: 6500, image: pParquet2 },
      { id: "p-pa-2-v2", name_fr: "Noyer fumé", name_ar: "جوز مدخن", price: 6800, image: pParquet2 },
    ]),
  mk("p-pa-3", "lvt-marbre-blanc", "parquet",
    "LVT Marbre Blanc Premium", "أرضية فينيل رخامية بيضاء",
    "Sol vinyle clipsable aspect marbre, ultra résistant. Idéal pièces humides.",
    "أرضية فينيل قابلة للتركيب بمظهر الرخام، شديدة المقاومة.",
    4200, pParquet3, "Lame 300×600 mm · 2.7m²/boîte", 320, [
      { id: "p-pa-3-v1", name_fr: "Marbre blanc", name_ar: "رخام أبيض", price: 4200, image: pParquet3 },
      { id: "p-pa-3-v2", name_fr: "Marbre gris", name_ar: "رخام رمادي", price: 4200, image: pParquet3 },
    ]),

  // === RIDEAUX ===
  mk("p-ri-1", "rideaux-velours-champagne", "rideaux",
    "Rideaux Velours Champagne", "ستائر مخملية شامبانيا",
    "Paire de rideaux occultants en velours, doublure thermique. Sur mesure disponible.",
    "زوج من الستائر المعتمة المخملية، بطانة حرارية.",
    18500, rideaux, "140 × 260 cm (paire)", 22, [
      { id: "p-ri-1-v1", name_fr: "Champagne", name_ar: "شامبانيا", price: 18500, image: rideaux },
      { id: "p-ri-1-v2", name_fr: "Mauve profond", name_ar: "موف عميق", price: 18500, image: rideaux },
      { id: "p-ri-1-v3", name_fr: "Anthracite", name_ar: "فحمي", price: 18900, image: rideaux },
    ]),
  mk("p-ri-2", "voilage-lin-ivoire", "rideaux",
    "Voilage Lin Ivoire", "ستارة شفافة كتانية عاجية",
    "Voilage léger en lin naturel, laisse passer la lumière douce. Lavable machine.",
    "ستارة خفيفة من الكتان الطبيعي، تسمح بمرور الضوء الناعم.",
    8900, pRideaux2, "140 × 260 cm (paire)", 40, [
      { id: "p-ri-2-v1", name_fr: "Ivoire", name_ar: "عاجي", price: 8900, image: pRideaux2 },
      { id: "p-ri-2-v2", name_fr: "Beige doré", name_ar: "بيج ذهبي", price: 8900, image: pRideaux2 },
    ]),
  mk("p-ri-3", "rideaux-brodes-oriental", "rideaux",
    "Rideaux Brodés Oriental Bordeaux", "ستائر مطرزة شرقية بوردو",
    "Rideaux somptueux brodés or sur fond bordeaux. Style royal et oriental.",
    "ستائر فاخرة مطرزة بالذهب على خلفية بوردو. طراز ملكي شرقي.",
    32000, pRideaux3, "150 × 280 cm (paire)", 12, [
      { id: "p-ri-3-v1", name_fr: "Bordeaux / Or", name_ar: "بوردو / ذهبي", price: 32000, image: pRideaux3 },
      { id: "p-ri-3-v2", name_fr: "Bleu nuit / Or", name_ar: "أزرق ليلي / ذهبي", price: 33000, image: pRideaux3 },
    ]),
];

export const formatDZD = (n: number, lang: "fr" | "ar") => {
  const s = new Intl.NumberFormat(lang === "ar" ? "ar-DZ" : "fr-DZ").format(n);
  return `${s} ${lang === "ar" ? "د.ج" : "DZD"}`;
};

import peinture from "@/assets/cat-peinture.jpg";
import carrelage from "@/assets/cat-carrelage.jpg";
import mobilier from "@/assets/cat-mobilier.jpg";
import lustre from "@/assets/cat-lustre.jpg";
import tapis from "@/assets/cat-tapis.jpg";
import cuisine from "@/assets/cat-cuisine.jpg";
import parquet from "@/assets/cat-parquet.jpg";
import rideaux from "@/assets/cat-rideaux.jpg";

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

export const products: Product[] = [
  {
    id: "p1", slug: "peinture-mauve-velours", category: "peinture",
    name_fr: "Peinture Mauve Velours", name_ar: "طلاء الموف المخملي",
    description_fr: "Peinture mate haut de gamme, finition velours. Couvre 12m² par pot. Sans odeur, séchage rapide.",
    description_ar: "طلاء غير لامع فاخر بلمسة مخملية. يغطي ١٢ م² لكل علبة. بدون رائحة، يجف بسرعة.",
    price: 4800, image: peinture, images: [peinture],
    dimensions: "Pot 2.5L · 12m²/pot",
    stock: 42, delivery_fr: "Livraison 48h · Alger", delivery_ar: "التسليم خلال ٤٨ ساعة · الجزائر",
    variants: [
      { id: "p1v1", name_fr: "Mauve profond", name_ar: "موف عميق", price: 4800, image: peinture },
      { id: "p1v2", name_fr: "Lavande douce", name_ar: "خزامى ناعم", price: 4800, image: peinture },
      { id: "p1v3", name_fr: "Ivoire", name_ar: "عاجي", price: 4500, image: peinture },
      { id: "p1v4", name_fr: "Champagne", name_ar: "شامبانيا", price: 5200, image: peinture },
      { id: "p1v5", name_fr: "Anthracite", name_ar: "فحمي", price: 5000, image: peinture },
    ],
  },
  {
    id: "p2", slug: "carrelage-marbre-blanc", category: "carrelage",
    name_fr: "Carrelage Marbre Blanc 60×60", name_ar: "بلاط رخامي أبيض ٦٠×٦٠",
    description_fr: "Grès cérame imitation marbre, finition polie. Idéal salon, salle de bain. Résistant et facile d'entretien.",
    description_ar: "بلاط بورسلين بمظهر الرخام، لمسة مصقولة. مثالي للصالون والحمام. مقاوم وسهل العناية.",
    price: 3200, image: carrelage, images: [carrelage],
    dimensions: "60×60 cm · 1.44m²/boîte (4 pièces)",
    stock: 320, delivery_fr: "Livraison 5-7 jours", delivery_ar: "التسليم ٥-٧ أيام",
    variants: [
      { id: "p2v1", name_fr: "Blanc Carrara", name_ar: "كرارا أبيض", price: 3200, image: carrelage },
      { id: "p2v2", name_fr: "Beige Travertin", name_ar: "ترافرتين بيج", price: 3400, image: carrelage },
      { id: "p2v3", name_fr: "Gris Perle", name_ar: "رمادي لؤلؤي", price: 3300, image: carrelage },
      { id: "p2v4", name_fr: "Noir Marquina", name_ar: "أسود ماركينا", price: 3800, image: carrelage },
    ],
  },
  {
    id: "p3", slug: "canape-velours-mauve", category: "mobilier",
    name_fr: "Canapé Velours Courbé", name_ar: "أريكة مخملية منحنية",
    description_fr: "Canapé 3 places en velours premium, structure bois massif. Confort enveloppant, design intemporel.",
    description_ar: "أريكة ٣ مقاعد من المخمل الفاخر، هيكل خشبي صلب. راحة محيطة، تصميم خالد.",
    price: 285000, image: mobilier, images: [mobilier],
    dimensions: "220 × 95 × 85 cm",
    stock: 6, delivery_fr: "Livraison 10-15 jours · Toute wilaya", delivery_ar: "التسليم ١٠-١٥ يوم · جميع الولايات",
    variants: [
      { id: "p3v1", name_fr: "Bordeaux", name_ar: "بوردو", price: 285000, image: mobilier },
      { id: "p3v2", name_fr: "Mauve profond", name_ar: "موف عميق", price: 285000, image: mobilier },
      { id: "p3v3", name_fr: "Ivoire", name_ar: "عاجي", price: 295000, image: mobilier },
      { id: "p3v4", name_fr: "Anthracite", name_ar: "فحمي", price: 285000, image: mobilier },
      { id: "p3v5", name_fr: "Champagne", name_ar: "شامبانيا", price: 310000, image: mobilier },
    ],
  },
  {
    id: "p4", slug: "lustre-cristal-imperial", category: "lustre",
    name_fr: "Lustre Cristal Impérial", name_ar: "ثريا كريستالية إمبراطورية",
    description_fr: "Lustre 12 lumières en cristal taillé, finition or champagne. Pour salon, salle à manger, hall d'entrée.",
    description_ar: "ثريا ١٢ ضوء من الكريستال المقطوع، لمسة ذهب شامبانيا. للصالون وغرفة الطعام والمدخل.",
    price: 145000, image: lustre, images: [lustre],
    dimensions: "Ø 80 × H 100 cm · 12 ampoules E14",
    stock: 8, delivery_fr: "Livraison 7-10 jours", delivery_ar: "التسليم ٧-١٠ أيام",
    variants: [
      { id: "p4v1", name_fr: "Or Champagne", name_ar: "ذهب شامبانيا", price: 145000, image: lustre },
      { id: "p4v2", name_fr: "Or rose", name_ar: "ذهب وردي", price: 152000, image: lustre },
      { id: "p4v3", name_fr: "Argent", name_ar: "فضي", price: 138000, image: lustre },
    ],
  },
  {
    id: "p5", slug: "tapis-berbere-laine", category: "tapis",
    name_fr: "Tapis Berbère Laine 200×290", name_ar: "سجاد بربري صوف ٢٠٠×٢٩٠",
    description_fr: "Tapis tissé main en pure laine, motifs traditionnels. Pièce unique, artisanat algérien.",
    description_ar: "سجاد منسوج يدوياً من الصوف النقي، نقوش تقليدية. قطعة فريدة، حرفية جزائرية.",
    price: 58000, image: tapis, images: [tapis],
    dimensions: "200 × 290 cm",
    stock: 14, delivery_fr: "Livraison 3-5 jours", delivery_ar: "التسليم ٣-٥ أيام",
    variants: [
      { id: "p5v1", name_fr: "Mauve & Champagne", name_ar: "موف وشامبانيا", price: 58000, image: tapis },
      { id: "p5v2", name_fr: "Ivoire & Or", name_ar: "عاجي وذهب", price: 62000, image: tapis },
      { id: "p5v3", name_fr: "Anthracite", name_ar: "فحمي", price: 55000, image: tapis },
      { id: "p5v4", name_fr: "Terracotta", name_ar: "تيراكوتا", price: 56000, image: tapis },
      { id: "p5v5", name_fr: "Bleu nuit", name_ar: "أزرق ليلي", price: 60000, image: tapis },
    ],
  },
  {
    id: "p6", slug: "cuisine-equipee-elegance", category: "cuisine",
    name_fr: "Cuisine Équipée Élégance 3m", name_ar: "مطبخ مجهز إليجانس ٣م",
    description_fr: "Cuisine complète façade laquée ivoire, poignées or champagne, plan de travail quartz. Installation incluse.",
    description_ar: "مطبخ كامل بواجهة عاجية لامعة، مقابض ذهب شامبانيا، سطح كوارتز. التركيب مشمول.",
    price: 420000, image: cuisine, images: [cuisine],
    dimensions: "3m linéaire · Installation incluse",
    stock: 4, delivery_fr: "Pose 15-20 jours", delivery_ar: "التركيب ١٥-٢٠ يوم",
    variants: [
      { id: "p6v1", name_fr: "Ivoire / Or", name_ar: "عاجي / ذهب", price: 420000, image: cuisine },
      { id: "p6v2", name_fr: "Anthracite / Or", name_ar: "فحمي / ذهب", price: 445000, image: cuisine },
      { id: "p6v3", name_fr: "Mauve / Or", name_ar: "موف / ذهب", price: 458000, image: cuisine },
    ],
  },
  {
    id: "p7", slug: "parquet-chevron-chene", category: "parquet",
    name_fr: "Parquet Chêne Chevron", name_ar: "باركيه بلوط شيفرون",
    description_fr: "Parquet massif chêne français, pose chevron. Finition huilée naturelle. Garantie 25 ans.",
    description_ar: "باركيه بلوط فرنسي صلب، تركيب شيفرون. لمسة زيتية طبيعية. ضمان ٢٥ سنة.",
    price: 7800, image: parquet, images: [parquet],
    dimensions: "Lame 90×600 mm · 1m²/boîte",
    stock: 180, delivery_fr: "Livraison 7-10 jours", delivery_ar: "التسليم ٧-١٠ أيام",
    variants: [
      { id: "p7v1", name_fr: "Chêne naturel", name_ar: "بلوط طبيعي", price: 7800, image: parquet },
      { id: "p7v2", name_fr: "Chêne fumé", name_ar: "بلوط مدخن", price: 8400, image: parquet },
      { id: "p7v3", name_fr: "Chêne blanchi", name_ar: "بلوط مبيض", price: 8200, image: parquet },
    ],
  },
  {
    id: "p8", slug: "rideaux-velours-champagne", category: "rideaux",
    name_fr: "Rideaux Velours Champagne", name_ar: "ستائر مخملية شامبانيا",
    description_fr: "Paire de rideaux occultants en velours, doublure thermique. Sur mesure disponible.",
    description_ar: "زوج من الستائر المعتمة المخملية، بطانة حرارية. تفصيل حسب الطلب متوفر.",
    price: 18500, image: rideaux, images: [rideaux],
    dimensions: "140 × 260 cm (paire)",
    stock: 22, delivery_fr: "Livraison 4-6 jours", delivery_ar: "التسليم ٤-٦ أيام",
    variants: [
      { id: "p8v1", name_fr: "Champagne", name_ar: "شامبانيا", price: 18500, image: rideaux },
      { id: "p8v2", name_fr: "Mauve profond", name_ar: "موف عميق", price: 18500, image: rideaux },
      { id: "p8v3", name_fr: "Ivoire", name_ar: "عاجي", price: 17800, image: rideaux },
      { id: "p8v4", name_fr: "Anthracite", name_ar: "فحمي", price: 18900, image: rideaux },
    ],
  },
];

export const formatDZD = (n: number, lang: "fr" | "ar") => {
  const s = new Intl.NumberFormat(lang === "ar" ? "ar-DZ" : "fr-DZ").format(n);
  return `${s} ${lang === "ar" ? "د.ج" : "DZD"}`;
};

// Configuration centralisée DECIDOR — pièces, styles, palettes

export type RoomType = {
  slug: string;
  name_fr: string;
  name_ar: string;
  emoji: string;
  prompt_en: string;
};

export const roomTypes: RoomType[] = [
  { slug: "chambre-coucher", name_fr: "Chambre à coucher", name_ar: "غرفة النوم", emoji: "🛏️", prompt_en: "master bedroom" },
  { slug: "chambre-invites", name_fr: "Chambre d'invités", name_ar: "غرفة الضيوف", emoji: "🛌", prompt_en: "guest bedroom" },
  { slug: "chambre-enfant-garcon", name_fr: "Chambre enfant garçon", name_ar: "غرفة طفل ولد", emoji: "🧸", prompt_en: "boy's children bedroom" },
  { slug: "chambre-enfant-fille", name_fr: "Chambre enfant fille", name_ar: "غرفة طفلة بنت", emoji: "🎀", prompt_en: "girl's children bedroom" },
  { slug: "salon", name_fr: "Salon", name_ar: "الصالون", emoji: "🛋️", prompt_en: "living room" },
  { slug: "salle-a-manger", name_fr: "Salle à manger", name_ar: "غرفة الطعام", emoji: "🍽️", prompt_en: "dining room" },
  { slug: "salle-de-bain", name_fr: "Salle de bain", name_ar: "الحمام", emoji: "🛁", prompt_en: "bathroom" },
  { slug: "cuisine", name_fr: "Cuisine", name_ar: "المطبخ", emoji: "🍳", prompt_en: "kitchen" },
  { slug: "bureau", name_fr: "Bureau", name_ar: "المكتب", emoji: "💼", prompt_en: "home office" },
  { slug: "escalier", name_fr: "Escalier", name_ar: "الدرج", emoji: "🪜", prompt_en: "staircase" },
  { slug: "hammam", name_fr: "Hammam", name_ar: "الحمام التقليدي", emoji: "♨️", prompt_en: "traditional hammam steam room" },
  { slug: "terrasse", name_fr: "Terrasse", name_ar: "التراس", emoji: "🌿", prompt_en: "outdoor terrace" },
  { slug: "veranda", name_fr: "Véranda", name_ar: "الشرفة الزجاجية", emoji: "🪟", prompt_en: "veranda sunroom" },
  { slug: "grenier", name_fr: "Grenier", name_ar: "العلية", emoji: "🏠", prompt_en: "attic loft" },
  { slug: "entree", name_fr: "Entrée", name_ar: "المدخل", emoji: "🚪", prompt_en: "entrance hall" },
  { slug: "coffee-shop", name_fr: "Coffee shop", name_ar: "مقهى", emoji: "☕", prompt_en: "premium coffee shop interior" },
];

export type DesignStyle = {
  slug: string;
  name_fr: string;
  name_ar: string;
  prompt_en: string;
};

export const designStyles: DesignStyle[] = [
  { slug: "classique", name_fr: "Classique", name_ar: "كلاسيكي", prompt_en: "Classic French style with elegant moldings, refined furniture, and timeless elegance" },
  { slug: "minimaliste", name_fr: "Minimaliste", name_ar: "بسيط", prompt_en: "Minimalist Japandi style with clean lines, neutral tones, and uncluttered space" },
  { slug: "moderne", name_fr: "Moderne", name_ar: "عصري", prompt_en: "Modern contemporary style with sleek finishes, bold geometric forms, and premium materials" },
  { slug: "arabo-islamique", name_fr: "Arabo-islamique", name_ar: "عربي إسلامي", prompt_en: "Arabo-Islamic style with mashrabiya woodwork, zellige tiles, arabesque patterns, brass lanterns, and ornate calligraphy" },
  { slug: "mediterraneen", name_fr: "Méditerranéen", name_ar: "متوسطي", prompt_en: "Mediterranean style with terracotta, whitewashed walls, natural wood, blue accents, and warm earthy tones" },
  { slug: "scandinave", name_fr: "Scandinave", name_ar: "إسكندنافي", prompt_en: "Scandinavian Nordic style with light woods, soft textiles, hygge atmosphere, and bright airy feel" },
  { slug: "royale", name_fr: "Royale", name_ar: "ملكي", prompt_en: "Royal opulent style with gold accents, crystal chandeliers, velvet upholstery, marble surfaces, and grand proportions" },
];

export type ColorPalette = {
  slug: string;
  name_fr: string;
  name_ar: string;
  colors: string[];
};

export const colorPalettes: ColorPalette[] = [
  { slug: "mauve-or", name_fr: "Mauve & Or champagne", name_ar: "موف وذهب شامبانيا", colors: ["#6B4E8C", "#C8A96E", "#F5F1E8", "#2D2438"] },
  { slug: "terre-mediterranee", name_fr: "Terres de Méditerranée", name_ar: "أتربة المتوسط", colors: ["#C4654A", "#E8A87C", "#87A878", "#F5EDE3"] },
  { slug: "noir-laiton", name_fr: "Noir & Laiton", name_ar: "أسود ونحاس", colors: ["#1A1A1A", "#2D2D2D", "#C9A84C", "#F0EBE3"] },
  { slug: "ivoire-sauge", name_fr: "Ivoire & Sauge", name_ar: "عاجي وميرمية", colors: ["#F5F0E8", "#DCE5D4", "#A8C0A0", "#7D9B76"] },
  { slug: "bleu-or", name_fr: "Bleu nuit & Or", name_ar: "أزرق ليلي وذهب", colors: ["#0F1B3D", "#1E3A5F", "#C9A84C", "#E8EDF3"] },
  { slug: "bordeaux-creme", name_fr: "Bordeaux & Crème", name_ar: "بوردو وكريمي", colors: ["#5C2018", "#9B4423", "#D4842A", "#F5F0E0"] },
];

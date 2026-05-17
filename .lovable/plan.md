# Phase 2 — Authentification + IA générative + Catalogue enrichi

## 1. Activation Lovable Cloud
Active Lovable Cloud (Postgres + Auth + Storage + secret `LOVABLE_API_KEY` pour l'IA Gateway).
- Auth: **Email + mot de passe** (par défaut) + **Google** (managé via le broker Lovable).
- Auto-confirmation email activée pour fluidifier les tests.
- Table `profiles` (id, full_name, phone, role) + trigger auto-create on signup.
- Table `user_roles` (client / fournisseur / admin) + fonction `has_role` (sécurité non-récursive).
- RLS activée partout, policies scopées `auth.uid()`.
- **Pas de JWT/refresh custom** : Supabase Auth gère déjà JWT + refresh tokens automatiquement de manière sécurisée (httpOnly via SDK). Réimplémenter serait moins sûr.

## 2. Routes et garde d'accès
- `/auth` → page unique inscription + connexion (onglets) + Google.
- `/_authenticated/*` → layout protégé avec `beforeLoad` + redirect `/auth`.
- `/_authenticated/compte` → profil utilisateur.
- `/_authenticated/mes-projets` → historique projets IA.
- `/_authenticated/ia/nouveau` → pipeline IA complet (protégé).
- `/ia` reste vitrine publique avec CTA "Se connecter pour générer".

## 3. Pipeline IA (`/_authenticated/ia/nouveau`)
Étapes guidées (wizard) :
1. **Type de pièce** (16 options) : chambre à coucher, chambre d'invités, chambre enfant garçon, chambre enfant fille, salon, salle de bain, escalier, bureau, hammam, cuisine, terrasse, véranda, grenier, coffee shop, salle à manger, entrée.
2. **Upload photo** (stockage Supabase Storage `room-photos`, bucket privé).
3. **Dimensions** (longueur × largeur × hauteur en mètres).
4. **Style** (7 options) : Classique, Minimaliste, Moderne, Arabo-islamique, Méditerranéen, Scandinave, Royale.
5. **Palette de couleurs** (6 palettes prédéfinies + custom).
6. **Budget** en DZD (slider).
7. **Génération** → 3 variantes via Lovable AI Gateway (`google/gemini-3.1-flash-image-preview`, alias Nano Banana 2 — meilleur pour édition d'images en préservant la structure).

**Préservation structurelle (important — limitation honnête)** :
Gemini image **édite** l'image source : il préserve raisonnablement la géométrie de la pièce (murs, position fenêtre/porte, perspective) car il part de la photo réelle, mais ce n'est pas garanti à 100% comme avec ControlNet+SDXL. Le prompt sera explicite : *"Preserve exact wall positions, window on the right, door on the left, ceiling height, perspective. Only change decor, furniture, colors, materials. Respect dimensions: {L}×{l}×{h}m."* Pour vraie préservation pixel-perfect, prévoir migration externe (Replicate ControlNet) en Phase 4.

**Sortie structurée** : pour chaque variante, l'IA renvoie aussi (via 2e appel `Output.object` Gemini Flash) la **liste des éléments du décor** (peinture murale, carrelage, mobilier, luminaire, textiles…) avec nom, catégorie, prix estimé en DZD, et lien vers produit catalogue si match.

## 4. Tables Lovable Cloud
```
profiles(id PK→auth.users, full_name, phone, avatar_url, created_at)
user_roles(id, user_id, role enum[client|fournisseur|admin], unique(user_id,role))
ai_projects(id, user_id, room_type, dimensions jsonb, style, palette jsonb, budget_dzd, source_image_url, status, created_at)
generated_designs(id, project_id, variant_index, image_url, elements jsonb, created_at)
```
RLS : un user voit/écrit uniquement ses lignes (`user_id = auth.uid()`).
Storage bucket `room-photos` (privé) + `generated-designs` (privé, signed URLs).

## 5. Server functions (TanStack)
- `src/lib/ai.functions.ts` :
  - `generateDesigns` (POST, middleware `requireSupabaseAuth`) → upload source, appelle Gemini 3 fois (3 variantes), extrait éléments, persiste `ai_projects` + 3 `generated_designs`, retourne le projet complet.
  - `getMyProjects` (GET, auth) → liste des projets de l'utilisateur.
  - `getProjectDetail` (GET, auth) → détail + variantes + éléments.
- Modèle image : `google/gemini-3.1-flash-image-preview` (rapide, édition d'images).
- Modèle extraction éléments : `google/gemini-3-flash-preview` avec `Output.object` + Zod schema.

## 6. Catalogue enrichi (3 produits min par catégorie)
Catégories existantes : Peinture, Carrelage, Mobilier, Lustres, Tapis, Rideaux, Cuisine, Parquet → **8 catégories × 3 produits = 24 produits minimum** (certaines en ont déjà). Génération d'images IA pour produits manquants (assets locaux, format carré, fond contextuel premium).

## 7. UI / UX
- Header : bouton "Se connecter" → "{Prénom}" + menu dropdown (Mon compte, Mes projets, Déconnexion) une fois loggé.
- Page `/auth` : design premium mauve/or, formulaires sobres, Google button distinct.
- Wizard IA : 7 étapes, barre de progression dorée, transitions fluides, prévisualisation photo uploadée.
- Page résultat : 3 variantes côte à côte (grille), clic → modal plein écran + liste éléments à droite, bouton "Sauvegarder dans Mes projets".
- État chargement génération : skeleton premium avec message "L'IA travaille (environ 30s)…".
- i18n FR/AR maintenu pour toutes les nouvelles strings.

## 8. Hors scope Phase 2 (gardé pour 3/4)
- Stripe (Phase 3)
- Dashboard fournisseur, wallet, commissions, chat temps réel, admin (Phase 3)
- Paiements Algérie, PWA install (Phase 4)
- ControlNet/SDXL externe pour préservation pixel-perfect (Phase 4 si jugé nécessaire)

## Détails techniques
- Lovable Cloud = Supabase managé (DB + Auth + Storage + Edge runtime).
- Auth : Supabase SDK browser + middleware `requireSupabaseAuth` côté server functions.
- `attachSupabaseAuth` ajouté à `functionMiddleware` dans `src/start.ts`.
- Bearer token attaché automatiquement aux appels server fn auth-protégés.
- Images IA stockées dans Storage (signed URLs 7 jours).
- Pas de Edge Functions : tout passe par `createServerFn` TanStack.

**Estimation** : ~25 fichiers créés/modifiés, 1 migration SQL, 2 buckets storage, ~24 images produits générées. C'est dense mais cohérent en un seul lot.

Approuve pour lancer.
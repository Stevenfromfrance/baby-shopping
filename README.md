# Nehemia — Pour son arrivée

Site pour partager la liste Amazon (bébé + maman) avec la famille :
commander via Colis Colibri, faire un don sur une fiche, ou un don libre.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrez l’URL affichée (souvent `http://localhost:5173`).

## Réglages importants

Éditez `src/config.ts` :

- `PAYPAL_ME` — identifiant PayPal.me (ex. `StevenSearwar`) pour les dons en un clic
- adresse Colis Colibri (déjà remplie)
- noms des parents / bébé

## Sync famille (plusieurs téléphones)

**Obligatoire pour le site en ligne.** Sans Supabase, chaque téléphone garde ses messages
dans son navigateur seulement — les autres visiteurs ne voient rien (risque de double achat).

### 1. Créer Supabase (5 min)

1. Crée un projet gratuit sur [supabase.com](https://supabase.com)
2. **SQL Editor** → colle et lance `supabase.sql`
3. Puis lance `scripts/seed-denise-phillip.sql` (cadeaux déjà offerts par Denise & Phillip)
4. **Project Settings → API** : copie `Project URL` et la clé `anon` `public`

### 2. Brancher GitHub Pages

Dans le repo GitHub → **Settings → Secrets and variables → Actions**, ajoute :

| Secret | Valeur |
| --- | --- |
| `VITE_SUPABASE_URL` | Project URL |
| `VITE_SUPABASE_ANON_KEY` | clé anon public |

Puis **Actions → Deploy GitHub Pages → Run workflow** (ou push sur `main`).

### 3. En local (optionnel)

```bash
cp .env.example .env
# remplir VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm run dev
```

## Produits

Les 56 articles viennent des listes Amazon publiques (Baby + Mom), avec images, prix et liens produit `/dp/`.
Fichier : `public/products.json`

Listes Amazon d’origine :

- Bébé : https://www.amazon.fr/hz/wishlist/ls/3P7DYQA3VATIP
- Maman : https://www.amazon.fr/hz/wishlist/ls/2LS2RZZ72752T

## Build / mise en ligne

```bash
npm run build
```

Déployez le dossier `dist/` sur Netlify, Vercel ou GitHub Pages.

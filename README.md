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

Sans configuration, les réservations restent dans le navigateur local.

Pour un affichage **public en direct** pour toute la famille :

1. Créez un projet gratuit sur [supabase.com](https://supabase.com)
2. Exécutez `supabase.sql` dans le SQL Editor
3. Copiez `.env.example` → `.env` et remplissez URL + clé `anon`
4. Relancez `npm run dev`

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

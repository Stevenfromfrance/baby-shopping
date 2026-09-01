/** Personnalisez ces réglages avant de partager le lien. */

export const BABY = {
  firstName: 'Nehemia',
  lastName: 'Searwar',
  father: 'Steven',
  mother: 'Sherally',
} as const

/**
 * Identifiant PayPal.me (sans l’URL).
 * Exemple : 'StevenSearwar' ouvre https://paypal.me/StevenSearwar
 * Créez le lien sur https://www.paypal.com/paypalme
 */
export const PAYPAL_ME = 'StevenSearwar'

export const DONATION_LINK = PAYPAL_ME
  ? `https://paypal.me/${PAYPAL_ME}`
  : ''

export function paypalUrl(amount?: number | null): string {
  if (!PAYPAL_ME) return ''
  if (amount != null && Number.isFinite(amount) && amount > 0) {
    const rounded = Math.round(amount * 100) / 100
    return `https://paypal.me/${PAYPAL_ME}/${rounded}`
  }
  return `https://paypal.me/${PAYPAL_ME}`
}

/** Added to PayPal contributions so delivery is covered, not only the item price. */
export const SHIPPING_EUR = 4.99

export function contributeAmount(price: number | null | undefined): number | null {
  if (price == null || Number.isNaN(price)) return null
  return Math.round((price + SHIPPING_EUR) * 100) / 100
}

export const DELIVERY = {
  service: 'Colis Colibri',
  name: 'Colis Colibri 2A',
  street: '222 Route de la Garde',
  postalCode: '42130',
  city: 'Boën-sur-Lignon',
  country: 'France',
} as const

export const WISHLISTS = {
  baby: 'https://www.amazon.fr/hz/wishlist/ls/3P7DYQA3VATIP',
  mom: 'https://www.amazon.fr/hz/wishlist/ls/2LS2RZZ72752T',
} as const

export const CONTACT_NOTE =
  'Une question ? Écrivez à Steven ou Sherally — ils vous guideront avec plaisir.'

/** Open the site with ?admin=searwar to restore a gift by mistake. */
export const ADMIN_PIN = 'searwar'

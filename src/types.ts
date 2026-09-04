export type ProductPriority = 'essential' | 'comfort'

export type Product = {
  id: string
  list: 'baby' | 'mom'
  listLabel: string
  category: string
  /** Helps guests know what matters most. */
  priority?: ProductPriority
  title: string
  titleEn?: string
  shortTitle: string
  brand: string
  /** Current Amazon price (promo if applicable). */
  price: number | null
  /** Strikethrough / list price when Amazon shows a higher “was” price. */
  originalPrice?: number | null
  currency: string
  description: string
  notes: string[]
  /** Preferred option (colour, size, etc.) so guests know what to pick. */
  choiceNote?: string
  image: string | null
  amazonUrl: string
  wishlistUrl: string
}

export type ClaimType = 'purchase' | 'donation'

export type Claim = {
  id: string
  productId: string
  type: ClaimType
  name: string
  message: string
  amount?: number | null
  proofNote?: string
  proofDataUrl?: string
  /** Shared across claims from one multi-gift checkout (one message). */
  groupId?: string
  createdAt: string
}

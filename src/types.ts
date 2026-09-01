export type Product = {
  id: string
  list: 'baby' | 'mom'
  listLabel: string
  category: string
  title: string
  shortTitle: string
  brand: string
  price: number | null
  currency: string
  description: string
  notes: string[]
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
  createdAt: string
}

/** Prefix public files with the GitHub Pages base (`/baby-shopping/`). */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/'
  return `${base}${path.replace(/^\//, '')}`
}

export function productTitle(
  product: { title: string; titleEn?: string; shortTitle?: string },
  lang: 'en' | 'fr',
): string {
  if (lang === 'en') return product.titleEn || product.shortTitle || product.title
  return product.title
}

const CATEGORY_ORDER = [
  'Chambre & sommeil',
  'Biberons & repas',
  'Toilette & soins',
  'Couches & hygiène',
  'Rangement & sorties',
  'Allaitement',
  'Portage',
  'Soins maman',
  'Post-partum',
]

function familyKey(brand: string) {
  const b = brand.trim().toLowerCase()
  if (b === 'avent' || b.includes('philips')) return 'philips avent'
  return b
}

export function groupProductsByFamily<T extends { category: string; brand: string; title: string; titleEn?: string }>(
  products: T[],
  lang: 'en' | 'fr',
): { category: string; products: T[] }[] {
  const buckets = new Map<string, T[]>()
  for (const product of products) {
    const list = buckets.get(product.category) ?? []
    list.push(product)
    buckets.set(product.category, list)
  }

  const ordered = [
    ...CATEGORY_ORDER.filter((category) => buckets.has(category)),
    ...[...buckets.keys()].filter((category) => !CATEGORY_ORDER.includes(category)),
  ]

  return ordered.map((category) => ({
    category,
    products: [...(buckets.get(category) ?? [])].sort((a, b) => {
      const family = familyKey(a.brand).localeCompare(familyKey(b.brand), lang)
      if (family !== 0) return family
      return productTitle(a, lang).localeCompare(productTitle(b, lang), lang)
    }),
  }))
}

export function formatPrice(
  price: number | null | undefined,
  locale = 'en-GB',
  fallback = 'See on Amazon',
): string {
  if (price == null || Number.isNaN(price)) return fallback
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function formatDate(iso: string, locale = 'en-GB'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export async function fileToDataUrl(
  file: File,
  maxBytes = 350_000,
): Promise<string> {
  if (file.size <= maxBytes) {
    return readFile(file)
  }
  if (!file.type.startsWith('image/')) {
    throw new Error('IMAGE_TYPE')
  }
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, Math.sqrt(maxBytes / file.size))
  const w = Math.max(1, Math.round(bitmap.width * scale))
  const h = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('COMPRESS')
  ctx.drawImage(bitmap, 0, 0, w, h)
  return canvas.toDataURL('image/jpeg', 0.72)
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('FILE_READ'))
    reader.readAsDataURL(file)
  })
}

export function copyText(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

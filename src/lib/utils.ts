export function formatPrice(price: number | null | undefined): string {
  if (price == null || Number.isNaN(price)) return 'Voir sur Amazon'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
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
  // Compress via canvas for photos
  if (!file.type.startsWith('image/')) {
    throw new Error('La preuve doit être une image (capture d’écran ou photo).')
  }
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, Math.sqrt(maxBytes / file.size))
  const w = Math.max(1, Math.round(bitmap.width * scale))
  const h = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Compression impossible')
  ctx.drawImage(bitmap, 0, 0, w, h)
  return canvas.toDataURL('image/jpeg', 0.72)
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Lecture du fichier impossible'))
    reader.readAsDataURL(file)
  })
}

export function copyText(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

import type { Claim } from '../types'

const STORAGE_KEY = 'nehemia-claims-v1'
const CHANNEL = 'nehemia-claims'

function read(): Claim[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Claim[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function write(claims: Claim[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(claims))
  window.dispatchEvent(new CustomEvent(CHANNEL, { detail: claims }))
  try {
    const bc = new BroadcastChannel(CHANNEL)
    bc.postMessage(claims)
    bc.close()
  } catch {
    /* ignore */
  }
}

export function getClaims(): Claim[] {
  return read().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function getClaimForProduct(productId: string): Claim | undefined {
  return getClaims().find((c) => c.productId === productId)
}

export function addClaim(claim: Omit<Claim, 'id' | 'createdAt'>): Claim {
  const existing = getClaimForProduct(claim.productId)
  if (existing) {
    throw new Error('Ce produit a déjà été réservé ou offert.')
  }
  const full: Claim = {
    ...claim,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  write([full, ...read()])
  return full
}

export function removeClaim(id: string) {
  write(read().filter((c) => c.id !== id))
}

export function subscribeClaims(cb: (claims: Claim[]) => void): () => void {
  const onCustom = () => cb(getClaims())
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb(getClaims())
  }
  window.addEventListener(CHANNEL, onCustom)
  window.addEventListener('storage', onStorage)

  let bc: BroadcastChannel | null = null
  try {
    bc = new BroadcastChannel(CHANNEL)
    bc.onmessage = () => cb(getClaims())
  } catch {
    /* ignore */
  }

  return () => {
    window.removeEventListener(CHANNEL, onCustom)
    window.removeEventListener('storage', onStorage)
    bc?.close()
  }
}

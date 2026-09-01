import type { Claim } from '../types'
import * as local from './claims'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const enabled = Boolean(url && key)

async function supabaseFetch(path: string, init?: RequestInit) {
  if (!url || !key) throw new Error('Supabase non configuré')
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Erreur Supabase ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export async function loadRemoteClaims(): Promise<Claim[] | null> {
  if (!enabled) return null
  const rows = (await supabaseFetch(
    'claims?select=*&order=created_at.desc',
  )) as Array<Record<string, unknown>>
  return rows.map(rowToClaim)
}

export async function pushRemoteClaim(
  claim: Omit<Claim, 'id' | 'createdAt'> & { id?: string; createdAt?: string },
): Promise<Claim> {
  if (!enabled) {
    return local.addClaim(claim)
  }
  const payload = {
    product_id: claim.productId,
    type: claim.type,
    name: claim.name,
    message: claim.message,
    amount: claim.amount ?? null,
    proof_note: claim.proofNote ?? null,
    proof_data_url: claim.proofDataUrl ?? null,
  }
  const rows = (await supabaseFetch('claims', {
    method: 'POST',
    body: JSON.stringify(payload),
  })) as Array<Record<string, unknown>>
  return rowToClaim(rows[0])
}

export async function deleteRemoteClaim(claim: Claim): Promise<void> {
  if (!enabled) {
    local.removeClaim(claim.id)
    return
  }
  await supabaseFetch(
    `claims?id=eq.${encodeURIComponent(claim.id)}`,
    { method: 'DELETE' },
  )
}

function rowToClaim(row: Record<string, unknown>): Claim {
  return {
    id: String(row.id),
    productId: String(row.product_id),
    type: row.type as Claim['type'],
    name: String(row.name),
    message: String(row.message ?? ''),
    amount: (row.amount as number | null) ?? null,
    proofNote: (row.proof_note as string | null) ?? undefined,
    proofDataUrl: (row.proof_data_url as string | null) ?? undefined,
    createdAt: String(row.created_at),
  }
}

export function isRemoteEnabled() {
  return enabled
}

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

/** Push local-only claims to Supabase, then return the shared list. */
export async function syncLocalClaimsToRemote(
  localClaims: Claim[],
): Promise<Claim[]> {
  if (!enabled) return localClaims
  const remote = (await loadRemoteClaims()) ?? []
  const remoteByProduct = new Set(remote.map((c) => c.productId))
  const orphans = localClaims.filter((c) => !remoteByProduct.has(c.productId))

  for (const orphan of orphans) {
    try {
      await pushRemoteClaim({
        productId: orphan.productId,
        type: orphan.type,
        name: orphan.name,
        message: orphan.message,
        amount: orphan.amount,
        proofNote: orphan.proofNote,
        proofDataUrl: orphan.proofDataUrl,
        groupId: orphan.groupId,
      })
    } catch {
      /* already claimed remotely or network error */
    }
  }

  return (await loadRemoteClaims()) ?? remote
}

const GID_PREFIX = '__gid__'

function packProofNote(groupId?: string, proofNote?: string): string | null {
  if (!groupId) return proofNote ?? null
  return `${GID_PREFIX}${groupId}__${proofNote ?? ''}`
}

function unpackProofNote(raw: string | null | undefined): {
  groupId?: string
  proofNote?: string
} {
  if (!raw) return {}
  if (!raw.startsWith(GID_PREFIX)) return { proofNote: raw }
  const rest = raw.slice(GID_PREFIX.length)
  const sep = rest.indexOf('__')
  if (sep <= 0) return { proofNote: raw }
  const groupId = rest.slice(0, sep)
  const proofNote = rest.slice(sep + 2)
  return {
    groupId,
    proofNote: proofNote || undefined,
  }
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
    proof_note: packProofNote(claim.groupId, claim.proofNote),
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
    local.removeClaimForProduct(claim.productId)
    return
  }
  try {
    await supabaseFetch(`claims?id=eq.${encodeURIComponent(claim.id)}`, {
      method: 'DELETE',
    })
  } catch {
    /* try by product if the row id does not match */
  }
  await supabaseFetch(
    `claims?product_id=eq.${encodeURIComponent(claim.productId)}`,
    { method: 'DELETE' },
  )
}

function rowToClaim(row: Record<string, unknown>): Claim {
  const packed = unpackProofNote(
    (row.proof_note as string | null | undefined) ?? undefined,
  )
  return {
    id: String(row.id),
    productId: String(row.product_id),
    type: row.type as Claim['type'],
    name: String(row.name),
    message: String(row.message ?? ''),
    amount: (row.amount as number | null) ?? null,
    proofNote: packed.proofNote,
    proofDataUrl: (row.proof_data_url as string | null) ?? undefined,
    groupId: packed.groupId,
    createdAt: String(row.created_at),
  }
}

export function isRemoteEnabled() {
  return enabled
}

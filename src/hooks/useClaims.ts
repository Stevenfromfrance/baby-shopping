import { useCallback, useEffect, useState } from 'react'
import {
  getClaimForProduct,
  getClaims,
  subscribeClaims,
  addClaim as addLocalClaim,
  removeClaim,
  removeClaimForProduct,
} from '../lib/claims'
import {
  isRemoteEnabled,
  loadRemoteClaims,
  pushRemoteClaim,
  deleteRemoteClaim,
} from '../lib/remote'
import type { Claim } from '../types'

export function useClaims() {
  const [claims, setClaims] = useState<Claim[]>(() => getClaims())
  const [ready, setReady] = useState(!isRemoteEnabled())

  useEffect(() => {
    const unsub = subscribeClaims(setClaims)
    return unsub
  }, [])

  useEffect(() => {
    if (!isRemoteEnabled()) return
    let cancelled = false
    loadRemoteClaims()
      .then((remote) => {
        if (!cancelled && remote) {
          localStorage.setItem('nehemia-claims-v1', JSON.stringify(remote))
          setClaims(remote)
        }
      })
      .catch(() => {
        /* keep local cache */
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })

    const timer = window.setInterval(() => {
      loadRemoteClaims()
        .then((remote) => {
          if (remote) {
            localStorage.setItem('nehemia-claims-v1', JSON.stringify(remote))
            setClaims(remote)
          }
        })
        .catch(() => undefined)
    }, 12_000)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [])

  const submitClaim = useCallback(
    async (claim: Omit<Claim, 'id' | 'createdAt'>) => {
      if (getClaimForProduct(claim.productId)) {
        throw new Error('Ce produit a déjà été réservé ou offert.')
      }
      if (isRemoteEnabled()) {
        const saved = await pushRemoteClaim(claim)
        const next = [saved, ...getClaims().filter((c) => c.id !== saved.id)]
        localStorage.setItem('nehemia-claims-v1', JSON.stringify(next))
        setClaims(next)
        return saved
      }
      return addLocalClaim(claim)
    },
    [],
  )

  const submitClaims = useCallback(
    async (items: Omit<Claim, 'id' | 'createdAt'>[]) => {
      if (items.length === 0) {
        throw new Error('Aucun cadeau sélectionné.')
      }
      for (const item of items) {
        if (getClaimForProduct(item.productId)) {
          throw new Error('Ce produit a déjà été réservé ou offert.')
        }
      }
      const groupId = items[0].groupId || crypto.randomUUID()
      const enriched = items.map((item) => ({
        ...item,
        groupId: item.groupId || groupId,
      }))
      const saved: Claim[] = []
      for (const item of enriched) {
        if (isRemoteEnabled()) {
          saved.push(await pushRemoteClaim(item))
        } else {
          saved.push(addLocalClaim(item))
        }
      }
      if (isRemoteEnabled()) {
        const savedIds = new Set(saved.map((c) => c.id))
        const next = [
          ...saved,
          ...getClaims().filter((c) => !savedIds.has(c.id)),
        ]
        localStorage.setItem('nehemia-claims-v1', JSON.stringify(next))
        setClaims(next)
      } else {
        setClaims(getClaims())
      }
      return saved
    },
    [],
  )

  const releaseClaim = useCallback(async (claim: Claim) => {
    if (isRemoteEnabled()) {
      try {
        await deleteRemoteClaim(claim)
      } catch {
        /* still clear locally so the admin can recover */
      }
    }
    removeClaim(claim.id)
    removeClaimForProduct(claim.productId)
    setClaims(getClaims())
  }, [])

  return {
    claims,
    ready,
    submitClaim,
    submitClaims,
    releaseClaim,
    remote: isRemoteEnabled(),
  }
}

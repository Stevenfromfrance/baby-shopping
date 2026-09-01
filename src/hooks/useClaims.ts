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

  return { claims, ready, submitClaim, releaseClaim, remote: isRemoteEnabled() }
}

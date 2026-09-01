import { useCallback, useEffect, useState } from 'react'
import {
  getClaimForProduct,
  getClaims,
  subscribeClaims,
  addClaim as addLocalClaim,
} from '../lib/claims'
import {
  isRemoteEnabled,
  loadRemoteClaims,
  pushRemoteClaim,
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

  return { claims, ready, submitClaim, remote: isRemoteEnabled() }
}

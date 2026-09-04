import { useEffect, useState } from 'react'
import { ADMIN_PIN } from '../config'

const STORAGE_KEY = 'nehemia-admin'

/**
 * Admin is invisible to guests.
 * Unlock only with the secret URL: ?admin=searwar
 * Stored in sessionStorage only (clears when the tab closes).
 */
export function useAdmin() {
  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    // Clear any old persistent admin flag from previous versions
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }

    const params = new URLSearchParams(window.location.search)
    const pin = params.get('admin')
    if (pin && pin === ADMIN_PIN) {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {
        /* ignore */
      }
      setAdmin(true)
      params.delete('admin')
      const search = params.toString()
      const next = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`
      window.history.replaceState({}, '', next)
      return
    }

    try {
      setAdmin(sessionStorage.getItem(STORAGE_KEY) === '1')
    } catch {
      setAdmin(false)
    }
  }, [])

  return { isAdmin: admin }
}

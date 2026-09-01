import { useEffect, useState } from 'react'
import { ADMIN_PIN } from '../config'

const STORAGE_KEY = 'nehemia-admin'

export function useAdmin() {
  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pin = params.get('admin')
    if (pin && pin === ADMIN_PIN) {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {
        /* ignore */
      }
      params.delete('admin')
      const search = params.toString()
      const next = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`
      window.history.replaceState({}, '', next)
      setAdmin(true)
      return
    }
    try {
      setAdmin(sessionStorage.getItem(STORAGE_KEY) === '1')
    } catch {
      setAdmin(false)
    }
  }, [])

  return admin
}

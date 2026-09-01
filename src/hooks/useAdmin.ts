import { useEffect, useState } from 'react'
import { ADMIN_PIN } from '../config'

const STORAGE_KEY = 'nehemia-admin'

function readAdmin(): boolean {
  try {
    return (
      localStorage.getItem(STORAGE_KEY) === '1' ||
      sessionStorage.getItem(STORAGE_KEY) === '1'
    )
  } catch {
    return false
  }
}

export function useAdmin() {
  const [admin, setAdmin] = useState(readAdmin)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pin = params.get('admin')
    if (pin && pin === ADMIN_PIN) {
      unlockAdmin()
      params.delete('admin')
      const search = params.toString()
      const next = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`
      window.history.replaceState({}, '', next)
      return
    }
    setAdmin(readAdmin())
  }, [])

  function unlockAdmin() {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
    setAdmin(true)
  }

  function unlock(pin: string) {
    if (pin.trim() !== ADMIN_PIN) return false
    unlockAdmin()
    return true
  }

  return { isAdmin: admin, unlock }
}

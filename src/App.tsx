import { useEffect, useMemo, useState } from 'react'
import { Header, Hero, HowTo } from './components/Hero'
import { ProductGrid } from './components/ProductGrid'
import { ProductModal } from './components/ProductModal'
import { CheckoutModal, SelectionBar } from './components/CheckoutModal'
import { ActivityFeed, DonateBanner, Footer } from './components/Activity'
import { useClaims } from './hooks/useClaims'
import { useAdmin } from './hooks/useAdmin'
import { publicUrl } from './lib/utils'
import type { Product } from './types'

export default function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [cartIds, setCartIds] = useState<string[]>([])
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const { claims, submitClaim, submitClaims, releaseClaim } = useClaims()
  const { isAdmin } = useAdmin()

  useEffect(() => {
    const version = import.meta.env.VITE_BUILD_ID || '1'
    fetch(publicUrl(`products.json?v=${version}`), { cache: 'no-store' })
      .then((r) => r.json())
      .then((data: Product[]) => setProducts(data))
      .catch(() => setProducts([]))
  }, [])

  const claimsByProduct = useMemo(() => {
    const map = new Map(claims.map((c) => [c.productId, c]))
    return map
  }, [claims])

  const productsById = useMemo(() => {
    return new Map(products.map((p) => [p.id, p]))
  }, [products])

  const selectedIds = useMemo(() => new Set(cartIds), [cartIds])

  const cartProducts = useMemo(
    () =>
      cartIds
        .map((id) => productsById.get(id))
        .filter((p): p is Product => p != null && !claimsByProduct.has(p.id)),
    [cartIds, productsById, claimsByProduct],
  )

  const selected = selectedId ? productsById.get(selectedId) : undefined

  function toggleSelect(product: Product) {
    if (claimsByProduct.has(product.id)) return
    setCartIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id],
    )
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowTo />
        <ProductGrid
          products={products}
          claimsByProduct={claimsByProduct}
          selectedIds={selectedIds}
          onOpen={(p) => setSelectedId(p.id)}
          onToggleSelect={toggleSelect}
        />
        <ActivityFeed claims={claims} productsById={productsById} />
        <DonateBanner />
      </main>
      <Footer />

      <SelectionBar
        count={cartProducts.length}
        onClear={() => setCartIds([])}
        onCheckout={() => setCheckoutOpen(true)}
      />

      {selected ? (
        <ProductModal
          product={selected}
          claim={claimsByProduct.get(selected.id)}
          isAdmin={isAdmin}
          selected={selectedIds.has(selected.id)}
          onToggleSelect={() => toggleSelect(selected)}
          onClose={() => setSelectedId(null)}
          onSubmitClaim={submitClaim}
          onReleaseClaim={
            isAdmin
              ? async (claim) => {
                  await releaseClaim(claim)
                  setSelectedId(null)
                }
              : undefined
          }
        />
      ) : null}

      {checkoutOpen ? (
        <CheckoutModal
          products={cartProducts}
          onClose={() => setCheckoutOpen(false)}
          onRemove={(productId) =>
            setCartIds((prev) => prev.filter((id) => id !== productId))
          }
          onSubmitClaims={async (items) => {
            const saved = await submitClaims(items)
            setCartIds([])
            setCheckoutOpen(false)
            return saved
          }}
        />
      ) : null}
    </>
  )
}

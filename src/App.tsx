import { useEffect, useMemo, useState } from 'react'
import { Header, Hero, HowTo } from './components/Hero'
import { ProductGrid } from './components/ProductGrid'
import { ProductModal } from './components/ProductModal'
import { ActivityFeed, DonateBanner, Footer } from './components/Activity'
import { useClaims } from './hooks/useClaims'
import { useAdmin } from './hooks/useAdmin'
import { publicUrl } from './lib/utils'
import type { Product } from './types'

export default function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { claims, submitClaim, releaseClaim } = useClaims()
  const isAdmin = useAdmin()

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

  const selected = selectedId ? productsById.get(selectedId) : undefined

  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowTo />
        <ProductGrid
          products={products}
          claimsByProduct={claimsByProduct}
          isAdmin={isAdmin}
          onOpen={(p) => setSelectedId(p.id)}
          onRelease={(claim) => void releaseClaim(claim)}
        />
        <ActivityFeed claims={claims} productsById={productsById} />
        <DonateBanner />
      </main>
      <Footer />

      {selected ? (
        <ProductModal
          product={selected}
          claim={claimsByProduct.get(selected.id)}
          isAdmin={isAdmin}
          onClose={() => setSelectedId(null)}
          onSubmitClaim={submitClaim}
          onReleaseClaim={releaseClaim}
        />
      ) : null}
    </>
  )
}

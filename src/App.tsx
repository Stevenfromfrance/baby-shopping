import { useEffect, useMemo, useState } from 'react'
import { Header, Hero, HowTo } from './components/Hero'
import { ProductGrid } from './components/ProductGrid'
import { ProductModal } from './components/ProductModal'
import { ActivityFeed, DonateBanner, Footer } from './components/Activity'
import { useClaims } from './hooks/useClaims'
import type { Product } from './types'

export default function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { claims, submitClaim } = useClaims()

  useEffect(() => {
    fetch('/products.json')
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
          onOpen={(p) => setSelectedId(p.id)}
        />
        <ActivityFeed claims={claims} productsById={productsById} />
        <DonateBanner />
      </main>
      <Footer />

      {selected ? (
        <ProductModal
          product={selected}
          claim={claimsByProduct.get(selected.id)}
          onClose={() => setSelectedId(null)}
          onSubmitClaim={submitClaim}
        />
      ) : null}
    </>
  )
}

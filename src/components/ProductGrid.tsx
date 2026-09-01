import { useMemo, useState } from 'react'
import type { Claim, Product } from '../types'
import { ProductCard } from './ProductCard'

type Props = {
  products: Product[]
  claimsByProduct: Map<string, Claim>
  onOpen: (product: Product) => void
}

export function ProductGrid({ products, claimsByProduct, onOpen }: Props) {
  const [query, setQuery] = useState('')
  const [list, setList] = useState<'all' | 'baby' | 'mom'>('all')
  const [category, setCategory] = useState('all')
  const [hideGifted, setHideGifted] = useState(false)

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category))
    return ['all', ...Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'))]
  }, [products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (list !== 'all' && p.list !== list) return false
      if (category !== 'all' && p.category !== category) return false
      if (hideGifted && claimsByProduct.has(p.id)) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    })
  }, [products, query, list, category, hideGifted, claimsByProduct])

  const available = products.filter((p) => !claimsByProduct.has(p.id)).length

  return (
    <section className="section wrap" id="liste">
      <div className="section-head">
        <h2>Les cadeaux</h2>
        <p>
          Cliquez sur un article pour commander, faire un don, ou laisser un
          message. Les cadeaux déjà offerts apparaissent en gris.
        </p>
      </div>

      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Rechercher un produit…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Rechercher"
        />
        <div className="chips" role="group" aria-label="Liste">
          {(
            [
              ['all', 'Tout'],
              ['baby', 'Bébé'],
              ['mom', 'Maman'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`chip${list === id ? ' active' : ''}`}
              onClick={() => setList(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="chips" role="group" aria-label="Catégories">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip${category === c ? ' active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c === 'all' ? 'Toutes catégories' : c}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`chip${hideGifted ? ' active' : ''}`}
          onClick={() => setHideGifted((v) => !v)}
        >
          Masquer les offerts
        </button>
        <div className="stats">
          <strong>{available}</strong> / {products.length} disponibles
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">Aucun produit ne correspond à votre recherche.</div>
      ) : (
        <div className="grid">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              claim={claimsByProduct.get(product.id)}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </section>
  )
}

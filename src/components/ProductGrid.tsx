import { useMemo, useState } from 'react'
import type { Claim, Product } from '../types'
import { ProductCard } from './ProductCard'

type Props = {
  products: Product[]
  claimsByProduct: Map<string, Claim>
  onOpen: (product: Product) => void
}

function ListBlock({
  id,
  title,
  intro,
  products,
  claimsByProduct,
  onOpen,
}: {
  id: string
  title: string
  intro: string
  products: Product[]
  claimsByProduct: Map<string, Claim>
  onOpen: (product: Product) => void
}) {
  const available = products.filter((p) => !claimsByProduct.has(p.id)).length

  return (
    <section className="list-block" id={id}>
      <div className="section-head">
        <h2>{title}</h2>
        <p>{intro}</p>
      </div>
      <div className="stats list-stats">
        <strong>{available}</strong> / {products.length} disponibles
      </div>
      {products.length === 0 ? (
        <div className="empty">Aucun produit ne correspond à votre recherche.</div>
      ) : (
        <div className="grid">
          {products.map((product) => (
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

export function ProductGrid({ products, claimsByProduct, onOpen }: Props) {
  const [query, setQuery] = useState('')
  const [hideGifted, setHideGifted] = useState(false)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (hideGifted && claimsByProduct.has(p.id)) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    })
  }, [products, query, hideGifted, claimsByProduct])

  const baby = visible.filter((p) => p.list === 'baby')
  const mom = visible.filter((p) => p.list === 'mom')

  return (
    <div className="section wrap" id="liste">
      <div className="section-head">
        <h2>Les cadeaux</h2>
        <p>
          Deux listes, comme sur Amazon : une pour Nehemia, une pour maman.
          Cliquez sur un article pour commander, faire un don, ou laisser un
          message.
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
        <button
          type="button"
          className={`chip${hideGifted ? ' active' : ''}`}
          onClick={() => setHideGifted((v) => !v)}
        >
          Masquer les offerts
        </button>
        <div className="list-jump">
          <a className="chip" href="#bebe">
            Pour le bébé
          </a>
          <a className="chip" href="#maman">
            Pour la maman
          </a>
        </div>
      </div>

      <ListBlock
        id="bebe"
        title="Pour le bébé"
        intro="Couches, toilette, chambre, sorties — tout pour accueillir Nehemia."
        products={baby}
        claimsByProduct={claimsByProduct}
        onOpen={onOpen}
      />
      <ListBlock
        id="maman"
        title="Pour la maman"
        intro="Allaitement, portage, soins post-partum — pour Sherally."
        products={mom}
        claimsByProduct={claimsByProduct}
        onOpen={onOpen}
      />
    </div>
  )
}

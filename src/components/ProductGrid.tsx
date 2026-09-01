import { useMemo } from 'react'
import type { Claim, Product } from '../types'
import { ProductCard } from './ProductCard'
import { useLang } from '../i18n'

type Props = {
  products: Product[]
  claimsByProduct: Map<string, Claim>
  isAdmin?: boolean
  onOpen: (product: Product) => void
  onRelease?: (claim: Claim) => void
}

function ListBlock({
  id,
  title,
  intro,
  products,
  claimsByProduct,
  isAdmin,
  onOpen,
  onRelease,
}: {
  id: string
  title: string
  intro: string
  products: Product[]
  claimsByProduct: Map<string, Claim>
  isAdmin?: boolean
  onOpen: (product: Product) => void
  onRelease?: (claim: Claim) => void
}) {
  const { t } = useLang()
  const available = products.filter((p) => !claimsByProduct.has(p.id)).length

  return (
    <section className="list-block" id={id}>
      <div className="section-head">
        <h2>{title}</h2>
        <p>{intro}</p>
      </div>
      <div className="stats list-stats">
        <strong>{available}</strong> / {products.length} {t.available}
      </div>
      {products.length === 0 ? (
        <div className="empty">{t.empty}</div>
      ) : (
        <div className="catalog">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              claim={claimsByProduct.get(product.id)}
              isAdmin={isAdmin}
              onOpen={onOpen}
              onRelease={onRelease}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export function ProductGrid({
  products,
  claimsByProduct,
  isAdmin,
  onOpen,
  onRelease,
}: Props) {
  const { t } = useLang()
  const baby = useMemo(
    () => products.filter((p) => p.list === 'baby'),
    [products],
  )
  const mom = useMemo(
    () => products.filter((p) => p.list === 'mom'),
    [products],
  )

  return (
    <div className="section wrap" id="liste">
      <div className="section-head">
        <h2>{t.giftsTitle}</h2>
        <p>{t.giftsIntro}</p>
      </div>

      <ListBlock
        id="bebe"
        title={t.babyTitle}
        intro={t.babyIntro}
        products={baby}
        claimsByProduct={claimsByProduct}
        isAdmin={isAdmin}
        onOpen={onOpen}
        onRelease={onRelease}
      />
      <ListBlock
        id="maman"
        title={t.momTitle}
        intro={t.momIntro}
        products={mom}
        claimsByProduct={claimsByProduct}
        isAdmin={isAdmin}
        onOpen={onOpen}
        onRelease={onRelease}
      />
    </div>
  )
}

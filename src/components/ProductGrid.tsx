import { useMemo } from 'react'
import type { Claim, Product } from '../types'
import { ProductCard } from './ProductCard'
import { useLang } from '../i18n'
import { groupProductsByFamily } from '../lib/utils'

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
  const { lang, t } = useLang()
  const available = products.filter((p) => !claimsByProduct.has(p.id)).length
  const families = useMemo(
    () => groupProductsByFamily(products, lang),
    [products, lang],
  )

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
        families.map((family) => (
          <div className="catalog-family" key={family.category}>
            <h3 className="catalog-family-title">
              {t.categories[family.category] ?? family.category}
            </h3>
            <div className="catalog">
              {family.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  claim={claimsByProduct.get(product.id)}
                  onOpen={onOpen}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  )
}

export function ProductGrid({ products, claimsByProduct, onOpen }: Props) {
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
        onOpen={onOpen}
      />
      <ListBlock
        id="maman"
        title={t.momTitle}
        intro={t.momIntro}
        products={mom}
        claimsByProduct={claimsByProduct}
        onOpen={onOpen}
      />
    </div>
  )
}

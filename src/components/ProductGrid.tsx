import { useMemo, useState } from 'react'
import type { Claim, Product, ProductPriority } from '../types'
import { ProductCard } from './ProductCard'
import { useLang } from '../i18n'
import { groupProductsByFamily } from '../lib/utils'
import { StickerField } from './Stickers'

type PriorityFilter = 'all' | ProductPriority

type Props = {
  products: Product[]
  claimsByProduct: Map<string, Claim>
  selectedIds: Set<string>
  onOpen: (product: Product) => void
  onToggleSelect: (product: Product) => void
}

function ListBlock({
  id,
  title,
  intro,
  products,
  claimsByProduct,
  selectedIds,
  onOpen,
  onToggleSelect,
}: {
  id: string
  title: string
  intro: string
  products: Product[]
  claimsByProduct: Map<string, Claim>
  selectedIds: Set<string>
  onOpen: (product: Product) => void
  onToggleSelect: (product: Product) => void
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
                  selected={selectedIds.has(product.id)}
                  onOpen={onOpen}
                  onToggleSelect={onToggleSelect}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  )
}

export function ProductGrid({
  products,
  claimsByProduct,
  selectedIds,
  onOpen,
  onToggleSelect,
}: Props) {
  const { t } = useLang()
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [hideGifted, setHideGifted] = useState(false)

  const filtered = useMemo(() => {
    let list = products
    if (priorityFilter !== 'all') {
      list = list.filter((p) => (p.priority || 'comfort') === priorityFilter)
    }
    if (hideGifted) {
      list = list.filter((p) => !claimsByProduct.has(p.id))
    }
    return list
  }, [products, priorityFilter, hideGifted, claimsByProduct])

  const baby = useMemo(
    () => filtered.filter((p) => p.list === 'baby'),
    [filtered],
  )
  const mom = useMemo(
    () => filtered.filter((p) => p.list === 'mom'),
    [filtered],
  )

  const filters: { id: PriorityFilter; label: string; hint: string }[] = [
    { id: 'all', label: t.priorityAll, hint: '' },
    {
      id: 'essential',
      label: t.priorityEssential,
      hint: t.priorityEssentialHint,
    },
    {
      id: 'comfort',
      label: t.priorityComfort,
      hint: t.priorityComfortHint,
    },
  ]

  return (
    <div className="section wrap section-with-stickers" id="liste">
      <StickerField variant="list" />
      <div className="section-head">
        <h2>{t.giftsTitle}</h2>
        <p>{t.giftsIntro}</p>
      </div>

      <div className="priority-filters" role="group" aria-label={t.filterPriority}>
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`priority-filter${priorityFilter === filter.id ? ' active' : ''}`}
            onClick={() => setPriorityFilter(filter.id)}
            title={filter.hint || undefined}
          >
            <span>{filter.label}</span>
            {filter.hint ? (
              <small className="priority-filter-hint">{filter.hint}</small>
            ) : null}
          </button>
        ))}
      </div>

      <label className="hide-gifted-toggle">
        <input
          type="checkbox"
          checked={hideGifted}
          onChange={(e) => setHideGifted(e.target.checked)}
        />
        <span>{t.hideGifted}</span>
      </label>

      <ListBlock
        id="bebe"
        title={t.babyTitle}
        intro={t.babyIntro}
        products={baby}
        claimsByProduct={claimsByProduct}
        selectedIds={selectedIds}
        onOpen={onOpen}
        onToggleSelect={onToggleSelect}
      />
      <ListBlock
        id="maman"
        title={t.momTitle}
        intro={t.momIntro}
        products={mom}
        claimsByProduct={claimsByProduct}
        selectedIds={selectedIds}
        onOpen={onOpen}
        onToggleSelect={onToggleSelect}
      />
    </div>
  )
}

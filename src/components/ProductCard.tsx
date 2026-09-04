import type { Claim, Product, ProductPriority } from '../types'
import {
  formatPrice,
  hasPromoPrice,
  productTitle,
  publicUrl,
} from '../lib/utils'
import { useLang } from '../i18n'

type Props = {
  product: Product
  claim?: Claim
  selected?: boolean
  onOpen: (product: Product) => void
  onToggleSelect?: (product: Product) => void
}

function priorityLabel(
  priority: ProductPriority | undefined,
  t: ReturnType<typeof useLang>['t'],
) {
  if (priority === 'essential') return t.priorityEssential
  return t.priorityComfort
}

export function ProductCard({
  product,
  claim,
  selected,
  onOpen,
  onToggleSelect,
}: Props) {
  const { lang, t } = useLang()
  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB'
  const category = t.categories[product.category] ?? product.category
  const listLabel = product.list === 'mom' ? t.listMom : t.listBaby
  const title = productTitle(product, lang)
  const canSelect = !claim && Boolean(onToggleSelect)
  const priority = product.priority || 'comfort'
  const promo = hasPromoPrice(product)

  return (
    <article
      className={`catalog-item${claim ? ' gifted' : ''}${selected ? ' selected' : ''}`}
    >
      <button
        type="button"
        className="catalog-photo"
        onClick={() => onOpen(product)}
        aria-label={title}
      >
        {claim ? (
          <span className="catalog-gifted-badge">{t.gifted}</span>
        ) : null}
        {product.image ? (
          <img src={publicUrl(product.image)} alt="" loading="lazy" />
        ) : (
          <span aria-hidden>✦</span>
        )}
      </button>
      <div className="catalog-body">
        <div className="card-meta">
          <span>{listLabel}</span>
          <span>{category}</span>
        </div>
        <div className={`priority-badge priority-${priority}`}>
          {priorityLabel(priority, t)}
        </div>
        <h3>
          <button
            type="button"
            className="catalog-title"
            onClick={() => onOpen(product)}
          >
            {title}
          </button>
        </h3>
        <div className="catalog-price">
          {promo ? (
            <>
              <span className="price-was">
                {formatPrice(product.originalPrice, locale, t.seeAmazon)}
              </span>
              <span className="price-now">
                {formatPrice(product.price, locale, t.seeAmazon)}
              </span>
              <span className="price-promo">{t.promoBadge}</span>
            </>
          ) : (
            formatPrice(product.price, locale, t.seeAmazon)
          )}
        </div>
        {product.choiceNote ? (
          <p className="catalog-choice">
            <span className="catalog-choice-label">{t.choiceLabel}</span>{' '}
            {product.choiceNote}
          </p>
        ) : null}
        {claim ? (
          <div className="gifted-by">
            <span className="gifted-by-label">{t.givenBy}</span>
            <strong className="gifted-by-name">{claim.name}</strong>
            {claim.message ? (
              <p className="gifted-by-message">« {claim.message} »</p>
            ) : null}
          </div>
        ) : null}
        <div className="catalog-actions">
          {canSelect ? (
            <label className="catalog-check">
              <input
                type="checkbox"
                checked={Boolean(selected)}
                onChange={() => onToggleSelect?.(product)}
              />
              <span>{selected ? t.selectedGift : t.selectGift}</span>
            </label>
          ) : null}
          {!claim ? (
            <a
              className="catalog-amazon"
              href={product.amazonUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t.amazonFr}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}

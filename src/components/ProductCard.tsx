import type { Claim, Product } from '../types'
import { formatPrice, productTitle, publicUrl } from '../lib/utils'
import { useLang } from '../i18n'

type Props = {
  product: Product
  claim?: Claim
  isAdmin?: boolean
  onOpen: (product: Product) => void
  onRelease?: (claim: Claim) => void
}

export function ProductCard({
  product,
  claim,
  isAdmin,
  onOpen,
  onRelease,
}: Props) {
  const { lang, t } = useLang()
  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB'
  const category = t.categories[product.category] ?? product.category
  const listLabel = product.list === 'mom' ? t.listMom : t.listBaby
  const title = productTitle(product, lang)

  return (
    <article className={`catalog-item${claim ? ' gifted' : ''}`}>
      <button
        type="button"
        className="catalog-photo"
        onClick={() => onOpen(product)}
        aria-label={title}
      >
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
        <h3>
          <button type="button" className="catalog-title" onClick={() => onOpen(product)}>
            {title}
          </button>
        </h3>
        <div className="catalog-price">
          {formatPrice(product.price, locale, t.seeAmazon)}
        </div>
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
          <a
            className="catalog-amazon"
            href={product.amazonUrl}
            target="_blank"
            rel="noreferrer"
          >
            {t.amazonFr}
          </a>
          {isAdmin && claim && onRelease ? (
            <button
              type="button"
              className="catalog-restore"
              onClick={() => {
                if (window.confirm(t.restoreConfirm)) onRelease(claim)
              }}
            >
              {t.restoreGift}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}

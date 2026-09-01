import type { Claim, Product } from '../types'
import { formatPrice, publicUrl } from '../lib/utils'
import { useLang } from '../i18n'

type Props = {
  product: Product
  claim?: Claim
  onOpen: (product: Product) => void
}

export function ProductCard({ product, claim, onOpen }: Props) {
  const { lang, t } = useLang()
  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB'
  const category = t.categories[product.category] ?? product.category
  const listLabel = product.list === 'mom' ? t.listMom : t.listBaby

  return (
    <button
      type="button"
      className={`catalog-item${claim ? ' gifted' : ''}`}
      data-gifted={t.gifted}
      onClick={() => onOpen(product)}
    >
      <div className="catalog-photo">
        {product.image ? (
          <img src={publicUrl(product.image)} alt="" loading="lazy" />
        ) : (
          <span aria-hidden>✦</span>
        )}
      </div>
      <div className="catalog-body">
        <div className="card-meta">
          <span>{listLabel}</span>
          <span>{category}</span>
        </div>
        <h3>{product.title}</h3>
        <div className="catalog-price">
          {formatPrice(product.price, locale, t.seeAmazon)}
        </div>
        {claim ? (
          <div className="claim-line">
            {t.thanks} {claim.name}
          </div>
        ) : null}
      </div>
    </button>
  )
}

import type { Claim, Product } from '../types'
import { formatPrice } from '../lib/utils'

type Props = {
  product: Product
  claim?: Claim
  onOpen: (product: Product) => void
}

export function ProductCard({ product, claim, onOpen }: Props) {
  return (
    <button
      type="button"
      className={`card${claim ? ' gifted' : ''}`}
      onClick={() => onOpen(product)}
    >
      <div className="card-photo">
        {product.image ? (
          <img src={product.image} alt="" loading="lazy" />
        ) : (
          <span aria-hidden>✦</span>
        )}
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span>{product.listLabel}</span>
          <span>{product.category}</span>
        </div>
        <h3>{product.shortTitle}</h3>
        <p className="card-desc">{product.description}</p>
        <div className="card-price">{formatPrice(product.price)}</div>
        {claim ? (
          <div className="claim-line">Merci {claim.name}</div>
        ) : null}
      </div>
    </button>
  )
}

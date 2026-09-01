import type { Claim, Product } from '../types'
import { formatDate, publicUrl } from '../lib/utils'
import { DONATION_LINK, CONTACT_NOTE, paypalUrl } from '../config'

type Props = {
  claims: Claim[]
  productsById: Map<string, Product>
}

export function ActivityFeed({ claims, productsById }: Props) {
  return (
    <section className="section wrap" id="messages">
      <div className="section-head">
        <h2>Messages & cadeaux</h2>
        <p>
          Tout s’affiche ici en direct : qui a offert quoi, et les petits mots
          laissés pour Nehemia.
        </p>
      </div>

      {claims.length === 0 ? (
        <div className="empty">
          Aucun cadeau pour l’instant — soyez le premier à participer ✨
        </div>
      ) : (
        <div className="activity">
          {claims.map((claim) => {
            const product = productsById.get(claim.productId)
            return (
              <article key={claim.id} className="activity-item">
                <div className="activity-thumb">
                  {product?.image ? (
                    <img src={publicUrl(product.image)} alt="" />
                  ) : (
                    <span>✦</span>
                  )}
                </div>
                <div>
                  <h3>
                    {claim.name}{' '}
                    {claim.type === 'donation' ? 'a fait un don pour' : 'a offert'}{' '}
                    {product?.shortTitle ?? 'un article'}
                  </h3>
                  {claim.message ? <p>« {claim.message} »</p> : null}
                  <div className="activity-meta">{formatDate(claim.createdAt)}</div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export function DonateBanner() {
  const paypal = paypalUrl()
  return (
    <section className="section wrap" id="don">
      <div className="donate-banner">
        <h2>Un don, en un clic</h2>
        <p>
          Pas d’article en tête ? PayPal suffit. Steven et Sherally
          l’utilisent pour les besoins du quotidien — couches, soins, petites
          surprises.
        </p>
        {paypal || DONATION_LINK ? (
          <a
            className="btn"
            href={paypal || DONATION_LINK}
            target="_blank"
            rel="noreferrer"
          >
            Donner via PayPal
          </a>
        ) : (
          <p style={{ opacity: 0.95 }}>{CONTACT_NOTE}</p>
        )}
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="site-footer wrap">
      <p>
        <strong>Nehemia</strong>
      </p>
      <p>Steven & Sherally — avec toute notre gratitude.</p>
    </footer>
  )
}

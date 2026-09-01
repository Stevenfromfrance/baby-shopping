import type { Claim, Product } from '../types'
import { formatDate, productTitle, publicUrl } from '../lib/utils'
import { DONATION_LINK, paypalUrl, BABY } from '../config'
import { useLang } from '../i18n'

type Props = {
  claims: Claim[]
  productsById: Map<string, Product>
}

export function ActivityFeed({ claims, productsById }: Props) {
  const { lang, t } = useLang()
  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB'

  return (
    <section className="section wrap" id="messages">
      <div className="section-head">
        <h2>{t.messagesTitle}</h2>
        <p>{t.messagesIntro}</p>
      </div>

      {claims.length === 0 ? (
        <div className="empty">{t.messagesEmpty}</div>
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
                  <p className="activity-who">
                    <span className="gifted-by-label">{t.givenBy}</span>
                    <strong className="gifted-by-name">{claim.name}</strong>
                  </p>
                  <p className="activity-what">
                    {claim.type === 'donation' ? t.donatedFor : t.offered}{' '}
                    {product ? productTitle(product, lang) : ''}
                  </p>
                  {claim.message ? (
                    <p className="gifted-by-message">« {claim.message} »</p>
                  ) : null}
                  <div className="activity-meta">
                    {formatDate(claim.createdAt, locale)}
                  </div>
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
  const { t } = useLang()
  const paypal = paypalUrl()
  return (
    <section className="section wrap" id="don">
      <div className="donate-banner">
        <h2>{t.donateTitle}</h2>
        <p>{t.donateBody}</p>
        {paypal || DONATION_LINK ? (
          <a
            className="btn"
            href={paypal || DONATION_LINK}
            target="_blank"
            rel="noreferrer"
          >
            {t.donateBtn}
          </a>
        ) : (
          <p style={{ opacity: 0.95 }}>{t.contact}</p>
        )}
      </div>
    </section>
  )
}

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="site-footer wrap">
      <p>
        <strong>
          {BABY.firstName} {BABY.lastName}
        </strong>
      </p>
      <p>{t.footerThanks}</p>
    </footer>
  )
}

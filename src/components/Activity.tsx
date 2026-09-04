import { useMemo } from 'react'
import type { Claim, Product } from '../types'
import { formatDate, productTitle, publicUrl } from '../lib/utils'
import { generateThanks } from '../lib/thanks'
import { BABY } from '../config'
import { useLang, localeForLang } from '../i18n'
import { PayOptions } from './PayOptions'
import { StickerField } from './Stickers'

type Props = {
  claims: Claim[]
  productsById: Map<string, Product>
}

type ClaimGroup = {
  key: string
  claims: Claim[]
  representative: Claim
}

function groupClaims(claims: Claim[]): ClaimGroup[] {
  const buckets = new Map<string, Claim[]>()
  const order: string[] = []
  for (const claim of claims) {
    const key = claim.groupId || claim.id
    if (!buckets.has(key)) {
      buckets.set(key, [])
      order.push(key)
    }
    buckets.get(key)!.push(claim)
  }
  return order.map((key) => {
    const list = buckets.get(key)!
    return {
      key,
      claims: list,
      representative: list[0],
    }
  })
}

export function ActivityFeed({ claims, productsById }: Props) {
  const { lang, t } = useLang()
  const locale = localeForLang(lang)
  const groups = useMemo(() => groupClaims(claims), [claims])

  return (
    <section className="section wrap section-with-stickers" id="messages">
      <StickerField variant="messages" />
      <div className="section-head">
        <h2>{t.messagesTitle}</h2>
        <p>{t.messagesIntro}</p>
      </div>

      {groups.length === 0 ? (
        <div className="empty">{t.messagesEmpty}</div>
      ) : (
        <div className="activity">
          {groups.map((group) => {
            const claim = group.representative
            const titles = group.claims
              .map((c) => {
                const product = productsById.get(c.productId)
                return product ? productTitle(product, lang) : ''
              })
              .filter(Boolean)
            const firstProduct = productsById.get(claim.productId)
            const thanks = generateThanks(
              claim.name,
              claim.message,
              lang,
              group.key,
            )

            return (
              <article key={group.key} className="activity-item">
                <div className="activity-thumb">
                  {firstProduct?.image ? (
                    <img src={publicUrl(firstProduct.image)} alt="" />
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
                    {titles.join(' · ')}
                  </p>
                  {claim.message ? (
                    <p className="gifted-by-message">« {claim.message} »</p>
                  ) : null}
                  <div className="activity-meta">
                    {formatDate(claim.createdAt, locale)}
                  </div>

                  <aside className="activity-thanks" aria-label={t.thanksLabel}>
                    <span className="activity-thanks-heart" aria-hidden>
                      ♥
                    </span>
                    <div className="activity-thanks-body">
                      <p className="activity-thanks-from">{t.thanksFrom}</p>
                      <p className="activity-thanks-text">{thanks}</p>
                    </div>
                  </aside>
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
  return (
    <section className="section wrap" id="don">
      <div className="donate-banner">
        <h2>{t.donateTitle}</h2>
        <p>{t.donateBody}</p>
        <PayOptions variant="dark" />
      </div>
    </section>
  )
}

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="site-footer wrap">
      <StickerField variant="footer" />
      <p>
        <strong>
          {BABY.firstName} {BABY.lastName}
        </strong>
      </p>
      <p>{t.footerThanks}</p>
    </footer>
  )
}

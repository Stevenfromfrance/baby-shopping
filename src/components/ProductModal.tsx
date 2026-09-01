import { useEffect, useState, type FormEvent } from 'react'
import { DELIVERY, DONATION_LINK, paypalUrl } from '../config'
import { copyText, fileToDataUrl, formatPrice, productTitle, publicUrl } from '../lib/utils'
import type { Claim, Product } from '../types'
import { useLang } from '../i18n'

type Tab = 'order' | 'donate' | 'claim'

type Props = {
  product: Product
  claim?: Claim
  isAdmin?: boolean
  onClose: () => void
  onSubmitClaim: (
    claim: Omit<Claim, 'id' | 'createdAt'>,
  ) => Promise<Claim>
  onReleaseClaim?: (claim: Claim) => Promise<void>
}

export function ProductModal({
  product,
  claim,
  isAdmin,
  onClose,
  onSubmitClaim,
  onReleaseClaim,
}: Props) {
  const { lang, t } = useLang()
  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB'
  const priceLabel = formatPrice(product.price, locale, t.seeAmazon)
  const [tab, setTab] = useState<Tab>(claim ? 'claim' : 'order')
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState(
    product.price != null ? String(product.price) : '',
  )
  const [proofNote, setProofNote] = useState('')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const addressText = [
    DELIVERY.name,
    DELIVERY.street,
    `${DELIVERY.postalCode} ${DELIVERY.city}`,
    DELIVERY.country,
  ].join('\n')

  async function handleCopy() {
    await copyText(addressText)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  function mapError(err: unknown) {
    if (!(err instanceof Error)) return t.genericError
    if (err.message === 'IMAGE_TYPE') return t.proofType
    if (err.message === 'COMPRESS') return t.compressFail
    if (err.message === 'FILE_READ') return t.fileFail
    return err.message || t.genericError
  }

  async function handleClaim(e: FormEvent, type: 'purchase' | 'donation') {
    e.preventDefault()
    setError('')
    setOk('')
    if (!name.trim()) {
      setError(t.nameRequired)
      return
    }
    setBusy(true)
    try {
      let proofDataUrl: string | undefined
      if (proofFile) {
        proofDataUrl = await fileToDataUrl(proofFile)
      }
      await onSubmitClaim({
        productId: product.id,
        type,
        name: name.trim(),
        message: message.trim(),
        amount:
          type === 'donation' && amount
            ? Number(amount.replace(',', '.'))
            : product.price,
        proofNote: proofNote.trim() || undefined,
        proofDataUrl,
      })
      setOk(type === 'donation' ? t.thanksDonate : t.thanksGift)
      setTab('claim')
    } catch (err) {
      setError(mapError(err))
    } finally {
      setBusy(false)
    }
  }

  const category = t.categories[product.category] ?? product.category
  const listLabel = product.list === 'mom' ? t.listMom : t.listBaby
  const title = productTitle(product, lang)

  async function handleRestore() {
    if (!claim || !onReleaseClaim) return
    if (!window.confirm(t.restoreConfirm)) return
    setBusy(true)
    setError('')
    try {
      await onReleaseClaim(claim)
      setOk(t.restored)
    } catch (err) {
      setError(mapError(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
      >
        <div className="modal-content">
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label={t.close}
          >
            ×
          </button>

          <div className="modal-top">
            <div className="modal-photo">
              {product.image ? (
                <img src={publicUrl(product.image)} alt="" />
              ) : (
                <span>✦</span>
              )}
            </div>
            <div className="modal-info">
              <div className="card-meta">
                <span>{listLabel}</span>
                <span>{category}</span>
              </div>
              <h2 id="product-title">{title}</h2>
              <div className="card-price" style={{ marginTop: '0.75rem' }}>
                {priceLabel}
              </div>
              <p style={{ marginTop: '0.85rem' }}>
                <a
                  className="btn btn-primary"
                  href={product.amazonUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.openAmazon}
                </a>
              </p>
              {claim ? (
                <div className="gifted-by gifted-by-modal">
                  <span className="gifted-by-label">{t.givenBy}</span>
                  <strong className="gifted-by-name">{claim.name}</strong>
                  {claim.message ? (
                    <p className="gifted-by-message">« {claim.message} »</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          {!claim ? (
            <>
              <div className="modal-tabs" role="tablist">
                <button
                  type="button"
                  className={`tab${tab === 'order' ? ' active' : ''}`}
                  onClick={() => setTab('order')}
                >
                  {t.order}
                </button>
                <button
                  type="button"
                  className={`tab${tab === 'donate' ? ' active' : ''}`}
                  onClick={() => setTab('donate')}
                >
                  {t.donate}
                </button>
                <button
                  type="button"
                  className={`tab${tab === 'claim' ? ' active' : ''}`}
                  onClick={() => setTab('claim')}
                >
                  {t.iGave}
                </button>
              </div>

              <div className="modal-panel">
                {tab === 'order' ? (
                  <div className="panel-box">
                    <h3>{t.amazonGuide}</h3>
                    <ol>
                      <li>{t.orderStep1}</li>
                      <li>{t.orderStep2}</li>
                      <li>
                        {t.orderStep3a} <strong>{DELIVERY.service}</strong>{' '}
                        {t.orderStep3b}
                      </li>
                      <li>{t.orderStep4}</li>
                    </ol>

                    <div className="address">
                      <strong>{t.addressLabel}</strong>
                      {DELIVERY.name}
                      <br />
                      {DELIVERY.street}
                      <br />
                      {DELIVERY.postalCode} {DELIVERY.city}
                      <br />
                      {DELIVERY.country}
                    </div>

                    <div className="copy-row">
                      <button
                        type="button"
                        className="btn btn-soft"
                        onClick={handleCopy}
                      >
                        {copied ? t.copied : t.copyAddress}
                      </button>
                      <a
                        className="btn btn-primary"
                        href={product.amazonUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t.openAmazon}
                      </a>
                      <a
                        className="btn btn-ghost"
                        href={product.wishlistUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t.viewWishlist}
                      </a>
                    </div>
                  </div>
                ) : null}

                {tab === 'donate' ? (
                  <div className="panel-box">
                    <h3>{t.donateItemTitle}</h3>
                    <p>{t.donateItemBody}</p>
                    {paypalUrl(product.price) || DONATION_LINK ? (
                      <p style={{ margin: '0.85rem 0' }}>
                        <a
                          className="btn btn-primary"
                          href={paypalUrl(product.price) || DONATION_LINK}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t.donatePaypal}
                          {product.price != null ? ` · ${priceLabel}` : ''}
                        </a>
                      </p>
                    ) : (
                      <p style={{ margin: '0.85rem 0' }}>{t.contactPaypal}</p>
                    )}
                    <form
                      className="form-grid"
                      onSubmit={(e) => handleClaim(e, 'donation')}
                    >
                      <label>
                        {t.yourName}
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t.namePh}
                          required
                        />
                      </label>
                      <label>
                        {t.amount}
                        <span className="hint">
                          {t.suggestion}: {priceLabel}
                        </span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </label>
                      <label>
                        {t.message}
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={t.messagePh}
                        />
                      </label>
                      {error ? <p className="form-error">{error}</p> : null}
                      {ok ? <p className="form-ok">{ok}</p> : null}
                      <button
                        className="btn btn-primary btn-block"
                        type="submit"
                        disabled={busy}
                      >
                        {t.confirmDonate}
                      </button>
                    </form>
                  </div>
                ) : null}

                {tab === 'claim' ? (
                  <div className="panel-box">
                    <h3>{t.iBoughtTitle}</h3>
                    <p>{t.iBoughtBody}</p>
                    <form
                      className="form-grid"
                      onSubmit={(e) => handleClaim(e, 'purchase')}
                    >
                      <label>
                        {t.yourName}
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t.cousinPh}
                          required
                        />
                      </label>
                      <label>
                        {t.message}
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={t.welcomePh}
                        />
                      </label>
                      <label>
                        {t.orderNote}
                        <span className="hint">{t.optional}</span>
                        <input
                          type="text"
                          value={proofNote}
                          onChange={(e) => setProofNote(e.target.value)}
                        />
                      </label>
                      <label>
                        {t.proof}
                        <span className="hint">{t.screenshot}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setProofFile(e.target.files?.[0] ?? null)
                          }
                        />
                      </label>
                      {error ? <p className="form-error">{error}</p> : null}
                      {ok ? <p className="form-ok">{ok}</p> : null}
                      <button
                        className="btn btn-primary btn-block"
                        type="submit"
                        disabled={busy}
                      >
                        {t.publish}
                      </button>
                    </form>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="modal-panel">
              <div className="panel-box">
                <h3>{t.alreadyTitle}</h3>
                <div className="gifted-by gifted-by-modal">
                  <span className="gifted-by-label">{t.givenBy}</span>
                  <strong className="gifted-by-name">{claim.name}</strong>
                  {claim.type === 'donation' ? (
                    <span className="gifted-by-tag">{t.donationTag}</span>
                  ) : null}
                  {claim.message ? (
                    <p className="gifted-by-message">« {claim.message} »</p>
                  ) : null}
                </div>
                {claim.proofDataUrl ? (
                  <p style={{ marginTop: '0.75rem' }}>
                    <img
                      src={claim.proofDataUrl}
                      alt={t.proofAlt}
                      style={{
                        maxWidth: '100%',
                        borderRadius: 12,
                        border: '1px solid var(--line)',
                      }}
                    />
                  </p>
                ) : null}
                {error ? <p className="form-error">{error}</p> : null}
                {ok ? <p className="form-ok">{ok}</p> : null}
                <p style={{ marginTop: '1rem' }} className="copy-row">
                  <a
                    className="btn btn-primary"
                    href={product.amazonUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t.openAmazon}
                  </a>
                  <a className="btn btn-ghost" href="#liste" onClick={onClose}>
                    {t.backToList}
                  </a>
                  {isAdmin && onReleaseClaim ? (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      disabled={busy}
                      onClick={handleRestore}
                    >
                      {t.restoreGift}
                    </button>
                  ) : null}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

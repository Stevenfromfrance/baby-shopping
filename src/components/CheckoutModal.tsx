import { useEffect, useState, type FormEvent } from 'react'
import { DELIVERY } from '../config'
import { copyText, fileToDataUrl, productTitle, publicUrl } from '../lib/utils'
import type { Claim, Product } from '../types'
import { useLang } from '../i18n'

type Props = {
  products: Product[]
  onClose: () => void
  onRemove: (productId: string) => void
  onSubmitClaims: (
    claims: Omit<Claim, 'id' | 'createdAt'>[],
  ) => Promise<Claim[]>
}

export function CheckoutModal({
  products,
  onClose,
  onRemove,
  onSubmitClaims,
}: Props) {
  const { lang, t } = useLang()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [proofNote, setProofNote] = useState('')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

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
    `${t.addressName} : ${DELIVERY.name}`,
    `${t.addressStreet} : ${DELIVERY.street}`,
    `${t.addressPostal} : ${DELIVERY.postalCode}`,
    `${t.addressCity} : ${DELIVERY.city}`,
    `${t.addressCountry} : ${DELIVERY.country}`,
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setOk('')
    if (products.length === 0) {
      setError(t.cartEmpty)
      return
    }
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
      const groupId = crypto.randomUUID()
      const sharedMessage = message.trim()
      await onSubmitClaims(
        products.map((product, index) => ({
          productId: product.id,
          type: 'purchase' as const,
          name: name.trim(),
          message: sharedMessage,
          amount: product.price,
          proofNote: proofNote.trim() || undefined,
          proofDataUrl: index === 0 ? proofDataUrl : undefined,
          groupId,
        })),
      )
      setOk(t.thanksGifts)
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
        className="modal checkout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
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

          <div className="panel-box">
            <h2 id="checkout-title">{t.cartTitle}</h2>
            <p>{t.cartIntro}</p>

            <ul className="cart-list">
              {products.map((product) => {
                const title = productTitle(product, lang)
                return (
                  <li key={product.id} className="cart-item">
                    <div className="cart-thumb">
                      {product.image ? (
                        <img src={publicUrl(product.image)} alt="" />
                      ) : (
                        <span>✦</span>
                      )}
                    </div>
                    <div className="cart-item-body">
                      <strong>{title}</strong>
                      {product.choiceNote ? (
                        <p className="cart-choice">
                          <span className="catalog-choice-label">{t.choiceLabel}</span>{' '}
                          {product.choiceNote}
                        </p>
                      ) : null}
                      <div className="cart-item-actions">
                        <a
                          href={product.amazonUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t.amazonFr}
                        </a>
                        <button
                          type="button"
                          className="cart-remove"
                          onClick={() => onRemove(product.id)}
                        >
                          {t.cartRemove}
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="address" style={{ marginTop: '1.25rem' }}>
              <strong>{t.addressLabel}</strong>
              <p className="address-forward">{t.addressForward}</p>
              <dl className="address-fields">
                <div>
                  <dt>{t.addressName}</dt>
                  <dd>{DELIVERY.name}</dd>
                </div>
                <div>
                  <dt>{t.addressStreet}</dt>
                  <dd>{DELIVERY.street}</dd>
                </div>
                <div>
                  <dt>{t.addressPostal}</dt>
                  <dd>{DELIVERY.postalCode}</dd>
                </div>
                <div>
                  <dt>{t.addressCity}</dt>
                  <dd>{DELIVERY.city}</dd>
                </div>
                <div>
                  <dt>{t.addressCountry}</dt>
                  <dd>{DELIVERY.country}</dd>
                </div>
              </dl>
            </div>

            <div className="copy-row">
              <button
                type="button"
                className="btn btn-soft"
                onClick={handleCopy}
              >
                {copied ? t.copied : t.copyAddress}
              </button>
            </div>

            <form className="form-grid" onSubmit={handleSubmit}>
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
                <span className="hint">{t.cartMessageHint}</span>
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
                  onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                />
              </label>
              {error ? <p className="form-error">{error}</p> : null}
              {ok ? <p className="form-ok">{ok}</p> : null}
              <button
                className="btn btn-primary btn-block"
                type="submit"
                disabled={busy || products.length === 0 || Boolean(ok)}
              >
                {t.cartPublish}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

type BarProps = {
  count: number
  onClear: () => void
  onCheckout: () => void
}

export function SelectionBar({ count, onClear, onCheckout }: BarProps) {
  const { t } = useLang()
  if (count <= 0) return null

  return (
    <div className="selection-bar" role="status">
      <div className="wrap selection-bar-inner">
        <p>
          <strong>{count}</strong> {count === 1 ? t.cartCountOne : t.cartCountMany}
        </p>
        <div className="selection-bar-actions">
          <button type="button" className="btn btn-soft" onClick={onClear}>
            {t.cartClear}
          </button>
          <button type="button" className="btn btn-primary" onClick={onCheckout}>
            {t.cartContinue}
          </button>
        </div>
      </div>
    </div>
  )
}

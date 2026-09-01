import { useEffect, useState, type FormEvent } from 'react'
import { DELIVERY, DONATION_LINK, paypalUrl } from '../config'
import { copyText, fileToDataUrl, formatPrice, publicUrl } from '../lib/utils'
import type { Claim, Product } from '../types'

type Tab = 'order' | 'donate' | 'claim'

type Props = {
  product: Product
  claim?: Claim
  onClose: () => void
  onSubmitClaim: (
    claim: Omit<Claim, 'id' | 'createdAt'>,
  ) => Promise<Claim>
}

export function ProductModal({ product, claim, onClose, onSubmitClaim }: Props) {
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

  async function handleClaim(e: FormEvent, type: 'purchase' | 'donation') {
    e.preventDefault()
    setError('')
    setOk('')
    if (!name.trim()) {
      setError('Indiquez votre prénom (ou le nom de la famille).')
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
      setOk(
        type === 'donation'
          ? 'Merci ! Votre don est affiché sur la liste.'
          : 'Merci ! Votre cadeau est marqué comme offert.',
      )
      setTab('claim')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
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
            aria-label="Fermer"
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
                <span>{product.listLabel}</span>
                <span>{product.category}</span>
              </div>
              <h2 id="product-title">{product.title}</h2>
              <p className="card-desc" style={{ WebkitLineClamp: 4 }}>
                {product.description}
              </p>
              <div className="card-price" style={{ marginTop: '0.75rem' }}>
                {formatPrice(product.price)}
              </div>
              {claim ? (
                <p className="claim-line" style={{ marginTop: '0.5rem' }}>
                  Déjà offert par {claim.name}
                  {claim.message ? ` — « ${claim.message} »` : ''}
                </p>
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
                  Commander
                </button>
                <button
                  type="button"
                  className={`tab${tab === 'donate' ? ' active' : ''}`}
                  onClick={() => setTab('donate')}
                >
                  Faire un don
                </button>
                <button
                  type="button"
                  className={`tab${tab === 'claim' ? ' active' : ''}`}
                  onClick={() => setTab('claim')}
                >
                  J’ai offert
                </button>
              </div>

              <div className="modal-panel">
                {tab === 'order' ? (
                  <div className="panel-box">
                    <h3>Guide commande Amazon</h3>
                    <ol>
                      <li>Ouvrez le produit sur Amazon.fr (bouton ci-dessous).</li>
                      <li>Ajoutez-le au panier et passez commande.</li>
                      <li>
                        À l’étape livraison, utilisez l’adresse{' '}
                        <strong>{DELIVERY.service}</strong> ci-dessous (pas
                        votre adresse personnelle).
                      </li>
                      <li>
                        Revenez ici dans l’onglet « J’ai offert » pour laisser
                        votre nom et un message.
                      </li>
                    </ol>

                    <div className="address">
                      <strong>Adresse de livraison</strong>
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
                        {copied ? 'Adresse copiée ✓' : 'Copier l’adresse'}
                      </button>
                      <a
                        className="btn btn-primary"
                        href={product.amazonUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ouvrir sur Amazon.fr
                      </a>
                      <a
                        className="btn btn-ghost"
                        href={product.wishlistUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Voir la wishlist
                      </a>
                    </div>
                  </div>
                ) : null}

                {tab === 'donate' ? (
                  <div className="panel-box">
                    <h3>Don pour ce produit</h3>
                    <p>
                      Idéal si vous ne souhaitez pas passer commande. Indiquez
                      votre nom — la fiche sera grisée pour tout le monde.
                    </p>
                    {paypalUrl(product.price) || DONATION_LINK ? (
                      <p style={{ margin: '0.85rem 0' }}>
                        <a
                          className="btn btn-primary"
                          href={paypalUrl(product.price) || DONATION_LINK}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Donner
                          {product.price != null
                            ? ` ${formatPrice(product.price)}`
                            : ''}{' '}
                          via PayPal
                        </a>
                      </p>
                    ) : (
                      <p style={{ margin: '0.85rem 0' }}>
                        Contactez Steven ou Sherally pour PayPal, puis validez
                        le formulaire ci-dessous.
                      </p>
                    )}
                    <form
                      className="form-grid"
                      onSubmit={(e) => handleClaim(e, 'donation')}
                    >
                      <label>
                        Votre prénom
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex. Tante Marie"
                          required
                        />
                      </label>
                      <label>
                        Montant (€)
                        <span className="hint">
                          Suggestion : {formatPrice(product.price)}
                        </span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </label>
                      <label>
                        Message (optionnel)
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Un petit mot pour les parents…"
                        />
                      </label>
                      {error ? <p className="form-error">{error}</p> : null}
                      {ok ? <p className="form-ok">{ok}</p> : null}
                      <button
                        className="btn btn-primary btn-block"
                        type="submit"
                        disabled={busy}
                      >
                        Confirmer mon don
                      </button>
                    </form>
                  </div>
                ) : null}

                {tab === 'claim' ? (
                  <div className="panel-box">
                    <h3>J’ai acheté / offert cet article</h3>
                    <p>
                      Dites qui vous êtes pour que la famille voie que c’est
                      déjà pris. Vous pouvez joindre une capture d’écran de
                      commande.
                    </p>
                    <form
                      className="form-grid"
                      onSubmit={(e) => handleClaim(e, 'purchase')}
                    >
                      <label>
                        Votre prénom
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex. Cousin Julien"
                          required
                        />
                      </label>
                      <label>
                        Message (optionnel)
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Bienvenue petit Nehemia 💙"
                        />
                      </label>
                      <label>
                        N° de commande / note
                        <span className="hint">Facultatif</span>
                        <input
                          type="text"
                          value={proofNote}
                          onChange={(e) => setProofNote(e.target.value)}
                          placeholder="Ex. Commande 302-…"
                        />
                      </label>
                      <label>
                        Preuve d’achat (image)
                        <span className="hint">Capture d’écran facultative</span>
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
                        Publier sur la liste
                      </button>
                    </form>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="modal-panel">
              <div className="panel-box">
                <h3>Déjà offert</h3>
                <p>
                  Merci à <strong>{claim.name}</strong>
                  {claim.type === 'donation' ? ' (don)' : ''}.
                </p>
                {claim.message ? <p>« {claim.message} »</p> : null}
                {claim.proofDataUrl ? (
                  <p style={{ marginTop: '0.75rem' }}>
                    <img
                      src={claim.proofDataUrl}
                      alt="Preuve d’achat"
                      style={{
                        maxWidth: '100%',
                        borderRadius: 12,
                        border: '1px solid var(--line)',
                      }}
                    />
                  </p>
                ) : null}
                <p style={{ marginTop: '1rem' }}>
                  <a className="btn btn-ghost" href="#liste" onClick={onClose}>
                    Retour à la liste
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

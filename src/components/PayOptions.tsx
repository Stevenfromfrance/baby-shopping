import { useState } from 'react'
import { DONATION_LINK, WERO_NUMBER, formatWeroNumber, paypalUrl } from '../config'
import { copyText } from '../lib/utils'
import { useLang } from '../i18n'

type Props = {
  variant?: 'light' | 'dark'
  paypalAmount?: number | null
  paypalLabel?: string
}

export function PayOptions({ variant = 'light', paypalAmount, paypalLabel }: Props) {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)
  const paypal = paypalUrl(paypalAmount ?? undefined) || DONATION_LINK

  async function handleCopy() {
    await copyText(WERO_NUMBER)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`pay-options pay-options-${variant}`}>
      {paypal ? (
        <a
          className="pay-option"
          href={paypal}
          target="_blank"
          rel="noreferrer"
        >
          <span className="pay-option-name">PayPal</span>
          <span className="pay-option-lead">{t.paypalHint}</span>
          <span className="pay-option-action">
            {paypalLabel || t.donatePaypal}
          </span>
        </a>
      ) : null}
      <div className="pay-option">
        <span className="pay-option-name">Wero</span>
        <strong className="pay-option-value">{formatWeroNumber()}</strong>
        <span className="pay-option-lead">{t.weroHint}</span>
        <button type="button" className="pay-option-action" onClick={handleCopy}>
          {copied ? t.numberCopied : t.copyNumber}
        </button>
      </div>
    </div>
  )
}

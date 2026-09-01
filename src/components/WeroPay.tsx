import { useState } from 'react'
import { WERO_NUMBER, formatWeroNumber } from '../config'
import { copyText } from '../lib/utils'
import { useLang } from '../i18n'

type Props = {
  variant?: 'light' | 'dark'
}

export function WeroPay({ variant = 'light' }: Props) {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await copyText(WERO_NUMBER)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`wero-pay wero-pay-${variant}`}>
      <span className="wero-brand">Wero</span>
      <strong className="wero-number">{formatWeroNumber()}</strong>
      <p>{t.weroHint}</p>
      <button type="button" className="btn btn-soft" onClick={handleCopy}>
        {copied ? t.numberCopied : t.copyNumber}
      </button>
    </div>
  )
}

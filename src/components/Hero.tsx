import { BABY } from '../config'
import { publicUrl } from '../lib/utils'
import { useLang } from '../i18n'
import { StickerField } from './Stickers'

export function Header() {
  const { lang, t, setLang } = useLang()

  return (
    <header className="site-header">
      <div className="wrap inner">
        <a className="brand-mark" href="#top">
          {BABY.firstName} <span>{BABY.lastName}</span>
        </a>
        <nav className="nav-links" aria-label="Navigation">
          <a href="#comment">{t.navHow}</a>
          <a href="#bebe">{t.navBaby}</a>
          <a href="#maman">{t.navMom}</a>
          <a href="#messages">{t.navMessages}</a>
          <a href="#don">{t.navDonate}</a>
        </nav>
        <div className="lang-switch" role="group" aria-label={t.langSwitch}>
          <button
            type="button"
            className={lang === 'en' ? 'active' : ''}
            onClick={() => setLang('en')}
          >
            {t.langEn}
          </button>
          <button
            type="button"
            className={lang === 'fr' ? 'active' : ''}
            onClick={() => setLang('fr')}
          >
            {t.langFr}
          </button>
        </div>
      </div>
    </header>
  )
}

export function Hero() {
  const { t } = useLang()

  return (
    <section className="hero" id="top">
      <div
        className="hero-photo hero-photo-desktop"
        style={{ backgroundImage: `url(${publicUrl('hero-baby-bw.jpg')})` }}
        aria-hidden
      />
      <div
        className="hero-photo hero-photo-mobile"
        style={{
          backgroundImage: `url(${publicUrl('hero-baby-bw-portrait.jpg')})`,
        }}
        aria-hidden
      />
      <div className="hero-veil" aria-hidden />
      <div className="hero-copy wrap">
        <p className="hero-kicker">{t.kicker}</p>
        <h1 className="hero-name">
          {BABY.firstName}
          <span>{BABY.lastName}</span>
        </h1>
        <p className="hero-parents">
          {BABY.mother} & {BABY.father}
        </p>
        <p className="hero-lede">{t.heroLede}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#bebe">
            {t.heroCtaBaby}
          </a>
          <a className="btn btn-ghost btn-on-dark" href="#maman">
            {t.heroCtaMom}
          </a>
        </div>
      </div>
    </section>
  )
}

export function HowTo() {
  const { t } = useLang()

  return (
    <section className="section section-howto wrap section-with-stickers" id="comment">
      <StickerField variant="section" />
      <div className="section-head section-head-compact">
        <h2>{t.howTitle}</h2>
        <p>{t.howIntro}</p>
      </div>

      <ol className="how-compact">
        <li>
          <span className="how-compact-num">1</span>
          <div>
            <strong>{t.how1Title}</strong>
            <p>{t.how1Body}</p>
          </div>
        </li>
        <li>
          <span className="how-compact-num">2</span>
          <div>
            <strong>{t.how2Title}</strong>
            <p>{t.how2Body}</p>
          </div>
        </li>
        <li>
          <span className="how-compact-num">3</span>
          <div>
            <strong>{t.how3Title}</strong>
            <p>{t.how3Body}</p>
          </div>
        </li>
      </ol>

      <div className="how-donate-bar">
        <div>
          <strong>{t.how4Title}</strong>
          <p>{t.how4Body}</p>
        </div>
        <a className="btn btn-primary" href="#don">
          {t.how4Cta}
        </a>
      </div>
    </section>
  )
}

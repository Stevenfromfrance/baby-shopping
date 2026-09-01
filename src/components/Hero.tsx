import { BABY } from '../config'
import { publicUrl } from '../lib/utils'
import { useLang } from '../i18n'

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
    <section className="section wrap" id="comment">
      <div className="section-head">
        <h2>{t.howTitle}</h2>
        <p>{t.howIntro}</p>
      </div>
      <div className="paths">
        <article className="path-card">
          <div className="path-num">01</div>
          <h3>{t.how1Title}</h3>
          <p>{t.how1Body}</p>
        </article>
        <article className="path-card">
          <div className="path-num">02</div>
          <h3>{t.how2Title}</h3>
          <p>{t.how2Body}</p>
        </article>
        <article className="path-card">
          <div className="path-num">03</div>
          <h3>{t.how3Title}</h3>
          <p>{t.how3Body}</p>
        </article>
      </div>
    </section>
  )
}

import { BABY } from '../config'
import { publicUrl } from '../lib/utils'

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap inner">
        <a className="brand-mark" href="#top">
          {BABY.firstName}
        </a>
        <nav className="nav-links" aria-label="Navigation">
          <a href="#comment">Comment participer</a>
          <a href="#bebe">Bébé</a>
          <a href="#maman">Maman</a>
          <a href="#messages">Messages</a>
          <a href="#don">Don</a>
        </nav>
      </div>
    </header>
  )
}

export function Hero() {
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
        <p className="hero-kicker">Pour son arrivée</p>
        <h1 className="hero-name">{BABY.firstName}</h1>
        <p className="hero-lede">
          Un cadeau sur Amazon, ou un don — comme vous voulez. Chaque geste
          compte pour l’accueillir.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#bebe">
            Pour le bébé
          </a>
          <a className="btn btn-ghost btn-on-dark" href="#maman">
            Pour la maman
          </a>
        </div>
      </div>
    </section>
  )
}

export function HowTo() {
  return (
    <section className="section wrap" id="comment">
      <div className="section-head">
        <h2>Trois façons de participer</h2>
        <p>
          Pas besoin d’être à l’aise avec internet. Choisissez ce qui vous
          convient — on a tout simplifié.
        </p>
      </div>
      <div className="paths">
        <article className="path-card">
          <div className="path-num">01</div>
          <h3>Commander sur Amazon</h3>
          <p>
            Ouvrez la fiche, suivez le guide de livraison Colis Colibri, puis
            indiquez que c’est vous qui avez offert le cadeau.
          </p>
        </article>
        <article className="path-card">
          <div className="path-num">02</div>
          <h3>Donner pour un produit</h3>
          <p>
            Vous préférez ne pas commander ? Sur la fiche, faites un don du
            montant du produit. On s’occupe du reste.
          </p>
        </article>
        <article className="path-card">
          <div className="path-num">03</div>
          <h3>Don libre</h3>
          <p>
            Aucune idée précise ? Un don libre aide aussi — couches, soins, ou
            petites surprises du quotidien.
          </p>
        </article>
      </div>
    </section>
  )
}

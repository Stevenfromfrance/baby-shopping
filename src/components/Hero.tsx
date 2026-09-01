import { BABY } from '../config'

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap inner">
        <a className="brand-mark" href="#top">
          {BABY.firstName}
        </a>
        <nav className="nav-links" aria-label="Navigation">
          <a href="#comment">Comment participer</a>
          <a href="#liste">Liste</a>
          <a href="#messages">Messages</a>
          <a href="#don">Don libre</a>
        </nav>
      </div>
    </header>
  )
}

export function Hero() {
  return (
    <section className="hero wrap" id="top">
      <p className="hero-kicker">Liste de naissance</p>
      <h1 className="hero-name">
        {BABY.firstName}
        <span>{BABY.lastName}</span>
      </h1>
      <p className="hero-parents">
        Avec tout notre amour, {BABY.father} & {BABY.mother}
      </p>
      <p className="hero-lede">
        Choisissez un cadeau sur Amazon, ou faites simplement un don — même sans
        commander. Chaque geste compte pour accueillir Nehemia.
      </p>
      <div className="hero-actions">
        <a className="btn btn-primary" href="#liste">
          Voir la liste
        </a>
        <a className="btn btn-ghost" href="#don">
          Faire un don libre
        </a>
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

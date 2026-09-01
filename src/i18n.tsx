import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Lang = 'en' | 'fr'

const STORAGE_KEY = 'nehemia-lang'

export const strings = {
  en: {
    htmlLang: 'en',
    title: 'Nehemia Searwar',
    description:
      'Gifts for the arrival of Nehemia Searwar, with love from Sherally and Steven.',
    navHow: 'How to take part',
    navBaby: 'Baby',
    navMom: 'Mother',
    navMessages: 'Messages',
    navDonate: 'Contribute',
    langEn: 'EN',
    langFr: 'FR',
    langSwitch: 'Language',
    kicker: 'Welcoming',
    heroLede: 'You are invited to celebrate the arrival of their son.',
    heroCtaBaby: 'Gifts for baby',
    heroCtaMom: 'Gifts for mother',
    howTitle: 'How to take part',
    howIntro: 'A few simple ways to share in this moment.',
    how1Title: 'Choose a gift',
    how1Body:
      'Open an item, order it on Amazon, and ship it to the Colis Colibri address.',
    how2Title: 'Contribute toward an item',
    how2Body:
      'If you would rather not place an order, you may contribute the amount of a gift.',
    how3Title: 'A contribution',
    how3Body:
      'A PayPal contribution is equally welcome, and will be used with care.',
    giftsTitle: 'The gifts',
    giftsIntro:
      'Two collections — one for Nehemia, one for Sherally — chosen with care.',
    hideGifted: 'Hide gifts already given',
    babyTitle: 'For the baby',
    babyIntro: 'For Nehemia’s first days: care, rest, and the little essentials.',
    momTitle: 'For the mother',
    momIntro: 'For Sherally: nursing, carrying, and the days after birth.',
    available: 'available',
    empty: 'Nothing to show here yet.',
    gifted: 'Given',
    givenBy: 'Given by',
    restoreGift: 'Make available again',
    restoreConfirm:
      'Mark this gift as available again? The name and message will be removed from the list.',
    restored: 'This gift is available again.',
    adminPinLabel: 'Family code',
    adminPinHint: 'Steven or Sherally only — this puts the gift back on the list.',
    adminPinWrong: 'That code is not right.',
    adminOn: 'Admin mode is on. You can restore a gift that was marked by mistake.',
    amazonFr: 'Amazon.fr',
    thanks: 'With thanks to',
    seeAmazon: 'See on Amazon',
    messagesTitle: 'Kind words',
    messagesIntro: 'Notes and gifts appear here as they arrive.',
    messagesEmpty: 'No messages yet.',
    donatedFor: 'contributed toward',
    offered: 'chose',
    donateTitle: 'A contribution',
    donateBody:
      'Should you wish to offer something of your own choosing, PayPal is the simplest way.',
    donateBtn: 'Contribute with PayPal',
    footerThanks: 'Sherally & Steven — with our love and gratitude.',
    close: 'Close',
    alreadyBy: 'Already given by',
    order: 'Order',
    donate: 'Contribute',
    iGave: 'I chose this gift',
    amazonGuide: 'Ordering on Amazon',
    orderStep1: 'Open the item on Amazon.fr with the button below.',
    orderStep2: 'Add it to your basket and complete the order.',
    orderStep3a: 'At delivery, use the',
    orderStep3b: 'address below — not your own.',
    orderStep4:
      'Return here under “I chose this gift” to leave your name and a note.',
    addressLabel: 'Delivery address',
    copied: 'Address copied',
    copyAddress: 'Copy address',
    openAmazon: 'Open on Amazon.fr',
    viewWishlist: 'View the Amazon list',
    donateItemTitle: 'Contribute toward this gift',
    donateItemBody:
      'A thoughtful alternative to placing an order. Your name will appear beside the item.',
    donatePaypal: 'Contribute via PayPal',
    contactPaypal: 'Write to Steven or Sherally for PayPal, then confirm below.',
    yourName: 'Your name',
    namePh: 'e.g. Aunt Marie',
    amount: 'Amount (€)',
    suggestion: 'Suggested',
    message: 'A note (optional)',
    messagePh: 'A few words for the family…',
    confirmDonate: 'Confirm my contribution',
    iBoughtTitle: 'I ordered or chose this item',
    iBoughtBody:
      'Leave your name so the family knows it is already taken. A screenshot is optional.',
    cousinPh: 'e.g. Cousin Julien',
    welcomePh: 'Welcome, little Nehemia',
    orderNote: 'Order number / note',
    optional: 'Optional',
    proof: 'Proof of purchase (image)',
    screenshot: 'Optional screenshot',
    publish: 'Share on the list',
    alreadyTitle: 'Already given',
    thankYou: 'Thank you to',
    donationTag: '(contribution)',
    proofAlt: 'Proof of purchase',
    backToList: 'Back to the gifts',
    nameRequired: 'Please enter your name.',
    proofType: 'The proof must be an image.',
    compressFail: 'Unable to compress the image.',
    fileFail: 'Unable to read the file.',
    thanksDonate: 'Thank you. Your contribution is now on the list.',
    thanksGift: 'Thank you. This gift is now marked as given.',
    genericError: 'Something went wrong.',
    contact:
      'A question? Write to Steven or Sherally — they will gladly help.',
    listBaby: 'Baby',
    listMom: 'Mother',
    categories: {
      'Toilette & soins': 'Bath & care',
      'Biberons & repas': 'Bottles & feeding',
      'Chambre & sommeil': 'Nursery & sleep',
      'Couches & hygiène': 'Nappies & hygiene',
      'Rangement & sorties': 'Outings & storage',
      Allaitement: 'Nursing',
      Portage: 'Babywearing',
      'Soins maman': 'Mother’s care',
      'Post-partum': 'Postpartum',
    } as Record<string, string>,
  },
  fr: {
    htmlLang: 'fr',
    title: 'Nehemia Searwar',
    description:
      'Cadeaux pour l’arrivée de Nehemia Searwar, avec tout l’amour de Sherally et Steven.',
    navHow: 'Participer',
    navBaby: 'Bébé',
    navMom: 'Maman',
    navMessages: 'Messages',
    navDonate: 'Contribuer',
    langEn: 'EN',
    langFr: 'FR',
    langSwitch: 'Langue',
    kicker: 'Pour son arrivée',
    heroLede: 'Vous êtes invités à célébrer l’arrivée de leur fils.',
    heroCtaBaby: 'Pour le bébé',
    heroCtaMom: 'Pour la maman',
    howTitle: 'Comment participer',
    howIntro: 'Quelques façons simples de prendre part à ce moment.',
    how1Title: 'Choisir un cadeau',
    how1Body:
      'Ouvrez un article, commandez-le sur Amazon, et faites-le livrer à l’adresse Colis Colibri.',
    how2Title: 'Contribuer pour un article',
    how2Body:
      'Si vous préférez ne pas commander, vous pouvez contribuer du montant d’un cadeau.',
    how3Title: 'Une contribution',
    how3Body:
      'Une contribution par PayPal est tout aussi bienvenue, et sera utilisée avec soin.',
    giftsTitle: 'Les cadeaux',
    giftsIntro:
      'Deux collections — une pour Nehemia, une pour Sherally — choisies avec attention.',
    hideGifted: 'Masquer les cadeaux déjà offerts',
    babyTitle: 'Pour le bébé',
    babyIntro:
      'Pour les premiers jours de Nehemia : le soin, le repos, les essentiels.',
    momTitle: 'Pour la maman',
    momIntro:
      'Pour Sherally : l’allaitement, le portage, et les jours après la naissance.',
    available: 'disponibles',
    empty: 'Rien à afficher pour le moment.',
    gifted: 'Offert',
    givenBy: 'Offert par',
    restoreGift: 'Remettre disponible',
    restoreConfirm:
      'Remettre ce cadeau disponible ? Le nom et le message disparaîtront de la liste.',
    restored: 'Ce cadeau est de nouveau disponible.',
    adminPinLabel: 'Code famille',
    adminPinHint:
      'Steven ou Sherally seulement — cela remet le cadeau sur la liste.',
    adminPinWrong: 'Ce code n’est pas le bon.',
    adminOn:
      'Mode admin activé. Vous pouvez remettre un cadeau offert par erreur.',
    amazonFr: 'Amazon.fr',
    thanks: 'Avec nos remerciements à',
    seeAmazon: 'Voir sur Amazon',
    messagesTitle: 'Quelques mots',
    messagesIntro: 'Les messages et les cadeaux apparaissent ici au fil du temps.',
    messagesEmpty: 'Aucun message pour l’instant.',
    donatedFor: 'a contribué pour',
    offered: 'a choisi',
    donateTitle: 'Une contribution',
    donateBody:
      'Si vous souhaitez offrir autrement, PayPal est la voie la plus simple.',
    donateBtn: 'Contribuer par PayPal',
    footerThanks: 'Sherally & Steven — avec tout notre amour et notre gratitude.',
    close: 'Fermer',
    alreadyBy: 'Déjà offert par',
    order: 'Commander',
    donate: 'Contribuer',
    iGave: 'J’ai choisi ce cadeau',
    amazonGuide: 'Commander sur Amazon',
    orderStep1: 'Ouvrez l’article sur Amazon.fr avec le bouton ci-dessous.',
    orderStep2: 'Ajoutez-le au panier et terminez la commande.',
    orderStep3a: 'À la livraison, utilisez l’adresse',
    orderStep3b: 'ci-dessous — pas la vôtre.',
    orderStep4:
      'Revenez ici, onglet « J’ai choisi ce cadeau », pour laisser votre nom et un mot.',
    addressLabel: 'Adresse de livraison',
    copied: 'Adresse copiée',
    copyAddress: 'Copier l’adresse',
    openAmazon: 'Ouvrir sur Amazon.fr',
    viewWishlist: 'Voir la liste Amazon',
    donateItemTitle: 'Contribuer pour ce cadeau',
    donateItemBody:
      'Une belle alternative à la commande. Votre nom apparaîtra auprès de l’article.',
    donatePaypal: 'Contribuer par PayPal',
    contactPaypal:
      'Écrivez à Steven ou Sherally pour PayPal, puis confirmez ci-dessous.',
    yourName: 'Votre nom',
    namePh: 'Ex. Tante Marie',
    amount: 'Montant (€)',
    suggestion: 'Suggestion',
    message: 'Un mot (facultatif)',
    messagePh: 'Quelques mots pour la famille…',
    confirmDonate: 'Confirmer ma contribution',
    iBoughtTitle: 'J’ai commandé ou choisi cet article',
    iBoughtBody:
      'Laissez votre nom pour que la famille sache que c’est déjà pris. Une capture n’est pas obligatoire.',
    cousinPh: 'Ex. Cousin Julien',
    welcomePh: 'Bienvenue, petit Nehemia',
    orderNote: 'N° de commande / note',
    optional: 'Facultatif',
    proof: 'Preuve d’achat (image)',
    screenshot: 'Capture d’écran facultative',
    publish: 'Publier sur la liste',
    alreadyTitle: 'Déjà offert',
    thankYou: 'Merci à',
    donationTag: '(contribution)',
    proofAlt: 'Preuve d’achat',
    backToList: 'Retour aux cadeaux',
    nameRequired: 'Indiquez votre nom.',
    proofType: 'La preuve doit être une image.',
    compressFail: 'Compression impossible.',
    fileFail: 'Lecture du fichier impossible.',
    thanksDonate: 'Merci. Votre contribution est affichée.',
    thanksGift: 'Merci. Ce cadeau est marqué comme offert.',
    genericError: 'Une erreur est survenue.',
    contact:
      'Une question ? Écrivez à Steven ou Sherally — ils vous aideront avec plaisir.',
    listBaby: 'Bébé',
    listMom: 'Maman',
    categories: {
      'Toilette & soins': 'Toilette & soins',
      'Biberons & repas': 'Biberons & repas',
      'Chambre & sommeil': 'Chambre & sommeil',
      'Couches & hygiène': 'Couches & hygiène',
      'Rangement & sorties': 'Rangement & sorties',
      Allaitement: 'Allaitement',
      Portage: 'Portage',
      'Soins maman': 'Soins maman',
      'Post-partum': 'Post-partum',
    } as Record<string, string>,
  },
} as const

export type Strings = (typeof strings)[Lang]

type LangContextValue = {
  lang: Lang
  t: Strings
  setLang: (lang: Lang) => void
}

const LangContext = createContext<LangContextValue | null>(null)

function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'fr' || stored === 'en') return stored
  } catch {
    /* ignore */
  }
  return 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  useEffect(() => {
    document.documentElement.lang = strings[lang].htmlLang
    document.title = strings[lang].title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', strings[lang].description)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignore */
    }
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      t: strings[lang],
      setLang: (next: Lang) => setLangState(next),
    }),
    [lang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}

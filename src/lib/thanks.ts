import type { Lang } from '../i18n'

const FR = [
  (name: string) =>
    `Merci infiniment, ${name}. Votre geste nous touche beaucoup — Nehemia a de la chance d’être entouré ainsi.`,
  (name: string) =>
    `Un grand merci, ${name}. On a le cœur chaud en lisant vos mots.`,
  (name: string) =>
    `Merci du fond du cœur, ${name}. Votre cadeau et votre message comptent énormément pour nous.`,
  (name: string) =>
    `Merci, ${name}. On vous embrasse fort — à très bientôt pour faire connaissance avec Nehemia.`,
  (name: string) =>
    `${name}, merci pour votre douceur. On pense à vous avec beaucoup d’amour.`,
]

const EN = [
  (name: string) =>
    `Thank you so much, ${name}. Your kindness means the world — Nehemia is lucky to be surrounded like this.`,
  (name: string) =>
    `A huge thank you, ${name}. Your note warmed our hearts.`,
  (name: string) =>
    `From the bottom of our hearts, thank you ${name}. Your gift and words mean so much to us.`,
  (name: string) =>
    `Thank you, ${name}. Sending you a big hug — we can’t wait for you to meet Nehemia.`,
  (name: string) =>
    `${name}, thank you for your sweetness. We’re thinking of you with so much love.`,
]

const NL = [
  (name: string) =>
    `Heel erg bedankt, ${name}. Jullie gebaar raakt ons diep — Nehemia heeft geluk met zulke lieve mensen om zich heen.`,
  (name: string) =>
    `Een groot dankjewel, ${name}. Jullie berichtje maakt ons hart warm.`,
  (name: string) =>
    `Van harte bedankt, ${name}. Jullie cadeau en woorden betekenen zoveel voor ons.`,
  (name: string) =>
    `Dank je, ${name}. Een dikke knuffel — we kunnen niet wachten tot jullie Nehemia ontmoeten.`,
  (name: string) =>
    `${name}, dank voor jullie zachtheid. We denken met heel veel liefde aan jullie.`,
]

function hashKey(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0
  }
  return h
}

function displayName(raw: string, lang: Lang): string {
  const trimmed = raw.trim()
  if (!trimmed) {
    if (lang === 'fr') return 'vous'
    if (lang === 'nl') return 'vriend'
    return 'friend'
  }
  return trimmed.split(/\s+/)[0] || trimmed
}

export function generateThanks(
  name: string,
  message: string,
  lang: Lang,
  claimKey: string,
): string {
  const templates = lang === 'fr' ? FR : lang === 'nl' ? NL : EN
  const who = displayName(name, lang)
  const idx = hashKey(`${claimKey}|${name}|${message}`) % templates.length
  return templates[idx](who)
}

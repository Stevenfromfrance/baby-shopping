export type ThanksLang = 'en' | 'fr'

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

function hashKey(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0
  }
  return h
}

function displayName(raw: string, lang: ThanksLang): string {
  const trimmed = raw.trim()
  if (!trimmed) return lang === 'fr' ? 'vous' : 'friend'
  return trimmed.split(/\s+/)[0] || trimmed
}

export function generateThanks(
  name: string,
  message: string,
  lang: ThanksLang,
  claimKey: string,
): string {
  const templates = lang === 'fr' ? FR : EN
  const who = displayName(name, lang)
  const idx = hashKey(`${claimKey}|${name}|${message}`) % templates.length
  return templates[idx](who)
}

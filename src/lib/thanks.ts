/** Personal thank-you replies matched on the giver’s name. */
const PERSONAL: Array<{ match: RegExp; text: string }> = [
  {
    match: /\b(debbie|deborah)\b/i,
    text: 'thank you aunty debbie',
  },
  {
    match: /\bsharon\b/i,
    text: 'Thank you Auntie Sharon ❤️❤️ for the lovely gift for the baby!',
  },
  {
    match: /\bstepho\b/i,
    text: 'Thank you Stepho, Xavier, Olivia and Gabriel — we love you so much.',
  },
  {
    match: /\b(krystyna|christian\s+poty)\b/i,
    text: 'Krystyna et Christian Poty merci énormément pour votre soutien ❤️',
  },
  {
    match: /\bdenise\b/i,
    text: 'thanks mom and dad ❤️ love u guys thanks for support',
  },
]

const DEFAULT =
  'Thank you so much for this gift for Nehemia ❤️❤️❤️'

/** Personal reply if known, otherwise a thank-you with hearts for every gift. */
export function generateThanks(name: string): string {
  const personal = PERSONAL.find((entry) => entry.match.test(name.trim()))
  return personal?.text ?? DEFAULT
}

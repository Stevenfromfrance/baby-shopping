/** Manual thank-you replies only — matched on the giver’s name. */
const PERSONAL: Array<{ match: RegExp; text: string }> = [
  {
    match: /\b(debbie|deborah)\b/i,
    text: 'thank you aunty debbie',
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

/** Returns a manual reply, or empty string if none is defined for this giver. */
export function generateThanks(name: string): string {
  const personal = PERSONAL.find((entry) => entry.match.test(name.trim()))
  return personal?.text ?? ''
}

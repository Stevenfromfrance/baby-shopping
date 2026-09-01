import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const products = JSON.parse(
  fs.readFileSync(path.join(root, 'public', 'products.json'), 'utf8'),
)
const outDir = path.join(root, 'public', 'products')
const ua =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'

function asinOf(url) {
  const m = String(url).match(/\/dp\/([A-Z0-9]{10})/)
  return m ? m[1] : null
}

function encodeImageUrl(url) {
  return url.replace(/images\/I\/([^/?]+)/, (_, id) => `images/I/${encodeURIComponent(id)}`)
}

function firstHiRes(html) {
  const matches = [...html.matchAll(/"hiRes":"(https:\\\/\\\/m\.media-amazon\.com\\\/images\\\/I\\\/[^"]+)"/g)]
  const plain = [...html.matchAll(/"hiRes":"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g)]
  const all = [...matches, ...plain].map((m) =>
    m[1].replace(/\\\//g, '/').replace(/\\u0026/g, '&'),
  )
  return all.find((u) => u.includes('SL1500') || u.includes('SL1000')) || all[0] || null
}

async function download(url, dest) {
  const res = await fetch(encodeImageUrl(url), {
    headers: { 'User-Agent': ua, Accept: 'image/jpeg,image/*;q=0.9' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 8000) throw new Error(`too small (${buf.length})`)
  fs.writeFileSync(dest, buf)
  return buf.length
}

const results = []
for (const product of products) {
  const asin = asinOf(product.amazonUrl)
  const dest = path.join(outDir, path.basename(product.image || `${product.id}.jpg`))
  if (!asin || !product.image) {
    results.push(`${product.id} SKIP no asin`)
    continue
  }
  try {
    const html = await fetch(`https://www.amazon.fr/dp/${asin}`, {
      headers: {
        'User-Agent': ua,
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        Accept: 'text/html',
      },
    }).then((r) => r.text())
    const hi = firstHiRes(html)
    if (!hi) throw new Error('no hiRes')
    const bytes = await download(hi, dest)
    results.push(`${product.id} OK ${asin} ${bytes} ${hi.split('/').pop()}`)
  } catch (err) {
    results.push(`${product.id} FAIL ${asin} ${err.message}`)
  }
  await new Promise((r) => setTimeout(r, 450))
}

console.log(results.join('\n'))
const ok = results.filter((l) => l.includes(' OK ')).length
const fail = results.filter((l) => l.includes(' FAIL ')).length
console.log(`\nDONE ok=${ok} fail=${fail}`)

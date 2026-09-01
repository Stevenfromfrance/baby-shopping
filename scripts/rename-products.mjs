import fs from 'node:fs'

const path = new URL('../public/products.json', import.meta.url)
const products = JSON.parse(fs.readFileSync(path, 'utf8'))

const names = {
  'baby-01': {
    title: 'Kit de puériculture Philips Avent',
    titleEn: 'Philips Avent grooming kit',
  },
  'baby-02': {
    title: 'Chauffe-biberon Philips Avent',
    titleEn: 'Philips Avent bottle warmer',
  },
  'baby-03': {
    title: 'Draps-housses Trois Kilos Sept, lot de 2',
    titleEn: 'Trois Kilos Sept fitted sheets, set of 2',
  },
  'baby-04': {
    title: 'Pâte à l’eau Eryplast',
    titleEn: 'Eryplast nappy rash cream',
  },
  'baby-05': {
    title: 'Paniers à linge pliables, lot de 2',
    titleEn: 'Foldable laundry baskets, set of 2',
  },
  'baby-07': {
    title: 'Aspirateur nasal NoseFrida',
    titleEn: 'Frida Baby NoseFrida nasal aspirator',
  },
  'baby-08': {
    title: 'Stérilisateur et sèche-biberon Philips Avent',
    titleEn: 'Philips Avent steriliser and dryer',
  },
  'baby-09': {
    title: 'Boîte doseuse NUK',
    titleEn: 'NUK milk powder dispenser',
  },
  'baby-10': {
    title: 'Kit biberons en verre Philips Avent',
    titleEn: 'Philips Avent glass bottle starter set',
  },
  'baby-11': {
    title: 'Gel lavant bio Mustela, 400 ml',
    titleEn: 'Mustela organic wash gel, 400 ml',
  },
  'baby-12': {
    title: 'Crème hydratante bio Mustela, 150 ml',
    titleEn: 'Mustela organic moisturising cream, 150 ml',
  },
  'baby-15': {
    title: 'Thermomètre électronique Thermoval',
    titleEn: 'Thermoval digital thermometer',
  },
  'baby-16': {
    title: 'Table à langer Twinly Bubbly avec baignoire',
    titleEn: 'Twinly Bubbly changing table with bath',
  },
  'baby-19': {
    title: 'Lingettes Pampers 99 % d’eau, 540',
    titleEn: 'Pampers 99% water wipes, 540',
  },
  'baby-20': {
    title: 'Spray solaire NIVEA SUN Kids FPS 50+',
    titleEn: 'NIVEA SUN Kids spray SPF 50+',
  },
  'baby-21': {
    title: 'Sérum physiologique Cooper, 30 unidoses',
    titleEn: 'Cooper saline solution, 30 vials',
  },
  'baby-22': {
    title: 'Pochette à couches HAMUR HOME',
    titleEn: 'HAMUR HOME nappy pouch',
  },
  'baby-24': {
    title: 'Coton pads bio Carryboo, 150',
    titleEn: 'Carryboo organic cotton pads, 150',
  },
  'baby-27': {
    title: 'Sacs à couches parfumés Ubbi, 200',
    titleEn: 'Ubbi scented nappy sacks, 200',
  },
  'baby-29': {
    title: 'Sac à langer Dikaslon',
    titleEn: 'Dikaslon changing backpack',
  },
  'baby-31': {
    title: 'Berceau cododo Maxi-Cosi Iora',
    titleEn: 'Maxi-Cosi Iora co-sleeper crib',
  },
  'baby-33': {
    title: 'Sucettes Soothie Philips Avent, lot de 2',
    titleEn: 'Philips Avent Soothie soothers, pack of 2',
  },
  'baby-35': {
    title: 'Poussette trio Maxi-Cosi Zelia S',
    titleEn: 'Maxi-Cosi Zelia S Trio travel system',
  },
  'mom-01': {
    title: 'Double tire-lait mains libres Philips Avent',
    titleEn: 'Philips Avent hands-free double breast pump',
  },
  'mom-03': {
    title: 'Coussin d’allaitement My Brest Friend Deluxe',
    titleEn: 'My Brest Friend deluxe nursing pillow',
  },
  'mom-04': {
    title: 'Coussinets d’allaitement lavables Lansinoh, 8',
    titleEn: 'Lansinoh washable nursing pads, 8',
  },
  'mom-06': {
    title: 'Sachets de conservation Philips Avent, 50',
    titleEn: 'Philips Avent milk storage bags, 50',
  },
  'mom-07': {
    title: 'Porte-bébé Ergobaby Embrace',
    titleEn: 'Ergobaby Embrace newborn carrier',
  },
  'mom-09': {
    title: 'Tire-lait manuel Philips Avent',
    titleEn: 'Philips Avent manual breast pump',
  },
  'mom-11': {
    title: 'Slips jetables maternité Tigex, lot de 5',
    titleEn: 'Tigex disposable maternity briefs, pack of 5',
  },
  'mom-12': {
    title: 'Culottes post-partum Always Discreet, taille L',
    titleEn: 'Always Discreet postpartum pants, size L',
  },
  'mom-13': {
    title: 'Serviettes de maternité Abena, 2 × 14',
    titleEn: 'Abena maternity pads, 2 × 14',
  },
  'mom-15': {
    title: 'Sachets de conservation Medela Easy Pour, 50',
    titleEn: 'Medela Easy Pour milk bags, 50',
  },
  'mom-17': {
    title: 'Bouteille périnéale Frida Mom',
    titleEn: 'Frida Mom peri bottle',
  },
  'mom-18': {
    title: 'Spray périnéal Lansinoh, 100 ml',
    titleEn: 'Lansinoh perineal spray, 100 ml',
  },
  'mom-19': {
    title: 'Bouteille périnéale Dr. Talbot’s, 360 ml',
    titleEn: 'Dr. Talbot’s peri bottle, 360 ml',
  },
  'mom-20': {
    title: 'Crème lanoline Medela Purelan, 37 g',
    titleEn: 'Medela Purelan lanolin cream, 37 g',
  },
}

const missing = []
for (const p of products) {
  const n = names[p.id]
  if (!n) {
    missing.push(`${p.id} ${p.title.slice(0, 60)}`)
    continue
  }
  p.title = n.title
  p.titleEn = n.titleEn
  p.shortTitle = n.title
  if (p.amazonUrl && !p.amazonUrl.includes('/dp/')) {
    console.warn('No dp link', p.id, p.amazonUrl)
  }
}

if (missing.length) {
  console.error('Unmapped products:\n' + missing.join('\n'))
  process.exit(1)
}

fs.writeFileSync(path, JSON.stringify(products, null, 2) + '\n')
console.log('Updated', products.length, 'products')

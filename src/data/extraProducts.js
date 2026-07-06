// Hand-authored mock products for categories not covered by the Amazon
// research CSV (src/data/raw_aquarium_products.csv). Merged into the full
// catalog in products.js.
let n = 0
const id = () => `mx-${++n}`

export const aquariumToys = [
  { category: 'Aquarium Toys & Decor', brand: 'Sobo', name: 'Resin Sunken Ship Ornament', priceRange: '₹450-900', description: 'Decorative hideout for small and medium fish.' },
  { category: 'Aquarium Toys & Decor', brand: 'Boyu', name: 'Bubble Diver Air Ornament', priceRange: '₹250-500', description: 'Air-stone powered moving diver toy.' },
  { category: 'Aquarium Toys & Decor', brand: 'Generic', name: 'Betta Fish Hammock Leaf', priceRange: '₹120-250', description: 'Suction-cup resting leaf for bettas.' },
  { category: 'Aquarium Toys & Decor', brand: 'Generic', name: 'Floating Mirror Ball Toy', priceRange: '₹150-300', description: 'Interactive stimulation toy for active fish.' },
  { category: 'Aquarium Toys & Decor', brand: 'Sobo', name: 'Artificial Aquatic Plant Set (6pc)', priceRange: '₹300-700', description: 'Soft silk plants, safe for all fish.' },
  { category: 'Aquarium Toys & Decor', brand: 'Generic', name: 'Driftwood Style Resin Log', priceRange: '₹350-800', description: 'Natural-look hideout and aquascape accent.' },
  { category: 'Aquarium Toys & Decor', brand: 'Boyu', name: 'Air Curtain Bubble Wall', priceRange: '₹300-650', description: 'Aeration bar with playful bubble curtain.' },
  { category: 'Aquarium Toys & Decor', brand: 'Generic', name: 'Colour-Changing LED Air Stone', priceRange: '₹200-450', description: 'RGB air stone for aeration and ambience.' },
  { category: 'Aquarium Toys & Decor', brand: 'Sobo', name: 'Gravel & Pebble Mix 2kg', priceRange: '₹250-500', description: 'Natural substrate for freshwater tanks.' },
  { category: 'Aquarium Toys & Decor', brand: 'Generic', name: 'Fish Tank Background Poster', priceRange: '₹150-400', description: 'Peel-and-stick 3D background scenery.' },
]

export const avianFriends = [
  { category: 'Bird Food', brand: 'Versele-Laga', name: 'Prestige Budgies Seed Mix 1kg', priceRange: '₹450-700', description: 'Balanced seed mix for budgerigars.' },
  { category: 'Bird Food', brand: 'Versele-Laga', name: 'Parrot Loro Premium Mix 1kg', priceRange: '₹600-950', description: 'Premium seed and nut mix for parrots.' },
  { category: 'Bird Food', brand: "Vitapol", name: 'Lovebird Food Mix 500g', priceRange: '₹250-450', description: 'Seed blend formulated for lovebirds.' },
  { category: 'Bird Food', brand: 'Generic', name: 'Cuttlebone Calcium Supplement', priceRange: '₹80-150', description: 'Natural calcium and mineral source.' },
  { category: 'Bird Food', brand: 'Generic', name: 'Honey & Fruit Energy Sticks', priceRange: '₹100-200', description: 'Treat sticks for lovebirds and budgies.' },
  { category: 'Cages & Perches', brand: 'Generic', name: 'Double-Door Parrot Cage (Large)', priceRange: '₹4500-9000', description: 'Powder-coated cage with pull-out tray.' },
  { category: 'Cages & Perches', brand: 'Generic', name: 'Lovebird Breeding Cage', priceRange: '₹1800-3500', description: 'Compact cage with nest-box access.' },
  { category: 'Cages & Perches', brand: 'Generic', name: 'Natural Wood Perch Set (3pc)', priceRange: '₹300-600', description: 'Varied-diameter perches for foot health.' },
  { category: 'Cages & Perches', brand: 'Generic', name: 'Rope Bungee Perch', priceRange: '₹250-500', description: 'Flexible cotton rope perch, easy grip.' },
  { category: 'Cages & Perches', brand: 'Generic', name: 'Cage Cover Cloth (Breathable)', priceRange: '₹300-600', description: 'Night cover for cages, breathable cotton.' },
  { category: 'Bird Toys & Enrichment', brand: 'Generic', name: 'Foraging Puzzle Feeder', priceRange: '₹350-700', description: 'Enrichment toy that hides treats.' },
  { category: 'Bird Toys & Enrichment', brand: 'Generic', name: 'Hanging Bell Chew Toy', priceRange: '₹150-350', description: 'Colourful chew and jingle toy.' },
  { category: 'Bird Toys & Enrichment', brand: 'Generic', name: 'Swing Ladder Combo', priceRange: '₹400-800', description: 'Wooden ladder and swing for climbing.' },
  { category: 'Bird Toys & Enrichment', brand: 'Generic', name: 'Shreddable Foraging Box', priceRange: '₹200-450', description: 'Natural fibre box for shredding behaviour.' },
  { category: 'Grooming & Health', brand: 'Generic', name: 'Bird Bath Tub (Clip-on)', priceRange: '₹250-500', description: 'Attachable bathing tub for cages.' },
  { category: 'Grooming & Health', brand: 'Generic', name: 'Nail & Beak Grooming Perch', priceRange: '₹200-400', description: 'Grinds nails naturally during perching.' },
  { category: 'Grooming & Health', brand: 'Generic', name: 'Avian Multivitamin Drops 30ml', priceRange: '₹300-550', description: 'Daily vitamin supplement for drinking water.' },
  { category: 'Grooming & Health', brand: 'Generic', name: 'Feather Mite Spray 100ml', priceRange: '₹250-450', description: 'Gentle mite and lice control spray.' },
].map((p) => ({ ...p, group: 'avian-friends' }))

const withGroupToys = aquariumToys.map((p) => ({ ...p, group: 'food-toys' }))

export const extraProducts = [...withGroupToys, ...avianFriends].map((p) => ({
  id: id(),
  ...p,
}))

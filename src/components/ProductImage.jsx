import {
  Fish, Waves, Filter, Wind, Lightbulb, Thermometer, FlaskConical, TestTube,
  Shell, Wheat, DoorOpen, Puzzle, HeartPulse, Box,
} from 'lucide-react'
import { hashString } from '../data/utils'

// The mock catalog has 100+ SKUs but only a handful of real product photos,
// so instead of showing broken/mismatched imagery we render a deterministic
// icon-on-gradient tile per sub-category — same idea as a placeholder
// thumbnail in a real storefront while photography is pending.
const iconByCategory = {
  Tanks: Box,
  Filters: Filter,
  'Motors/Pumps': Wind,
  Lights: Lightbulb,
  Heaters: Thermometer,
  'CO2 Systems': FlaskConical,
  'Test Kits': TestTube,
  'Fish Food': Fish,
  'Aquarium Toys & Decor': Shell,
  'Bird Food': Wheat,
  'Cages & Perches': DoorOpen,
  'Bird Toys & Enrichment': Puzzle,
  'Grooming & Health': HeartPulse,
}

const gradients = [
  'from-marina-blue to-marina-indigo',
  'from-marina-indigo to-marina-red',
  'from-marina-red to-marina-redLight',
  'from-marina-green to-marina-cyan',
  'from-marina-cyan to-marina-blue',
  'from-marina-blue to-marina-red',
]

export default function ProductImage({ product, className = '' }) {
  const Icon = iconByCategory[product.category] || Waves
  const gradient = gradients[hashString(product.id) % gradients.length]

  return (
    <div className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${className}`}>
      <Icon className="h-1/3 w-1/3 text-white/85" strokeWidth={1.5} />
    </div>
  )
}

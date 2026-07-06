export const categories = [
  {
    slug: 'tanks-filters',
    name: 'Tanks & Filters',
    tagline: 'Built to last, engineered to thrive.',
    description:
      'Discover our range of durable fish tanks, high-efficiency filtration systems, and reliable accessories engineered for functional utility.',
    image: '/assets/p2_2.png',
    subcategories: ['Tanks', 'Filters', 'Motors/Pumps', 'Lights', 'Heaters', 'CO2 Systems', 'Test Kits'],
  },
  {
    slug: 'food-toys',
    name: 'Food & Aquarium Toys',
    tagline: 'Nutrition and enrichment, science-backed.',
    description:
      'Keep your fishes healthy and engaged with our science-backed nutritional food options and playful aquatic immersion toys designed for optimal stimulation.',
    image: '/assets/p2_4.png',
    subcategories: ['Fish Food', 'Aquarium Toys & Decor'],
  },
  {
    slug: 'avian-friends',
    name: 'Avian Friends',
    tagline: 'Vibrant companions, vibrant care.',
    description:
      'Welcoming love birds and parrots to our family. Explore our growing selection of practical, safe, and enriching accessories for your feathered companions.',
    image: '/assets/p2_6.png',
    subcategories: ['Bird Food', 'Cages & Perches', 'Bird Toys & Enrichment', 'Grooming & Health'],
  },
]

export const getCategory = (slug) => categories.find((c) => c.slug === slug)

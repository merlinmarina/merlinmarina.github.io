export const WHATSAPP_NUMBER = '918124010104'

export const whatsappLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ''}`

export const siteConfig = {
  name: 'Merlin Marina',
  tagline: 'Quality Care For Every Fin And Feather',
  phone: '8124010104',
  hours: 'Mon - Sun, 10:00 AM - 9:00 PM',
  address: 'No- 4A, Hanumar Koil Street, Radha Nagar, Chromepet, Chennai',
  instagram: 'https://www.instagram.com/merlinmarina79',
  youtube: 'https://www.youtube.com/@MerlinmarinaAquarium',
}

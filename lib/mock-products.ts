export interface MockProduct {
  id: number
  handle: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  description: string
  sizes: string[]
  colors: { name: string; hex: string }[]
  rating: number
  reviewCount: number
  category: string
}

export const mockProducts: MockProduct[] = [
  {
    id: 1,
    handle: 'classic-white-tee',
    name: 'Classic White Tee',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop',
    ],
    description: 'A wardrobe essential. Our Classic White Tee is crafted from 100% organic cotton for all-day comfort. The relaxed fit and clean silhouette make it the perfect layering piece or a standalone statement.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#ffffff' },
      { name: 'Black', hex: '#111111' },
      { name: 'Grey', hex: '#9ca3af' },
    ],
    rating: 4.8,
    reviewCount: 124,
    category: 'Tops',
  },
  {
    id: 2,
    handle: 'denim-jacket',
    name: 'Denim Jacket',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&h=800&fit=crop',
    ],
    description: 'A timeless denim jacket built for durability and style. Made from heavyweight cotton denim with a classic fit, chest pockets, and adjustable button cuffs.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Indigo', hex: '#3730a3' },
      { name: 'Light Wash', hex: '#93c5fd' },
      { name: 'Black', hex: '#111111' },
    ],
    rating: 4.6,
    reviewCount: 87,
    category: 'Outerwear',
  },
  {
    id: 3,
    handle: 'leather-sneakers',
    name: 'Leather Sneakers',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
    ],
    description: 'Clean, minimal leather sneakers that go with everything. Full-grain leather upper, cushioned insole, and rubber lug sole for everyday comfort and lasting style.',
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
    colors: [
      { name: 'White', hex: '#f9fafb' },
      { name: 'Tan', hex: '#d97706' },
      { name: 'Black', hex: '#111111' },
    ],
    rating: 4.9,
    reviewCount: 206,
    category: 'Footwear',
  },
  {
    id: 4,
    handle: 'cotton-hoodie',
    name: 'Cotton Hoodie',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop',
    ],
    description: 'Our softest hoodie yet. 400gsm French terry cotton gives it the perfect weight and drape. Kangaroo pocket, ribbed cuffs, and a relaxed fit for effortless everyday wear.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Slate', hex: '#64748b' },
      { name: 'Cream', hex: '#fef3c7' },
      { name: 'Forest', hex: '#166534' },
      { name: 'Black', hex: '#111111' },
    ],
    rating: 4.7,
    reviewCount: 341,
    category: 'Tops',
  },
  {
    id: 5,
    handle: 'slim-fit-jeans',
    name: 'Slim Fit Jeans',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop',
    ],
    description: 'Premium slim-fit jeans cut from stretch cotton denim. A tapered leg and mid-rise waist give a clean, modern silhouette that works dressed up or down.',
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Dark Indigo', hex: '#1e3a5f' },
      { name: 'Mid Wash', hex: '#60a5fa' },
      { name: 'Black', hex: '#111111' },
    ],
    rating: 4.5,
    reviewCount: 178,
    category: 'Bottoms',
  },
  {
    id: 6,
    handle: 'canvas-backpack',
    name: 'Canvas Backpack',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
    ],
    description: 'A rugged 20L canvas backpack for daily use. Features a padded laptop sleeve (fits up to 15"), external zip pocket, and adjustable padded shoulder straps.',
    sizes: ['One Size'],
    colors: [
      { name: 'Olive', hex: '#4d7c0f' },
      { name: 'Tan', hex: '#d97706' },
      { name: 'Navy', hex: '#1e3a8a' },
    ],
    rating: 4.6,
    reviewCount: 92,
    category: 'Accessories',
  },
  {
    id: 7,
    handle: 'wool-beanie',
    name: 'Wool Beanie',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&h=800&fit=crop',
    ],
    description: 'A cozy merino wool beanie that keeps you warm without bulk. Fine-knit construction, ribbed texture, and a slightly slouchy fit. Machine washable.',
    sizes: ['One Size'],
    colors: [
      { name: 'Charcoal', hex: '#374151' },
      { name: 'Camel', hex: '#d97706' },
      { name: 'Burgundy', hex: '#881337' },
      { name: 'Cream', hex: '#fef3c7' },
    ],
    rating: 4.8,
    reviewCount: 55,
    category: 'Accessories',
  },
  {
    id: 8,
    handle: 'sunglasses',
    name: 'Sunglasses',
    price: 149.99,
    originalPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&h=800&fit=crop',
    ],
    description: 'Polarized acetate sunglasses with UV400 protection. Lightweight yet durable frame, spring hinges for a comfortable fit, and scratch-resistant lenses.',
    sizes: ['One Size'],
    colors: [
      { name: 'Tortoise', hex: '#92400e' },
      { name: 'Black', hex: '#111111' },
      { name: 'Clear', hex: '#e5e7eb' },
    ],
    rating: 4.7,
    reviewCount: 63,
    category: 'Accessories',
  },
]

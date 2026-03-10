'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { mockProducts } from '@/lib/mock-products'

interface ProductGridProps {
  settings: any
}

export default function ProductGrid({ settings }: ProductGridProps) {
  const heading = settings.heading?.defaultValue || 'Featured Products'
  const numberOfProducts = settings.numberOfProducts?.defaultValue || 8
  const columns = settings.columns?.defaultValue || 4
  const mobileColumns = settings.mobileColumns?.defaultValue || 2
  const showQuickAdd = settings.showQuickAdd?.defaultValue ?? true
  const cardStyle = settings.cardStyle?.defaultValue || 'standard'

  const products = mockProducts.slice(0, numberOfProducts)

  const gridClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }

  const mobileGridClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {heading}
        </h2>

        <div className={`grid ${mobileGridClasses[mobileColumns] ?? 'grid-cols-2'} md:${gridClasses[columns] ?? 'grid-cols-4'} gap-6`}>
          {products.map((product) => (
            <a key={product.id} href={`/products/${product.handle}`} className="block">
              <ProductCard
                product={product}
                showQuickAdd={showQuickAdd}
                cardStyle={cardStyle}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({
  product,
  showQuickAdd,
  cardStyle,
}: {
  product: (typeof mockProducts)[number]
  showQuickAdd: boolean
  cardStyle: string
}) {
  const [isHovered, setIsHovered] = React.useState(false)

  if (cardStyle === 'minimal') {
    return (
      <div
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-square overflow-hidden mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600">${product.price}</p>
      </div>
    )
  }

  if (cardStyle === 'overlay') {
    return (
      <div
        className="group relative cursor-pointer overflow-hidden rounded-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-white font-semibold mb-1">{product.name}</h3>
          <p className="text-white/90 text-sm">${product.price}</p>
        </div>
        {showQuickAdd && isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Button className="bg-white text-black hover:bg-gray-100" onClick={(e) => e.preventDefault()}>
              Quick Add
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Standard card
  return (
    <div
      className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square overflow-hidden bg-gray-100 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.originalPrice && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
            Sale
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-gray-900">${product.price}</p>
            {product.originalPrice && (
              <p className="text-sm text-gray-400 line-through">${product.originalPrice}</p>
            )}
          </div>
          {showQuickAdd && (
            <Button
              size="sm"
              variant={isHovered ? 'default' : 'outline'}
              className="transition-all"
              onClick={(e) => e.preventDefault()}
            >
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

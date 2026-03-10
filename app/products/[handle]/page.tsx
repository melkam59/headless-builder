'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { mockProducts } from '@/lib/mock-products'
import { useCart } from '@/lib/cart-context'
import { cn } from '@/lib/utils'
import { ArrowLeft, ShoppingBag, Star, Minus, Plus } from 'lucide-react'

export default function ProductDetailPage() {
  const { handle } = useParams<{ handle: string }>()
  const product = mockProducts.find((p) => p.handle === handle)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">Product not found</p>
          <a href="/preview" className="text-sm text-violet-600 hover:underline">
            Back to store
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <a href="/preview" className="hover:text-gray-900 transition-colors">Home</a>
          <span>/</span>
          <span className="text-gray-400">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <ProductDetail product={product} />

        {/* Related products */}
        <div className="mt-20 border-t border-gray-100 pt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mockProducts
              .filter((p) => p.handle !== product.handle)
              .slice(0, 4)
              .map((related) => (
                <a key={related.id} href={`/products/${related.handle}`} className="group block">
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3">
                    <img
                      src={related.image}
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                    {related.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">${related.price}</p>
                </a>
              ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function PageHeader() {
  const { totalItems, openCart } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a
          href="/preview"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to store
        </a>
        <a href="/preview" className="text-xl font-bold text-gray-900 tracking-tight">
          My Store
        </a>
        <button
          onClick={openCart}
          className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}

function ProductDetail({ product }: { product: (typeof mockProducts)[number] }) {
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, selectedColor)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const fullStars = Math.floor(product.rating)
  const hasHalfStar = product.rating % 1 >= 0.5

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      {/* Images */}
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  'w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                  selectedImage === i ? 'border-gray-900' : 'border-transparent hover:border-gray-300',
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-2">
          {product.category}
        </span>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-4 h-4',
                  i < fullStars
                    ? 'fill-amber-400 text-amber-400'
                    : i === fullStars && hasHalfStar
                    ? 'fill-amber-200 text-amber-400'
                    : 'fill-gray-200 text-gray-200',
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">{product.rating}</span>
          <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-3xl font-bold text-gray-900">${product.price}</span>
          {product.originalPrice && (
            <>
              <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
              <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
              </span>
            </>
          )}
        </div>

        <div className="w-full h-px bg-gray-100 mb-6" />

        {/* Color selector */}
        {product.colors.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-900 mb-3">
              Color{selectedColor ? `: ${selectedColor}` : ''}
            </p>
            <div className="flex gap-2.5">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  title={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={cn(
                    'w-8 h-8 rounded-full border-2 transition-all',
                    selectedColor === color.name
                      ? 'border-gray-900 scale-110'
                      : 'border-gray-200 hover:border-gray-400',
                    ['#ffffff', '#f9fafb', '#e5e7eb'].includes(color.hex) ? 'ring-1 ring-gray-200' : '',
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size selector */}
        {product.sizes.length > 1 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-900 mb-3">
              Size{selectedSize ? `: ${selectedSize}` : ''}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg border transition-all',
                    selectedSize === size
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900',
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="flex items-center gap-4 mb-6">
          <p className="text-sm font-semibold text-gray-900">Quantity</p>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2.5 hover:bg-gray-50 transition-colors"
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <span className="px-5 py-2 text-sm font-semibold text-gray-900 border-x border-gray-200 min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2.5 hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Add to cart */}
        <Button
          onClick={handleAddToCart}
          className={cn(
            'w-full h-12 text-base font-semibold rounded-xl transition-all',
            added
              ? 'bg-green-600 hover:bg-green-600 text-white'
              : 'bg-gray-900 hover:bg-gray-700 text-white',
          )}
        >
          {added ? '✓ Added to cart' : 'Add to cart'}
        </Button>

        <div className="w-full h-px bg-gray-100 mt-8 mb-6" />

        {/* Description */}
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-2">Description</p>
          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
        </div>
      </div>
    </div>
  )
}

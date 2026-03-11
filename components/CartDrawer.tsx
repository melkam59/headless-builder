'use client'

import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } = useCart()

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-900" />
            <h2 className="text-base font-semibold text-gray-900">
              Cart {totalItems > 0 && <span className="text-gray-400 font-normal">({totalItems})</span>}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeCart}
            className="text-gray-400 hover:text-gray-700"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-gray-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Your cart is empty</p>
                <p className="text-sm text-gray-500">Add some products to get started</p>
              </div>
              <Button
                variant="outline"
                onClick={closeCart}
                className="mt-2"
              >
                Continue shopping
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 px-5">
              {items.map((item) => (
                <li key={item.id} className="py-5 flex gap-4">
                  {/* Image */}
                  <a href={`/products/${item.product.handle}`} onClick={closeCart}>
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  </a>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href={`/products/${item.product.handle}`}
                        onClick={closeCart}
                        className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors leading-snug"
                      >
                        {item.product.name}
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {(item.size || item.color) && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {[item.color, item.size].filter(Boolean).join(' · ')}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="rounded-none h-7 w-7"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3 text-gray-600" />
                        </Button>
                        <Input
                          readOnly
                          value={item.quantity}
                          className="w-10 h-7 rounded-none border-x border-gray-200 text-center text-sm font-semibold text-gray-900"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="rounded-none h-7 w-7"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3 text-gray-600" />
                        </Button>
                      </div>

                      <p className="text-sm font-bold text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-5 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Shipping</span>
                <span>{totalPrice >= 50 ? 'Free' : '$5.99'}</span>
              </div>
              {totalPrice < 50 && (
                <p className="text-xs text-violet-600">
                  Add ${(50 - totalPrice).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>${(totalPrice + (totalPrice >= 50 ? 0 : 5.99)).toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full h-12 bg-gray-900 hover:bg-gray-700 text-white text-base font-semibold rounded-xl">
              Checkout
            </Button>
            <Button
              variant="ghost"
              onClick={closeCart}
              className="w-full text-sm text-gray-500 hover:text-gray-900 justify-center"
            >
              Continue shopping
            </Button>
          </div>
        )}
      </aside>
    </>
  )
}

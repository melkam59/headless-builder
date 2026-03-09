'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface ProductGridProps {
  settings: any;
}

// Mock product data - in real app, this would come from your database
const mockProducts = [
  {
    id: 1,
    name: 'Classic White Tee',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
  },
  {
    id: 2,
    name: 'Denim Jacket',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
  },
  {
    id: 3,
    name: 'Leather Sneakers',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
  },
  {
    id: 4,
    name: 'Cotton Hoodie',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
  },
  {
    id: 5,
    name: 'Slim Fit Jeans',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
  },
  {
    id: 6,
    name: 'Canvas Backpack',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
  },
  {
    id: 7,
    name: 'Wool Beanie',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=400&fit=crop',
  },
  {
    id: 8,
    name: 'Sunglasses',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
  },
];

export default function ProductGrid({ settings }: ProductGridProps) {
  const heading = settings.heading?.defaultValue || 'Featured Products';
  const numberOfProducts = settings.numberOfProducts?.defaultValue || 8;
  const columns = settings.columns?.defaultValue || 4;
  const mobileColumns = settings.mobileColumns?.defaultValue || 2;
  const showQuickAdd = settings.showQuickAdd?.defaultValue ?? true;
  const cardStyle = settings.cardStyle?.defaultValue || 'standard';

  const products = mockProducts.slice(0, numberOfProducts);

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  const mobileGridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {heading}
        </h2>

        <div
          className={`grid ${mobileGridClasses[mobileColumns as keyof typeof mobileGridClasses]} md:${gridClasses[columns as keyof typeof gridClasses]} gap-6`}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showQuickAdd={showQuickAdd}
              cardStyle={cardStyle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  showQuickAdd,
  cardStyle,
}: {
  product: any;
  showQuickAdd: boolean;
  cardStyle: string;
}) {
  const [isHovered, setIsHovered] = React.useState(false);

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
    );
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
            <Button className="bg-white text-black hover:bg-gray-100">
              Quick Add
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Standard card style
  return (
    <div
      className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900">${product.price}</p>
          {showQuickAdd && (
            <Button
              size="sm"
              variant={isHovered ? 'default' : 'outline'}
              className="transition-all"
            >
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

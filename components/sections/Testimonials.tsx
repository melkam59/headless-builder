'use client'

import { cn } from '@/lib/utils'

interface Block {
  type: string
  settings: any
}

interface TestimonialsProps {
  settings: any
  blocks?: Block[]
}

export default function Testimonials({ settings, blocks = [] }: TestimonialsProps) {
  const heading = settings.heading?.defaultValue || 'What Our Customers Say'
  const layout = settings.layout?.defaultValue || 'carousel'
  const backgroundColor = settings.backgroundColor?.defaultValue || '#f9f9f9'

  return (
    <section className="py-16 px-4" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {heading}
        </h2>

        <div className={cn('grid gap-8', layout === 'grid' ? 'md:grid-cols-3' : 'md:grid-cols-1')}>
          {blocks.map((block, index) => (
            <TestimonialCard key={index} block={block} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ block }: { block: Block }) {
  const quote = block.settings.quote?.defaultValue || ''
  const name = block.settings.name?.defaultValue || ''
  const avatar = block.settings.avatar?.defaultValue || ''
  const rating = block.settings.rating?.defaultValue || 5

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={cn('w-5 h-5', i < rating ? 'text-yellow-400' : 'text-gray-300')}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <p className="text-gray-700 mb-6 italic">&ldquo;{quote}&rdquo;</p>

      <div className="flex items-center">
        {avatar && (
          <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover mr-4" />
        )}
        <div>
          <p className="font-semibold text-gray-900">{name}</p>
        </div>
      </div>
    </div>
  )
}

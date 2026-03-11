'use client'

import { cn } from '@/lib/utils'

interface Block {
  type: string
  settings: Record<string, any>
}

interface TestimonialsProps {
  settings: Record<string, any>
  blocks?: Block[]
}

/** Read a field value from either stored format (plain value) or schema format ({ defaultValue }) */
function val(field: any): any {
  if (field === null || field === undefined) return field
  if (typeof field === 'object' && 'defaultValue' in field) return field.defaultValue
  return field
}

export default function Testimonials({ settings, blocks = [] }: TestimonialsProps) {
  const heading = val(settings.heading) ?? 'What Our Customers Say'
  const layout = val(settings.layout) ?? 'grid'
  const backgroundColor = val(settings.backgroundColor) ?? '#f9f9f9'

  // Only render testimonial blocks
  const testimonialBlocks = blocks.filter((b) => b.type === 'testimonial')

  if (testimonialBlocks.length === 0) return null

  return (
    <section className="py-16 px-4" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {heading}
        </h2>

        <div className={cn('grid gap-8', layout === 'grid' ? 'md:grid-cols-3' : 'md:grid-cols-1')}>
          {testimonialBlocks.map((block, index) => (
            <TestimonialCard key={index} block={block} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ block }: { block: Block }) {
  const quote = val(block.settings.quote) ?? ''
  const name = val(block.settings.name) ?? ''
  const avatar = val(block.settings.avatar) ?? ''
  const rating = Number(val(block.settings.rating) ?? 5)

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      {/* Star rating */}
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

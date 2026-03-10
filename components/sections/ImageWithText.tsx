import { cn } from '@/lib/utils'

interface Block {
  type: string
  settings: any
  blocks?: Block[]
}

interface ImageWithTextProps {
  settings: any
  blocks?: Block[]
}

export default function ImageWithText({ settings, blocks = [] }: ImageWithTextProps) {
  const layout = settings.layout?.defaultValue || 'image-left'
  const image = settings.image?.defaultValue || ''
  const imageRatio = settings.imageRatio?.defaultValue || 'square'

  const ratioClasses: Record<string, string> = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
  }

  const isImageLeft = layout === 'image-left'

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className={cn(!isImageLeft && 'md:order-2')}>
            <div className={cn(ratioClasses[imageRatio], 'overflow-hidden rounded-lg')}>
              <img src={image} alt="Feature" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className={cn(!isImageLeft && 'md:order-1')}>
            {blocks.map((block, index) => (
              <ContentBlockRenderer key={index} block={block} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ContentBlockRenderer({ block }: { block: Block }) {
  if (block.type !== 'group') return null

  const padding = block.settings.padding?.defaultValue || 48

  return (
    <div style={{ padding: `${padding}px` }}>
      {block.blocks?.map((childBlock, index) => (
        <NestedBlockRenderer key={index} block={childBlock} />
      ))}
    </div>
  )
}

function NestedBlockRenderer({ block }: { block: Block }) {
  if (block.type === 'heading') {
    const text = block.settings.text?.defaultValue || ''
    const size = block.settings.size?.defaultValue || 'large'

    const sizeClasses: Record<string, string> = {
      small: 'text-2xl',
      medium: 'text-3xl',
      large: 'text-4xl',
    }

    return (
      <h2 className={cn(sizeClasses[size], 'font-bold mb-4 text-gray-900')}>
        {text}
      </h2>
    )
  }

  if (block.type === 'text') {
    const text = block.settings.text?.defaultValue || ''
    return <p className="text-lg text-gray-600 mb-6 leading-relaxed">{text}</p>
  }

  if (block.type === 'button') {
    const label = block.settings.label?.defaultValue || ''
    const link = block.settings.link?.defaultValue || '#'

    return (
      <a href={link} className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium">
        {label}
      </a>
    )
  }

  return null
}

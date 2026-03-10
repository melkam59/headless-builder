import { cn } from '@/lib/utils'

interface Block {
  type: string
  settings: any
  blocks?: Block[]
}

interface HeroProps {
  settings: any
  blocks?: Block[]
}

const heightClasses: Record<string, string> = {
  small: 'h-[400px]',
  medium: 'h-[500px]',
  large: 'h-[600px]',
  'full-screen': 'h-screen',
}

const mobileHeightClasses: Record<string, string> = {
  small: 'max-md:h-[300px]',
  medium: 'max-md:h-[400px]',
  large: 'max-md:h-[500px]',
}

export default function Hero({ settings, blocks = [] }: HeroProps) {
  const layout = settings.layout?.defaultValue || 'full-width'
  const height = settings.height?.defaultValue || 'large'
  const mobileHeight = settings.mobileHeight?.defaultValue || 'medium'
  const backgroundImage = settings.backgroundImage?.defaultValue || ''
  const overlayOpacity = settings.overlayOpacity?.defaultValue || 30

  return (
    <section
      className={cn(
        'relative flex items-center justify-center overflow-hidden',
        heightClasses[height],
        mobileHeightClasses[mobileHeight],
      )}
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity / 100 }} />

      <div className={cn('relative z-10 w-full px-4', layout === 'contained' && 'max-w-7xl mx-auto')}>
        {blocks.map((block, index) => (
          <BlockRenderer key={index} block={block} />
        ))}
      </div>
    </section>
  )
}

function BlockRenderer({ block }: { block: Block }) {
  if (block.type !== 'group') return null

  const alignment = block.settings.alignment?.defaultValue || 'center'
  const verticalAlignment = block.settings.verticalAlignment?.defaultValue || 'center'
  const maxWidth = block.settings.maxWidth?.defaultValue || 600

  const alignmentClasses: Record<string, string> = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }

  const verticalClasses: Record<string, string> = {
    top: 'justify-start',
    center: 'justify-center',
    bottom: 'justify-end',
  }

  return (
    <div
      className={cn('flex flex-col mx-auto', alignmentClasses[alignment], verticalClasses[verticalAlignment])}
      style={{ maxWidth: `${maxWidth}px` }}
    >
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
    const color = block.settings.color?.defaultValue || '#ffffff'

    const sizeClasses: Record<string, string> = {
      small: 'text-2xl md:text-3xl',
      medium: 'text-3xl md:text-4xl',
      large: 'text-4xl md:text-5xl',
      xlarge: 'text-5xl md:text-7xl',
    }

    return (
      <h1 className={cn(sizeClasses[size], 'font-bold mb-4')} style={{ color }}>
        {text}
      </h1>
    )
  }

  if (block.type === 'text') {
    const text = block.settings.text?.defaultValue || ''
    const size = block.settings.size?.defaultValue || 'medium'
    const color = block.settings.color?.defaultValue || '#ffffff'

    const sizeClasses: Record<string, string> = {
      small: 'text-sm md:text-base',
      medium: 'text-base md:text-lg',
      large: 'text-lg md:text-xl',
    }

    return (
      <p className={cn(sizeClasses[size], 'mb-6')} style={{ color }}>
        {text}
      </p>
    )
  }

  if (block.type === 'buttonGroup') {
    const spacing = block.settings.spacing?.defaultValue || 16

    return (
      <div className="flex flex-wrap gap-4" style={{ gap: `${spacing}px` }}>
        {block.blocks?.map((button, index) => (
          <ButtonRenderer key={index} block={button} />
        ))}
      </div>
    )
  }

  return null
}

function ButtonRenderer({ block }: { block: Block }) {
  const label = block.settings.label?.defaultValue || ''
  const link = block.settings.link?.defaultValue || '#'
  const style = block.settings.style?.defaultValue || 'primary'

  const styleClasses: Record<string, string> = {
    primary: 'bg-white text-black hover:bg-gray-100',
    secondary: 'bg-black text-white hover:bg-gray-800',
    outline: 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-black',
  }

  return (
    <a href={link} className={cn('px-6 py-3 rounded-md font-medium transition-colors', styleClasses[style])}>
      {label}
    </a>
  )
}

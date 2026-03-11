import { cn } from '@/lib/utils'

interface Block {
  type: string
  settings: Record<string, any>
  blocks?: Block[]
}

interface HeroProps {
  settings: Record<string, any>
  blocks?: Block[]
}

// ─── Shared helper — same pattern as Header.tsx ───────────────────────────────
// Reads both merged-schema shape {defaultValue:…} and raw DB shape (plain value)
function get<T>(field: any, fallback: T): T {
  if (field === undefined || field === null) return fallback
  if (typeof field === 'object' && 'defaultValue' in field) {
    return (field.value !== undefined ? field.value : field.defaultValue) as T
  }
  return field as T
}

// ─── Size maps ─────────────────────────────────────────────────────────────────

const SECTION_HEIGHT: Record<string, string> = {
  small: 'min-h-[360px]',
  medium: 'min-h-[480px]',
  large: 'min-h-[600px]',
  'full-screen': 'min-h-screen',
}

const MOBILE_HEIGHT: Record<string, string> = {
  small: 'max-md:min-h-[260px]',
  medium: 'max-md:min-h-[360px]',
  large: 'max-md:min-h-[460px]',
}

const VERTICAL_ALIGN: Record<string, string> = {
  top: 'items-start',
  center: 'items-center',
  bottom: 'items-end',
}

const CONTENT_ALIGN: Record<string, string> = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
}

// ─── Block renderers ──────────────────────────────────────────────────────────

const HEADING_SIZE: Record<string, string> = {
  small: 'text-2xl md:text-3xl',
  medium: 'text-3xl md:text-4xl',
  large: 'text-4xl md:text-5xl',
  xlarge: 'text-5xl md:text-6xl lg:text-7xl',
}

const FONT_WEIGHT: Record<string, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
}

const LETTER_SPACING: Record<string, string> = {
  tight: 'tracking-tight',
  normal: 'tracking-normal',
  wide: 'tracking-wide',
}

function HeadingBlock({ block }: { block: Block }) {
  const text = get<string>(block.settings.text, '')
  const tag = get<string>(block.settings.tag, 'h1')
  const size = get<string>(block.settings.size, 'xlarge')
  const color = get<string>(block.settings.color, '#ffffff')
  const weight = get<string>(block.settings.fontWeight, 'bold')
  const spacing = get<string>(block.settings.letterSpacing, 'normal')

  const Tag = tag as 'h1' | 'h2' | 'h3'

  return (
    <Tag
      style={{ color }}
      className={cn(
        HEADING_SIZE[size],
        FONT_WEIGHT[weight],
        LETTER_SPACING[spacing],
        'mb-4 leading-tight',
      )}
    >
      {text}
    </Tag>
  )
}

const SUBHEADING_SIZE: Record<string, string> = {
  small: 'text-sm md:text-base',
  medium: 'text-base md:text-lg',
  large: 'text-lg md:text-xl',
}

function SubheadingBlock({ block }: { block: Block }) {
  const text = get<string>(block.settings.text, '')
  const size = get<string>(block.settings.size, 'medium')
  const color = get<string>(block.settings.color, '#f0f0f0')

  return (
    <p style={{ color }} className={cn(SUBHEADING_SIZE[size], 'mb-2 max-w-full')}>
      {text}
    </p>
  )
}

const BUTTON_SIZE: Record<string, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3 text-base',
}

const BUTTON_STYLE: Record<string, string> = {
  primary:
    'bg-white text-black hover:bg-gray-100 border border-white font-semibold',
  secondary:
    'bg-black text-white hover:bg-gray-900 border border-black font-semibold',
  outline:
    'bg-transparent text-white border-2 border-white hover:bg-white hover:text-black font-semibold',
  link:
    'bg-transparent text-white underline underline-offset-4 hover:opacity-80 px-0 py-0 border-0',
}

function ButtonBlock({ block }: { block: Block }) {
  const label = get<string>(block.settings.label, '')
  const link = get<string>(block.settings.link, '#')
  const style = get<string>(block.settings.style, 'primary')
  const size = get<string>(block.settings.size, 'lg')
  const newTab = get<boolean>(block.settings.openInNewTab, false)

  if (!label) return null

  return (
    <a
      href={link}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      className={cn(
        'inline-flex items-center justify-center rounded-md transition-all duration-200',
        BUTTON_SIZE[size],
        BUTTON_STYLE[style],
      )}
    >
      {label}
    </a>
  )
}

const IMAGE_RADIUS: Record<string, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
}

function ImageBlock({ block }: { block: Block }) {
  const src = get<string>(block.settings.src, '')
  const alt = get<string>(block.settings.alt, '')
  const width = get<number>(block.settings.width, 320)
  const radius = get<string>(block.settings.borderRadius, 'md')

  if (!src) return null

  return (
    <img
      src={src}
      alt={alt}
      style={{ width: `${width}px`, maxWidth: '100%' }}
      className={cn('object-contain my-2', IMAGE_RADIUS[radius])}
    />
  )
}

function DividerBlock({ block }: { block: Block }) {
  const height = get<number>(block.settings.height, 24)
  return <div style={{ height: `${height}px` }} aria-hidden />
}

// ─── Main Hero ─────────────────────────────────────────────────────────────────

export default function Hero({ settings, blocks = [] }: HeroProps) {
  // Section-level settings
  const bgImage = get<string>(settings.backgroundImage, '')
  const bgPosition = get<string>(settings.backgroundPosition, 'center')
  const bgFit = get<string>(settings.backgroundFit, 'cover')
  const overlayColor = get<string>(settings.overlayColor, '#000000')
  const overlayOpacity = get<number>(settings.overlayOpacity, 30)
  const height = get<string>(settings.height, 'large')
  const mobileHeight = get<string>(settings.mobileHeight, 'medium')
  const layout = get<string>(settings.layout, 'contained')
  const contentAlign = get<string>(settings.contentAlignment, 'center')
  const verticalAlign = get<string>(settings.verticalAlignment, 'center')
  const maxWidth = get<number>(settings.contentMaxWidth, 640)
  const paddingTop = get<number>(settings.paddingTop, 0)
  const paddingBottom = get<number>(settings.paddingBottom, 0)

  // Collect consecutive button blocks so they can share a flex row
  // All other block types render individually
  const renderBlocks = () => {
    const elements: React.ReactNode[] = []
    let i = 0
    while (i < blocks.length) {
      const block = blocks[i]

      if (block.type === 'button') {
        // Gather consecutive button blocks into a single flex row
        const buttonGroup: Block[] = []
        while (i < blocks.length && blocks[i].type === 'button') {
          buttonGroup.push(blocks[i])
          i++
        }
        elements.push(
          <div
            key={`btn-group-${i}`}
            className={cn(
              'flex flex-wrap gap-3 mt-2',
              contentAlign === 'center' && 'justify-center',
              contentAlign === 'right' && 'justify-end',
              contentAlign === 'left' && 'justify-start',
            )}
          >
            {buttonGroup.map((btn, j) => (
              <ButtonBlock key={j} block={btn} />
            ))}
          </div>,
        )
      } else {
        switch (block.type) {
          case 'heading':
            elements.push(<HeadingBlock key={i} block={block} />)
            break
          case 'subheading':
            elements.push(<SubheadingBlock key={i} block={block} />)
            break
          case 'image':
            elements.push(<ImageBlock key={i} block={block} />)
            break
          case 'divider':
            elements.push(<DividerBlock key={i} block={block} />)
            break
          default:
            break
        }
        i++
      }
    }
    return elements
  }

  return (
    <section
      className={cn(
        'relative flex overflow-hidden',
        SECTION_HEIGHT[height] ?? 'min-h-[600px]',
        MOBILE_HEIGHT[mobileHeight] ?? '',
        VERTICAL_ALIGN[verticalAlign] ?? 'items-center',
      )}
      style={{
        ...(bgImage
          ? {
              backgroundImage: `url(${bgImage})`,
              backgroundSize: bgFit,
              backgroundPosition: bgPosition,
            }
          : { backgroundColor: '#1a1a1a' }),
        paddingTop: `${paddingTop}px`,
        paddingBottom: `${paddingBottom}px`,
      }}
    >
      {/* Colour overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: overlayColor, opacity: overlayOpacity / 100 }}
      />

      {/* Content */}
      <div
        className={cn(
          'relative z-10 w-full px-4 sm:px-6',
          layout === 'contained' && 'max-w-7xl mx-auto',
        )}
      >
        <div
          className={cn('flex flex-col mx-auto', CONTENT_ALIGN[contentAlign] ?? 'items-center text-center')}
          style={{ maxWidth: `${maxWidth}px` }}
        >
          {renderBlocks()}
        </div>
      </div>
    </section>
  )
}

import React from 'react';

interface Setting {
  type: string;
  id: string;
  label: string;
  defaultValue: any;
  options?: string[];
}

interface Block {
  type: string;
  settings: any;
  blocks?: Block[];
}

interface HeroProps {
  settings: any;
  blocks?: Block[];
}

export default function Hero({ settings, blocks = [] }: HeroProps) {
  const layout = settings.layout?.defaultValue || 'full-width';
  const height = settings.height?.defaultValue || 'large';
  const mobileHeight = settings.mobileHeight?.defaultValue || 'medium';
  const backgroundImage = settings.backgroundImage?.defaultValue || '';
  const overlayOpacity = settings.overlayOpacity?.defaultValue || 30;

  const heightClasses = {
    small: 'h-[400px]',
    medium: 'h-[500px]',
    large: 'h-[600px]',
    'full-screen': 'h-screen',
  };

  const mobileHeightClasses = {
    small: 'max-md:h-[300px]',
    medium: 'max-md:h-[400px]',
    large: 'max-md:h-[500px]',
  };

  return (
    <section
      className={`relative ${heightClasses[height as keyof typeof heightClasses]} ${mobileHeightClasses[mobileHeight as keyof typeof mobileHeightClasses]} flex items-center justify-center overflow-hidden`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity / 100 }}
      />

      {/* Content */}
      <div className={`relative z-10 w-full ${layout === 'contained' ? 'max-w-7xl mx-auto px-4' : 'px-4'}`}>
        {blocks.map((block, index) => (
          <BlockRenderer key={index} block={block} />
        ))}
      </div>
    </section>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  if (block.type === 'group') {
    const alignment = block.settings.alignment?.defaultValue || 'center';
    const verticalAlignment = block.settings.verticalAlignment?.defaultValue || 'center';
    const maxWidth = block.settings.maxWidth?.defaultValue || 600;

    const alignmentClasses = {
      left: 'text-left items-start',
      center: 'text-center items-center',
      right: 'text-right items-end',
    };

    const verticalAlignmentClasses = {
      top: 'justify-start',
      center: 'justify-center',
      bottom: 'justify-end',
    };

    return (
      <div
        className={`flex flex-col ${alignmentClasses[alignment as keyof typeof alignmentClasses]} ${verticalAlignmentClasses[verticalAlignment as keyof typeof verticalAlignmentClasses]} mx-auto`}
        style={{ maxWidth: `${maxWidth}px` }}
      >
        {block.blocks?.map((childBlock, index) => (
          <NestedBlockRenderer key={index} block={childBlock} />
        ))}
      </div>
    );
  }

  return null;
}

function NestedBlockRenderer({ block }: { block: Block }) {
  if (block.type === 'heading') {
    const text = block.settings.text?.defaultValue || '';
    const size = block.settings.size?.defaultValue || 'large';
    const color = block.settings.color?.defaultValue || '#ffffff';

    const sizeClasses = {
      small: 'text-2xl md:text-3xl',
      medium: 'text-3xl md:text-4xl',
      large: 'text-4xl md:text-5xl',
      xlarge: 'text-5xl md:text-7xl',
    };

    return (
      <h1
        className={`${sizeClasses[size as keyof typeof sizeClasses]} font-bold mb-4`}
        style={{ color }}
      >
        {text}
      </h1>
    );
  }

  if (block.type === 'text') {
    const text = block.settings.text?.defaultValue || '';
    const size = block.settings.size?.defaultValue || 'medium';
    const color = block.settings.color?.defaultValue || '#ffffff';

    const sizeClasses = {
      small: 'text-sm md:text-base',
      medium: 'text-base md:text-lg',
      large: 'text-lg md:text-xl',
    };

    return (
      <p
        className={`${sizeClasses[size as keyof typeof sizeClasses]} mb-6`}
        style={{ color }}
      >
        {text}
      </p>
    );
  }

  if (block.type === 'buttonGroup') {
    const spacing = block.settings.spacing?.defaultValue || 16;

    return (
      <div className="flex flex-wrap gap-4" style={{ gap: `${spacing}px` }}>
        {block.blocks?.map((button, index) => (
          <ButtonRenderer key={index} block={button} />
        ))}
      </div>
    );
  }

  return null;
}

function ButtonRenderer({ block }: { block: Block }) {
  const label = block.settings.label?.defaultValue || '';
  const link = block.settings.link?.defaultValue || '#';
  const style = block.settings.style?.defaultValue || 'primary';

  const styleClasses = {
    primary: 'bg-white text-black hover:bg-gray-100',
    secondary: 'bg-black text-white hover:bg-gray-800',
    outline: 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-black',
  };

  return (
    <a
      href={link}
      className={`px-6 py-3 rounded-md font-medium transition-colors ${styleClasses[style as keyof typeof styleClasses]}`}
    >
      {label}
    </a>
  );
}

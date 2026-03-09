import React from 'react';

interface Block {
  type: string;
  settings: any;
}

interface CollectionListProps {
  settings: any;
  blocks?: Block[];
}

export default function CollectionList({ settings, blocks = [] }: CollectionListProps) {
  const heading = settings.heading?.defaultValue || 'Shop by Category';
  const layout = settings.layout?.defaultValue || 'grid';
  const columns = settings.columns?.defaultValue || 3;
  const mobileColumns = settings.mobileColumns?.defaultValue || 2;

  const gridClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  const mobileGridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {heading}
        </h2>

        <div
          className={`grid ${mobileGridClasses[mobileColumns as keyof typeof mobileGridClasses]} ${gridClasses[columns as keyof typeof gridClasses]} gap-6`}
        >
          {blocks.map((block, index) => (
            <CollectionCard key={index} block={block} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionCard({ block }: { block: Block }) {
  const title = block.settings.title?.defaultValue || '';
  const image = block.settings.image?.defaultValue || '';
  const collectionId = block.settings.collectionId?.defaultValue || '';

  return (
    <a
      href={`/collections/${collectionId}`}
      className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
        <h3 className="text-white text-2xl font-bold">{title}</h3>
      </div>
    </a>
  );
}

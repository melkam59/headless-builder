interface TreeSectionProps {
  title: string;
  icon: string;
  isExpanded: boolean;
  onToggle: () => void;
  isSelected: boolean;
  onSelect: () => void;
  children?: React.ReactNode;
}

export default function TreeSection({
  title,
  icon,
  isExpanded,
  onToggle,
  isSelected,
  onSelect,
  children,
}: TreeSectionProps) {
  return (
    <div>
      <div
        className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer hover:bg-gray-50 ${
          isSelected ? 'bg-gray-100' : ''
        }`}
        onClick={onSelect}
      >
        <div className="flex items-center flex-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="p-0.5 hover:bg-gray-200 rounded mr-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-3 h-3 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
      </div>
      {isExpanded && children && <div className="ml-4 mt-1">{children}</div>}
    </div>
  );
}

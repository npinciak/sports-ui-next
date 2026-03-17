interface CategorySelectorProps {
  categoryList: string[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

export default function CategorySelector({ categoryList, activeCategory, setActiveCategory }: CategorySelectorProps) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
      <span style={{ fontSize: 11, color: '#4b5563', letterSpacing: '0.1em', marginRight: 4 }}>CATEGORY</span>
      {categoryList.map(cat => {
        const isActive = cat === activeCategory;
        return (
          <button
            key={cat}
            className="cat-pill"
            onClick={() => setActiveCategory(cat)}
            style={{
              background: isActive ? '#f9fafb' : '#18181b',
              border: `1px solid ${isActive ? '#f9fafb' : '#27272a'}`,
              borderRadius: 20,
              padding: '4px 14px',
              color: isActive ? '#0d0d0d' : '#9ca3af',
              fontFamily: 'inherit',
              fontSize: 12,
              fontWeight: isActive ? 700 : 400,
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

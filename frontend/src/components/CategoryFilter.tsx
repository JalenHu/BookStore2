interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string;
    sortOrder: string;
    onCategoryChange: (category: string) => void;
    onSortChange: (order: string) => void;
}

function CategoryFilter({ categories, selectedCategory, sortOrder, onCategoryChange, onSortChange }: CategoryFilterProps) {
    return (
        <div className="row mb-3">
            <div className="col-12 col-md-8">
                <strong>Filter by Category: </strong>
                <button
                    className="btn btn-sm btn-outline-secondary me-1"
                    onClick={() => onCategoryChange('All')}
                    disabled={selectedCategory === 'All'}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => onCategoryChange(cat)}
                        disabled={selectedCategory === cat}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="col-12 col-md-4 text-md-end mt-2 mt-md-0">
                <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => onSortChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                    Sort by Title {sortOrder === 'asc' ? 'ASC▲' : 'DESC▼'}
                </button>
            </div>
        </div>
    );
}

export default CategoryFilter;

import './CategorySidebar.css';

const CategorySidebar = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <aside className="category-sidebar">
            <h3 className="sidebar-title">Рубрики</h3>
            <ul className="category-list">
                <li
                    className={`category-item ${selectedCategory === null ? 'active' : ''}`}
                    onClick={() => onSelectCategory(null)}
                >
                    <span className="category-icon">📋</span>
                    <span>Все объявления</span>
                </li>

                {categories.map((cat) => (
                    <li
                        key={cat.id}
                        className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
                        onClick={() => onSelectCategory(cat.id)}
                    >
            <span className="category-icon">
              {getCategoryIcon(cat.slug)}
            </span>
                        <span>{cat.name}</span>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

// Иконки для категорий
const getCategoryIcon = (slug) => {
    const icons = {
        'study-and-tutoring': '📚',
        'jobs-and-internships': '💼',
        'housing-and-dormitory': '🏠',
        'buy-and-sell': '🛒',
        'events': '🎉',
        'lost-and-found': '🔍',
        'science-and-projects': '🔬',
        'academic-process': '🎓',
    };
    return icons[slug] || '📌';
};

export default CategorySidebar;
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];

    // Логика отображения страниц (например: 1 ... 4 5 6 ... 10)
    const addPage = (num) => {
        if (!pages.includes(num)) pages.push(num);
    };

    addPage(1);
    if (currentPage > 3) pages.push('...');

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        addPage(i);
    }

    if (currentPage < totalPages - 2) pages.push('...');
    if (totalPages > 1) addPage(totalPages);

    return (
        <div className="pagination">
            <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                ← Назад
            </button>

            {pages.map((page, idx) => (
                <button
                    key={idx}
                    className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={page === '...'}
                >
                    {page}
                </button>
            ))}

            <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Вперёд →
            </button>
        </div>
    );
};

export default Pagination;

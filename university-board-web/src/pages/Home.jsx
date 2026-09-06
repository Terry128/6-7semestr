import { useState, useEffect } from 'react';
import API from '../api/axios';
import AnnouncementCard from '../components/AnnouncementCard';
import CategorySidebar from '../components/CategorySidebar';
import Pagination from '../components/Pagination';
import './Home.css';

const Home = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const limit = 9;

    // Загрузка категорий (один раз)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Ошибка загрузки категорий:', error);
            }
        };
        fetchCategories();
    }, []);

    // Загрузка объявлений (при смене категории или страницы)
    useEffect(() => {
        const fetchAnnouncements = async () => {
            setLoading(true);
            try {
                const params = { page: currentPage, limit };
                if (selectedCategory) {
                    params.categoryId = selectedCategory;
                }

                const response = await API.get('/announcements', { params });
                setAnnouncements(response.data.announcements);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Ошибка загрузки объявлений:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, [currentPage, selectedCategory]);

    // Сброс страницы при смене категории
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
    };

    const selectedCategoryName = selectedCategory
        ? categories.find(c => c.id === selectedCategory)?.name
        : 'Все объявления';

    return (
        <div className="home-layout">
            <CategorySidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategoryChange}
            />

            <div className="home-content">
                <div className="home-header">
                    <h1 className="home-title">{selectedCategoryName}</h1>
                    <p className="home-subtitle">
                        {loading
                            ? 'Загрузка...'
                            : `Найдено объявлений: ${announcements.length}`}
                    </p>
                </div>

                {loading ? (
                    <div className="loading-state">Загрузка объявлений...</div>
                ) : announcements.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h3>Объявлений пока нет</h3>
                        <p>В этой категории пока нет опубликованных объявлений.</p>
                    </div>
                ) : (
                    <>
                        <div className="announcements-grid">
                            {announcements.map((announcement) => (
                                <AnnouncementCard
                                    key={announcement.id}
                                    announcement={announcement}
                                />
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
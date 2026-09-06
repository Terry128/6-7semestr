import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './CreateAnnouncement.css';

const CreateAnnouncement = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        categoryId: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Загрузка категорий при монтировании
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Валидация
        if (formData.title.length < 5) {
            setError('Заголовок должен содержать минимум 5 символов');
            return;
        }
        if (formData.content.length < 20) {
            setError('Содержание должно содержать минимум 20 символов');
            return;
        }
        if (!formData.categoryId) {
            setError('Выберите категорию объявления');
            return;
        }

        setLoading(true);

        try {
            await API.post('/announcements', {
                title: formData.title,
                content: formData.content,
                categoryId: parseInt(formData.categoryId),
            });

            // После успешного создания — редирект на "Мои объявления"
            navigate('/my');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при создании объявления');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-page">
            <div className="create-card">
                <h1 className="create-title">📝 Новое объявление</h1>
                <p className="create-subtitle">
                    После создания объявление будет отправлено на модерацию администратору
                </p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="create-form">
                    <div className="form-group">
                        <label htmlFor="categoryId">Категория *</label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            <option value="">— Выберите категорию —</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="title">Заголовок *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Например: Продам учебник по мат. анализу"
                            maxLength={100}
                            required
                            disabled={loading}
                        />
                        <span className="char-counter">
              {formData.title.length} / 100
            </span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Содержание *</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Опишите подробно ваше объявление..."
                            rows={8}
                            maxLength={2000}
                            required
                            disabled={loading}
                        />
                        <span className="char-counter">
              {formData.content.length} / 2000
            </span>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => navigate('/')}
                            disabled={loading}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Отправка...' : 'Опубликовать'}
                        </button>
                    </div>
                </form>

                <div className="moderation-notice">
                    <span className="notice-icon">⚠️</span>
                    <div>
                        <strong>Обратите внимание:</strong> все объявления проходят модерацию
                        перед публикацией. После отправки вы сможете отслеживать статус
                        в разделе «Мои объявления».
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAnnouncement;
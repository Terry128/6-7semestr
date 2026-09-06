import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import './MyAnnouncements.css';

const MyAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null); // ID объявления для удаления

    const fetchMyAnnouncements = async () => {
        setLoading(true);
        try {
            const response = await API.get('/announcements/my');
            setAnnouncements(response.data);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyAnnouncements();
    }, []);

    const handleDelete = async () => {
        try {
            await API.delete(`/announcements/${deleteId}`);
            setAnnouncements(announcements.filter(a => a.id !== deleteId));
            setDeleteId(null);
        } catch (error) {
            alert(error.response?.data?.message || 'Ошибка при удалении');
        }
    };

    // Статусы модерации
    const statusConfig = {
        pending: {
            label: 'На модерации',
            className: 'status-pending',
            icon: '⏳',
        },
        approved: {
            label: 'Опубликовано',
            className: 'status-approved',
            icon: '✅',
        },
        rejected: {
            label: 'Отклонено',
            className: 'status-rejected',
            icon: '❌',
        },
    };

    return (
        <div className="my-announcements-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">📋 Мои объявления</h1>
                    <p className="page-subtitle">
                        Всего: {announcements.length} •
                        Опубликовано: {announcements.filter(a => a.status === 'approved').length} •
                        На модерации: {announcements.filter(a => a.status === 'pending').length}
                    </p>
                </div>
                <Link to="/create" className="btn-create-new">
                    + Создать объявление
                </Link>
            </div>

            {loading ? (
                <div className="loading-state">Загрузка...</div>
            ) : announcements.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>У вас пока нет объявлений</h3>
                    <p>Создайте своё первое объявление, чтобы оно появилось здесь.</p>
                    <Link to="/create" className="btn-create-first">
                        Создать объявление
                    </Link>
                </div>
            ) : (
                <div className="announcements-list">
                    {announcements.map((announcement) => {
                        const status = statusConfig[announcement.status];
                        return (
                            <div key={announcement.id} className="my-announcement-card">
                                <div className="card-left">
                                    <div className={`status-badge ${status.className}`}>
                                        <span className="status-icon">{status.icon}</span>
                                        <span>{status.label}</span>
                                    </div>
                                    <span className="card-category">
                    {announcement.categoryData?.name}
                  </span>
                                </div>

                                <div className="card-middle">
                                    <h3 className="card-title">{announcement.title}</h3>
                                    <p className="card-preview">
                                        {announcement.content.length > 120
                                            ? announcement.content.substring(0, 120) + '...'
                                            : announcement.content}
                                    </p>
                                    <span className="card-date">
                    Создано: {new Date(announcement.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                                </div>

                                <div className="card-right">
                                    <button
                                        className="btn-delete"
                                        onClick={() => setDeleteId(announcement.id)}
                                        title="Удалить объявление"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Модальное окно подтверждения удаления */}
            {deleteId !== null && (
                <div className="modal-overlay" onClick={() => setDeleteId(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Удалить объявление?</h3>
                        <p>Это действие нельзя будет отменить. Объявление будет удалено навсегда.</p>
                        <div className="modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => setDeleteId(null)}
                            >
                                Отмена
                            </button>
                            <button
                                className="btn-danger"
                                onClick={handleDelete}
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAnnouncements;
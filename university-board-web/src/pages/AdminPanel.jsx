import { useState, useEffect } from 'react';
import API from '../api/axios';
import './AdminPanel.css';

// Выносим за пределы компонентов — доступны всем
const roleColors = {
    admin: '#dc2626',
    teacher: '#16a34a',
    student: '#2563eb'
};

const roleLabels = {
    admin: 'Администратор',
    teacher: 'Преподаватель',
    student: 'Студент'
};

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('moderation');
    const [pendingAnnouncements, setPendingAnnouncements] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeTab === 'moderation') {
                    const response = await API.get('/announcements/pending');
                    setPendingAnnouncements(response.data);
                } else {
                    const response = await API.get('/users');
                    setUsers(response.data);
                }
            } catch (error) {
                console.error('Ошибка загрузки:', error);
                alert('Ошибка загрузки данных');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    const handleModerate = async (id, status) => {
        try {
            await API.patch(`/announcements/${id}/moderate`, { status });
            setPendingAnnouncements(pendingAnnouncements.filter(a => a.id !== id));
        } catch (error) {
            alert(error.response?.data?.message || 'Ошибка модерации');
        }
    };

    const handleChangeRole = async (userId, newRole) => {
        try {
            await API.patch(`/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            alert(error.response?.data?.message || 'Ошибка смены роли');
        }
    };

    const handleToggleBan = async (userId) => {
        try {
            await API.patch(`/users/${userId}/ban`);
            setUsers(users.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
        } catch (error) {
            alert(error.response?.data?.message || 'Ошибка блокировки');
        }
    };

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h1 className="admin-title">⚙️ Панель администратора</h1>
                <p className="admin-subtitle">Управление объявлениями и пользователями системы</p>
            </div>

            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === 'moderation' ? 'active' : ''}`}
                    onClick={() => setActiveTab('moderation')}
                >
                    📋 Модерация
                    {pendingAnnouncements.length > 0 && (
                        <span className="tab-badge">{pendingAnnouncements.length}</span>
                    )}
                </button>
                <button
                    className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    👥 Пользователи
                    <span className="tab-badge secondary">{users.length}</span>
                </button>
            </div>

            <div className="admin-content">
                {loading ? (
                    <div className="loading-state">Загрузка...</div>
                ) : activeTab === 'moderation' ? (
                    <ModerationTab
                        announcements={pendingAnnouncements}
                        onModerate={handleModerate}
                    />
                ) : (
                    <UsersTab
                        users={users}
                        onChangeRole={handleChangeRole}
                        onToggleBan={handleToggleBan}
                    />
                )}
            </div>
        </div>
    );
};

// --- Вкладка "Модерация" ---
const ModerationTab = ({ announcements, onModerate }) => {
    if (announcements.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">✨</div>
                <h3>Нет объявлений на модерации</h3>
                <p>Все объявления обработаны. Отличная работа!</p>
            </div>
        );
    }

    return (
        <div className="moderation-list">
            {announcements.map((announcement) => (
                <div key={announcement.id} className="moderation-card">
                    <div className="mod-card-header">
                        <span className="mod-category">{announcement.categoryData?.name}</span>
                        <span className="mod-date">
              {new Date(announcement.createdAt).toLocaleString('ru-RU')}
            </span>
                    </div>

                    <h3 className="mod-title">{announcement.title}</h3>
                    <p className="mod-content">{announcement.content}</p>

                    <div className="mod-author">
                        <strong>Автор:</strong> {announcement.author?.firstName} {announcement.author?.lastName}
                        <span className="author-email">({announcement.author?.email})</span>
                        <span
                            className="author-role-badge"
                            style={{
                                backgroundColor: (roleColors[announcement.author?.role] || '#6b7280') + '20',
                                color: roleColors[announcement.author?.role] || '#6b7280'
                            }}
                        >
              {roleLabels[announcement.author?.role] || announcement.author?.role}
            </span>
                    </div>

                    <div className="mod-actions">
                        <button
                            className="btn-approve"
                            onClick={() => onModerate(announcement.id, 'approved')}
                        >
                            ✅ Одобрить
                        </button>
                        <button
                            className="btn-reject"
                            onClick={() => onModerate(announcement.id, 'rejected')}
                        >
                            ❌ Отклонить
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Вкладка "Пользователи" ---
const UsersTab = ({ users, onChangeRole, onToggleBan }) => {
    if (users.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">👤</div>
                <h3>Нет пользователей</h3>
            </div>
        );
    }

    return (
        <div className="users-table-wrapper">
            <table className="users-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>ФИО</th>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>Статус</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id} className={user.isBanned ? 'banned-row' : ''}>
                        <td>{user.id}</td>
                        <td>
                            <div className="user-fullname">
                                {user.lastName} {user.firstName}
                                {user.patronymic && ` ${user.patronymic}`}
                            </div>
                        </td>
                        <td className="user-email-cell">{user.email}</td>
                        <td>
                            <select
                                className="role-select"
                                value={user.role}
                                onChange={(e) => onChangeRole(user.id, e.target.value)}
                                style={{
                                    borderColor: roleColors[user.role],
                                    color: roleColors[user.role]
                                }}
                            >
                                <option value="student">Студент</option>
                                <option value="teacher">Преподаватель</option>
                                <option value="admin">Администратор</option>
                            </select>
                        </td>
                        <td>
                            {user.isBanned ? (
                                <span className="status-banned">🚫 Заблокирован</span>
                            ) : (
                                <span className="status-active">✅ Активен</span>
                            )}
                        </td>
                        <td>
                            <button
                                className={`btn-ban ${user.isBanned ? 'unban' : ''}`}
                                onClick={() => onToggleBan(user.id)}
                            >
                                {user.isBanned ? '🔓 Разблокировать' : '🔒 Заблокировать'}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
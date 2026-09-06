import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import './AnnouncementCard.css';

const AnnouncementCard = ({ announcement }) => {
    const { title, content, createdAt, author, categoryData } = announcement;

    // Обрезаем длинный текст для превью
    const previewText = content.length > 150
        ? content.substring(0, 150) + '...'
        : content;

    // Форматируем дату ("5 минут назад", "2 дня назад")
    const timeAgo = formatDistanceToNow(new Date(createdAt), {
        addSuffix: true,
        locale: ru
    });

    // Цвет бейджа роли автора
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

    return (
        <div className="announcement-card">
            <div className="card-header">
                <span className="category-badge">{categoryData?.name}</span>
                <span className="time-ago">{timeAgo}</span>
            </div>

            <h3 className="card-title">{title}</h3>
            <p className="card-content">{previewText}</p>

            <div className="card-footer">
                <div className="author-info">
                    <div className="author-avatar">
                        {author?.firstName?.[0]}{author?.lastName?.[0]}
                    </div>
                    <div className="author-details">
            <span className="author-name">
              {author?.firstName} {author?.lastName}
            </span>
                        <span
                            className="author-role"
                            style={{ color: roleColors[author?.role] }}
                        >
              {roleLabels[author?.role]}
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementCard;
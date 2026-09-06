import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    🎓 Доска объявлений
                </Link>

                <nav className="nav">
                    <Link to="/" className="nav-link">Главная</Link>

                    {user ? (
                        <>
                            <Link to="/create" className="nav-link">Создать объявление</Link>
                            <Link to="/my" className="nav-link">Мои объявления</Link>

                            {user.role === 'admin' && (
                                <Link to="/admin" className="nav-link admin-link">Админ-панель</Link>
                            )}

                            <div className="user-info">
                <span className="user-name">
                  {user.firstName} {user.lastName}
                </span>
                                <span className="user-role">({user.role})</span>
                                <button onClick={handleLogout} className="btn-logout">
                                    Выйти
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn-login">Войти</Link>
                            <Link to="/register" className="btn-register">Регистрация</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
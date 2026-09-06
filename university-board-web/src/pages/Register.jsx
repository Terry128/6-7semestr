import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        patronymic: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

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
        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        if (formData.password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов');
            return;
        }

        setLoading(true);

        try {
            await register({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                patronymic: formData.patronymic || null,
            });

            alert('Регистрация успешна! Теперь вы можете войти в систему.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка регистрации. Попробуйте другой email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Регистрация</h1>
                <p className="auth-subtitle">Создайте аккаунт для доступа к доске объявлений</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="lastName">Фамилия *</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Иванов"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="firstName">Имя *</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Иван"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="patronymic">Отчество</label>
                        <input
                            type="text"
                            id="patronymic"
                            name="patronymic"
                            value={formData.patronymic}
                            onChange={handleChange}
                            placeholder="Иванович (необязательно)"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@university.ru"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="password">Пароль *</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Минимум 6 символов"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Подтвердите пароль *</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Повторите пароль"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <div className="auth-footer">
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
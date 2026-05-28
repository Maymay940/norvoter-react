import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Функция для прямого мок-логина на GitHub Pages
  const handleDirectMockLogin = (username: string, password: string): boolean => {
    if (window.location.hostname.includes('github.io')) {
      // Очищаем старую сессию перед новым входом
      localStorage.clear();
      
      // Пользователь ivanov
      if (username === 'ivanov' && password === 'user123') {
        const userData = {
          id: 2,
          username: 'ivanov',
          is_admin: false,
          first_name: 'Иван',
          last_name: 'Иванов',
          phone: '+7 (999) 123-45-67',
          email: 'ivanov@email.com'
        };
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userId', String(userData.id));
        localStorage.setItem('isAdmin', String(userData.is_admin));
        localStorage.setItem('username', userData.username);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/');
        return true;
      }
      // Админ
      if (username === 'admin' && password === 'admin123') {
        const userData = {
          id: 1,
          username: 'admin',
          is_admin: true,
          first_name: 'Администратор',
          last_name: 'Системы',
          phone: '+7 (999) 000-00-00',
          email: 'admin@norvoter.com'
        };
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userId', String(userData.id));
        localStorage.setItem('isAdmin', String(userData.is_admin));
        localStorage.setItem('username', userData.username);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/');
        return true;
      }
      setError('Неверное имя пользователя или пароль');
      return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Сначала пробуем прямой мок-логин (для GitHub Pages)
    if (handleDirectMockLogin(username, password)) {
      setLoading(false);
      return;
    }

    // Для локальной разработки
    try {
      const response = await login(username, password);
      
      console.log('Response:', response);
      
      // Проверяем тип ответа (мок или реальный API)
      const isMockResponse = response && typeof response === 'object' && 'success' in response;
      
      if (isMockResponse) {
        // Мок-ответ от api.ts
        if (response.success && response.data) {
          const userData = response.data;
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userId', userData.id || userData.user_id);
          localStorage.setItem('isAdmin', userData.is_admin);
          localStorage.setItem('username', userData.username);
          localStorage.setItem('user', JSON.stringify({
            id: userData.id || userData.user_id,
            username: userData.username,
            is_admin: userData.is_admin,
            first_name: userData.first_name,
            last_name: userData.last_name,
            phone: userData.phone,
            email: userData.email
          }));
          navigate('/');
        } else {
          setError(response.error || 'Ошибка входа');
        }
      } else {
        // AxiosResponse от реального API
        const axiosResponse = response as any;
        if (axiosResponse.data?.success) {
          const userData = axiosResponse.data.data;
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userId', userData.id);
          localStorage.setItem('isAdmin', userData.is_admin);
          localStorage.setItem('username', userData.username);
          localStorage.setItem('user', JSON.stringify({
            id: userData.id,
            username: userData.username,
            is_admin: userData.is_admin,
            first_name: userData.first_name,
            last_name: userData.last_name,
            phone: userData.phone,
            email: userData.email
          }));
          navigate('/');
        } else {
          setError(axiosResponse.data?.error || 'Ошибка входа');
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Вход</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Имя пользователя</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="ivanov или admin"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="user123 или admin123"
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Link to="/register">Нет аккаунта? Зарегистрироваться</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;
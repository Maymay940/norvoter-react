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
    // Проверяем, что мы на GitHub Pages
    if (window.location.hostname.includes('github.io')) {
      // Тестовый пользователь
      if (username === 'testuser' && password === '123456') {
        const userData = {
          user_id: 1,
          username: 'testuser',
          is_admin: false,
          first_name: 'Тест',
          last_name: 'Пользователь',
          phone: '+7 (999) 123-45-67',
          email: 'test@example.com'
        };
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userId', String(userData.user_id));
        localStorage.setItem('isAdmin', String(userData.is_admin));
        localStorage.setItem('username', userData.username);
        localStorage.setItem('user', JSON.stringify({
          id: userData.user_id,
          username: userData.username,
          is_admin: userData.is_admin,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          email: userData.email
        }));
        navigate('/');
        return true;
      }
      // Администратор
      if (username === 'admin' && password === 'admin123') {
        const userData = {
          user_id: 2,
          username: 'admin',
          is_admin: true,
          first_name: 'Админ',
          last_name: 'Системы',
          phone: '+7 (888) 123-45-67',
          email: 'admin@example.com'
        };
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userId', String(userData.user_id));
        localStorage.setItem('isAdmin', String(userData.is_admin));
        localStorage.setItem('username', userData.username);
        localStorage.setItem('user', JSON.stringify({
          id: userData.user_id,
          username: userData.username,
          is_admin: userData.is_admin,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          email: userData.email
        }));
        navigate('/');
        return true;
      }
      setError('Неверное имя пользователя или пароль');
      return true; // Останавливаем дальнейшую обработку
    }
    return false; // Не на GitHub Pages, продолжаем обычный логин
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Проверяем прямой мок-логин для GitHub Pages
    if (handleDirectMockLogin(username, password)) {
      setLoading(false);
      return;
    }

    // Обычный логин для локальной разработки
    try {
      const response = await login(username, password);
      
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      
      const result = response.data || response;
      
      if (result.success) {
        const userData = result;
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userId', userData.user_id);
        localStorage.setItem('isAdmin', userData.is_admin);
        localStorage.setItem('username', userData.username);
        localStorage.setItem('user', JSON.stringify({
          id: userData.user_id,
          username: userData.username,
          is_admin: userData.is_admin,
        }));
        
        navigate('/');
      } else {
        setError(result.error || 'Ошибка входа');
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
                placeholder="testuser или admin"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="123456 или admin123"
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
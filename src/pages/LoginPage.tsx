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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(username, password);
      
      console.log('Login response:', response);
      
      // Проверяем, является ли ответ мок-ответом (имеет поле success)
      const isMockResponse = response && typeof response === 'object' && 'success' in response;
      
      if (isMockResponse) {
        // Мок-ответ от mockApi
        if (response.success && response.data) {
          const userData = response.data;
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userId', String(userData.id));
          localStorage.setItem('isAdmin', String(userData.is_admin));
          localStorage.setItem('username', userData.username);
          localStorage.setItem('user', JSON.stringify(userData));
          navigate('/');
        } else {
          setError(response.error || 'Ошибка входа');
        }
      } else {
        // AxiosResponse от реального API
        const axiosResponse = response as any;
        if (axiosResponse.data?.success && axiosResponse.data?.data) {
          const userData = axiosResponse.data.data;
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userId', String(userData.id));
          localStorage.setItem('isAdmin', String(userData.is_admin));
          localStorage.setItem('username', userData.username);
          localStorage.setItem('user', JSON.stringify(userData));
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
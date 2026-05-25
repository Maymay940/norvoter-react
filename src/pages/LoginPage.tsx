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
      const result = response.data;
      if (result.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userId', result.data.user_id);
        localStorage.setItem('isAdmin', result.data.is_admin);
        localStorage.setItem('username', result.data.username);
        localStorage.setItem('user', JSON.stringify({
          id: result.data.user_id,
          username: result.data.username,
          is_admin: result.data.is_admin,
        }));
        navigate('/');
      } else {
        setError(result.error || 'Ошибка входа');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
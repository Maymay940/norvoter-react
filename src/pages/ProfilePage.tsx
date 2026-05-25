// pages/ProfilePage.tsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { restoreSession, changePassword } from '../store/slices/authSlice';
import { Container, Card, Button, Spinner, Alert, Form } from 'react-bootstrap';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; type: 'success' | 'danger' } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (!user && localStorage.getItem('user')) {
      dispatch(restoreSession());
    }
  }, [dispatch, user]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'Новые пароли не совпадают', type: 'danger' });
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 3) {
      setPasswordMessage({ text: 'Пароль должен содержать минимум 3 символа', type: 'danger' });
      setPasswordLoading(false);
      return;
    }

    try {
      await dispatch(changePassword({ old_password: oldPassword, new_password: newPassword })).unwrap();
      setPasswordMessage({ text: 'Пароль успешно изменён', type: 'success' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMessage({ text: err.message || 'Ошибка смены пароля', type: 'danger' });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          Пожалуйста, войдите в систему
          <Button variant="primary" className="ms-3" onClick={() => navigate('/login')}>
            Войти
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
      <h1 className="mb-4">Личный кабинет</h1>
      
      {/* Информация о пользователе */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title className="mb-3">Информация о пользователе</Card.Title>
          <Card.Text>
            <strong>Имя пользователя:</strong> {user.username}<br />
            <strong>Email:</strong> {user.email || 'не указан'}<br />
            <strong>Имя:</strong> {user.first_name || 'не указано'}<br />
            <strong>Фамилия:</strong> {user.last_name || 'не указана'}<br />
            <strong>Телефон:</strong> {user.phone || 'не указан'}<br />
            <strong>Роль:</strong> {user.is_admin ? 'Администратор' : 'Пользователь'}
          </Card.Text>
        </Card.Body>
      </Card>

      {/* Форма смены пароля */}
      <Card>
        <Card.Body>
          <Card.Title className="mb-3">Смена пароля</Card.Title>
          {passwordMessage && (
            <Alert variant={passwordMessage.type} onClose={() => setPasswordMessage(null)} dismissible>
              {passwordMessage.text}
            </Alert>
          )}
          <Form onSubmit={handleChangePassword}>
            <Form.Group className="mb-3">
              <Form.Label>Старый пароль</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Новый пароль</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Подтверждение нового пароля</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={passwordLoading}>
              {passwordLoading ? 'Смена пароля...' : 'Сменить пароль'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;
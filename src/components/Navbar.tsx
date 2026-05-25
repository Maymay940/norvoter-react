import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';

export const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const username = localStorage.getItem('username') || '';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="primary" data-bs-theme="dark">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">Norvoter</BootstrapNavbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Счетчики</Nav.Link>
          <Nav.Link as={Link} to="/requests">Заявки</Nav.Link>
          {isAdmin && (
            <Nav.Link as={Link} to="/admin">Админ-панель</Nav.Link>
          )}
        </Nav>
        <Nav>
          {isAuthenticated ? (
            <>
              <Nav.Link as={Link} to="/profile" className="text-light">
                  {username}
              </Nav.Link>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/login">Вход</Nav.Link>
              <Nav.Link as={Link} to="/register">Регистрация</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </BootstrapNavbar>
  );
};
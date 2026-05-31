import { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';

export const Navbar = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const username = localStorage.getItem('username') || '';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = async () => {
    await logout();
    localStorage.clear();
    setExpanded(false);
    navigate('/login');
  };

  const closeMenu = () => setExpanded(false);

  return (
    <BootstrapNavbar
      bg="primary"
      data-bs-theme="dark"
      expand="lg"
      expanded={expanded}
      onToggle={setExpanded}
      className="app-navbar"
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" onClick={closeMenu}>Norvoter</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="main-navbar" />
        <BootstrapNavbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={closeMenu}>Счетчики</Nav.Link>
            <Nav.Link as={Link} to="/requests" onClick={closeMenu}>Заявки</Nav.Link>
            {isAdmin && (
              <Nav.Link as={Link} to="/admin" onClick={closeMenu}>Админ-панель</Nav.Link>
            )}
          </Nav>
          <Nav className="navbar-user-actions">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/profile" className="text-light" onClick={closeMenu}>
                  {username}
                </Nav.Link>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" onClick={closeMenu}>Вход</Nav.Link>
                <Nav.Link as={Link} to="/register" onClick={closeMenu}>Регистрация</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

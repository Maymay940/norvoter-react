import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Button variant="primary" onClick={() => navigate('/')}>На главную</Button>
    </Container>
  );
};
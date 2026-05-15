import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, Alert, Table, Row, Col } from 'react-bootstrap';
import { getRequestById, submitRequest, deleteRequest } from '../services/api';
import type { Request, Position } from '../types/request';

export const RequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<Request | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRequest();
  }, [id]);

  const loadRequest = async () => {
    try {
      const data = await getRequestById(Number(id));
      setRequest(data);
      setPositions(data.positions || []);
    } catch (err) {
      setError('Заявка не найдена');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    await submitRequest(Number(id));
    loadRequest();
  };

  const handleDelete = async () => {
    if (confirm('Удалить черновик заявки?')) {
      await deleteRequest(Number(id));
      navigate('/requests');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error || !request) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error || 'Заявка не найдена'}</Alert>
        <Button variant="primary" onClick={() => navigate('/requests')}>К списку заявок</Button>
      </Container>
    );
  }

  const statusMap: Record<string, string> = {
    draft: 'Черновик',
    submitted: 'Отправлено',
    completed: 'Завершено',
    rejected: 'Отклонено',
    deleted: 'Удалено',
  };

  const statusVariant: Record<string, string> = {
    draft: 'secondary',
    submitted: 'info',
    completed: 'success',
    rejected: 'danger',
    deleted: 'dark',
  };

  return (
    <Container className="mt-4">
      <Button variant="link" onClick={() => navigate(-1)} className="mb-3">
        ← Назад
      </Button>

      <h1 className="mb-4">Заявка №{request.id}</h1>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>
            Статус:{' '}
            <span className={`badge bg-${statusVariant[request.status]}`}>
              {statusMap[request.status] || request.status}
            </span>
          </Card.Title>
          <Card.Text>
            <strong>Дата создания:</strong> {request.created_at}<br />
            {request.submitted_at && (
              <>
                <strong>Дата отправки:</strong> {request.submitted_at}<br />
              </>
            )}
            {request.completed_at && (
              <>
                <strong>Дата завершения:</strong> {request.completed_at}<br />
              </>
            )}
            {request.comment && (
              <>
                <strong>Комментарий:</strong> {request.comment}<br />
              </>
            )}
          </Card.Text>
        </Card.Body>
      </Card>

      <h3 className="mb-3">Показания счетчиков</h3>
      {positions.length === 0 ? (
        <Alert variant="info">Нет добавленных счетчиков</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Адрес</th>
              <th>Тип</th>
              <th>Предыдущие</th>
              <th>Текущие</th>
              <th>Расход (м³)</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => (
              <tr key={pos.id}>
                <td>{pos.water_meter__address}</td>
                <td>{pos.water_meter__meter_type === 'HOT' ? 'ГВС' : 'ХВС'}</td>
                <td>{pos.water_meter__last_verified_reading}</td>
                <td>{pos.current_reading}</td>
                <td><strong>{pos.consumption}</strong></td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {request.total_consumption && request.amount_to_pay && (
        <Card className="mb-4 bg-light">
          <Card.Body>
            <Row>
              <Col className="text-center">
                <h5>Общий расход</h5>
                <h3>{request.total_consumption} м³</h3>
              </Col>
              <Col className="text-center">
                <h5>Сумма к оплате</h5>
                <h3 className="text-primary">{request.amount_to_pay} ₽</h3>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {request.status === 'draft' && (
        <div className="d-flex gap-2">
          <Button variant="success" onClick={handleSubmit}>
            Подать показания
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Удалить черновик
          </Button>
          <Button variant="primary" onClick={() => navigate('/')}>
            Добавить счетчик
          </Button>
        </div>
      )}
    </Container>
  );
};
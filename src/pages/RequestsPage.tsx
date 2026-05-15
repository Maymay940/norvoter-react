import { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getRequests } from '../services/api';
import type { Request } from '../types/request';

export const RequestsPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await getRequests() as Request[];
      setRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      draft: 'secondary',
      submitted: 'info',
      completed: 'success',
      rejected: 'danger',
      deleted: 'dark',
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };


  if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Все заявки</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Счетчиков</th>
            <th>Сумма</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{getStatusBadge(req.status)}</td>
              <td>{req.created_at}</td>
              <td>{req.positions_count}</td>
              <td>{req.amount_to_pay ? `${req.amount_to_pay} ₽` : '-'}</td>
              <td>
                <Link to={`/requests/${req.id}`}>
                  <Button variant="primary" size="sm">Подробнее</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
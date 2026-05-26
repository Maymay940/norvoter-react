import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';  
import type { AppDispatch, RootState } from '../store';
import { fetchRequests, setFilters } from '../store/slices/requestsSlice';
import { Table, Badge, Button, Form, Row, Col, Spinner } from 'react-bootstrap';

export const RequestsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();  
  const { items: requests, loading, filters } = useSelector((state: RootState) => state.requests);
  const [dateFrom, setDateFrom] = useState(filters.date_from);
  const [dateTo, setDateTo] = useState(filters.date_to);
  const [statusFilter, setStatusFilter] = useState(filters.status);

  const loadRequests = () => {
    dispatch(fetchRequests({ status: statusFilter, date_from: dateFrom, date_to: dateTo }));
  };

  useEffect(() => {
    loadRequests();
    const interval = setInterval(() => {
      loadRequests();
    }, 5000);
    return () => clearInterval(interval);
  }, [dateFrom, dateTo, statusFilter]);

  const handleFilter = () => {
    dispatch(setFilters({ status: statusFilter, date_from: dateFrom, date_to: dateTo }));
    loadRequests();
  };

  const handleRowClick = (id: number) => {
    navigate(`/requests/${id}`);  // переход на детали заявки
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      draft: 'secondary',
      submitted: 'info',
      completed: 'success',
      rejected: 'danger',
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading && requests.length === 0) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  return (
    <div className="container mt-4">
      <h1>Заявки</h1>

      {/* Фильтры */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Control
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="Дата от"
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="Дата до"
          />
        </Col>
        <Col md={3}>
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Все статусы</option>
            <option value="draft">Черновик</option>
            <option value="submitted">Отправлено</option>
            <option value="completed">Завершено</option>
            <option value="rejected">Отклонено</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button variant="primary" onClick={handleFilter}>
            Применить
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>№</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Дата отправки</th>
            <th>Кол-во</th>
            <th>Сумма</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr 
              key={req.id} 
              onClick={() => handleRowClick(req.id)}
              style={{ cursor: 'pointer' }}
              className="request-row"
            >
              <td>{req.id}</td>
              <td>{getStatusBadge(req.status)}</td>
              <td>{req.created_at}</td>
              <td>{req.submitted_at || '-'}</td>
              <td>{req.positions_count}</td>
              <td>{req.amount_to_pay ? `${req.amount_to_pay} ₽` : '-'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RequestsPage;
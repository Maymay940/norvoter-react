import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';  
import type { AppDispatch, RootState } from '../store';
import { fetchRequests, setFilters } from '../store/slices/requestsSlice';
import { Table, Badge, Form, Row, Col, Spinner } from 'react-bootstrap';

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
    navigate(`/requests/${id}`);
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
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="page-header">
        <h1 className="page-title" style={{ textAlign: 'left', marginBottom: '24px' }}>Заявки</h1>
      </div>

      {/* Фильтры */}
      <div className="filters-panel" style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        borderRadius: '20px', 
        padding: '20px',
        marginBottom: '30px'
      }}>
        <Row className="align-items-end">
          <Col md={3}>
            <Form.Group>
              <Form.Label style={{ fontSize: '14px', color: '#666', marginBottom: '6px' }}>Дата от</Form.Label>
              <Form.Control
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                style={{ borderRadius: '12px', border: '1px solid #ddd', padding: '10px' }}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label style={{ fontSize: '14px', color: '#666', marginBottom: '6px' }}>Дата до</Form.Label>
              <Form.Control
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                style={{ borderRadius: '12px', border: '1px solid #ddd', padding: '10px' }}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label style={{ fontSize: '14px', color: '#666', marginBottom: '6px' }}>Статус</Form.Label>
              <Form.Select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ borderRadius: '12px', border: '1px solid #ddd', padding: '10px' }}
              >
                <option value="">Все статусы</option>
                <option value="draft">Черновик</option>
                <option value="submitted">Отправлено</option>
                <option value="completed">Завершено</option>
                <option value="rejected">Отклонено</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <button 
              className="btn-primary" 
              onClick={handleFilter}
              style={{
                width: '100%',
                borderRadius: '30px',
                padding: '10px 24px',
                fontSize: '16px',
                fontWeight: '500',
                backgroundColor: 'var(--primary-blue, #0E57E7)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0b4ad1';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-blue, #0E57E7)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Применить
            </button>
          </Col>
        </Row>
      </div>

      <div className="requests-list">
        <Table striped bordered hover style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px 16px' }}>№</th>
              <th style={{ padding: '12px 16px' }}>Статус</th>
              <th style={{ padding: '12px 16px' }}>Дата создания</th>
              <th style={{ padding: '12px 16px' }}>Дата отправки</th>
              <th style={{ padding: '12px 16px' }}>Кол-во</th>
              <th style={{ padding: '12px 16px' }}>Сумма</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr 
                key={req.id} 
                onClick={() => handleRowClick(req.id)}
                style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                className="request-row"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '12px 16px', fontWeight: '500' }}>{req.id}</td>
                <td style={{ padding: '12px 16px' }}>{getStatusBadge(req.status)}</td>
                <td style={{ padding: '12px 16px' }}>{new Date(req.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '12px 16px' }}>{req.submitted_at ? new Date(req.submitted_at).toLocaleDateString() : '-'}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>{req.positions_count}</td>
                <td style={{ padding: '12px 16px', fontWeight: '500', color: '#0E57E7' }}>
                  {req.amount_to_pay ? `${req.amount_to_pay} ₽` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        
        {requests.length === 0 && !loading && (
          <div className="text-center mt-5">
            <p className="text-secondary">Нет заявок</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsPage;
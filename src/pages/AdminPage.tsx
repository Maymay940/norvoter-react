// pages/AdminPage.tsx
import { useEffect, useState } from 'react';
import { Table, Badge, Button, Spinner, Form, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USE_MOCK } from '../config/env';
import * as mockApi from '../services/mockApi';

interface RequestItem {
  id: number;
  user_id: number;
  username: string;
  status: string;
  created_at: string;
  submitted_at: string | null;
  completed_at: string | null;
  positions_count: number;
  total_consumption: number | null;
  amount_to_pay: number | null;
  comment: string;
}

export const AdminPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [users, setUsers] = useState<Record<number, string>>({});

const loadUsers = async () => {
  try {
    let usersData;
    
    if (USE_MOCK) {
      const response = await mockApi.mockGetAllUsers();
      usersData = response.data;
      console.log('Загружены мок-пользователи:', usersData);
    } else {
      const response = await axios.get('/api/users/');
      usersData = response.data.data;
    }
    
    const userMap: Record<number, string> = {};
    usersData.forEach((user: any) => {
      userMap[user.id] = user.username;
    });
    setUsers(userMap);
  } catch (error) {
    console.error('Не удалось загрузить пользователей:', error);
    const fallbackMap: Record<number, string> = {
      1: 'admin',
      2: 'ivanov',
    };
    setUsers(fallbackMap);
  }
};

  const loadRequests = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filterStatus) params.status = filterStatus;
      if (filterDateFrom) params.date_from = filterDateFrom;
      if (filterDateTo) params.date_to = filterDateTo;
      
      const response = await axios.get('/api/requests/', { params });
      setRequests(response.data.data.requests);
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadRequests();
  }, [filterStatus, filterDateFrom, filterDateTo]);

  const handleViewDetails = (id: number) => {
    navigate(`/requests/${id}`);
  };

  const handleComplete = async (id: number) => {
    await axios.put(`/api/requests/${id}/complete/`);
    loadRequests();
  };

  const handleReject = async (id: number) => {
    await axios.put(`/api/requests/${id}/reject/`);
    loadRequests();
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/requests/${id}/delete/`);
    loadRequests();
    setShowDeleteModal(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      draft: 'secondary',
      submitted: 'info',
      completed: 'success',
      rejected: 'danger',
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const getUserDisplay = (userId: number) => {
    return users[userId] || `ID: ${userId}`;
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-2">Админ-панель</h1>
      <p className="text-muted mb-4">Управление заявками всех пользователей</p>

      {/* Фильтры */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Все статусы</option>
            <option value="draft">Черновик</option>
            <option value="submitted">Отправлено</option>
            <option value="completed">Завершено</option>
            <option value="rejected">Отклонено</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Control
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            placeholder="Дата от"
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            placeholder="Дата до"
          />
        </Col>
        <Col md={3}>
          <Button variant="primary" onClick={loadRequests} size="sm" className="rounded-pill w-100">Применить</Button>
        </Col>
      </Row>

      {/* Таблица заявок */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Пользователь</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Дата отправки</th>
            <th>Кол-во</th>
            <th>Сумма</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{getUserDisplay(req.user_id)}</td>
              <td>{getStatusBadge(req.status)}</td>
              <td>{req.created_at}</td>
              <td>{req.submitted_at || '-'}</td>
              <td>{req.positions_count}</td>
              <td>{req.amount_to_pay ? `${req.amount_to_pay} ₽` : '-'}</td>
              <td style={{ whiteSpace: 'nowrap' }}>

                <Button
                  size="sm"
                  variant="info"
                  onClick={() => handleViewDetails(req.id)}
                  className="me-2 rounded-pill"
                  title="Просмотр деталей"
                >
                  Подробнее
                </Button>

                {req.status === 'submitted' && (
                  <>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleComplete(req.id)}
                      className="me-2 rounded-pill"
                      title="Завершить заявку"
                    >
                      Завершить
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleReject(req.id)}
                      className="me-2 rounded-pill"
                      title="Отклонить заявку"
                    >
                      Отклонить
                    </Button>
                  </>
                )}

                {req.status === 'draft' && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      setSelectedRequest(req);
                      setShowDeleteModal(true);
                    }}
                    className="rounded-pill"
                    title="Удалить черновик"
                  >
                    Удалить
                  </Button>
                )}
               </td>
             </tr>
          ))}
        </tbody>
      </Table>

      {/* Модальное окно подтверждения удаления */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Вы уверены, что хотите удалить заявку №{selectedRequest?.id}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Отмена
          </Button>
          <Button variant="danger" onClick={() => selectedRequest && handleDelete(selectedRequest.id)}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPage;
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { fetchRequestById, deletePosition, updatePosition, submitRequest } from '../store/slices/requestSlice';
import { Button, Table, Spinner, Alert, Card } from 'react-bootstrap';

interface Position {
  id: number;
  water_meter__address: string;
  water_meter__meter_type: 'HOT' | 'COLD';
  water_meter__last_verified_reading: number;
  current_reading: number;
  consumption: number;
}

export const RequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentRequest, loading } = useSelector((state: RootState) => state.request);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchRequestById(parseInt(id)));
    }
  }, [id, dispatch]);

  const handleUpdateReading = async (positionId: number, currentReading: number) => {
    const newReading = prompt('Введите новые показания:', currentReading.toString());
    if (newReading) {
      await dispatch(updatePosition({ position_id: positionId, current_reading: parseInt(newReading) }));
      dispatch(fetchRequestById(parseInt(id!)));
    }
  };

  const handleDeletePosition = async (positionId: number) => {
    if (confirm('Удалить счётчик из заявки?')) {
      await dispatch(deletePosition(positionId));
      dispatch(fetchRequestById(parseInt(id!)));
    }
  };

  const handleSubmit = async () => {
    await dispatch(submitRequest(parseInt(id!)));
    navigate('/requests');
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (!currentRequest) return <Alert variant="danger">Заявка не найдена</Alert>;

  const isDraft = currentRequest.status === 'draft';
  const canEdit = isDraft || (user?.is_admin && currentRequest.status === 'submitted');

  return (
    <div className="container mt-4">
      <h1>Заявка №{currentRequest.id}</h1>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Статус: {currentRequest.status}</Card.Title>
          <Card.Text>
            <strong>Дата создания:</strong> {currentRequest.created_at}<br />
            {currentRequest.total_consumption && (
              <>
                <strong>Общий расход:</strong> {currentRequest.total_consumption} м³<br />
                <strong>Сумма к оплате:</strong> {currentRequest.amount_to_pay} ₽
              </>
            )}
          </Card.Text>
        </Card.Body>
      </Card>

      <h3>Показания счетчиков</h3>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Адрес</th>
            <th>Тип</th>
            <th>Предыдущие</th>
            <th>Текущие</th>
            <th>Расход</th>
            {canEdit && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {currentRequest.positions?.map((pos: Position) => (
            <tr key={pos.id}>
              <td>{pos.water_meter__address}</td>
              <td>{pos.water_meter__meter_type === 'HOT' ? 'ГВС' : 'ХВС'}</td>
              <td>{pos.water_meter__last_verified_reading}</td>
              <td>{pos.current_reading}</td>
              <td>{pos.consumption}</td>
              {canEdit && (
                <td>
                  <Button 
                    size="sm" 
                    variant="warning" 
                    onClick={() => handleUpdateReading(pos.id, pos.current_reading)}
                    className="me-1"
                  >
                    Изменить
                  </Button>
                  <Button 
                    size="sm" 
                    variant="danger" 
                    onClick={() => handleDeletePosition(pos.id)}
                  >
                    Удалить
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      {isDraft && (
        <div className="mt-4">
          <Button variant="success" onClick={handleSubmit} className="me-2">
            Подать показания
          </Button>
          <Button variant="primary" href="/">
            Добавить счётчик
          </Button>
        </div>
      )}
    </div>
  );
};

export default RequestDetailPage;
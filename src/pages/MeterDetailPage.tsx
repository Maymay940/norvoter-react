import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Image, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { getMeters, createRequest } from '../services/api';
import type { Meter } from '../types/meter';

export const MeterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meter, setMeter] = useState<Meter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reading, setReading] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [consumption, setConsumption] = useState<number | null>(null);

  useEffect(() => {
    const loadMeter = async () => {
      try {
        const meters = await getMeters();
        const found = meters.find(m => m.id === Number(id));
        if (found) {
          setMeter(found);
        } else {
          setError('Счетчик не найден');
        }
      } catch (err) {
        setError('Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };
    loadMeter();
  }, [id]);

  // расчет расхода при вводе показаний
  const handleReadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setReading(e.target.value);
    if (meter && !isNaN(value) && value >= meter.last_verified_reading) {
      setConsumption(value - meter.last_verified_reading);
    } else {
      setConsumption(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meter || !reading) return;

    setSubmitting(true);
    try {
      const result = await createRequest(meter.id, parseInt(reading));
      if (result.request_id) {
        navigate(`/requests/${result.request_id}`);
      } else {
        setError('Ошибка при создании заявки');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error || !meter) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error || 'Счетчик не найден'}</Alert>
        <Button variant="primary" onClick={() => navigate('/')}>На главную</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Button variant="link" onClick={() => navigate(-1)} className="mb-3">
        ← Назад
      </Button>

      <h1 className="mb-4">{meter.address}</h1>

      <Row>
        <Col md={6}>
          <Image
            src={meter.photo_url || '/default-meter.jpg'}
            fluid
            rounded
            className="mb-3"
          />
          {meter.setup_video_url && (
            <div className="mt-3">
              <video controls className="w-100" style={{ borderRadius: '8px' }}>
                <source src={meter.setup_video_url} type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
            </div>
          )}
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>{meter.meter_model} №{meter.serial_number}</Card.Title>
              <Card.Text>
                <strong>Тип:</strong> {meter.meter_type === 'HOT' ? 'Горячая вода' : 'Холодная вода'}<br />
                <strong>Дата установки:</strong> {meter.installation_date}<br />
                <strong>Последние показания:</strong> {meter.last_verified_reading} м³
              </Card.Text>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title className="mb-3">Передать показания</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Текущие показания (м³)</Form.Label>
                  <Form.Control
                    type="number"
                    value={reading}
                    onChange={handleReadingChange}
                    placeholder="Введите показания"
                    min={meter.last_verified_reading}
                    required
                  />
                </Form.Group>

                {consumption !== null && (
                  <Alert variant="info" className="mt-2">
                    Расход в этом месяце: <strong>{consumption} м³</strong>
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="success"
                  className="w-100"
                  disabled={submitting || !reading || consumption === null}
                >
                  {submitting ? 'Отправка...' : 'Передать показания'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
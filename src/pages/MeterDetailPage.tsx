// src/pages/MeterDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { fetchMeters } from '../store/slices/metersSlice';
import { addToRequest, fetchCart } from '../store/slices/requestSlice';
import type { Meter } from '../store/slices/metersSlice';
import { Button, Spinner, Alert } from 'react-bootstrap';

export const MeterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [meter, setMeter] = useState<Meter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reading, setReading] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [consumption, setConsumption] = useState<number | null>(null);

  useEffect(() => {
    const loadMeter = async () => {
      try {
        const meters = await dispatch(fetchMeters()).unwrap();
        const found = meters.find((m: Meter) => m.id === Number(id));
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
  }, [id, dispatch]);

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
      const result = await dispatch(addToRequest({ 
        meter_id: meter.id, 
        current_reading: parseInt(reading) 
      })).unwrap();
      await dispatch(fetchCart());
      if (result.request_id) {
        navigate(`/requests/${result.request_id}`);
      }
    } catch (err) {
      setError('Ошибка при создании заявки');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error || !meter) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">{error || 'Счетчик не найден'}</Alert>
        <Button variant="primary" onClick={() => navigate('/')}>На главную</Button>
      </div>
    );
  }

  return (
    <div className="app">
      <main className="main">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">{meter.address}</h1>
          </div>

          <div className="meter-card">
            <div className="card__image-col">
              {meter.photo_url ? (
                <img src={meter.photo_url} alt={`Счетчик ${meter.serial_number}`} className="meter-photo" />
              ) : (
                <img src="/default-meter.jpg" alt="Нет фото" className="meter-photo" />
              )}
              
              {meter.setup_video_url && (
                <div className="video-section">
                  <video className="meter-video" autoPlay muted loop playsInline>
                    <source src={meter.setup_video_url} type="video/mp4" />
                  </video>
                </div>
              )}
            </div>

            <div className="card__content-col">
              <div className="info-block">
                <div className="info-line">
                  <span className="info-label">Модель:</span>
                  <span className="info-value">{meter.meter_model} (№{meter.serial_number})</span>
                </div>
                <div className="info-line">
                  <span className="info-label">Тип:</span>
                  <span className="info-value">{meter.meter_type === 'HOT' ? 'Горячая вода' : 'Холодная вода'}</span>
                </div>
                <div className="info-line">
                  <span className="info-label">Дата установки:</span>
                  <span className="info-value">{meter.installation_date}</span>
                </div>
                <div className="info-line">
                  <span className="info-label">Последние показания:</span>
                  <span className="info-value">{meter.last_verified_reading} м³ (подтверждено)</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="reading-form">
                <input type="hidden" name="meter_id" value={meter.id} />

                <div className="reading-section">
                  <div className="reading-input-col">
                    <label htmlFor="current_reading" className="reading-label">Текущие показания:</label>
                    <input
                      type="number"
                      id="current_reading"
                      name="current_reading"
                      className="reading-input"
                      placeholder="Введите показания"
                      min={meter.last_verified_reading}
                      value={reading}
                      onChange={handleReadingChange}
                      required
                    />
                  </div>

                  <div className="reading-stats-col">
                    <div className="previous-reading">
                      <span className="stats-label">Предыдущие показания:</span>
                      <span className="previous-value">{meter.last_verified_reading} м³</span>
                    </div>
                    <div className="calculated-consumption" id="consumption-display">
                      <span className="stats-label">Расход в этом месяце:</span>
                      <span className="stats-value" id="consumption-value">
                        {consumption !== null ? `${consumption} м³` : '-- м³'}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
                    {error}
                  </div>
                )}

                <div className="card__actions">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Отправка...' : 'передать показания'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MeterDetailPage;
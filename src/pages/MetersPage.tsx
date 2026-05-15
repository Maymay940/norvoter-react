import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { MeterCard } from '../components/MeterCard';
import { VideoBackground } from '../components/VideoBackground';
import { getMeters } from '../services/api';
import type { Meter } from '../types/meter';

export const MetersPage = () => {
  const [meters, setMeters] = useState<Meter[]>([]);
  const [searchAddress, setSearchAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMeters();
  }, []);

  const loadMeters = async (address?: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await getMeters(address);
      setMeters(data);
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadMeters(searchAddress);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <>
      <VideoBackground />
      <Container className="mt-4">
        <div className="page-header">
          <h1 className="page-title page-title-light">Счетчики воды</h1>
        </div>

        <div className="search-section search-section-transparent">
          <div className="search-field search-field-light">
            <input
              type="text"
              className="search-input search-input-light"
              placeholder="Найти по адресу..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-button search-button-light" onClick={handleSearch}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="cards-grid">
          {meters.map((meter) => (
            <MeterCard key={meter.id} meter={meter} />
          ))}
        </div>
      </Container>
    </>
  );
};
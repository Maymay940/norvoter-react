import { useNavigate } from 'react-router-dom';
import type { Meter } from '../types/meter';

interface Props {
  meter: Meter;
}

export const MeterCard = ({ meter }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="meter-card-compact meter-card-glass">
      <h3 className="compact-title">{meter.meter_model} № {meter.serial_number}</h3>
      <p className="compact-address">{meter.address}</p>
      <p className="compact-type">Тип: {meter.meter_type === 'HOT' ? 'ГВС' : 'ХВС'}</p>
      <div className="compact-footer">
        <span className="compact-days">{meter.last_verified_reading}</span>
        <span className="compact-label">последние показания</span>
      </div>
      <button 
        className="btn btn-primary btn-compact"
        onClick={() => navigate(`/meters/${meter.id}`)}
      >
        подробнее
      </button>
    </div>
  );
};
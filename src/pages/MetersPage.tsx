import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { MeterCard } from '../components/MeterCard';
import { VideoBackground } from '../components/VideoBackground';
import { getMeters } from '../services/api';
import type { RootState } from '../store';
import { setAddress, setMeterType, setSortBy } from '../store/slices/filtersSlice';
import type { Meter } from '../types/meter';

export const MetersPage = () => {
  const dispatch = useDispatch();
  const { address, meterType, sortBy } = useSelector((state: RootState) => state.filters);
  const [localSearch, setLocalSearch] = useState(address);
  const queryClient = useQueryClient();

  const { data: meters = [], isLoading, isFetching, error } = useQuery<Meter[]>({
    queryKey: ['meters', address],
    queryFn: async () => {
      const response = await getMeters(address);
      
      if (response && typeof response === 'object') {
        if (Array.isArray(response)) {
          return response;
        }
        if ('data' in response && Array.isArray((response as any).data)) {
          return (response as any).data;
        }
        if ('data' in response && (response as any).data && 'data' in (response as any).data && Array.isArray((response as any).data.data)) {
          return (response as any).data.data;
        }
      }
      
      return [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const isRefreshing = isFetching && !isLoading;

  const handleSearch = () => {
    dispatch(setAddress(localSearch));
    queryClient.invalidateQueries({ queryKey: ['meters'] });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filteredMeters = (Array.isArray(meters) ? meters : [])
    .filter((meter) => address === '' || meter.address.toLowerCase().includes(address.toLowerCase()))
    .filter((meter) => meterType === 'all' || meter.meter_type === meterType)
    .sort((a, b) => {
      if (sortBy === 'address') {
        return a.address.localeCompare(b.address);
      } else {
        return b.last_verified_reading - a.last_verified_reading;
      }
    });

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <div className="alert alert-danger">Ошибка загрузки данных</div>
      </div>
    );
  }

  return (
    <>
      <VideoBackground />
      <div className="app">
        <main className="main">
          <div className="container">
            <div className="page-header">
              <div className="page-header-bar">
                <h1 className="page-title page-title-light">Счетчики воды</h1>
                <div className="filters-wrapper">
                  <select 
                    value={meterType} 
                    onChange={(e) => dispatch(setMeterType(e.target.value as any))}
                    className="filter-select meter-type-filter"
                  >
                    <option value="all">Все типы</option>
                    <option value="HOT">ГВС</option>
                    <option value="COLD">ХВС</option>
                  </select>
                  
                  <select 
                    value={sortBy} 
                    onChange={(e) => dispatch(setSortBy(e.target.value as any))}
                    className="filter-select meter-sort-filter"
                  >
                    <option value="address">По адресу</option>
                    <option value="last_reading">По показаниям</option>
                  </select>
                  
                  {isRefreshing && <Spinner animation="border" size="sm" className="ms-2" />}
                </div>
              </div>
            </div>

            <div className="search-section search-section-transparent">
              <div className="search-field search-field-light">
                <input
                  type="text"
                  className="search-input search-input-light"
                  placeholder="Найти по адресу..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className="search-button search-button-light" onClick={handleSearch}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="cards-grid">
              {filteredMeters.map((meter) => (
                <MeterCard key={meter.id} meter={meter} />
              ))}
            </div>
            
            {filteredMeters.length === 0 && (
              <div className="text-center mt-5">
                <p className="text-light">Ничего не найдено</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

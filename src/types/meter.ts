export interface Meter {
  id: number;
  user_id?: number; 
  address: string;
  serial_number: string;
  meter_type: 'HOT' | 'COLD';
  meter_model: string;
  installation_date: string;
  last_verified_reading: number;
  photo_url: string | null;
  setup_video_url: string | null;
}
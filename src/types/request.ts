export interface Position {
  id: number;
  water_meter__address: string;
  water_meter__meter_type: 'HOT' | 'COLD';
  water_meter__last_verified_reading: number;
  current_reading: number;
  consumption: number;
}

export interface Request {
  id: number;
  status: string;
  created_at: string;
  submitted_at: string | null;
  completed_at: string | null;
  positions_count: number;
  total_consumption: number | null;
  amount_to_pay: number | null;
  comment: string;
  positions?: Position[];
}
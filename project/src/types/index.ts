export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email: string;
  license_plate?: string;
  face_encoding?: string;
  visit_count: number;
  last_visit: Date;
  created_at: Date;
}

export interface DriveThruSession {
  id: string;
  customer_id?: string;
  vehicle_plate?: string;
  order_start_time: Date;
  order_end_time?: Date;
  pickup_time?: Date;
  total_duration?: number;
  status: 'ordering' | 'preparing' | 'completed';
}

export interface DailyAnalytics {
  date: Date;
  total_customers: number;
  avg_service_time: number;
  peak_hours: { hour: number; count: number }[];
  delayed_orders: number;
}
/*
  # Initial Schema for CKH Drive Thru Analytics

  1. New Tables
    - customers: Stores customer information and recognition data
    - drive_thru_sessions: Tracks individual drive-thru visits
    - daily_analytics: Stores aggregated daily statistics
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT UNIQUE NOT NULL,
  license_plate TEXT,
  face_encoding TEXT,
  visit_count INTEGER DEFAULT 0,
  last_visit TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Drive-thru sessions table
CREATE TABLE IF NOT EXISTS drive_thru_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  vehicle_plate TEXT,
  order_start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  order_end_time TIMESTAMPTZ,
  pickup_time TIMESTAMPTZ,
  total_duration INTEGER, -- in seconds
  status TEXT CHECK (status IN ('ordering', 'preparing', 'completed')) DEFAULT 'ordering',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Daily analytics table
CREATE TABLE IF NOT EXISTS daily_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  total_customers INTEGER DEFAULT 0,
  avg_service_time INTEGER, -- in seconds
  peak_hours JSONB,
  delayed_orders INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_thru_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow authenticated read access" ON customers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON drive_thru_sessions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON daily_analytics
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert" ON customers
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated insert" ON drive_thru_sessions
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated insert" ON daily_analytics
  FOR INSERT TO authenticated WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_license_plate ON customers(license_plate);
CREATE INDEX IF NOT EXISTS idx_customers_last_visit ON customers(last_visit);
CREATE INDEX IF NOT EXISTS idx_sessions_customer_id ON drive_thru_sessions(customer_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON drive_thru_sessions(status);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON daily_analytics(date);
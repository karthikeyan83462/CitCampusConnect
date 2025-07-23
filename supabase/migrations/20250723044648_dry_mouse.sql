/*
  # Initial Schema Setup for CampusConnect

  1. New Tables
    - `profiles` - User profiles with role-based access
    - `clubs` - Student clubs and organizations
    - `club_members` - Club membership relationships
    - `hostel_rooms` - Hostel room management
    - `hostel_complaints` - Maintenance and complaint tracking
    - `canteen_items` - Food items and menu management
    - `canteen_orders` - Order processing and tracking
    - `marketplace_items` - Student marketplace listings

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure user data with proper authentication checks

  3. Features
    - UUID primary keys for all tables
    - Timestamps for audit trails
    - Proper foreign key relationships
    - Default values for better data consistency
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'club_head', 'canteen_vendor', 'hostel_admin', 'super_admin')),
  student_id text,
  phone text,
  hostel_block text,
  room_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Clubs table
CREATE TABLE IF NOT EXISTS clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  club_head_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  member_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Club members table
CREATE TABLE IF NOT EXISTS club_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(club_id, user_id)
);

-- Hostel rooms table
CREATE TABLE IF NOT EXISTS hostel_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block text NOT NULL,
  room_number text NOT NULL,
  capacity integer DEFAULT 2,
  occupied integer DEFAULT 0,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(block, room_number)
);

-- Hostel complaints table
CREATE TABLE IF NOT EXISTS hostel_complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('plumbing', 'electricity', 'cleaning', 'maintenance', 'other')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Canteen items table
CREATE TABLE IF NOT EXISTS canteen_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  category text NOT NULL,
  is_available boolean DEFAULT true,
  vendor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Canteen orders table
CREATE TABLE IF NOT EXISTS canteen_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  items jsonb NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  delivery_type text DEFAULT 'pickup' CHECK (delivery_type IN ('pickup', 'delivery')),
  delivery_address text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Marketplace items table
CREATE TABLE IF NOT EXISTS marketplace_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  category text NOT NULL,
  condition text NOT NULL CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
  images text[] DEFAULT '{}',
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE canteen_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE canteen_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Clubs policies
CREATE POLICY "Anyone can read active clubs"
  ON clubs
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Club heads can manage their clubs"
  ON clubs
  FOR ALL
  TO authenticated
  USING (club_head_id = auth.uid());

-- Club members policies
CREATE POLICY "Users can read club memberships"
  ON club_members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join clubs"
  ON club_members
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave clubs"
  ON club_members
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Hostel complaints policies
CREATE POLICY "Users can read own complaints"
  ON hostel_complaints
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create complaints"
  ON hostel_complaints
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Canteen items policies
CREATE POLICY "Anyone can read available items"
  ON canteen_items
  FOR SELECT
  TO authenticated
  USING (is_available = true);

-- Canteen orders policies
CREATE POLICY "Users can read own orders"
  ON canteen_orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create orders"
  ON canteen_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Marketplace items policies
CREATE POLICY "Anyone can read available items"
  ON marketplace_items
  FOR SELECT
  TO authenticated
  USING (is_available = true);

CREATE POLICY "Users can manage own items"
  ON marketplace_items
  FOR ALL
  TO authenticated
  USING (seller_id = auth.uid());

-- Functions to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON clubs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hostel_complaints_updated_at BEFORE UPDATE ON hostel_complaints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_canteen_items_updated_at BEFORE UPDATE ON canteen_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_canteen_orders_updated_at BEFORE UPDATE ON canteen_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketplace_items_updated_at BEFORE UPDATE ON marketplace_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
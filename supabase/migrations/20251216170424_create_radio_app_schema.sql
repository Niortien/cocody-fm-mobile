/*
  # Create Radio App Schema

  1. New Tables
    - `programs`
      - `id` (uuid, primary key)
      - `title` (text) - Program title
      - `description` (text) - Program description
      - `day_of_week` (integer) - 0=Sunday, 1=Monday, ..., 6=Saturday
      - `start_time` (time) - Start time of the program
      - `end_time` (time) - End time of the program
      - `host_name` (text) - Name of the host
      - `image_url` (text) - Program image URL
      - `created_at` (timestamptz)
    
    - `hosts`
      - `id` (uuid, primary key)
      - `name` (text) - Host name
      - `bio` (text) - Host biography
      - `photo_url` (text) - Host photo URL
      - `role` (text) - Host role/position
      - `created_at` (timestamptz)
    
    - `partners`
      - `id` (uuid, primary key)
      - `name` (text) - Partner name
      - `description` (text) - Partner description
      - `logo_url` (text) - Partner logo URL
      - `website` (text) - Partner website
      - `display_order` (integer) - Display order
      - `created_at` (timestamptz)
    
    - `radio_info`
      - `id` (uuid, primary key)
      - `key` (text, unique) - Info key (e.g., 'history', 'audio_stream_url', 'video_stream_url')
      - `value` (text) - Info value
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (radio app data is public)
*/

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  host_name text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create hosts table
CREATE TABLE IF NOT EXISTS hosts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  bio text DEFAULT '',
  photo_url text DEFAULT '',
  role text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  logo_url text DEFAULT '',
  website text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create radio_info table
CREATE TABLE IF NOT EXISTS radio_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE radio_info ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Programs are publicly readable"
  ON programs FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Hosts are publicly readable"
  ON hosts FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Partners are publicly readable"
  ON partners FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Radio info is publicly readable"
  ON radio_info FOR SELECT
  TO anon
  USING (true);

-- Insert sample data for radio info
INSERT INTO radio_info (key, value) VALUES
  ('history', 'Notre radio a été fondée en 2020 avec la mission de promouvoir la culture locale et de divertir notre communauté. Depuis nos débuts, nous avons grandi pour devenir une voix incontournable dans la région, offrant une programmation variée et de qualité.'),
  ('audio_stream_url', 'https://example.com/radio/stream'),
  ('video_stream_url', 'https://example.com/radio/live'),
  ('radio_name', 'Radio Orange FM'),
  ('tagline', 'Votre radio locale')
ON CONFLICT (key) DO NOTHING;

-- Insert sample hosts
INSERT INTO hosts (name, bio, role, photo_url) VALUES
  ('Marie Dubois', 'Animatrice passionnée depuis 10 ans, Marie apporte son énergie et sa bonne humeur chaque matin.', 'Animatrice matinale', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Jean Martin', 'Expert en musique et culture, Jean vous accompagne pendant vos après-midis.', 'Animateur après-midi', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Sophie Laurent', 'Voix apaisante du soir, Sophie vous guide vers la nuit avec douceur.', 'Animatrice soirée', 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400')
ON CONFLICT DO NOTHING;

-- Insert sample programs
INSERT INTO programs (title, description, day_of_week, start_time, end_time, host_name, image_url) VALUES
  ('Le Réveil Orange', 'Démarrez votre journée avec énergie et bonne humeur', 1, '06:00', '09:00', 'Marie Dubois', 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Musique et Culture', 'Découvrez la musique et la culture locale', 1, '14:00', '17:00', 'Jean Martin', 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Soirée Douce', 'Détendez-vous en fin de journée', 1, '19:00', '22:00', 'Sophie Laurent', 'https://images.pexels.com/photos/1916824/pexels-photo-1916824.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Le Réveil Orange', 'Démarrez votre journée avec énergie et bonne humeur', 2, '06:00', '09:00', 'Marie Dubois', 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Musique et Culture', 'Découvrez la musique et la culture locale', 2, '14:00', '17:00', 'Jean Martin', 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Soirée Douce', 'Détendez-vous en fin de journée', 2, '19:00', '22:00', 'Sophie Laurent', 'https://images.pexels.com/photos/1916824/pexels-photo-1916824.jpeg?auto=compress&cs=tinysrgb&w=400')
ON CONFLICT DO NOTHING;

-- Insert sample partners
INSERT INTO partners (name, description, logo_url, website, display_order) VALUES
  ('Café Central', 'Notre partenaire café local', 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://cafecentral.example.com', 1),
  ('Librairie du Coin', 'La librairie de référence en ville', 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://librairie.example.com', 2),
  ('Restaurant Le Gourmet', 'Gastronomie locale de qualité', 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://legourmet.example.com', 3)
ON CONFLICT DO NOTHING;
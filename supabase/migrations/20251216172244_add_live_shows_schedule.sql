/*
  # Add Live Shows Schedule

  1. New Tables
    - `live_shows`
      - `id` (uuid, primary key)
      - `title` (text) - Live show title
      - `description` (text) - Live show description
      - `start_time` (time) - Start time of the live show
      - `end_time` (time) - End time of the live show
      - `host_name` (text) - Name of the host
      - `thumbnail_url` (text) - Show thumbnail URL
      - `is_active` (boolean) - Whether the show is currently live
      - `day_of_week` (integer) - Day of the week (0=Sunday, 1=Monday, etc.)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `live_shows` table
    - Add policy for public read access

  3. Sample Data
    - Insert sample live shows for demonstration
*/

-- Create live_shows table
CREATE TABLE IF NOT EXISTS live_shows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  start_time time NOT NULL,
  end_time time NOT NULL,
  host_name text DEFAULT '',
  thumbnail_url text DEFAULT '',
  is_active boolean DEFAULT false,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE live_shows ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Live shows are publicly readable"
  ON live_shows FOR SELECT
  TO anon
  USING (true);

-- Insert sample live shows for different days
INSERT INTO live_shows (title, description, start_time, end_time, host_name, thumbnail_url, day_of_week, is_active) VALUES
  ('Le Morning Show', 'Démarrez votre journée en direct avec toute l''actualité', '06:00', '09:00', 'Marie Dubois', 'https://images.pexels.com/photos/3756165/pexels-photo-3756165.jpeg?auto=compress&cs=tinysrgb&w=400', 1, false),
  ('Journal de Midi', 'Les informations en direct à l''heure du déjeuner', '12:00', '13:00', 'Pierre Durand', 'https://images.pexels.com/photos/3760607/pexels-photo-3760607.jpeg?auto=compress&cs=tinysrgb&w=400', 1, false),
  ('L''Après-midi Live', 'Musique, débats et invités en direct', '14:00', '17:00', 'Jean Martin', 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400', 1, true),
  ('Le Talk du Soir', 'Débats et discussions en direct', '19:00', '21:00', 'Sophie Laurent', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400', 1, false),
  ('Le Morning Show', 'Démarrez votre journée en direct avec toute l''actualité', '06:00', '09:00', 'Marie Dubois', 'https://images.pexels.com/photos/3756165/pexels-photo-3756165.jpeg?auto=compress&cs=tinysrgb&w=400', 2, false),
  ('Journal de Midi', 'Les informations en direct à l''heure du déjeuner', '12:00', '13:00', 'Pierre Durand', 'https://images.pexels.com/photos/3760607/pexels-photo-3760607.jpeg?auto=compress&cs=tinysrgb&w=400', 2, false),
  ('L''Après-midi Live', 'Musique, débats et invités en direct', '14:00', '17:00', 'Jean Martin', 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400', 2, false),
  ('Le Talk du Soir', 'Débats et discussions en direct', '19:00', '21:00', 'Sophie Laurent', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400', 2, false)
ON CONFLICT DO NOTHING;
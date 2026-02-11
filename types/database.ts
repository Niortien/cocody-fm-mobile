export interface Program {
  id: string;
  title: string;
  description: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  host_name: string;
  image_url: string;
  created_at: string;
}

export interface Host {
  id: string;
  name: string;
  bio: string;
  photo_url: string;
  role: string;
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  website: string;
  display_order: number;
  created_at: string;
}

export interface RadioInfo {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface LiveShow {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  host_name: string;
  thumbnail_url: string;
  is_active: boolean;
  day_of_week: number;
  created_at: string;
}

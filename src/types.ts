export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  status: 'draft' | 'published';
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface Review {
  id: number;
  user_id: number;
  service_id: number;
  rating: number;
  comment: string;
  created_at: string;
  is_approved: boolean;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  status: 'active' | 'inactive';
  category_id: number;
}

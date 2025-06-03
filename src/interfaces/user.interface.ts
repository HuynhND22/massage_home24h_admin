export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
} 
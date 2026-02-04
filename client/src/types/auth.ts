export type UserRole = 'admin' | 'operator' | 'resident';

export interface User {
  id: number;
  name: string;
  role: UserRole;
  village_id: number;

  username?: string;
  email?: string;
  phone?: string;
  contact_number?: string;
  is_active?: boolean;
  address?: string;

  village?: {
    village_id: number;
    village_name: string;
    taluka: string;
    district: string;
    state: string;
  };
}

export interface LoginCredentials {
  identifier: string; // username or phone
  password: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

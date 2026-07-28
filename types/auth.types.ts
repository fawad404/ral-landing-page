export type UserRole = 'admin' | 'facility' | 'vendor';

export interface AuthUser {
  _id: string;
  email: string;
  role: UserRole;
  isApproved: boolean;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

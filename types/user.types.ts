import type { UserRole } from './auth.types';

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  isApproved: boolean;
  isActive: boolean;
  lastLogin: string | null;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResetPasswordResponse {
  temporaryPassword: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  isApproved?: boolean;
  isActive?: boolean;
}

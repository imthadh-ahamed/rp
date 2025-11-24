import { CurrentUser } from "./currentUser";

/**
 * API Response Types
 * Match backend response structure
 */

// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

// Auth Responses
export interface AuthData {
  user: CurrentUser;
  token: string;
}

export interface AuthResponse extends ApiResponse<AuthData> {
  success: boolean;
  message: string;
  data: AuthData;
}

export interface ProfileResponse extends ApiResponse<{ user: CurrentUser }> {
  success: boolean;
  message: string;
  data: {
    user: CurrentUser;
  };
}

// Request Types
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Validation Error
export interface ValidationError {
  field?: string;
  message: string;
  value?: string;
}

export interface ValidationErrorResponse extends ApiResponse {
  success: false;
  message: string;
  error: ValidationError[];
}

// Error Response
export interface ErrorResponse extends ApiResponse {
  success: false;
  message: string;
  error?: any;
}



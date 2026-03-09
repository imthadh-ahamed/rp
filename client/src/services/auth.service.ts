import Cookies from "js-cookie";
import { CurrentUser } from "@/types/currentUser";
import {
  AuthResponse,
  ProfileResponse,
  RegisterRequest,
  LoginRequest,
  AuthData,
} from "@/types/api.types";
import axiosInstance from "./http-service";

/**
 * Authentication Service
 * Handles all authentication operations without Redux
 * For Redux integration, use auth-redux.service.ts instead
 */
class AuthService {
  private readonly TOKEN_KEY = "token";
  private readonly USER_KEY = "user";

  /**
   * Register a new user
   * @param data User registration data
   * @returns User data and authentication token
   */
  register = async (data: RegisterRequest): Promise<AuthData> => {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        "/auth/register",
        data
      );

      if (response.data.success) {
        const { user, token } = response.data.data;

        // Store token in cookies
        Cookies.set(this.TOKEN_KEY, token, { expires: 7 });

        // Store user data in localStorage
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));

        return { user, token };
      }

      throw new Error(response.data.message || "Registration failed");
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Registration failed";
      throw new Error(message);
    }
  };

  /**
   * Login user
   * @param credentials User login credentials
   * @returns User data and authentication token
   */
  login = async (credentials: LoginRequest): Promise<AuthData> => {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        "/auth/login",
        credentials
      );

      if (response.data.success) {
        const { user, token } = response.data.data;

        // Store token in cookies
        Cookies.set(this.TOKEN_KEY, token, { expires: 7 });

        // Store user data in localStorage
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));

        return { user, token };
      }

      throw new Error(response.data.message || "Login failed");
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      throw new Error(message);
    }
  };

  /**
   * Get current user profile
   * @returns Current user data
   */
  getCurrentUser = async (): Promise<CurrentUser> => {
    try {
      const response = await axiosInstance.get<ProfileResponse>("/auth/profile");

      if (response.data.success) {
        const { user } = response.data.data;

        // Update stored user data
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));

        return user;
      }

      throw new Error(response.data.message || "Failed to fetch profile");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch profile";
      throw new Error(message);
    }
  };

  /**
   * Logout user
   * Clears all authentication data
   */
  logout = (): void => {
    // Remove token from cookies
    Cookies.remove(this.TOKEN_KEY);

    // Remove user data from localStorage
    localStorage.removeItem(this.USER_KEY);
  };

  /**
   * Get stored user from localStorage
   * @returns Stored user data or null
   */
  getStoredUser = (): CurrentUser | null => {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };

  /**
   * Get stored token from cookies
   * @returns Stored token or null
   */
  getStoredToken = (): string | null => {
    return Cookies.get(this.TOKEN_KEY) || null;
  };

  /**
   * Check if user is authenticated
   * @returns True if user is authenticated
   */
  isAuthenticated = (): boolean => {
    return !!this.getStoredToken();
  };
}

export default new AuthService();
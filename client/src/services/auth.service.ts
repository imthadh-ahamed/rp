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

class AuthService {
  private readonly TOKEN_KEY = "token";
  private readonly USER_KEY = "user";

  register = async (data: RegisterRequest): Promise<AuthData> => {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        "/auth/register",
        data
      );

      if (response.data.success) {
        const { user, token } = response.data.data;
        Cookies.set(this.TOKEN_KEY, token, { expires: 7 });
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

  login = async (credentials: LoginRequest): Promise<AuthData> => {
    // 🔓 LOGIN DISABLED — all users are allowed through
    const mockUser: CurrentUser = {
      id: "dev-user-001",
      email: credentials.email,
      name: "Dev User",
    } as CurrentUser;

    const mockToken = "dev-token-bypass-123";

    Cookies.set(this.TOKEN_KEY, mockToken, { expires: 7 });
    localStorage.setItem(this.USER_KEY, JSON.stringify(mockUser));

    return { user: mockUser, token: mockToken };
  };

  getCurrentUser = async (): Promise<CurrentUser> => {
    // 🔓 Return stored user directly when login is bypassed
    const stored = this.getStoredUser();
    if (stored) return stored;

    try {
      const response = await axiosInstance.get<ProfileResponse>("/auth/profile");

      if (response.data.success) {
        const { user } = response.data.data;
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

  logout = (): void => {
    Cookies.remove(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  };

  getStoredUser = (): CurrentUser | null => {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };

  getStoredToken = (): string | null => {
    return Cookies.get(this.TOKEN_KEY) || null;
  };

  isAuthenticated = (): boolean => {
    return !!this.getStoredToken();
  };
}

export default new AuthService();
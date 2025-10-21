/**
 * Current User Type
 * Represents the authenticated user's data
 */
export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

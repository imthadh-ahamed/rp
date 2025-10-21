import { CurrentUser } from "./currentUser";

/**
 * Current Response Type
 * Wraps API response with status and data
 */
export interface Current {
  status: number;
  data: CurrentUser;
}

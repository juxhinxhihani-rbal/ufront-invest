import { jwtDecode } from "jwt-decode";

export function decodeAccessToken(token: string): Record<string, any> | null {
  try {
    return jwtDecode(token);
  } catch (e) {
    console.error("Invalid JWT:", e);
    return null;
  }
}

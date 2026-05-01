export const runtime = "nodejs";
import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";

const COOKIE = process.env.SESSION_COOKIE_NAME ?? "__session";

export interface User {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
}

// Verifica un ID token de Firebase (usado para API calls desde el cliente)
export async function verifyIdToken(idToken: string): Promise<{ uid: string; email?: string }> {
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    return { uid: decoded.uid, email: decoded.email };
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export async function getServerUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(token, true);
    
    return {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    };
  } catch {
    return null;
  }
}

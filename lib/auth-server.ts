export const runtime = "nodejs";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "./firebase-admin";

const COOKIE = process.env.SESSION_COOKIE_NAME ?? "__session";

export interface User {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  role: string;
  isAdmin: boolean;
}

export async function getServerUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(token, true);
    
    // Consultar rol en Firestore
    const userDoc = await adminDb.doc(`users/${decoded.uid}`).get();
    const userData = userDoc.data();
    
    const role = userData?.role ?? "user";
    
    return {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      role: role,
      isAdmin: role === "admin",
    };
  } catch {
    return null;
  }
}

export async function isAdminUser(): Promise<boolean> {
  const user = await getServerUser();
  return user?.isAdmin ?? false;
}

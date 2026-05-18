"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./firebase-client";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // Obtiene el rol del usuario y devuelve true si es admin
  const fetchUserRole = async (uid: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/user/role?uid=${uid}`);
      if (res.ok) {
        const data = await res.json();
        return data.role === "admin";
      }
    } catch {
      // silenciar error de red
    }
    return false;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // ── CORRECCIÓN: esperar el rol ANTES de quitar el loading ──
        const admin = await fetchUserRole(firebaseUser.uid);
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }

      // Solo se pone false DESPUÉS de conocer el rol
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

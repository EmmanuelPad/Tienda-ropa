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
  username: string; // ← nuevo: nombre de usuario desde Firestore
  setUsername: (u: string) => void; // ← para actualizar sin recargar tras guardar en Config
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  isAdmin: false,
  username: "",
  setUsername: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  // Obtiene el rol y el username del usuario
  const fetchUserData = async (uid: string): Promise<{ isAdmin: boolean; username: string }> => {
    try {
      // Rol
      const roleRes = await fetch(`/api/user/role?uid=${uid}`);
      const roleData = roleRes.ok ? await roleRes.json() : {};
      const isAdmin = roleData.role === "admin";

      // Username desde Firestore
      const userRes = await fetch(`/api/user?uid=${uid}`);
      const userData = userRes.ok ? await userRes.json() : {};
      const username = userData?.usuario?.username || "";

      return { isAdmin, username };
    } catch {
      return { isAdmin: false, username: "" };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const { isAdmin, username } = await fetchUserData(firebaseUser.uid);
        setIsAdmin(isAdmin);
        setUsername(username);
      } else {
        setIsAdmin(false);
        setUsername("");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, isAdmin, username, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

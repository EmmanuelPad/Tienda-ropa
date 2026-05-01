"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

/**
 * Redirige automáticamente si el usuario no tiene el rol requerido.
 * Úsalo al inicio de cualquier página protegida.
 *
 * @example
 * // Solo admins
 * useRequireRole("admin");
 *
 * // Solo usuarios autenticados (cualquier rol)
 * useRequireRole("user");
 */
export function useRequireRole(requiredRole: "user" | "admin") {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // No autenticado → login
    if (!user) {
      router.replace("/Login");
      return;
    }

    // Requiere admin pero no lo es → inicio
    if (requiredRole === "admin" && !isAdmin) {
      router.replace("/");
    }
  }, [user, loading, isAdmin, requiredRole, router]);

  return { user, loading, isAdmin };
}

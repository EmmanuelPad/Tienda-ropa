"use client";

import { useEffect, useState } from "react";
import { useRequireRole } from "@/lib/useRequireRole";
import { auth } from "@/lib/firebase-client";
import AdminHeader from "@/components/layout/AdminHeader";

interface UsuarioFirestore {
  uid: string;
  email: string;
  displayName?: string;
  role?: string;
  createdAt?: string;
}

export default function AdminUsuariosPage() {
  const { loading, isAdmin, user } = useRequireRole("admin");
  const [usuarios, setUsuarios] = useState<UsuarioFirestore[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [asignando, setAsignando] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && isAdmin) fetchUsuarios();
  }, [loading, isAdmin]);

  async function getToken() {
    const user = auth.currentUser;
    if (!user) throw new Error("No autenticado");
    return user.getIdToken();
  }

  async function fetchUsuarios() {
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) setUsuarios(data.usuarios);
      else setError(data.error || "Error al cargar usuarios");
    } catch {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  }

  async function cambiarRol(targetUid: string, nuevoRol: "user" | "admin") {
    setAsignando(targetUid);
    try {
      const token = await getToken();
      const res = await fetch("/api/user/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUid, role: nuevoRol }),
      });

      if (res.ok) {
        setUsuarios((prev) =>
          prev.map((u) => (u.uid === targetUid ? { ...u, role: nuevoRol } : u))
        );
      } else {
        setError("No se pudo cambiar el rol");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setAsignando(null);
    }
  }

  // Mientras verifica permisos
  if (loading || cargando) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <AdminHeader user={user} />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
        </div>
      </main>
    );
  }

  // Si no es admin, useRequireRole ya redirigió — esto es solo por seguridad
  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AdminHeader user={user} />
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-pink-400">Administración</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Gestión de usuarios</h1>
          <p className="mt-2 text-sm text-slate-400">
            Asigna o revoca permisos de administrador a los usuarios registrados.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {cargando ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
            <table className="w-full">
              <thead className="border-b border-slate-800 bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Usuario</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Registro</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Rol actual</th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-400">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                ) : (
                  usuarios.map((u) => (
                    <tr key={u.uid} className="hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{u.displayName || "Sin nombre"}</p>
                        <p className="text-sm text-slate-400">{u.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString("es-MX") : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            u.role === "admin"
                              ? "bg-pink-500/20 text-pink-300"
                              : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {u.role === "admin" ? "Administrador" : "Usuario"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => cambiarRol(u.uid, u.role === "admin" ? "user" : "admin")}
                          disabled={asignando === u.uid}
                          className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
                            u.role === "admin"
                              ? "bg-slate-700 text-slate-300 hover:bg-red-500/20 hover:text-red-400"
                              : "bg-pink-500/20 text-pink-300 hover:bg-pink-500/30"
                          }`}
                        >
                          {asignando === u.uid
                            ? "Guardando..."
                            : u.role === "admin"
                            ? "Quitar admin"
                            : "Hacer admin"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

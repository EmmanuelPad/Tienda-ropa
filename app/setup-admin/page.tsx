"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function SetupAdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [users, setUsers] = useState<{ uid: string; email: string; role: string; displayName?: string }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [loading, isAdmin, router]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = await user?.getIdToken();
      const res = await fetch("/api/admin/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        setUsers(data.usuarios);
      } else {
        setMessage("Error al cargar usuarios");
      }
    } catch {
      setMessage("Error de conexión");
    } finally {
      setLoadingUsers(false);
    }
  };

  const makeAdmin = async (targetUid: string, targetEmail: string) => {
    try {
      const token = await user?.getIdToken();
      const res = await fetch("/api/user/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUid, role: "admin" }),
      });

      if (res.ok) {
        setMessage(`✅ ${targetEmail} ahora es administrador`);
        fetchUsers(); // Recargar lista
      } else {
        setMessage("Error al asignar rol de admin");
      }
    } catch {
      setMessage("Error de conexión");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>No tienes permisos para acceder a esta página.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Configuración de Administradores</h1>

        <div className="bg-slate-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Asignar Rol de Administrador</h2>
          <p className="text-slate-400 mb-4">
            Aquí puedes convertir usuarios normales en administradores. Los administradores pueden gestionar productos y usuarios.
          </p>

          <button
            onClick={fetchUsers}
            disabled={loadingUsers}
            className="bg-pink-500 hover:bg-pink-400 disabled:opacity-50 px-4 py-2 rounded-lg font-semibold"
          >
            {loadingUsers ? "Cargando..." : "Cargar Usuarios"}
          </button>

          {message && (
            <div className="mt-4 p-3 rounded-lg bg-slate-800 text-sm">
              {message}
            </div>
          )}
        </div>

        {users.length > 0 && (
          <div className="bg-slate-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Lista de Usuarios</h3>
            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.uid} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div>
                    <p className="font-medium">{u.displayName || "Sin nombre"}</p>
                    <p className="text-sm text-slate-400">{u.email}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      u.role === "admin"
                        ? "bg-pink-500/20 text-pink-300"
                        : "bg-slate-700 text-slate-300"
                    }`}>
                      {u.role === "admin" ? "Administrador" : "Usuario"}
                    </span>
                  </div>
                  {u.role !== "admin" && (
                    <button
                      onClick={() => makeAdmin(u.uid, u.email)}
                      className="bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Hacer Admin
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
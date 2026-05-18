"use client";

import { useState, useEffect } from "react";
import { useRequireRole } from "@/lib/useRequireRole";
import AdminHeader from "@/components/layout/AdminHeader";

interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export default function CategoriasPage() {
  const { loading: roleLoading, isAdmin } = useRequireRole("admin");

  const [categorias, setCategorias] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Formulario nueva categoría
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!roleLoading && isAdmin) fetchCategorias();
  }, [roleLoading, isAdmin]);

  async function fetchCategorias() {
    setLoadingCats(true);
    setError("");
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.ok) {
        setCategorias(data.data ?? []);
      } else {
        setError(data.error || "Error al cargar categorías");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoadingCats(false);
    }
  }

  async function handleCrear(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setGuardando(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nombre.trim(), description: descripcion.trim() }),
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess(`Categoría "${nombre}" creada correctamente.`);
        setNombre("");
        setDescripcion("");
        fetchCategorias();
      } else {
        setError(data.error || "Error al crear la categoría");
      }
    } catch {
      setError("Error de conexión al crear la categoría");
    } finally {
      setGuardando(false);
    }
  }

  async function handleEliminar(id: string, name: string) {
    if (!confirm(`¿Eliminar la categoría "${name}"?`)) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        setSuccess(`Categoría "${name}" eliminada.`);
        fetchCategorias();
      } else {
        setError(data.error || "Error al eliminar");
      }
    } catch {
      setError("Error de conexión al eliminar");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-800 text-white px-4 py-2.5 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-500/30";

  if (roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Verificando permisos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminHeader />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">

        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestionar Categorías</h1>
          <p className="mt-1 text-sm text-slate-400">
            Crea y elimina las categorías que se usan al registrar productos.
          </p>
        </div>

        {/* Alertas */}
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-300">
            {success}
          </div>
        )}

        {/* ── Formulario nueva categoría ── */}
        <div className="rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-xl">
          <h2 className="text-base font-semibold text-white mb-4">Nueva categoría</h2>
          <form onSubmit={handleCrear} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Nombre <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Mujer, Hombre, Accesorios..."
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Descripción <span className="text-slate-500">(opcional)</span>
              </label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Breve descripción de la categoría"
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={guardando || !nombre.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-400 disabled:opacity-50"
            >
              {guardando ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Crear categoría
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── Lista de categorías ── */}
        <div className="rounded-2xl bg-slate-900 border border-white/10 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              Categorías existentes
              {!loadingCats && (
                <span className="ml-2 rounded-full bg-pink-500/20 px-2 py-0.5 text-xs font-bold text-pink-300">
                  {categorias.length}
                </span>
              )}
            </h2>
            <button
              onClick={fetchCategorias}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              ↻ Actualizar
            </button>
          </div>

          {loadingCats ? (
            <div className="px-6 py-10 text-center text-slate-400 text-sm">Cargando...</div>
          ) : categorias.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-500 text-sm">
              No hay categorías aún. ¡Crea la primera!
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {categorias.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{cat.name}</p>
                    {cat.description && (
                      <p className="text-sm text-slate-400 truncate">{cat.description}</p>
                    )}
                    <p className="text-xs text-slate-600 mt-0.5">
                      {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString("es-MX") : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEliminar(cat.id, cat.name)}
                    className="flex-shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Eliminar categoría"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </main>
    </div>
  );
}

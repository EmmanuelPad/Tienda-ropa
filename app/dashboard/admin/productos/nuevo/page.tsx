"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { useRequireRole } from "@/lib/useRequireRole";
import AdminHeader from "@/components/layout/AdminHeader";

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function NuevoProductoPage() {
  const router = useRouter();
  const { loading: roleLoading, isAdmin, user } = useRequireRole("admin");

  const [categorias, setCategorias] = useState<Category[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // ── Modal nueva categoría ──
  const [modalOpen, setModalOpen] = useState(false);
  const [nuevaNombre, setNuevaNombre] = useState("");
  const [nuevaDesc, setNuevaDesc] = useState("");
  const [guardandoCat, setGuardandoCat] = useState(false);
  const [errorCat, setErrorCat] = useState("");

  /* ── Cargar categorías ── */
  useEffect(() => {
    if (!roleLoading && isAdmin) fetchCategorias();
  }, [roleLoading, isAdmin]);

  async function fetchCategorias() {
    setLoadingCats(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.ok) {
        setCategorias(data.data ?? []);
      } else {
        setError(data.error || "Error al cargar categorías");
      }
    } catch {
      setError("Error de conexión al cargar categorías");
    } finally {
      setLoadingCats(false);
    }
  }

  /* ── Toggle checkbox ── */
  const toggleCategoria = (id: string) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  /* ── Crear nueva categoría desde el modal ── */
  async function handleCrearCategoria() {
    if (!nuevaNombre.trim()) return;
    setGuardandoCat(true);
    setErrorCat("");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nuevaNombre.trim(), description: nuevaDesc.trim() }),
      });
      const data = await res.json();
      if (data.ok) {
        setNuevaNombre("");
        setNuevaDesc("");
        setModalOpen(false);
        await fetchCategorias();
        // Auto-seleccionar la recién creada
        setSeleccionadas((prev) => [...prev, data.data.id]);
      } else {
        setErrorCat(data.error || "Error al crear la categoría");
      }
    } catch {
      setErrorCat("Error de conexión");
    } finally {
      setGuardandoCat(false);
    }
  }

  /* ── Submit producto ── */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (seleccionadas.length === 0) {
      setError("Selecciona al menos una categoría.");
      return;
    }

    setIsSaving(true);
    const formData = new FormData(event.currentTarget);

    const product = {
      name: String(formData.get("nombre") ?? "").trim(),
      categories: seleccionadas,
      price: Number(formData.get("precio") ?? 0),
      stock: Number(formData.get("stock") ?? 0),
      description: String(formData.get("descripcion") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || "Error al registrar el producto.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrar el producto.");
    } finally {
      setIsSaving(false);
    }
  }

  /* ── Loading rol ── */
  if (roleLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      </main>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AdminHeader user={user} />

      <section className="mx-auto max-w-3xl px-6 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <p className="text-sm font-medium text-emerald-400">Productos</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Nuevo producto</h1>
          <p className="mt-2 text-sm text-slate-400">
            Completa el formulario para registrar un producto en el sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="grid gap-6">
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-slate-300">
                Nombre del producto
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                placeholder="Ej. Camisa casual azul"
                className={inputClass}
              />
            </div>

            {/* ── Categorías ── */}
            <div>
              {/* Encabezado con contador y botón nueva categoría */}
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-slate-300">
                  Categorías
                  {seleccionadas.length > 0 && (
                    <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                      {seleccionadas.length} seleccionada{seleccionadas.length > 1 ? "s" : ""}
                    </span>
                  )}
                </label>

                {/* ── Botón nueva categoría ── */}
                <button
                  type="button"
                  onClick={() => { setModalOpen(true); setErrorCat(""); }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40
                    bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400
                    transition hover:border-emerald-400 hover:bg-emerald-500/20"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Nueva categoría
                </button>
              </div>

              {loadingCats ? (
                <div className="flex items-center gap-2 py-2 text-sm text-slate-400">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                  Cargando categorías...
                </div>
              ) : categorias.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center">
                  <p className="text-sm text-slate-400">No hay categorías registradas.</p>
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 underline"
                  >
                    Crear la primera categoría →
                  </button>
                </div>
              ) : (
                /* ── Grid de tarjetas: 2 cols en móvil, 3 en sm+ ── */
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {categorias.map((cat) => {
                    const checked = seleccionadas.includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        className={`relative flex cursor-pointer flex-col gap-1 rounded-xl border-2 p-3
                          transition select-none
                          ${checked
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-slate-700 bg-slate-950 hover:border-slate-500 hover:bg-white/[0.02]"
                          }`}
                      >
                        {/* Checkbox oculto */}
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          onChange={() => toggleCategoria(cat.id)}
                        />

                        {/* Check badge arriba a la derecha */}
                        <div className={`absolute top-2 right-2 flex h-4 w-4 items-center justify-center
                          rounded border-2 transition
                          ${checked
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-slate-600 bg-transparent"
                          }`}
                        >
                          {checked && (
                            <svg className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>

                        <p className={`pr-5 text-sm font-semibold leading-tight truncate
                          ${checked ? "text-emerald-300" : "text-white"}`}>
                          {cat.name}
                        </p>
                        {cat.description && (
                          <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                            {cat.description}
                          </p>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Precio y Stock */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="precio" className="mb-2 block text-sm font-medium text-slate-300">
                  Precio (MXN)
                </label>
                <input
                  id="precio"
                  name="precio"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="Ej. 450.00"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="stock" className="mb-2 block text-sm font-medium text-slate-300">
                  Stock
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  required
                  placeholder="Ej. 12"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="mb-2 block text-sm font-medium text-slate-300">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows={4}
                placeholder="Describe brevemente el producto..."
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3
                  text-sm text-white outline-none transition placeholder:text-slate-500
                  focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Acciones */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <a
              href="/dashboard"
              className="inline-flex justify-center rounded-xl border border-slate-700 px-4 py-2
                text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Cancelar
            </a>
            <button
              type="submit"
              disabled={isSaving || seleccionadas.length === 0}
              className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-900
                transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                  Guardando...
                </span>
              ) : (
                "Guardar producto"
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ── Modal nueva categoría ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Nueva categoría</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {errorCat && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
                {errorCat}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Nombre <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  value={nuevaNombre}
                  onChange={(e) => setNuevaNombre(e.target.value)}
                  placeholder="Ej: Mujer, Hombre, Accesorios..."
                  autoFocus
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5
                    text-sm text-white outline-none transition placeholder:text-slate-500
                    focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Descripción <span className="text-slate-500">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={nuevaDesc}
                  onChange={(e) => setNuevaDesc(e.target.value)}
                  placeholder="Breve descripción..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5
                    text-sm text-white outline-none transition placeholder:text-slate-500
                    focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 rounded-xl border border-slate-700 py-2.5 text-sm font-semibold
                  text-slate-300 transition hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCrearCategoria}
                disabled={guardandoCat || !nuevaNombre.trim()}
                className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold
                  text-slate-900 transition hover:bg-emerald-400 disabled:opacity-50"
              >
                {guardandoCat ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                    Creando...
                  </span>
                ) : (
                  "Crear categoría"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

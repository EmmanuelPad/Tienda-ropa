"use client";
import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { useRequireRole } from "@/lib/useRequireRole";
import AdminHeader from "@/components/layout/AdminHeader";

export default function NuevoProductoPage() {
  const { loading, isAdmin, user } = useRequireRole("admin");
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) 
  {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const product = 
    {
      name: String(formData.get("nombre")??"").trim(),
      category: String(formData.get("categoria")??"").trim(),
      price: Number(formData.get("precio")??0),
      stock: Number(formData.get("stock")??0),
      description: String(formData.get("descripcion")??"").trim(),
    }

    try
    {
      const response = await fetch("/api/products",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
      });

      if (!response.ok) 
      {
        throw new Error("Error al registrar el producto.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Error al registrar el producto.");
    } finally {
      setIsSaving(false);
    }

  }


  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <AdminHeader user={user} />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AdminHeader user={user} />
      <section className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-emerald-400">
            Productos
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Nuevo producto
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Completa el formulario para registrar un producto en el sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/50 p-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <div className="grid gap-5">
            <div>
              <label
                htmlFor="nombre"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Nombre del producto
              </label>

              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ej. Laptop Lenovo ThinkPad"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
              />
            </div>

            <div>
              <label
                htmlFor="categoria"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Categoría
              </label>

              <input
                id="categoria"
                name="categoria"
                type="text"
                placeholder="Ej. Tecnología"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="precio"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Precio
                </label>

                <input
                  id="precio"
                  name="precio"
                  type="number"
                  placeholder="Ej. 18500"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                />
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Stock
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="Ej. 12"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="descripcion"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Descripción
              </label>

              <textarea
                id="descripcion"
                name="descripcion"
                rows={4}
                placeholder="Describe brevemente el producto..."
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <a
              href="/dashboard"
              className="inline-flex justify-center rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Cancelar
            </a>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Guardando..." : "Guardar producto"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
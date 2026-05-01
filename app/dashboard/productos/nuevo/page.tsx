"use client";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function NuevoProductoPage() {
  
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  function validateForm(formData: FormData): Record<string, string> {
    const errors: Record<string, string> = {};
    
    const name = String(formData.get("nombre") ?? "").trim();
    const category = String(formData.get("categoria") ?? "").trim();
    const price = Number(formData.get("precio") ?? 0);
    const stock = Number(formData.get("stock") ?? 0);
    const description = String(formData.get("descripcion") ?? "").trim();

    if (!name) errors.nombre = "El nombre del producto es requerido";
    if (!category) errors.categoria = "La categoría es requerida";
    if (price <= 0) errors.precio = "El precio debe ser mayor a 0";
    if (stock < 0) errors.stock = "El stock no puede ser negativo";
    if (!description) errors.descripcion = "La descripción es requerida";

    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) 
  {
    event.preventDefault();
    setError("");
    setValidationErrors({});

    const formData = new FormData(event.currentTarget);
    
    // Validar formulario
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSaving(true);

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

      const data = await response.json();

      if (!response.ok) 
      {
        throw new Error(data.error || "Error al registrar el producto.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/productos");
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar el producto.");
    } finally {
      setIsSaving(false);
    }

  }


  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <section className="mx-auto max-w-3xl">
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
              ❌ {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/50 p-3 text-sm text-emerald-400">
              ✅ Producto creado exitosamente. Redirigiendo...
            </div>
          )}
          
          <div className="grid gap-5">
            <div>
              <label
                htmlFor="nombre"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Nombre del producto *
              </label>

              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ej. Laptop Lenovo ThinkPad"
                className={`w-full rounded-xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 bg-slate-950 ${
                  validationErrors.nombre 
                    ? "border-red-500 focus:border-red-400" 
                    : "border-slate-700 focus:border-emerald-400"
                }`}
              />
              {validationErrors.nombre && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.nombre}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="categoria"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Categoría *
              </label>

              <input
                id="categoria"
                name="categoria"
                type="text"
                placeholder="Ej. Ropa, Accesorios, Calzado"
                className={`w-full rounded-xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 bg-slate-950 ${
                  validationErrors.categoria 
                    ? "border-red-500 focus:border-red-400" 
                    : "border-slate-700 focus:border-emerald-400"
                }`}
              />
              {validationErrors.categoria && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.categoria}</p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="precio"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Precio (COP) *
                </label>

                <input
                  id="precio"
                  name="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ej. 49900"
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 bg-slate-950 ${
                    validationErrors.precio 
                      ? "border-red-500 focus:border-red-400" 
                      : "border-slate-700 focus:border-emerald-400"
                  }`}
                />
                {validationErrors.precio && (
                  <p className="mt-1 text-xs text-red-400">{validationErrors.precio}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Stock *
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="Ej. 25"
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 bg-slate-950 ${
                    validationErrors.stock 
                      ? "border-red-500 focus:border-red-400" 
                      : "border-slate-700 focus:border-emerald-400"
                  }`}
                />
                {validationErrors.stock && (
                  <p className="mt-1 text-xs text-red-400">{validationErrors.stock}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="descripcion"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Descripción *
              </label>

              <textarea
                id="descripcion"
                name="descripcion"
                rows={4}
                placeholder="Describe brevemente el producto, materiales, características..."
                className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 bg-slate-950 ${
                  validationErrors.descripcion 
                    ? "border-red-500 focus:border-red-400" 
                    : "border-slate-700 focus:border-emerald-400"
                }`}
              />
              {validationErrors.descripcion && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.descripcion}</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <a
              href="/dashboard/productos"
              className="inline-flex justify-center rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Cancelar
            </a>

            <button
              type="submit"
              disabled={isSaving || success}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Guardando..." : success ? "¡Listo!" : "Guardar producto"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
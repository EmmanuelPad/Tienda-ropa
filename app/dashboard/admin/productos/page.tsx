"use client";
import { useEffect, useState } from "react";
import { useRequireRole } from "@/lib/useRequireRole";
import Link from "next/link";
import AdminHeader from "@/components/layout/AdminHeader";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  categories: string[];
  price: number;
  stock: number;
  description: string;
  rating?: number;
  reviewCount?: number;
}

export default function AdminProductosPage() {
  const { loading: roleLoading, isAdmin } = useRequireRole("admin");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!roleLoading && isAdmin) {
      fetchProducts();
      fetchCategories();
    }
  }, [roleLoading, isAdmin]);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.ok) {
        setProducts(data.data);
      } else {
        setError(data.error || "Error al cargar productos");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.ok) {
        setCategories(data.data ?? []);
      }
    } catch {
      // No bloquear la carga de productos.
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert("Error al eliminar producto");
      }
    } catch {
      alert("Error de conexión");
    }
  }

  const categoriesById = categories.reduce<Record<string, string>>(
    (acc, category) => {
      acc[category.id] = category.name;
      return acc;
    },
    {},
  );

  const filteredProducts = products.filter(
    (product) => (product.rating ?? 0) >= minRating,
  );

  if (roleLoading || loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <AdminHeader />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AdminHeader />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-400">
              Administración
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Productos
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Gestiona los productos de tu tienda
            </p>
          </div>
          <Link
            href="/dashboard/admin/productos/nuevo"
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-400"
          >
            + Nuevo producto
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-slate-300">
            Filtrar por calificación:
          </label>
          <select
            value={minRating}
            onChange={(event) => setMinRating(Number(event.target.value))}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400"
          >
            <option value={0}>Todas</option>
            <option value={5}>5 estrellas</option>
            <option value={4}>4 estrellas o más</option>
            <option value={3}>3 estrellas o más</option>
            <option value={2}>2 estrellas o más</option>
            <option value={1}>1 estrella o más</option>
          </select>
          <span className="text-sm text-slate-400">
            Mostrando {filteredProducts.length} de {products.length}
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/50 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <table className="w-full">
            <thead className="border-b border-slate-800 bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Producto
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Categoría
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Precio
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Calificación
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Stock
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No hay productos registrados. ¡Crea el primero!
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">
                        {product.name}
                      </div>
                      <div className="text-sm text-slate-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full border border-slate-700 bg-slate-800/50 px-2 py-1 text-xs text-slate-300">
                        {product.categories
                          .map((categoryId) => categoriesById[categoryId] ?? categoryId)
                          .join(", ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      ${product.price.toLocaleString("es-MX")}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {product.rating ? `${product.rating.toFixed(1)} ★` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm ${product.stock > 0 ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {product.stock} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/admin/productos/${product.id}`}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-500/10 hover:text-emerald-400"
                          title="Editar"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                          title="Eliminar"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import PublicHeader from "@/components/layout/PublicHeader";
import CartSidebar from "@/components/layout/CartSidebar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { useCart } from "@/lib/CartContext";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  idcategories: string[];
  imageUrl?: string;
}

export default function DashboardPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [filtroActivo, setFiltroActivo] = useState<string>("Todos");
  const [orden, setOrden] = useState("nombre-az");

  const { addToCart } = useCart();
  const router = useRouter();

  /* ── Auth ── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const res = await fetch(`/api/user/role?uid=${firebaseUser.uid}`);
          const data = await res.json();
          setIsAdmin(data.role === "admin");
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  /* ── Datos ── */
  const fetchData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      if (prodData.ok) setProducts(prodData.data ?? []);
      if (catData.ok) setCategories(catData.data ?? []);
    } catch {
      // silencioso
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ── Helpers ── */
  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;

  /* ── Filtrado y orden ── */
  const productosFiltrados = products
    .filter((p) => {
      if (filtroActivo === "Todos") return true;
      return p.idcategories?.includes(filtroActivo);
    })
    .sort((a, b) => {
      if (orden === "precio-asc") return a.price - b.price;
      if (orden === "precio-desc") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  /* ── Loading ── */
  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {isAdmin ? <AdminHeader /> : <PublicHeader />}

      {/* Panel carrito (solo usuarios normales) */}
      {!isAdmin && <CartSidebar />}

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-pink-300">
            Nuestra colección
          </p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Productos</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Descubre prendas de calidad con estilo único.
          </p>

          {isAdmin && (
            <div className="mt-6">
              <Link
                href="/dashboard/admin/productos"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/50
                  bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-400
                  transition hover:bg-emerald-500/30"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Administrar Productos
              </Link>
            </div>
          )}
        </div>

        {/* Filtros + orden */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {/* Botón "Todos" */}
            <button
              onClick={() => setFiltroActivo("Todos")}
              className={`rounded-full border px-4 py-2 text-sm transition
                ${
                  filtroActivo === "Todos"
                    ? "border-pink-400/50 bg-pink-500/20 text-pink-100"
                    : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-pink-400/30 hover:bg-pink-500/10 hover:text-pink-100"
                }`}
            >
              Todos
            </button>

            {/* Botones dinámicos de categorías */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFiltroActivo(cat.id)}
                className={`rounded-full border px-4 py-2 text-sm transition
                  ${
                    filtroActivo === cat.id
                      ? "border-pink-400/50 bg-pink-500/20 text-pink-100"
                      : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-pink-400/30 hover:bg-pink-500/10 hover:text-pink-100"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-300">Ordenar por:</label>
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="rounded-3xl border border-slate-700 bg-slate-900/90 px-3 py-2
                text-sm text-white outline-none focus:border-pink-400"
            >
              <option value="nombre-az">Nombre A-Z</option>
              <option value="precio-asc">Precio: Menor a mayor</option>
              <option value="precio-desc">Precio: Mayor a menor</option>
            </select>
          </div>
        </div>

        {/* Grid de productos */}
        {dataLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <p className="text-slate-400 text-lg">
              No hay productos disponibles.
            </p>
            {isAdmin && (
              <Link
                href="/dashboard/admin/productos/nuevo"
                className="rounded-full bg-pink-500 px-5 py-2 text-sm font-semibold text-white
                  transition hover:bg-pink-400"
              >
                + Agregar primer producto
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productosFiltrados.map((producto) => (
              <div
                key={producto.id}
                onClick={() => router.push(`/producto/${producto.id}`)}
                className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/5
                  shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/10"
              >
                {/* Imagen del producto */}
                <div className="relative aspect-square bg-slate-800/50 overflow-hidden">
                  {producto.imageUrl ? (
                    <Image
                      src={producto.imageUrl}
                      alt={producto.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-6xl">
                      👕
                    </div>
                  )}
                </div>

                <div className="p-5">
                  {/* Categorías */}
                  <div className="mb-2 flex flex-wrap gap-1">
                    {producto.idcategories?.map((catId) => (
                      <span
                        key={catId}
                        className="inline-block rounded-full bg-pink-500/20 px-2 py-0.5
                          text-xs font-medium text-pink-300"
                      >
                        {getCategoryName(catId)}
                      </span>
                    ))}
                  </div>

                  <h3 className="mb-1 text-base font-semibold text-white line-clamp-1">
                    {producto.name}
                  </h3>
                  <p className="mb-3 text-sm text-slate-400 line-clamp-2">
                    {producto.description}
                  </p>

                  {/* Stock */}
                  <p
                    className={`mb-3 text-xs font-medium ${producto.stock > 0 ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {producto.stock > 0
                      ? `${producto.stock} disponibles`
                      : "Sin stock"}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-pink-300">
                      ${producto.price.toLocaleString("es-MX")}
                    </span>

                    {!isAdmin && (
                      <button
                        disabled={producto.stock === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({
                            id: producto.id,
                            name: producto.name,
                            price: producto.price,
                            description: producto.description,
                          });
                        }}
                        className="rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white
                          transition hover:bg-pink-400 active:scale-95
                          disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Agregar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-slate-400">¿No encuentras lo que buscas?</p>
          <a
            href="#contacto"
            className="mt-2 inline-block text-pink-300 transition hover:text-pink-200"
          >
            Contáctanos para sugerencias personalizadas →
          </a>
        </div>
      </div>
    </main>
  );
}

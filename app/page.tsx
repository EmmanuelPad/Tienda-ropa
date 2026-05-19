"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PublicHeader from "@/components/layout/PublicHeader";
import CartSidebar from "@/components/layout/CartSidebar";
import { useCart } from "@/lib/CartContext";
import Image from "next/image";
import heroImage from "@/Imagenes/hero.jpg";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  idcategories: string[];
  imageUrl?: string;
}

interface Category {
  id: string;
  name: string;
}

// ─── Tarjeta de producto ───────────────────────────────────────────────────────
function ProductCard({
  product,
  getCategoryName,
  onAgregar,
}: {
  product: Product;
  getCategoryName: (id: string) => string;
  onAgregar: () => void;
}) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/producto/${product.id}`)}
      className="group cursor-pointer rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800/50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">
            👕
          </div>
        )}
      </div>
      <div className="mb-2 flex flex-wrap gap-1">
        {product.idcategories?.map((catId) => (
          <span
            key={catId}
            className="inline-block rounded-full bg-gray-100 dark:bg-white/5 px-2 py-0.5 text-xs font-medium text-pink-600 dark:text-pink-300"
          >
            {getCategoryName(catId)}
          </span>
        ))}
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1">
        {product.name}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
        {product.description}
      </p>
      <p
        className={`mt-1 text-xs font-medium ${product.stock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}
      >
        {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-lg font-bold text-pink-600">
          ${product.price.toLocaleString("es-MX")}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAgregar();
          }}
          disabled={product.stock === 0}
          className="rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-400 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Home() {
  const { resolvedTheme } = useTheme();
  const { addToCart } = useCart();
  const [mounted, setMounted] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => setMounted(true), []);

  // ── Cargar productos y categorías reales ──
  useEffect(() => {
    Promise.all([fetch("/api/products"), fetch("/api/categories")])
      .then(async ([prodRes, catRes]) => {
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        if (prodData.ok) setProducts((prodData.data ?? []).slice(0, 8)); // máximo 8 en home
        if (catData.ok) setCategories(catData.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  }, []);

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-linear-to-br from-pink-600/40 via-fuchsia-500/10 to-sky-600/40"
          : "bg-linear-to-br from-pink-100 via-fuchsia-50 to-sky-100"
      }`}
    >
      <PublicHeader />
      <CartSidebar />

      {/* ── Hero ── */}
      <section className="relative h-[90.7vh] min-h-96 overflow-hidden">
        <Image
          src={heroImage}
          alt="Imagen de moda"
          fill
          className="object-cover object-center opacity-30"
          priority
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-linear-to-br from-pink-600/40 via-fuchsia-500/10 to-sky-600/40"
              : "bg-linear-to-br from-pink-200/60 via-fuchsia-100/30 to-sky-200/60"
          }`}
        />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-16 text-center text-white sm:px-6 lg:px-8">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-pink-200 sm:text-base">
            Colección exclusiva
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Ropa con estilo y actitud
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
            Explora prendas únicas para cada temporada. Calidad, tendencia y
            confort en un solo lugar.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#productos"
              className="rounded-md bg-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:bg-pink-400"
            >
              Ver Productos
            </a>
            {/* ── Botón Contáctanos ── */}
            <a
              href="#contacto"
              className="rounded-md border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </section>

      {/* ── Productos más vendidos ── */}
      <section id="productos" className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-4xl bg-white dark:bg-gray-800/50 shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
            <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Productos Destacados
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Los favoritos de nuestra colección esta temporada.
                  </p>
                </div>
                <a
                  href="/dashboard"
                  className="hidden sm:inline-flex shrink-0 items-center gap-1 text-sm font-medium text-pink-600 dark:text-pink-400 hover:text-pink-500 transition"
                >
                  Ver todos →
                </a>
              </div>

              {loadingProducts ? (
                <div className="flex justify-center py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
                </div>
              ) : products.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <p>No hay productos disponibles aún.</p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {products.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      getCategoryName={getCategoryName}
                      onAgregar={() =>
                        addToCart({
                          id: p.id,
                          name: p.name,
                          price: p.price,
                          description: p.description,
                        })
                      }
                    />
                  ))}
                </div>
              )}

              <div className="mt-10 text-center">
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-md bg-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:bg-pink-400"
                >
                  Ver Todos los Productos <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sobre nosotros ── */}
      <section
        id="sobre-nosotros"
        className="py-16 text-gray-900 dark:text-white"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-4xl bg-white dark:bg-slate-900/90 p-8 shadow-2xl ring-1 ring-gray-200 dark:ring-white/10 sm:p-12">
            <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-pink-600 dark:text-pink-300">
                  Sobre Nosotros
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Moda con propósito y estilo auténtico
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-slate-300">
                  Somos una tienda de ropa creada para ofrecer piezas cómodas,
                  modernas y accesibles. Nuestra misión es ayudarte a sentirte
                  bien con cada prenda, cuidando siempre la calidad y las
                  últimas tendencias.
                </p>
              </div>
              <div className="space-y-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-6 shadow-sm">
                {[
                  {
                    titulo: "Calidad garantizada",
                    desc: "Seleccionamos cada artículo con atención para que obtengas piezas duraderas y con buen diseño.",
                  },
                  {
                    titulo: "Estilo para todos",
                    desc: "Encontrarás looks versátiles para mujer, hombre y accesorios que complementan tu outfit.",
                  },
                  {
                    titulo: "Atención personalizada",
                    desc: "Nuestro equipo está listo para ayudarte a elegir lo que mejor te queda.",
                  },
                ].map(({ titulo, desc }) => (
                  <div key={titulo}>
                    <h3 className="text-xl font-semibold">{titulo}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contacto ── */}
      <section id="contacto" className="py-16 text-gray-900 dark:text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="rounded-4xl bg-white dark:bg-slate-900/90 p-8 shadow-2xl ring-1 ring-gray-200 dark:ring-white/10 sm:p-10">
              <p className="text-sm uppercase tracking-[0.35em] text-pink-600 dark:text-pink-300">
                Contacto
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Estamos aquí para ayudarte
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-slate-300">
                ¿Tienes dudas sobre un pedido o quieres asesoría de estilo?
                Contáctanos y te responderemos lo antes posible.
              </p>
              <div className="mt-8 space-y-6 text-sm text-gray-600 dark:text-slate-300 sm:text-base">
                {[
                  { label: "Email", valor: "hola@altapinta.com" },
                  { label: "Teléfono", valor: "+52 55 1234 5678" },
                  {
                    label: "Dirección",
                    valor: "Av. Moda 123, Ciudad de México",
                  },
                ].map(({ label, valor }) => (
                  <div key={label}>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {label}
                    </p>
                    <p>{valor}</p>
                  </div>
                ))}
              </div>
            </div>
            <ContactForm isDark={isDark} />
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Formulario de contacto ────────────────────────────────────────────────────
function ContactForm({ isDark }: { isDark: boolean }) {
  const [form, setForm] = useState({ nombre: "", correo: "", mensaje: "" });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const inputClass = `mt-2 w-full rounded-3xl border ${isDark ? "border-slate-700 bg-slate-800 text-white" : "border-slate-200 bg-slate-50 text-slate-900"} px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    await new Promise((r) => setTimeout(r, 1000));
    setEnviando(false);
    setEnviado(true);
    setForm({ nombre: "", correo: "", mensaje: "" });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-4xl bg-white dark:bg-slate-900/90 p-8 shadow-2xl ring-1 ring-gray-200 dark:ring-white/10 sm:p-10"
    >
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Escríbenos
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
        Completa el formulario y te contestaremos en menos de 24 horas.
      </p>

      {enviado ? (
        <div className="mt-8 rounded-2xl bg-green-50 dark:bg-green-900/20 p-6 text-center">
          <p className="text-green-700 dark:text-green-300 font-semibold">
            ¡Mensaje enviado!
          </p>
          <p className="mt-1 text-sm text-green-600 dark:text-green-400">
            Te responderemos pronto.
          </p>
          <button
            type="button"
            onClick={() => setEnviado(false)}
            className="mt-4 text-sm text-pink-500 hover:text-pink-400 underline"
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          <label
            className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            Nombre
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={(e) =>
                setForm((p) => ({ ...p, nombre: e.target.value }))
              }
              placeholder="Tu nombre"
              required
              className={inputClass}
            />
          </label>
          <label
            className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            Correo electrónico
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={(e) =>
                setForm((p) => ({ ...p, correo: e.target.value }))
              }
              placeholder="tu@correo.com"
              required
              className={inputClass}
            />
          </label>
          <label
            className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            Mensaje
            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={(e) =>
                setForm((p) => ({ ...p, mensaje: e.target.value }))
              }
              rows={4}
              placeholder="Cuéntanos cómo podemos ayudarte"
              required
              className={inputClass}
            />
          </label>
          <button
            type="submit"
            disabled={enviando}
            className="mt-3 inline-flex w-full items-center justify-center rounded-3xl bg-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:bg-pink-400 disabled:opacity-60"
          >
            {enviando ? "Enviando..." : "Enviar mensaje"}
          </button>
        </div>
      )}
    </form>
  );
}

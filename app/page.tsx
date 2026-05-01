"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import PublicHeader from "@/components/layout/PublicHeader";
import Image from "next/image";
import heroImage from "@/Imagenes/hero.jpg";

// ─── Tarjeta de producto reutilizable ────────────────────────────────────────
interface ProductCardProps {
  emoji: string;
  categoria: string;
  nombre: string;
  descripcion: string;
  precio: number;
  onAgregar: () => void;
}

function ProductCard({ emoji, categoria, nombre, descripcion, precio, onAgregar }: ProductCardProps) {
  return (
    <div className="group rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800/50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 aspect-square overflow-hidden rounded-2xl bg-slate-100 flex items-center justify-center">
        <span className="text-4xl">{emoji}</span>
      </div>
      <div className="mb-2">
        <span className="inline-block rounded-full bg-gray-100 dark:bg-white/5 px-2 py-1 text-xs font-medium text-pink-600 dark:text-pink-300">
          {categoria}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{nombre}</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{descripcion}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-bold text-pink-600">${precio}</span>
        <button
          onClick={onAgregar}
          className="rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-400"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}

// ─── Datos de productos ───────────────────────────────────────────────────────
const PRODUCTOS = [
  { id: 1, emoji: "👗", categoria: "Mujer",  nombre: "Vestido Elegante Negro", descripcion: "Versátil para ocasiones especiales", precio: 850 },
  { id: 2, emoji: "👖", categoria: "Hombre", nombre: "Jeans Clásicos",         descripcion: "Corte recto, cómodos y duraderos",  precio: 650 },
  { id: 3, emoji: "🧥", categoria: "Hombre", nombre: "Chaqueta de Cuero",      descripcion: "Estilo vintage, cuero genuino",     precio: 1200 },
  { id: 4, emoji: "👜", categoria: "Mujer",  nombre: "Bolso de Mano",          descripcion: "Diseño minimalista y elegante",     precio: 750 },
];

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita el flash de hidratación — no renderiza hasta que el tema esté listo
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  function handleAgregar(nombre: string) {
    // TODO: conectar con carrito de compras
    alert(`"${nombre}" agregado al carrito`);
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark
        ? "bg-gradient-to-br from-pink-600/40 via-fuchsia-500/10 to-sky-600/40"
        : "bg-gradient-to-br from-pink-100 via-fuchsia-50 to-sky-100"
    }`}>
      <PublicHeader />

      {/* ── Hero ── */}
      <section className="relative h-[90.7vh] min-h-[26rem] overflow-hidden">
        <Image
          src={heroImage}
          alt="Imagen de moda"
          fill
          className="object-cover object-center opacity-30"
          priority
        />
        <div className={`absolute inset-0 ${
          isDark
            ? "bg-gradient-to-br from-pink-600/40 via-fuchsia-500/10 to-sky-600/40"
            : "bg-gradient-to-br from-pink-200/60 via-fuchsia-100/30 to-sky-200/60"
        }`} />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-16 text-center text-white sm:px-6 lg:px-8">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-pink-200 sm:text-base">
            Colección exclusiva
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Ropa con estilo y actitud
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
            Explora prendas únicas para cada temporada. Calidad, tendencia y confort en un solo lugar.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#productos"
              className="rounded-md bg-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:bg-pink-400"
            >
              Ver Productos Más Vendidos
            </a>
            <a
              href="#sobre-nosotros"
              className="text-sm font-semibold text-white/90 transition hover:text-white"
            >
              Sobre Nosotros <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Productos más vendidos ── */}
      <section id="productos" className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-white dark:bg-gray-800/50 shadow-2xl ring-1 ring-black/5">
            <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
              <div className="mb-10 max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Productos Más Vendidos
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                  Los favoritos de nuestros clientes. Descubre las prendas que más se llevan esta temporada.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {PRODUCTOS.map((p) => (
                  <ProductCard
                    key={p.id}
                    emoji={p.emoji}
                    categoria={p.categoria}
                    nombre={p.nombre}
                    descripcion={p.descripcion}
                    precio={p.precio}
                    onAgregar={() => handleAgregar(p.nombre)}
                  />
                ))}
              </div>

              <div className="mt-10 text-center">
                <a
                  href="/Productos"
                  className="inline-flex items-center gap-2 rounded-md bg-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:bg-pink-400"
                >
                  Ver Todos los Productos
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sobre nosotros ── */}
      <section id="sobre-nosotros" className="py-16 text-gray-900 dark:text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900/90 p-8 shadow-2xl ring-1 ring-gray-200 dark:ring-white/10 sm:p-12">
            <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-pink-600 dark:text-pink-300">
                  Sobre Nosotros
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Moda con propósito y estilo auténtico
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-slate-300">
                  Somos una tienda de ropa creada para ofrecer piezas cómodas, modernas y accesibles. Nuestra misión es ayudarte a sentirte bien con cada prenda, cuidando siempre la calidad y las últimas tendencias.
                </p>
              </div>
              <div className="space-y-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-6 shadow-sm">
                {[
                  { titulo: "Calidad garantizada", desc: "Seleccionamos cada artículo con atención para que obtengas piezas duraderas y con buen diseño." },
                  { titulo: "Estilo para todos",   desc: "Encontrarás looks versátiles para mujer, hombre y accesorios que complementan tu outfit." },
                  { titulo: "Atención personalizada", desc: "Nuestro equipo está listo para ayudarte a elegir lo que mejor te queda y responder tus dudas." },
                ].map(({ titulo, desc }) => (
                  <div key={titulo}>
                    <h3 className="text-xl font-semibold">{titulo}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">{desc}</p>
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

            {/* Info de contacto */}
            <div className="rounded-[2rem] bg-white dark:bg-slate-900/90 p-8 shadow-2xl ring-1 ring-gray-200 dark:ring-white/10 sm:p-10">
              <p className="text-sm uppercase tracking-[0.35em] text-pink-600 dark:text-pink-300">Contacto</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Estamos aquí para ayudarte
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-slate-300">
                ¿Tienes dudas sobre un pedido o quieres asesoría de estilo? Contáctanos y te responderemos lo antes posible.
              </p>
              <div className="mt-8 space-y-6 text-sm text-gray-600 dark:text-slate-300 sm:text-base">
                {[
                  { label: "Email",     valor: "hola@altapinta.com" },
                  { label: "Teléfono", valor: "+52 55 1234 5678" },
                  { label: "Dirección", valor: "Av. Moda 123, Ciudad de México" },
                ].map(({ label, valor }) => (
                  <div key={label}>
                    <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
                    <p>{valor}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario */}
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Formulario de contacto (componente separado con estado propio) ────────────
function ContactForm() {
  const [form, setForm] = useState({ nombre: "", correo: "", mensaje: "" });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    // TODO: conectar con Firebase / servicio de email
    await new Promise((r) => setTimeout(r, 1000)); // simulación
    setEnviando(false);
    setEnviado(true);
    setForm({ nombre: "", correo: "", mensaje: "" });
  }

  const inputClass =
    "mt-2 w-full rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] bg-white dark:bg-slate-900/90 p-8 shadow-2xl ring-1 ring-gray-200 dark:ring-white/10 sm:p-10"
    >
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Escríbenos</h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
        Completa el formulario y te contestaremos en menos de 24 horas.
      </p>

      {enviado ? (
        <div className="mt-8 rounded-2xl bg-green-50 dark:bg-green-900/20 p-6 text-center">
          <p className="text-green-700 dark:text-green-300 font-semibold">¡Mensaje enviado!</p>
          <p className="mt-1 text-sm text-green-600 dark:text-green-400">Te responderemos pronto.</p>
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
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Nombre
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Correo electrónico
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="tu@correo.com"
              required
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Mensaje
            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
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

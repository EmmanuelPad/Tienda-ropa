"use client";

import { useState, useEffect } from "react";
import PublicHeader from "@/components/layout/PublicHeader";
import Image from "next/image";
import heroImage from "@/Imagenes/hero.jpg";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(savedTheme);
    }
  }, []);

  const colors = {
    bg: theme === "dark" ? "bg-gray-950" : "bg-gray-50",
    text: theme === "dark" ? "text-white" : "text-gray-900",
    textSecondary: theme === "dark" ? "text-gray-400" : "text-gray-600",
    card: theme === "dark" ? "bg-gray-800/50" : "bg-white",
    cardBorder: theme === "dark" ? "border-white/10" : "border-gray-200",
    cardText: theme === "dark" ? "text-white" : "text-gray-900",
    cardTextSec: theme === "dark" ? "text-gray-400" : "text-gray-600",
    tagBg: theme === "dark" ? "bg-white/5" : "bg-gray-100",
    tagText: theme === "dark" ? "text-pink-300" : "text-pink-600",
  };

  return (
    <>
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gradient-to-br from-pink-600/40 via-fuchsia-500/10 to-sky-600/40" : "bg-gradient-to-br from-pink-100 via-fuchsia-50 to-sky-100"}`}>
      <PublicHeader />
      <section className="relative h-[90.7vh] min-h-[26rem] overflow-hidden bg-gradient-to-br ">
        <Image
          src={heroImage}
          alt="Imagen de moda"
          fill
          className="object-cover object-center opacity-30"
          priority
        />
        <div className={`absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-pink-600/40 via-fuchsia-500/10 to-sky-600/40" : "bg-gradient-to-br from-pink-200/60 via-fuchsia-100/30 to-sky-200/60"}`} />
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

      <section id="productos" className="py-10 ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" >
          <div className={`overflow-hidden rounded-[2rem] ${colors.card} shadow-2xl ring-1 ring-black/5`}>
            <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
              <div className="mb-10 max-w-2xl">
                <h2 className={`text-3xl font-bold tracking-tight ${colors.cardText}`}>Productos Más Vendidos</h2>
                <p className={`mt-4 text-lg ${colors.cardTextSec}`}>
                  Los favoritos de nuestros clientes. Descubre las prendas que más se llevan esta temporada.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className={`group rounded-3xl border ${colors.cardBorder} ${colors.card} p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}>
                  <div className="mb-4 aspect-square overflow-hidden rounded-2xl bg-slate-100 flex items-center justify-center">
                    <span className="text-4xl">👗</span>
                  </div>
                  <div className="mb-2">
                    <span className={`inline-block rounded-full ${colors.tagBg} px-2 py-1 text-xs font-medium ${colors.tagText}`}>
                      Mujer
                    </span>
                  </div>
                  <h3 className={`text-lg font-semibold ${colors.cardText}`}>Vestido Elegante Negro</h3>
                  <p className={`mt-2 text-sm ${colors.cardTextSec}`}>Versátil para ocasiones especiales</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-pink-600">$850</span>
                    <button className="rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-400">
                      Agregar
                    </button>
                  </div>
                </div>

                <div className={`group rounded-3xl border ${colors.cardBorder} ${colors.card} p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}>
                  <div className="mb-4 aspect-square overflow-hidden rounded-2xl bg-slate-100 flex items-center justify-center">
                    <span className="text-4xl">👖</span>
                  </div>
                  <div className="mb-2">
                    <span className={`inline-block rounded-full ${colors.tagBg} px-2 py-1 text-xs font-medium ${colors.tagText}`}>
                      Hombre
                    </span>
                  </div>
                  <h3 className={`text-lg font-semibold ${colors.cardText}`}>Jeans Clásicos</h3>
                  <p className={`mt-2 text-sm ${colors.cardTextSec}`}>Corte recto, cómodos y duraderos</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-pink-600">$650</span>
                    <button className="rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-400">
                      Agregar
                    </button>
                  </div>
                </div>

                <div className={`group rounded-3xl border ${colors.cardBorder} ${colors.card} p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}>
                  <div className="mb-4 aspect-square overflow-hidden rounded-2xl bg-slate-100 flex items-center justify-center">
                    <span className="text-4xl">🧥</span>
                  </div>
                  <div className="mb-2">
                    <span className={`inline-block rounded-full ${colors.tagBg} px-2 py-1 text-xs font-medium ${colors.tagText}`}>
                      Hombre
                    </span>
                  </div>
                  <h3 className={`text-lg font-semibold ${colors.cardText}`}>Chaqueta de Cuero</h3>
                  <p className={`mt-2 text-sm ${colors.cardTextSec}`}>Estilo vintage, cuero genuino</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-pink-600">$1200</span>
                    <button className="rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-400">
                      Agregar
                    </button>
                  </div>
                </div>

                <div className={`group rounded-3xl border ${colors.cardBorder} ${colors.card} p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}>
                  <div className="mb-4 aspect-square overflow-hidden rounded-2xl bg-slate-100 flex items-center justify-center">
                    <span className="text-4xl">👟</span>
                  </div>
                  <div className="mb-2">
                    <span className={`inline-block rounded-full ${colors.tagBg} px-2 py-1 text-xs font-medium ${colors.tagText}`}>
                      Unisex
                    </span>
                  </div>
                  <h3 className={`text-lg font-semibold ${colors.cardText}`}>Zapatos Deportivos</h3>
                  <p className={`mt-2 text-sm ${colors.cardTextSec}`}>Cómodos para actividades diarias</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-pink-600">$750</span>
                    <button className="rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-400">
                      Agregar
                    </button>
                  </div>
                </div>
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

      <section id="sobre-nosotros" className={`py-16 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`overflow-hidden rounded-[2rem] ${theme === "dark" ? "bg-slate-900/90" : "bg-white"} p-8 shadow-2xl ring-1 ${theme === "dark" ? "ring-white/10" : "ring-gray-200"} sm:p-12`}>
            <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
              <div>
                <p className={`text-sm uppercase tracking-[0.35em] ${theme === "dark" ? "text-pink-300" : "text-pink-600"}`}>Sobre Nosotros</p>
                <h2 className={`mt-4 text-3xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"} sm:text-4xl`}>
                  Moda con propósito y estilo auténtico
                </h2>
                <p className={`mt-6 text-lg leading-8 ${theme === "dark" ? "text-slate-300" : "text-gray-600"}`}>
                  Somos una tienda de ropa creada para ofrecer piezas cómodas, modernas y accesibles. Nuestra misión es ayudarte a sentirte bien con cada prenda, cuidando siempre la calidad y las últimas tendencias.
                </p>
              </div>
              <div className={`space-y-6 rounded-3xl border ${theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"} p-6 shadow-sm`}>
                <div>
                  <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Calidad garantizada</h3>
                  <p className={`mt-2 text-sm leading-6 ${theme === "dark" ? "text-slate-300" : "text-gray-600"}`}>
                    Seleccionamos cada artículo con atención para que obtengas piezas duraderas y con buen diseño.
                  </p>
                </div>
                <div>
                  <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Estilo para todos</h3>
                  <p className={`mt-2 text-sm leading-6 ${theme === "dark" ? "text-slate-300" : "text-gray-600"}`}>
                    Encontrarás looks versátiles para mujer, hombre y accesorios que complementan tu outfit.
                  </p>
                </div>
                <div>
                  <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Atención personalizada</h3>
                  <p className={`mt-2 text-sm leading-6 ${theme === "dark" ? "text-slate-300" : "text-gray-600"}`}>
                    Nuestro equipo está listo para ayudarte a elegir lo que mejor te queda y responder tus dudas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className={`py-16 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className={`rounded-[2rem] ${theme === "dark" ? "bg-slate-900/90" : "bg-white"} p-8 shadow-2xl ring-1 ${theme === "dark" ? "ring-white/10" : "ring-gray-200"} sm:p-10`}>
              <p className={`text-sm uppercase tracking-[0.35em] ${theme === "dark" ? "text-pink-300" : "text-pink-600"}`}>Contacto</p>
              <h2 className={`mt-4 text-3xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"} sm:text-4xl`}>
                Estamos aquí para ayudarte
              </h2>
              <p className={`mt-6 text-lg leading-8 ${theme === "dark" ? "text-slate-300" : "text-gray-600"}`}>
                ¿Tienes dudas sobre un pedido o quieres asesoría de estilo? Contáctanos por el medio que prefieras y te responderemos lo antes posible.
              </p>
              <div className={`mt-8 space-y-6 text-sm ${theme === "dark" ? "text-slate-300" : "text-gray-600"} sm:text-base`}>
                <div>
                  <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Email</p>
                  <p>hola@altapinta.com</p>
                </div>
                <div>
                  <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Teléfono</p>
                  <p>+52 55 1234 5678</p>
                </div>
                <div>
                  <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Dirección</p>
                  <p>Av. Moda 123, Ciudad de México</p>
                </div>
              </div>
            </div>

            <form className={`rounded-[2rem] ${theme === "dark" ? "bg-slate-900/90" : "bg-white"} p-8 shadow-2xl ring-1 ${theme === "dark" ? "ring-white/10" : "ring-gray-200"} sm:p-10`}>
              <h3 className={`text-2xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Escríbenos</h3>
              <p className={`mt-2 text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}>
                Completa el formulario y te contestaremos en menos de 24 horas.
              </p>

              <div className="mt-8 space-y-5">
                <label className={`block text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                  Nombre
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className={`mt-2 w-full rounded-3xl border ${theme === "dark" ? "border-slate-700 bg-slate-800 text-white" : "border-slate-200 bg-slate-50 text-slate-900"} px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200`}
                  />
                </label>
                <label className={`block text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                  Correo electrónico
                  <input
                    type="email"
                    placeholder="tu@correo.com"
                    className={`mt-2 w-full rounded-3xl border ${theme === "dark" ? "border-slate-700 bg-slate-800 text-white" : "border-slate-200 bg-slate-50 text-slate-900"} px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200`}
                  />
                </label>
                <label className={`block text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                  Mensaje
                  <textarea
                    rows={4}
                    placeholder="Cuéntanos cómo podemos ayudarte"
                    className={`mt-2 w-full rounded-3xl border ${theme === "dark" ? "border-slate-700 bg-slate-800 text-white" : "border-slate-200 bg-slate-50 text-slate-900"} px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200`}
                  />
                </label>
              </div>

              <button
                type="submit"
                className="mt-8 inline-flex w-full items-center justify-center rounded-3xl bg-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:bg-pink-400"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}

import PublicHeader from "@/components/layout/PublicHeader";
import Image from "next/image";
import heroImage from "@/Imagenes/hero.jpg";

export default function Home() {
  return (
    <>
    <div className="bg-gradient-to-br from-pink-600/40 via-fuchsia-500/10 to-sky-600/40">
      <PublicHeader />
      <section className="relative h-[90.7vh] min-h-[26rem] overflow-hidden bg-gradient-to-br ">
        <Image
          src={heroImage}
          alt="Imagen de moda"
          fill
          className="object-cover object-center opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/40 via-fuchsia-500/10 to-sky-600/40" />
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
              href="#categorias"
              className="rounded-md bg-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:bg-pink-400"
            >
              Explorar Categorías
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

      <section id="categorias" className="py-10 ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" >
          <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-black/5">
            <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
              <div className="mb-10 max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Categorías Destacadas</h2>
                <p className="mt-4 text-lg text-gray-600">
                  Descubre nuestras categorías más populares y encuentra tu estilo perfecto.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <a href="#" className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500 text-white shadow-sm transition group-hover:bg-pink-400">
                    <span className="text-2xl">👗</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Mujer</h3>
                  <p className="mt-3 text-sm text-gray-600">
                    Vestidos, blusas y outfits femeninos para cada ocasión.
                  </p>
                </a>

                <a href="#" className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-sm transition group-hover:bg-indigo-400">
                    <span className="text-2xl">👔</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Hombre</h3>
                  <p className="mt-3 text-sm text-gray-600">
                    Camisas, jeans y looks casuales o formales con estilo.
                  </p>
                </a>

                <a href="#" className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500 text-white shadow-sm transition group-hover:bg-green-400">
                    <span className="text-2xl">👜</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Accesorios</h3>
                  <p className="mt-3 text-sm text-gray-600">
                    Bolsos, cinturones y complementos que elevan tu look.
                  </p>
                </a>

                <a href="#" className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-700 text-white shadow-sm transition group-hover:bg-slate-600">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Nuevas Llegadas</h3>
                  <p className="mt-3 text-sm text-gray-600">
                    Lo último en moda con las piezas más actuales de la temporada.
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sobre-nosotros" className=" py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-slate-900/90 p-8 shadow-2xl ring-1 ring-white/10 sm:p-12">
            <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-pink-300">Sobre Nosotros</p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Moda con propósito y estilo auténtico
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-300">
                  Somos una tienda de ropa creada para ofrecer piezas cómodas, modernas y accesibles. Nuestra misión es ayudarte a sentirte bien con cada prenda, cuidando siempre la calidad y las últimas tendencias.
                </p>
              </div>
              <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
                <div>
                  <h3 className="text-xl font-semibold text-white">Calidad garantizada</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Seleccionamos cada artículo con atención para que obtengas piezas duraderas y con buen diseño.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Estilo para todos</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Encontrarás looks versátiles para mujer, hombre y accesorios que complementan tu outfit.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Atención personalizada</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Nuestro equipo está listo para ayudarte a elegir lo que mejor te queda y responder tus dudas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className=" py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="rounded-[2rem] bg-slate-900/90 p-8 shadow-2xl ring-1 ring-white/10 sm:p-10">
              <p className="text-sm uppercase tracking-[0.35em] text-pink-300">Contacto</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Estamos aquí para ayudarte
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                ¿Tienes dudas sobre un pedido o quieres asesoría de estilo? Contáctanos por el medio que prefieras y te responderemos lo antes posible.
              </p>
              <div className="mt-8 space-y-6 text-sm text-slate-300 sm:text-base">
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <p>hola@altapinta.com</p>
                </div>
                <div>
                  <p className="font-semibold text-white">Teléfono</p>
                  <p>+52 55 1234 5678</p>
                </div>
                <div>
                  <p className="font-semibold text-white">Dirección</p>
                  <p>Av. Moda 123, Ciudad de México</p>
                </div>
              </div>
            </div>

            <form className="rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-black/5 sm:p-10">
              <h3 className="text-2xl font-semibold text-slate-900">Escríbenos</h3>
              <p className="mt-2 text-sm text-slate-500">
                Completa el formulario y te contestaremos en menos de 24 horas.
              </p>

              <div className="mt-8 space-y-5">
                <label className="block text-sm font-medium text-slate-700">
                  Nombre
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Correo electrónico
                  <input
                    type="email"
                    placeholder="tu@correo.com"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Mensaje
                  <textarea
                    rows={4}
                    placeholder="Cuéntanos cómo podemos ayudarte"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
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

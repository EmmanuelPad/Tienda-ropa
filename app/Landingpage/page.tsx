'use client';

import { useState } from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/layout/PublicHeader';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-fuchsia-500/20" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Estilo que te <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-400">define</span>
              </h1>
              <p className="mt-6 text-lg text-gray-300">
                Descubre la colección más exclusiva de ropa para expresar tu personalidad. Calidad premium, diseños únicos y tendencias que marcan la diferencia.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/Productos"
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-fuchsia-500 px-8 py-3 font-semibold text-white shadow-lg shadow-pink-500/50 transition hover:shadow-xl hover:shadow-pink-500/75"
                >
                  Explorar Colección
                </Link>
                <Link
                  href="#sobre-nosotros"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-400 px-8 py-3 font-semibold text-white transition hover:border-pink-400 hover:text-pink-400"
                >
                  Conocer Más
                </Link>
              </div>
              <div className="mt-8 flex gap-8">
                <div>
                  <p className="text-3xl font-bold text-white">10k+</p>
                  <p className="text-gray-400">Clientes Satisfechos</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">500+</p>
                  <p className="text-gray-400">Prendas Diferentes</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-pink-400/10 to-fuchsia-400/10 p-8">
                <div className="h-full w-full rounded-xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">👗</div>
                    <p className="text-white/70">Alta Pinta</p>
                    <p className="text-white/70 text-sm">Moda para Todos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-pink-500">
              Colección Especial
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Productos Destacados
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Las mejores prendas seleccionadas para ti
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Camisetas Premium', desc: 'Algodón 100% orgánico', icon: '👕', color: 'from-blue-400 to-cyan-400' },
              { name: 'Jeans Ajustados', desc: 'Comodidad y estilo', icon: '👖', color: 'from-indigo-400 to-blue-400' },
              { name: 'Vestidos Elegantes', desc: 'Para cualquier ocasión', icon: '👗', color: 'from-pink-400 to-rose-400' },
            ].map((product, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 transition hover:shadow-lg"
              >
                <div className={`inline-block rounded-lg bg-gradient-to-r ${product.color} p-3 text-3xl`}>
                  {product.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{product.name}</h3>
                <p className="mt-2 text-gray-600">{product.desc}</p>
                <Link
                  href="/Productos"
                  className="mt-4 inline-flex items-center text-sm font-semibold text-pink-600 transition group-hover:text-pink-700"
                >
                  Ver más →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="sobre-nosotros" className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Sobre <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-fuchsia-600">Alta Pinta</span>
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                Somos una tienda de moda dedicada a ofrecer prendas de calidad con los mejores estilos. Cada pieza es seleccionada cuidadosamente para garantizar que nuestros clientes se sientan seguros y a la moda.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { title: 'Calidad Premium', desc: 'Materiales seleccionados de proveedores confiables' },
                  { title: 'Envíos Rápidos', desc: 'Entrega en 3-5 días hábiles a todo el país' },
                  { title: 'Garantía Total', desc: 'Devuelve tu compra si no estás satisfecho' },
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white">
                        ✓
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                      <p className="mt-2 text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-pink-100 to-fuchsia-100 p-8">
                <div className="h-full w-full rounded-xl bg-gradient-to-br from-pink-200/30 to-fuchsia-200/30 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-6xl mb-4">🎯</p>
                    <p className="text-gray-700 font-semibold">Moda Consciente</p>
                    <p className="text-gray-600 text-sm mt-2">Diseños Sostenibles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Amado por Clientes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Mira lo que nuestros clientes dicen de nuestras prendas
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'María López', role: 'Diseñadora', text: 'La calidad de las prendas es excepcional. Vuelvo a comprar una y otra vez.' },
              { name: 'Carlos Mendez', role: 'Abogado', text: 'Excelente servicio al cliente y envíos rápidos. Muy recomendado.' },
              { name: 'Andrea Silva', role: 'Influencer', text: 'Los diseños son únicos y me encanta cómo quedan. ¡Perfectos para mis stories!' },
            ].map((testimonial, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                <div className="flex gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&quot;{testimonial.text}&quot;</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-pink-500 to-fuchsia-600 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Suscríbete a Nuestro Newsletter
            </h2>
            <p className="mt-4 text-lg text-pink-100">
              Recibe ofertas exclusivas y novedades sobre nuestras nuevas colecciones directamente en tu correo.
            </p>

            <form onSubmit={handleSubscribe} className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-lg bg-white/20 px-4 py-3 text-white placeholder-white/70 backdrop-blur-sm transition focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <button
                type="submit"
                className="rounded-lg bg-white px-6 py-3 font-semibold text-pink-600 shadow-lg transition hover:bg-pink-50"
              >
                Suscribirse
              </button>
            </form>

            {subscribed && (
              <p className="mt-4 text-sm text-white bg-green-500/20 rounded-lg p-3">
                ¡Gracias por suscribirte! Revisa tu correo pronto.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            ¿Listo para descubrir nuevos estilos?
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Explora nuestra colección completa y encuentra lo que te hace falta.
          </p>
          <Link
            href="/Productos"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-fuchsia-500 px-8 py-3 font-semibold text-white shadow-lg shadow-pink-500/50 transition hover:shadow-xl"
          >
            Ver Todos los Productos
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Alta Pinta</h3>
              <p className="text-sm">Tu tienda de moda de confianza para todo tipo de estilos.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/Productos" className="hover:text-pink-400">Productos</Link></li>
                <li><Link href="#sobre-nosotros" className="hover:text-pink-400">Sobre Nosotros</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Ayuda</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-pink-400">Contacto</a></li>
                <li><a href="#" className="hover:text-pink-400">Envíos</a></li>
                <li><a href="#" className="hover:text-pink-400">Devoluciones</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-pink-400">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:text-pink-400">Política de Privacidad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Alta Pinta. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

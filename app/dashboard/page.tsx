"use client";

import { useEffect, useState } from "react";
import AuthHeader from "@/components/layout/AuthHeader";
import AdminHeader from "@/components/layout/AdminHeader";
import PublicHeader from "@/components/layout/PublicHeader";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import Link from "next/link";

interface User {
  email?: string | null;
  uid: string;
}

const productos = [
  {
    id: 1,
    nombre: "Camisa Casual Azul",
    precio: 450,
    categoria: "Hombre",
    imagen: "👕",
    descripcion: "Camisa de algodón perfecta para el día a día."
  },
  {
    id: 2,
    nombre: "Vestido Elegante Negro",
    precio: 850,
    categoria: "Mujer",
    imagen: "👗",
    descripcion: "Vestido versátil para ocasiones especiales."
  },
  {
    id: 3,
    nombre: "Jeans Clásicos",
    precio: 650,
    categoria: "Hombre",
    imagen: "👖",
    descripcion: "Jeans de corte recto, cómodos y duraderos."
  },
  {
    id: 4,
    nombre: "Blusa Blanca",
    precio: 350,
    categoria: "Mujer",
    imagen: "👚",
    descripcion: "Blusa básica de algodón, esencial en tu guardarropa."
  },
  {
    id: 5,
    nombre: "Chaqueta de Cuero",
    precio: 1200,
    categoria: "Hombre",
    imagen: "🧥",
    descripcion: "Chaqueta de cuero genuino con estilo vintage."
  },
  {
    id: 6,
    nombre: "Falda Plisada",
    precio: 550,
    categoria: "Mujer",
    imagen: "👗",
    descripcion: "Falda plisada elegante para looks modernos."
  },
  {
    id: 7,
    nombre: "Sudadera Oversize",
    precio: 480,
    categoria: "Unisex",
    imagen: "👕",
    descripcion: "Sudadera cómoda para días casuales."
  },
  {
    id: 8,
    nombre: "Zapatos Deportivos",
    precio: 750,
    categoria: "Unisex",
    imagen: "👟",
    descripcion: "Zapatillas cómodas para actividades diarias."
  }
];

function Productos() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({ email: firebaseUser.email, uid: firebaseUser.uid });
        // Fetch user role
        try {
          //api/user/role?uid=${firebaseUser.uid}
          const res = await fetch(`/api/user/role?uid=${firebaseUser.uid}`);
          const data = await res.json();
          setIsAdmin(data.role === "admin");
        } catch {
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {isAdmin ? <AdminHeader user={user} /> : <PublicHeader />}

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-pink-300">Nuestra colección</p>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Productos</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Descubre prendas de calidad con estilo único. Cada pieza está seleccionada para ofrecerte comodidad y tendencia.
          </p>
          
          {/* Botón de administración solo para admins */}
          {isAdmin && (
            <div className="mt-6">
              <Link
                href="/dashboard/productos"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/50 px-4 py-2 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/30"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Administrar Productos
              </Link>
            </div>
          )}
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full border border-pink-400/30 bg-pink-500/10 px-4 py-2 text-sm text-pink-100 transition hover:bg-pink-500/20">
              Todos
            </button>
            <button className="rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 transition hover:border-pink-400/30 hover:bg-pink-500/10 hover:text-pink-100">
              Mujer
            </button>
            <button className="rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 transition hover:border-pink-400/30 hover:bg-pink-500/10 hover:text-pink-100">
              Hombre
            </button>
            <button className="rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 transition hover:border-pink-400/30 hover:bg-pink-500/10 hover:text-pink-100">
              Unisex
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-300">Ordenar por:</label>
            <select className="rounded-3xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white outline-none focus:border-pink-400">
              <option>Precio: Menor a mayor</option>
              <option>Precio: Mayor a menor</option>
              <option>Nombre A-Z</option>
              <option>Novedades</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/10"
            >
              <div className="aspect-square bg-slate-800/50 p-8 text-center text-6xl">
                {producto.imagen}
              </div>

              <div className="p-6">
                <div className="mb-2">
                  <span className="inline-block rounded-full bg-pink-500/20 px-2 py-1 text-xs font-medium text-pink-300">
                    {producto.categoria}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-white">{producto.nombre}</h3>
                <p className="mb-4 text-sm text-slate-400">{producto.descripcion}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-pink-300"></span>
                  <button className="rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-400">
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

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

export default Productos;

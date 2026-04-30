"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/Imagenes/Logo.png";
import { useAuth } from "@/lib/auth-context";

function PublicHeader({islogin = false, issignup = false}: {islogin?: boolean; issignup?: boolean}) {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 text-white shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-1 sm:px-6 lg:px-8">
        <a href="/" >
        <div  className="flex items-center gap-2">
          <div className="relative h-12 w-20 overflow-hidden">
            <Image src={logo} alt="Logo tienda" fill className="object-contain" />
          </div>
          <div>
            <p className="text-sm font-style  uppercase tracking-[0.3em] text-pink-300">Alta pinta</p>
            <h1 className="text-xl font-semibold">Moda para todos</h1>
          </div>
        </div>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/dashboard" className="text-sm font-medium text-white hover:text-pink-300">
            Productos
          </Link>
          <Link href="#sobre-nosotros" className="text-sm font-medium text-white hover:text-pink-300">
            Sobre Nosotros
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {!loading && (
            <>
              {user ? (
                // Usuario logueado - mostrar opciones de cuenta
                <>
                  <span className="text-sm text-slate-300">
                    Hola, <span className="text-pink-300">{user.email?.split('@')[0]}</span>
                  </span>
                  <button 
                    onClick={handleSignOut}
                    className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-pink-300 hover:bg-pink-500/10 hover:text-pink-100"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                // Usuario no logueado - mostrar botones de login/registro
                <>
                  {!issignup &&(
                    <Link href="/Signup" className="text-sm font-medium text-white hover:text-pink-300">
                      <button className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-pink-300 hover:bg-pink-500/10 hover:text-pink-100">
                        Registrar
                      </button>
                    </Link>
                  )}
                  {!islogin &&(
                    <Link href="/Login" className="text-sm font-medium text-white hover:text-pink-300">
                      <button className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-pink-300 hover:bg-pink-500/10 hover:text-pink-100">
                        Iniciar sesión
                      </button>
                    </Link>
                  )}
                </>
              )}
            </>
          )}
          <button className="relative inline-flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-400">
            <span>Carrito</span>
          </button>
      </div>
      </div>
    </header>
  );
}

export default PublicHeader;
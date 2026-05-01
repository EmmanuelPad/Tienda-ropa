"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/Imagenes/Logo.png";
import { useAuth } from "@/lib/auth-context";

function PublicHeader({islogin = false, issignup = false}: {islogin?: boolean; issignup?: boolean}) {
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [username, setUsername] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  // Cargar username guardado
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const savedUsername = localStorage.getItem("username") as string | null;
    if (savedTheme) setTheme(savedTheme);
    if (savedUsername) setUsername(savedUsername);
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cambiar tema
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/sessionLogout", { method: "POST" });
    } catch {
      // Continuar con signOut local aunque falle
    }
    await signOut();
  };

  return (
    <header className={`sticky top-0 z-50 shadow-sm backdrop-blur-sm transition-colors duration-300 ${theme === "dark" ? "bg-gray-900/95 text-white" : "bg-white/95 text-gray-900"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-1 sm:px-6 lg:px-8">
        <a href="/" >
        <div  className="flex items-center gap-2">
          <div className="relative h-12 w-20 overflow-hidden">
            <Image src={logo} alt="Logo tienda" fill className="object-contain" />
          </div>
          <div>
            <p className={`text-sm font-style uppercase tracking-[0.3em] ${theme === "dark" ? "text-pink-300" : "text-pink-600"}`}>Alta pinta</p>
            <h1 className="text-xl font-semibold">Moda para todos</h1>
          </div>
        </div>
        </a>

        <nav className={`hidden items-center gap-8 md:flex ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          <Link href="/dashboard" className={`text-sm font-medium transition hover:text-pink-300`}>
            Productos
          </Link>
          <Link href="#sobre-nosotros" className={`text-sm font-medium transition hover:text-pink-300`}>
            Sobre Nosotros
          </Link>
        </nav>

        <div className="flex items-center gap-3">
            <>
              {loading ? (
                // Verificando estado de sesión
                <span className="text-sm text-slate-400">Cargando...</span>
              ) : user ? (
                // Usuario logueado - mostrar menú de usuario
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:border-pink-300 hover:bg-pink-500/10"
                  >
                    <span className="text-pink-300">
                      {username ? `@${username}` : user.email?.split('@')[0]}
                    </span>
                    <svg className={`h-4 w-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Menú desplegable */}
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg border border-white/10 bg-gray-800 py-1 shadow-lg">
                      <Link
                        href="/dashboard/configuracion"
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/5"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Configuración
                      </Link>
                      <button
                        onClick={() => { toggleTheme(); setMenuOpen(false); }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/5"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {theme === "dark" ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          )}
                        </svg>
                        {theme === "dark" ? "Modo claro" : "Modo oscuro"}
                      </button>
                      <hr className="my-1 border-white/10" />
                      <button
                        onClick={() => { handleSignOut(); setMenuOpen(false); }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Usuario no logueado - mostrar botones de login/registro
                <>
                  {!issignup &&(
                    <Link href="/Signup" className={`text-sm font-medium transition hover:text-pink-300 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      <button className={`rounded-full border border-current px-4 py-2 text-sm font-medium transition hover:border-pink-300 hover:bg-pink-500/10 ${theme === "dark" ? "bg-white/5 text-white" : "bg-gray-100 text-gray-900"}`}>
                        Registrar
                      </button>
                    </Link>
                  )}
                  {!islogin &&(
                    <Link href="/Login" className={`text-sm font-medium transition hover:text-pink-300 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      <button className={`rounded-full border border-current px-4 py-2 text-sm font-medium transition hover:border-pink-300 hover:bg-pink-500/10 ${theme === "dark" ? "bg-white/5 text-white" : "bg-gray-100 text-gray-900"}`}>
                        Iniciar sesión
                      </button>
                    </Link>
                  )}
                </>
              )}
            </>
          <button className="relative inline-flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-400">
            <span>Carrito</span>
          </button>
      </div>
      </div>
    </header>
  );
}

export default PublicHeader;
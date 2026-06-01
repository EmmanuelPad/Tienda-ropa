"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/Imagenes/Logo.png";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "next-themes";
import { useCart } from "@/lib/CartContext";

function PublicHeader({
  islogin = false,
  issignup = false,
}: {
  islogin?: boolean;
  issignup?: boolean;
}) {
  const { user, loading, signOut, isAdmin, username } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const { openCart, totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDark = resolvedTheme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  // ── Cambiado: usa username de Firestore; si no tiene, cae al email ──
  const displayLabel = username || user?.email?.split("@")[0] || "";

  const handleSignOut = async () => {
    try {
      await fetch("/api/sessionLogout", { method: "POST" });
    } catch {
      // Continuar aunque falle
    }
    await signOut();
  };

  const linkClass = `rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-pink-500/10 hover:text-pink-400 ${isDark ? "text-white" : "text-gray-900"}`;

  return (
    <header
      className={`sticky top-0 z-50 shadow-sm backdrop-blur-sm transition-colors duration-300 ${
        isDark ? "bg-gray-900/95 text-white" : "bg-white/95 text-gray-900"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-1 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2">
            <div className="relative h-12 w-20 overflow-hidden">
              <Image
                src={logo}
                alt="Logo tienda"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p
                className={`text-sm uppercase tracking-[0.3em] ${isDark ? "text-pink-300" : "text-pink-600"}`}
              >
                Nova Wear
              </p>
              <h1 className="text-xl font-semibold">Moda para todos</h1>
            </div>
          </div>
        </Link>

        {/* ── Nav según rol ── */}
        <nav className="hidden items-center gap-1 md:flex">
          {isAdmin ? (
            <>
              <Link href="/dashboard" className={linkClass}>
                Productos
              </Link>
              <Link href="/dashboard/admin" className={linkClass}>
                Administrar
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className={linkClass}>
                Productos
              </Link>
              <Link href="#sobre-nosotros" className={linkClass}>
                Sobre Nosotros
              </Link>
            </>
          )}
        </nav>

        {/* ── Acciones derecha ── */}
        <div className="flex items-center gap-3">
          {loading ? (
            <span className="text-sm text-slate-400">Cargando...</span>
          ) : user ? (
            <div className="relative" ref={menuRef}>
              {/* Botón usuario con badge ADMIN */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
                  isAdmin
                    ? "border-pink-400/40 bg-pink-500/10 text-pink-200 hover:border-pink-300 hover:bg-pink-500/20"
                    : "border-white/20 bg-white/5 text-white hover:border-pink-300 hover:bg-pink-500/10"
                }`}
              >
                {isAdmin && (
                  <span className="rounded-full bg-pink-500 px-1.5 py-0.5 text-[10px] font-bold text-white leading-tight">
                    ADMIN
                  </span>
                )}
                {/* ── Muestra @username (desde Firestore) ── */}
                <span className="text-pink-300">@{displayLabel}</span>
                <svg
                  className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Menú desplegable */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-lg border border-white/10 bg-gray-800 py-1 shadow-lg">
                  {/* Sección admin */}
                  {isAdmin && (
                    <>
                      <p className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-pink-400">
                        Panel admin
                      </p>
                      <Link
                        href="/dashboard/productos"
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/5"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg
                          className="h-4 w-4 text-pink-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 10h16M4 14h16M4 18h16"
                          />
                        </svg>
                        Gestionar productos
                      </Link>
                      <Link
                        href="/dashboard/admin/usuarios"
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/5"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg
                          className="h-4 w-4 text-pink-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Gestionar usuarios
                      </Link>
                      <Link
                        href="/dashboard/productos/nuevo"
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/5"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg
                          className="h-4 w-4 text-pink-400"
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
                        Agregar producto
                      </Link>
                      <hr className="my-1 border-white/10" />
                    </>
                  )}

                  {/* Opciones comunes */}
                  <Link
                    href="/dashboard/configuracion"
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/5"
                    onClick={() => setMenuOpen(false)}
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
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Configuración
                  </Link>
                  <button
                    onClick={() => {
                      toggleTheme();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/5"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {isDark ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      )}
                    </svg>
                    {isDark ? "Modo claro" : "Modo oscuro"}
                  </button>
                  <hr className="my-1 border-white/10" />
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5"
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {!issignup && (
                <Link href="/Signup">
                  <button
                    className={`rounded-full border border-current px-4 py-2 text-sm font-medium transition hover:border-pink-300 hover:bg-pink-500/10 ${isDark ? "bg-white/5 text-white" : "bg-gray-100 text-gray-900"}`}
                  >
                    Registrar
                  </button>
                </Link>
              )}
              {!islogin && (
                <Link href="/Login">
                  <button
                    className={`rounded-full border border-current px-4 py-2 text-sm font-medium transition hover:border-pink-300 hover:bg-pink-500/10 ${isDark ? "bg-white/5 text-white" : "bg-gray-100 text-gray-900"}`}
                  >
                    Iniciar sesión
                  </button>
                </Link>
              )}
            </>
          )}

          {/* ── Botón carrito (solo usuarios normales) ── */}
          {!isAdmin && (
            <button
              onClick={openCart}
              className="relative inline-flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2
                text-sm font-semibold text-white transition hover:bg-pink-400 active:scale-95"
              aria-label="Abrir carrito"
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>Carrito</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-pink-600">
                  {totalItems}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default PublicHeader;

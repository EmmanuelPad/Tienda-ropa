"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";

export default function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
  } = useCart();

  /* bloquea scroll del body cuando está abierto */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* cierra con Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeCart]);

  return (
    <>
      {/* ── Overlay ── */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* ── Panel ── */}
      <aside
        role="dialog"
        aria-label="Carrito de compras"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm flex flex-col
          bg-slate-900 text-white shadow-2xl border-l border-white/10
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-base font-semibold">Mi carrito</h2>
            {totalItems > 0 && (
              <span className="rounded-full bg-pink-500 px-2 py-0.5 text-[11px] font-bold text-white leading-none">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Productos ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
              <div className="rounded-full bg-white/5 p-7">
                <svg className="h-10 w-10 text-pink-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">Tu carrito está vacío</p>
                <p className="mt-1 text-sm text-slate-400">Agrega productos para comenzar</p>
              </div>
              <button
                onClick={closeCart}
                className="rounded-full bg-pink-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-pink-400"
              >
                Ver productos
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-xl bg-white/5 p-3 border border-white/5"
                >
                  {/* Icono placeholder */}
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center
                    rounded-lg bg-slate-800 text-2xl">
                    👕
                  </div>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-white leading-tight line-clamp-2">
                        {item.name}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Eliminar"
                        className="flex-shrink-0 text-slate-500 transition hover:text-red-400"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Controles cantidad */}
                      <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-800">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2.5 py-1 text-pink-400 transition hover:text-pink-300 text-sm font-bold"
                        >−</button>
                        <span className="min-w-[1.5rem] text-center text-sm font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2.5 py-1 text-pink-400 transition hover:text-pink-300 text-sm font-bold"
                        >+</button>
                      </div>
                      <p className="text-sm font-semibold text-pink-300">
                        ${(item.price * item.quantity).toLocaleString("es-MX")}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Footer subtotal ── */}
        {items.length > 0 && (
          <div className="border-t border-white/10 bg-slate-900 px-5 py-4 space-y-4">
            {/* Desglose */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>{totalItems} {totalItems === 1 ? "artículo" : "artículos"}</span>
                <span>${subtotal.toLocaleString("es-MX")}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Envío</span>
                <span className="font-medium text-emerald-400">Gratis</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 text-base font-bold text-white">
                <span>Subtotal</span>
                <span className="text-pink-300">${subtotal.toLocaleString("es-MX")}</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/carrito"
              onClick={closeCart}
              className="flex w-full items-center justify-center gap-2 rounded-full
                bg-pink-500 px-5 py-3 text-sm font-semibold text-white
                transition hover:bg-pink-400 active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Ir al carrito
            </Link>

            <button
              onClick={closeCart}
              className="w-full text-center text-xs text-slate-500 transition hover:text-slate-300"
            >
              ← Seguir comprando
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

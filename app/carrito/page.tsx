"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { useCart } from "@/lib/CartContext";
import PublicHeader from "@/components/layout/PublicHeader";
import AdminHeader from "@/components/layout/AdminHeader";
import CartSidebar from "@/components/layout/CartSidebar";
import Link from "next/link";

export default function CarritoPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
  } = useCart();
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutCanceled, setCheckoutCanceled] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await fetch(`/api/user/role?uid=${user.uid}`);
          const data = await res.json();
          setIsAdmin(data.role === "admin");
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      clearCart();
      setCheckoutSuccess(true);
    }
    if (params.get("canceled") === "true") {
      setCheckoutCanceled(true);
    }
  }, [clearCart]);

  const envio = 0;
  const total = subtotal + envio;

  const handleCheckout = async () => {
    if (items.length === 0 || checkoutLoading) return;
    setCheckoutLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "No se pudo iniciar el pago.");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      setCheckoutLoading(false);
      window.alert(
        error instanceof Error
          ? error.message
          : "Error al procesar el pago. Intenta de nuevo."
      );
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
      </main>
    );
  }

  /* ── Confirmación de compra ── */
  if (checkoutSuccess) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        {isAdmin ? <AdminHeader /> : <PublicHeader />}
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-32 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-5xl">
            ✓
          </div>
          <h1 className="text-3xl font-bold text-white">Pago completado</h1>
          <p className="text-slate-400">
            Gracias por tu compra. Tu pago se ha procesado correctamente.
          </p>
          <Link
            href="/dashboard"
            className="rounded-full bg-pink-500 px-8 py-3 font-semibold text-white
              shadow-lg shadow-pink-500/30 transition hover:bg-pink-400"
          >
            Seguir comprando
          </Link>
        </div>
      </main>
    );
  }

  if (checkoutCanceled) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        {isAdmin ? <AdminHeader /> : <PublicHeader />}
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-32 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/20 text-5xl">
            ⚠️
          </div>
          <h1 className="text-3xl font-bold text-white">Pago cancelado</h1>
          <p className="text-slate-400">
            No se completó el pago. Puedes intentar de nuevo cuando quieras.
          </p>
          <Link
            href="/carrito"
            className="rounded-full bg-pink-500 px-8 py-3 font-semibold text-white
              shadow-lg shadow-pink-500/30 transition hover:bg-pink-400"
          >
            Volver al carrito
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {isAdmin ? <AdminHeader /> : <PublicHeader />}
      {!isAdmin && <CartSidebar />}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-10 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Seguir comprando
          </Link>
          <span className="text-slate-700">/</span>
          <h1 className="text-2xl font-bold text-white">
            Mi carrito
            {totalItems > 0 && (
              <span className="ml-2 rounded-full bg-pink-500/20 px-2.5 py-0.5 text-sm font-semibold text-pink-300">
                {totalItems} {totalItems === 1 ? "artículo" : "artículos"}
              </span>
            )}
          </h1>
        </div>

        {/* ── Carrito vacío ── */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-24 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-800 text-5xl">
              🛒
            </div>
            <div>
              <p className="text-xl font-semibold text-white">
                Tu carrito está vacío
              </p>
              <p className="mt-1 text-slate-400">
                Agrega productos para comenzar.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="rounded-full bg-pink-500 px-8 py-3 font-semibold text-white
                shadow-lg shadow-pink-500/30 transition hover:bg-pink-400"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            {/* ── Lista de productos ── */}
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-white/5 bg-white/5 p-5
                    transition hover:bg-white/[0.07]"
                >
                  {/* Imagen / placeholder */}
                  <div
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-800 cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/producto/${item.id}`)
                    }
                  >
                    <div className="flex h-full items-center justify-center text-4xl">
                      👕
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/producto/${item.id}`}
                          className="font-semibold text-white leading-tight hover:text-pink-300 transition"
                        >
                          {item.name}
                        </Link>
                        {item.description && (
                          <p className="mt-0.5 text-sm text-slate-400 line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Eliminar"
                        className="shrink-0 rounded-lg p-1.5 text-slate-500 transition
                          hover:bg-red-500/10 hover:text-red-400"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Controles cantidad */}
                      <div className="flex items-center rounded-xl border border-white/10 bg-slate-800">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-3 py-1.5 text-lg font-bold text-pink-400 transition hover:text-pink-300"
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-3 py-1.5 text-lg font-bold text-pink-400 transition hover:text-pink-300"
                        >
                          +
                        </button>
                      </div>

                      {/* Precio unitario y total */}
                      <div className="text-right">
                        <p className="text-base font-bold text-pink-300">
                          $
                          {(item.price * item.quantity).toLocaleString("es-MX")}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-slate-500">
                            ${item.price.toLocaleString("es-MX")} c/u
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Vaciar carrito */}
              <button
                onClick={clearCart}
                className="self-start text-sm text-slate-500 transition hover:text-red-400"
              >
                Vaciar carrito
              </button>
            </div>

            {/* ── Resumen del pedido ── */}
            <div className="sticky top-24 rounded-2xl border border-white/5 bg-white/5 p-6">
              <h2 className="mb-5 text-lg font-bold text-white">
                Resumen del pedido
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>
                    {totalItems} {totalItems === 1 ? "artículo" : "artículos"}
                  </span>
                  <span>${subtotal.toLocaleString("es-MX")}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Envío</span>
                  <span className="font-medium text-emerald-400">Gratis</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Descuentos</span>
                  <span>—</span>
                </div>
              </div>

              <div className="my-5 border-t border-white/10" />

              <div className="flex justify-between text-base font-bold text-white">
                <span>Total</span>
                <span className="text-2xl text-pink-300">
                  ${total.toLocaleString("es-MX")}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading || items.length === 0}
                className="mt-6 w-full rounded-2xl bg-pink-500 py-4 font-bold text-white
                  shadow-lg shadow-pink-500/30 transition hover:bg-pink-400 active:scale-[0.98]
                  disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
              >
                {checkoutLoading ? "Redirigiendo a Stripe..." : "Proceder al pago →"}
              </button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Pago seguro y encriptado
              </p>

              <div className="mt-5 border-t border-white/5 pt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Aceptamos
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Visa", "Mastercard", "OXXO Pay", "PayPal"].map((m) => (
                    <span
                      key={m}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-400"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

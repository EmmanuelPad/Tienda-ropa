"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { useCart } from "@/lib/CartContext";
import PublicHeader from "@/components/layout/PublicHeader";
import AdminHeader from "@/components/layout/AdminHeader";
import CartSidebar from "@/components/layout/CartSidebar";

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  categories: string[];
  imageUrl?: string;
  imageUrls?: string[];
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
}

export default function ProductoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});
  const [categoryNames, setCategoryNames] = useState<string[]>([]);

  const { addToCart } = useCart();

  /* ── Auth ── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
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
    });
    return () => unsub();
  }, []);

  /* ── Datos ── */
  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setProduct(data.data);
        else router.replace("/dashboard");
      })
      .catch(() => router.replace("/dashboard"))
      .finally(() => setLoading(false));
  }, [id, router]);

  useEffect(() => {
    if (!id) return;
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.data)) {
          const map: Record<string, string> = {};
          data.data.forEach((category: { id: string; name: string }) => {
            map[category.id] = category.name;
          });
          setCategoriesMap(map);
        }
      })
      .catch(() => {
        setCategoriesMap({});
      });
  }, [id]);

  useEffect(() => {
    if (!product) {
      setCategoryNames([]);
      return;
    }
    if (Object.keys(categoriesMap).length === 0) {
      setCategoryNames(product.categories ?? []);
      return;
    }
    setCategoryNames(
      product.categories.map((categoryId) => categoriesMap[categoryId] ?? categoryId),
    );
  }, [product, categoriesMap]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSubmitReview = async () => {
    if (!user) {
      setReviewError("Debes iniciar sesión para dejar una opinión.");
      return;
    }
    if (reviewRating < 1 || reviewRating > 5) {
      setReviewError("Selecciona una calificación entre 1 y 5 estrellas.");
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError("Escribe tu opinión antes de enviar.");
      return;
    }

    setReviewLoading(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      const response = await fetch(`/api/products/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          userName: user.displayName ?? user.email ?? "Cliente",
          rating: reviewRating,
          comment: reviewComment.trim(),
        }),
      });
      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.error || "No se pudo enviar la opinión.");
      }
      setProduct(data.data);
      setReviewRating(5);
      setReviewComment("");
      setReviewSuccess("Gracias por tu opinión. Se ha enviado con éxito.");
    } catch (error) {
      setReviewError(
        error instanceof Error
          ? error.message
          : "Error al enviar la opinión. Intenta de nuevo.",
      );
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
      </main>
    );
  }

  if (!product) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {isAdmin ? <AdminHeader /> : <PublicHeader />}
      {!isAdmin && <CartSidebar />}

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Volver */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-slate-400 transition hover:text-white"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver a productos
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* ── Imagen ── */}
          <div className="space-y-4">
            {product.imageUrls?.length ? (
              <>
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-slate-800/50 shadow-xl">
                  <Image
                    src={product.imageUrls[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
                {product.imageUrls.length > 1 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {product.imageUrls.slice(1, 5).map((url, index) => (
                      <div key={url + index} className="relative aspect-square overflow-hidden rounded-3xl bg-slate-800/50 shadow-xl">
                        <Image
                          src={url}
                          alt={`${product.name} ${index + 2}`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : product.imageUrl ? (
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-slate-800/50 shadow-xl">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-3xl bg-slate-800/50 text-9xl">
                👕
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="flex flex-col gap-6">
            {/* Categorías */}
            {categoryNames?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categoryNames.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full bg-pink-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-pink-300"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {product.name}
            </h1>

            <p className="text-4xl font-bold text-pink-300">
              ${product.price.toLocaleString("es-MX")}
            </p>

            {/* Stock */}
            <p
              className={`flex items-center gap-2 text-sm font-medium ${product.stock > 0 ? "text-emerald-400" : "text-red-400"}`}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${product.stock > 0 ? "bg-emerald-400" : "bg-red-400"}`}
              />
              {product.stock > 0
                ? `${product.stock} unidades disponibles`
                : "Sin stock"}
            </p>

            {/* Descripción */}
            <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
                Descripción
              </p>
              <p className="leading-relaxed text-slate-300">
                {product.description || "Sin descripción."}
              </p>
            </div>

            {/* ── Calificación y opiniones ── */}
            <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Calificación del producto
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-1 text-pink-400">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const value = index + 1;
                        return (
                          <span key={value}>
                            {value <= Math.round(product.rating ?? 0) ? "★" : "☆"}
                          </span>
                        );
                      })}
                    </div>
                    <span className="text-sm text-slate-400">
                      {product.reviewCount
                        ? `${product.rating?.toFixed(1)} · ${product.reviewCount} opinión${product.reviewCount === 1 ? "" : "es"}`
                        : "Sin calificaciones aún"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                <div className="pb-5">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
                    Dejar opinión
                  </p>
                  {reviewError && (
                    <div className="mb-3 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {reviewError}
                    </div>
                  )}
                  {reviewSuccess && (
                    <div className="mb-3 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                      {reviewSuccess}
                    </div>
                  )}
                  <div className="mb-3 flex items-center gap-2 text-sm text-slate-200">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const value = index + 1;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setReviewRating(value)}
                          className={`text-2xl transition ${
                            value <= reviewRating ? "text-pink-400" : "text-slate-600"
                          }`}
                        >
                          ★
                        </button>
                      );
                    })}
                    <span className="text-slate-400">{reviewRating} / 5</span>
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(event) => setReviewComment(event.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-white outline-none focus:border-pink-400"
                    placeholder="Escribe tu opinión sobre el producto..."
                  />
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleSubmitReview}
                      disabled={reviewLoading}
                      className="rounded-2xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-400 disabled:opacity-40"
                    >
                      {reviewLoading ? "Enviando opinión..." : "Enviar opinión"}
                    </button>
                    {!user && (
                      <p className="text-sm text-slate-500">
                        Inicia sesión para dejar tu opinión.
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-5">
                  <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">
                    Opiniones de clientes
                  </p>
                  {product.reviews?.length ? (
                    <div className="space-y-4">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                          <div className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-300">
                            <span>{review.userName}</span>
                            <span className="text-pink-400">{review.rating} ★</span>
                          </div>
                          <p className="text-sm leading-relaxed text-slate-300">
                            {review.comment}
                          </p>
                          <p className="mt-3 text-xs text-slate-500">
                            {new Date(review.createdAt).toLocaleDateString("es-MX")}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">Aún no hay opiniones para este producto.</p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Acciones usuario ── */}
            {!isAdmin && (
              <div className="flex flex-col gap-4">
                {/* Cantidad */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">Cantidad:</span>
                  <div className="flex items-center rounded-xl border border-white/10 bg-slate-800">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-lg font-bold text-pink-400 transition hover:text-pink-300"
                    >
                      −
                    </button>
                    <span className="min-w-10 text-center font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((q) => Math.min(product.stock, q + 1))
                      }
                      disabled={quantity >= product.stock}
                      className="px-3 py-2 text-lg font-bold text-pink-400 transition hover:text-pink-300 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-slate-500">
                    Total:{" "}
                    <span className="font-semibold text-white">
                      ${(product.price * quantity).toLocaleString("es-MX")}
                    </span>
                  </span>
                </div>

                {/* Botón agregar */}
                <button
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                  className={`w-full rounded-2xl py-4 text-base font-bold text-white shadow-lg transition active:scale-[0.98]
                    disabled:cursor-not-allowed disabled:opacity-40
                    ${
                      added
                        ? "bg-emerald-500 shadow-emerald-500/30"
                        : "bg-pink-500 shadow-pink-500/30 hover:bg-pink-400"
                    }`}
                >
                  {added ? "✓ Agregado al carrito" : "Agregar al carrito"}
                </button>
              </div>
            )}

            {/* ── Acciones admin ── */}
            {isAdmin && (
              <Link
                href={`/dashboard/admin/productos/${product.id}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-sky-500/40
                  bg-sky-500/20 px-5 py-3 text-sm font-semibold text-sky-300
                  transition hover:bg-sky-500/30"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar producto
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

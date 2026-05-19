"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect, useRef, useCallback } from "react";
import { useRequireRole } from "@/lib/useRequireRole";
import AdminHeader from "@/components/layout/AdminHeader";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function NuevoProductoPage() {
  const router = useRouter();
  const { loading: roleLoading, isAdmin, user } = useRequireRole("admin");

  const [categorias, setCategorias]     = useState<Category[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  const [loadingCats, setLoadingCats]   = useState(true);
  const [isSaving, setIsSaving]         = useState(false);
  const [error, setError]               = useState("");

  // ── Imagen ──
  const [imageFile, setImageFile]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadedUrl, setUploadedUrl]   = useState("");
  const [uploadedPublicId, setUploadedPublicId] = useState("");
  const [dragOver, setDragOver]         = useState(false);
  const fileInputRef                    = useRef<HTMLInputElement>(null);

  // ── Modal nueva categoría ──
  const [modalOpen, setModalOpen]       = useState(false);
  const [nuevaNombre, setNuevaNombre]   = useState("");
  const [nuevaDesc, setNuevaDesc]       = useState("");
  const [guardandoCat, setGuardandoCat] = useState(false);
  const [errorCat, setErrorCat]         = useState("");

  useEffect(() => {
    if (!roleLoading && isAdmin) fetchCategorias();
  }, [roleLoading, isAdmin]);

  async function fetchCategorias() {
    setLoadingCats(true);
    try {
      const res  = await fetch("/api/categories");
      const data = await res.json();
      if (data.ok) setCategorias(data.data ?? []);
      else setError(data.error || "Error al cargar categorías");
    } catch {
      setError("Error de conexión al cargar categorías");
    } finally {
      setLoadingCats(false);
    }
  }

  const toggleCategoria = (id: string) =>
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  // ── Manejo de imagen ──
  const handleImageChange = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten archivos de imagen.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar 5 MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    // Limpiar URL previa si el usuario cambia la imagen
    setUploadedUrl("");
    setUploadedPublicId("");
  }, []);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageChange(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setUploadedUrl("");
    setUploadedPublicId("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Sube la imagen a Cloudinary y devuelve la URL
  async function uploadImage(): Promise<{ url: string; publicId: string } | null> {
    if (!imageFile) return null;
    setUploadingImg(true);
    try {
      const form = new FormData();
      form.append("file", imageFile);
      const res  = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!data.ok) throw new Error(data.message || "Error al subir imagen");
      return { url: data.url, publicId: data.publicId };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir imagen");
      return null;
    } finally {
      setUploadingImg(false);
    }
  }

  async function handleCrearCategoria() {
    if (!nuevaNombre.trim()) return;
    setGuardandoCat(true);
    setErrorCat("");
    try {
      const res  = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nuevaNombre.trim(), description: nuevaDesc.trim() }),
      });
      const data = await res.json();
      if (data.ok) {
        setNuevaNombre("");
        setNuevaDesc("");
        setModalOpen(false);
        await fetchCategorias();
        setSeleccionadas((prev) => [...prev, data.data.id]);
      } else {
        setErrorCat(data.error || "Error al crear la categoría");
      }
    } catch {
      setErrorCat("Error de conexión");
    } finally {
      setGuardandoCat(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (seleccionadas.length === 0) {
      setError("Selecciona al menos una categoría.");
      return;
    }

    setIsSaving(true);

    try {
      // 1. Subir imagen si hay una seleccionada
      let imgUrl    = uploadedUrl;
      let imgPubId  = uploadedPublicId;

      if (imageFile && !uploadedUrl) {
        const uploaded = await uploadImage();
        if (!uploaded) { setIsSaving(false); return; }
        imgUrl   = uploaded.url;
        imgPubId = uploaded.publicId;
      }

      // 2. Crear el producto
      const formData = new FormData(event.currentTarget);
      const product = {
        name:        String(formData.get("nombre") ?? "").trim(),
        categories:  seleccionadas,
        price:       Number(formData.get("precio") ?? 0),
        stock:       Number(formData.get("stock") ?? 0),
        description: String(formData.get("descripcion") ?? "").trim(),
        imageUrl:    imgUrl,
        publicId:    imgPubId,
      };

      const response = await fetch("/api/products", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(product),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || "Error al registrar el producto.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrar el producto.");
    } finally {
      setIsSaving(false);
    }
  }

  if (roleLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      </main>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AdminHeader />

      <section className="mx-auto max-w-3xl px-6 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <p className="text-sm font-medium text-emerald-400">Productos</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Nuevo producto</h1>
          <p className="mt-2 text-sm text-slate-400">
            Completa el formulario para registrar un producto en el sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="grid gap-6">

            {/* ── Imagen del producto ── */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Imagen del producto
                <span className="ml-2 text-xs text-slate-500">(opcional · máx. 5 MB)</span>
              </label>

              {imagePreview ? (
                /* Vista previa */
                <div className="relative w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
                  <div className="relative h-64 w-full">
                    <Image
                      src={imagePreview}
                      alt="Vista previa del producto"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  {/* Acciones sobre la imagen */}
                  <div className="flex items-center justify-between border-t border-slate-700 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate max-w-[200px]">{imageFile?.name}</span>
                      <span className="text-slate-500">
                        ({imageFile ? (imageFile.size / 1024).toFixed(0) : 0} KB)
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:border-emerald-400 hover:text-emerald-400 transition"
                      >
                        Cambiar
                      </button>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Zona de drop */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 transition
                    ${dragOver
                      ? "border-emerald-400 bg-emerald-400/5"
                      : "border-slate-700 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800/60"
                    }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700">
                    <svg className="h-6 w-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-300">
                      {dragOver ? "Suelta la imagen aquí" : "Arrastra una imagen o haz clic para seleccionar"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">PNG, JPG, WEBP — máx. 5 MB</p>
                  </div>
                  <span className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
                    Seleccionar imagen
                  </span>
                </div>
              )}

              {/* Input oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageChange(file);
                }}
              />
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-slate-300">
                Nombre del producto
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                placeholder="Ej. Camisa casual azul"
                className={inputClass}
              />
            </div>

            {/* ── Categorías ── */}
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-slate-300">
                  Categorías
                  {seleccionadas.length > 0 && (
                    <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                      {seleccionadas.length} seleccionada{seleccionadas.length > 1 ? "s" : ""}
                    </span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={() => { setModalOpen(true); setErrorCat(""); }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40
                    bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400
                    transition hover:border-emerald-400 hover:bg-emerald-500/20"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Nueva categoría
                </button>
              </div>

              {loadingCats ? (
                <div className="flex items-center gap-2 py-4 text-sm text-slate-400">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                  Cargando categorías...
                </div>
              ) : categorias.length === 0 ? (
                <p className="rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm text-slate-400">
                  No hay categorías. Crea una con el botón de arriba.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {categorias.map((cat) => {
                    const isSelected = seleccionadas.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategoria(cat.id)}
                        className={`relative flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition
                          ${isSelected
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                            : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500"
                          }`}
                      >
                        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition
                          ${isSelected ? "border-emerald-500 bg-emerald-500" : "border-slate-600"}`}
                        >
                          {isSelected && (
                            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        <span className="truncate">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="precio" className="mb-2 block text-sm font-medium text-slate-300">
                  Precio (MXN)
                </label>
                <input
                  id="precio"
                  name="precio"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="stock" className="mb-2 block text-sm font-medium text-slate-300">
                  Stock
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  required
                  placeholder="0"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="mb-2 block text-sm font-medium text-slate-300">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows={4}
                placeholder="Describe el producto..."
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-xl border border-slate-700 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || uploadingImg}
              className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploadingImg ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Subiendo imagen...
                </span>
              ) : isSaving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Guardando...
                </span>
              ) : (
                "Crear producto"
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ── Modal nueva categoría ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Nueva categoría</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {errorCat && (
              <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {errorCat}
              </p>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Nombre</label>
                <input
                  type="text"
                  value={nuevaNombre}
                  onChange={(e) => setNuevaNombre(e.target.value)}
                  placeholder="Ej. Ropa de verano"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Descripción <span className="text-slate-500">(opcional)</span>
                </label>
                <textarea
                  value={nuevaDesc}
                  onChange={(e) => setNuevaDesc(e.target.value)}
                  placeholder="Descripción breve de la categoría"
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 rounded-xl border border-slate-700 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearCategoria}
                disabled={!nuevaNombre.trim() || guardandoCat}
                className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-50"
              >
                {guardandoCat ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creando...
                  </span>
                ) : "Crear categoría"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

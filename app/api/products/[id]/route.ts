import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/lib/Products/product.repository";
import { NextRequest, NextResponse } from "next/server";

// GET /api/products/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json(
        { ok: false, error: "Producto no encontrado" },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, data: product });
  } catch (error) {
    console.error("Error obteniendo producto:", error);
    return NextResponse.json(
      { ok: false, error: "Error al obtener el producto" },
      { status: 500 },
    );
  }
}

// PUT /api/products/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const name = String(body.name ?? "").trim();
    const categories = Array.isArray(body.categories)
      ? body.categories.map(String)
      : [];
    const price = Number(body.price ?? 0);
    const stock = Number(body.stock ?? 0);
    const description = String(body.description ?? "").trim();
    const imageUrls = Array.isArray(body.imageUrls)
      ? body.imageUrls.map(String).filter(Boolean)
      : [];
    const publicIds = Array.isArray(body.publicIds)
      ? body.publicIds.map(String).filter(Boolean)
      : [];
    const imageUrl = String(body.imageUrl ?? "");
    const publicId = String(body.publicId ?? "");

    const finalImageUrls = imageUrls.length
      ? imageUrls
      : imageUrl
      ? [imageUrl]
      : [];
    const finalPublicIds = publicIds.length
      ? publicIds
      : publicId
      ? [publicId]
      : [];

    if (!name) {
      return NextResponse.json(
        { ok: false, error: "El nombre del producto es requerido" },
        { status: 400 },
      );
    }
    if (categories.length === 0) {
      return NextResponse.json(
        { ok: false, error: "La categoría del producto es requerida" },
        { status: 400 },
      );
    }
    if (price <= 0) {
      return NextResponse.json(
        { ok: false, error: "El precio debe ser un valor positivo" },
        { status: 400 },
      );
    }
    if (stock < 0) {
      return NextResponse.json(
        { ok: false, error: "El stock no puede ser negativo" },
        { status: 400 },
      );
    }

    const updated = await updateProduct(id, {
      name,
      categories,
      price,
      stock,
      description,
      imageUrls: finalImageUrls,
      publicIds: finalPublicIds,
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    console.error("Error actualizando producto:", error);
    return NextResponse.json(
      { ok: false, error: "Error al actualizar el producto" },
      { status: 500 },
    );
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteProduct(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error eliminando producto:", error);
    return NextResponse.json(
      { ok: false, error: "Error al eliminar el producto" },
      { status: 500 },
    );
  }
}

import { createProduct, deleteProduct, getProduct } from "@/lib/Products/product.repository";
import { NextRequest, NextResponse } from "next/server";

// GET /api/products - Obtener todos los productos
export async function GET() {
  try {
    const products = await getProduct();
    return NextResponse.json({ ok: true, data: products });
  } catch (error) {
    console.error("Error obteniendo los productos:", error);
    return NextResponse.json(
      { ok: false, error: "No se pudieron obtener los productos" },
      { status: 500 }
    );
  }
}

// POST /api/products - Crear un nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name        = String(body.name ?? "").trim();
    const category    = Array.isArray(body.categories) ? body.categories.map(String) : [];
    const price       = Number(body.price ?? 0);
    const stock       = Number(body.stock ?? 0);
    const description = String(body.description ?? "").trim();
    const imageUrls   = Array.isArray(body.imageUrls)
      ? body.imageUrls.map(String).filter(Boolean)
      : [];
    const publicIds   = Array.isArray(body.publicIds)
      ? body.publicIds.map(String).filter(Boolean)
      : [];
    const imageUrl    = String(body.imageUrl ?? "");
    const publicId    = String(body.publicId ?? "");

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
        { status: 400 }
      );
    }
    if (category.length === 0) {
      return NextResponse.json(
        { ok: false, error: "La categoría del producto es requerida" },
        { status: 400 }
      );
    }
    if (price <= 0) {
      return NextResponse.json(
        { ok: false, error: "El precio del producto debe ser un valor positivo" },
        { status: 400 }
      );
    }
    if (stock < 0) {
      return NextResponse.json(
        { ok: false, error: "El stock del producto debe ser un valor no negativo" },
        { status: 400 }
      );
    }

    const product = await createProduct({
      name,
      categories: category,
      price,
      stock,
      description,
      imageUrls: finalImageUrls,
      publicIds: finalPublicIds,
    });

    return NextResponse.json({ ok: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo crear el producto" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/:id - Eliminar un producto por ID
export async function DELETE(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const id = pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID de producto requerido" },
        { status: 400 }
      );
    }

    await deleteProduct(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo eliminar el producto" },
      { status: 500 }
    );
  }
}

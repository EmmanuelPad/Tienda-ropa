import { NextRequest, NextResponse } from "next/server";
import { addProductReview } from "@/lib/Products/product.repository";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const userId = String(body.userId ?? "").trim();
    const userName = String(body.userName ?? "").trim();
    const rating = Number(body.rating ?? 0);
    const comment = String(body.comment ?? "").trim();

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Identificador de usuario requerido" },
        { status: 400 },
      );
    }
    if (!userName) {
      return NextResponse.json(
        { ok: false, error: "Nombre de usuario requerido" },
        { status: 400 },
      );
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { ok: false, error: "La calificación debe ser entre 1 y 5 estrellas" },
        { status: 400 },
      );
    }
    if (!comment) {
      return NextResponse.json(
        { ok: false, error: "El comentario es requerido" },
        { status: 400 },
      );
    }

    const updatedProduct = await addProductReview(id, {
      userId,
      userName,
      rating,
      comment,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { ok: false, error: "Producto no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, data: updatedProduct });
  } catch (error) {
    console.error("Error agregando opinión del producto:", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo agregar la opinión" },
      { status: 500 },
    );
  }
}

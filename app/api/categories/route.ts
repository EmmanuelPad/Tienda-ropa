import { createCategory, deleteCategory, getCategory } from "@/lib/Categorias/categorias.repository";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await getCategory();
    return NextResponse.json({ ok: true, data: categories });
  } catch (error) {
    console.error("Error obteniendo las categorías: ", error);
    return NextResponse.json(
      { ok: false, error: "No se pudieron obtener las categorías" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const description = String(body.description ?? "").trim();

    if (!name) {
      return NextResponse.json(
        { ok: false, error: "El nombre es requerido" },
        { status: 400 }
      );
    }

    const category = await createCategory({ name, description });
    return NextResponse.json({ ok: true, data: category });
  } catch (error) {
    console.error("Error creando la categoría: ", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo crear la categoría" },
      { status: 500 }
    );
  }
}

// ← AGREGADO: eliminar categoría por ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Se requiere el ID de la categoría" },
        { status: 400 }
      );
    }

    await deleteCategory(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error eliminando la categoría: ", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo eliminar la categoría" },
      { status: 500 }
    );
  }
}

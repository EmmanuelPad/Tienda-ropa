import { deleteProduct } from "@/lib/Products/product.repository";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          ok: false,
          error: "ID del producto es requerido",
        },
        {
          status: 400,
        }
      );
    }

    const success = await deleteProduct(id);

    if (!success) {
      return NextResponse.json(
        {
          ok: false,
          error: "No se pudo eliminar el producto",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Producto eliminado exitosamente",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting product:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "No se pudo eliminar el producto",
      },
      {
        status: 500,
      }
    );
  }
}

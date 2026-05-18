import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { ok: false, message: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, message: "Solo se permiten imágenes" },
        { status: 400 }
      );
    }

    // Validar tamaño (máx. 5 MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { ok: false, message: "La imagen no puede superar 5 MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Subir a Cloudinary
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "productos", resource_type: "image" },
            (error, result) => {
              if (error || !result) {
                reject(error ?? new Error("Cloudinary no devolvió resultado"));
              } else {
                resolve(result as { secure_url: string; public_id: string });
              }
            }
          )
          .end(buffer);
      }
    );

    return NextResponse.json({
      ok: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    return NextResponse.json(
      { ok: false, message: "Error interno al subir la imagen" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getServerUser } from "@/lib/auth-server";

/**
 * Endpoint temporal para crear el primer admin.
 * IMPORTANTE: Eliminar después de usar o proteger con una clave secreta.
 * 
 * Uso: POST /api/admin/setup-first-admin
 * Body: { "secret": "tu_clave_secreta" }
 */

const SETUP_SECRET = process.env.SETUP_ADMIN_SECRET ?? "admin-setup-2026";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Verificar clave secreta
    if (body.secret !== SETUP_SECRET) {
      return NextResponse.json(
        { error: "Clave secreta inválida" },
        { status: 403 }
      );
    }

    // Obtener el usuario actual (debe estar autenticado)
    const currentUser = await getServerUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Debes iniciar sesión primero" },
        { status: 401 }
      );
    }

    // Verificar si ya es admin
    if (currentUser.isAdmin) {
      return NextResponse.json(
        { message: "Ya eres administrador", isAdmin: true },
        { status: 200 }
      );
    }

    // Promover a admin
    await adminDb.doc(`users/${currentUser.uid}`).update({
      role: "admin",
      updatedAt: new Date().toISOString(),
      updatedBy: "setup-first-admin",
    });

    return NextResponse.json({ 
      success: true, 
      message: "¡Ahora eres administrador!",
      isAdmin: true,
    });
  } catch (error) {
    console.error("Error en setup:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
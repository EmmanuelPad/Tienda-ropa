import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getServerUser } from "@/lib/auth-server";

export async function POST(request: Request) {
  try {
    // Verificar que el usuario actual es admin
    const currentUser = await getServerUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    if (!currentUser.isAdmin) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 403 }
      );
    }

    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { error: "UID de usuario requerido" },
        { status: 400 }
      );
    }

    // No permitir que un admin se degrade a sí mismo
    if (uid === currentUser.uid) {
      return NextResponse.json(
        { error: "No puedes cambiar tu propio rol" },
        { status: 400 }
      );
    }

    // Actualizar el rol del usuario en Firestore
    await adminDb.doc(`users/${uid}`).update({
      role: "admin",
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser.uid,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Usuario promovido a administrador" 
    });
  } catch (error) {
    console.error("Error al promover usuario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
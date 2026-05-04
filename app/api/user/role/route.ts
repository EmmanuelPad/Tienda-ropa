import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

// GET /api/user/role?uid=... — devuelve el rol de un usuario específico
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json({ error: "UID requerido" }, { status: 400 });
    }

    // Obtener el usuario de Firestore
    const userDoc = await adminDb.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const userData = userDoc.data();
    const role = userData?.role || "user";

    return NextResponse.json({ role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// POST /api/user/role — actualiza el rol de un usuario (solo admins)
export async function POST(request: NextRequest) {
  try {
    const { targetUid, role } = await request.json();

    if (!targetUid || !role) {
      return NextResponse.json({ error: "targetUid y role requeridos" }, { status: 400 });
    }

    if (!["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
    }

    // Verificar que quien llama es admin
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await import("@/lib/auth-server").then(m => m.verifyIdToken(token));

    const callerDoc = await adminDb.collection("users").doc(decoded.uid).get();
    if (callerDoc.data()?.role !== "admin") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    // Actualizar el rol
    await adminDb.collection("users").doc(targetUid).update({ role });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
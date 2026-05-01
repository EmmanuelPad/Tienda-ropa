import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyIdToken } from "@/lib/auth-server";

// GET /api/admin/usuarios — devuelve todos los usuarios (solo admins)
export async function GET(request: NextRequest) {
  try {
    // Verificar que quien llama es admin
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await verifyIdToken(token);

    const callerDoc = await adminDb.collection("users").doc(decoded.uid).get();
    if (callerDoc.data()?.role !== "admin") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    // Obtener todos los usuarios
    const snapshot = await adminDb
      .collection("users")
      .orderBy("createdAt", "desc")
      .get();

    const usuarios = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        email: data.email || "",
        displayName: data.displayName || "",
        role: data.role || "user",
        createdAt: data.createdAt || null,
      };
    });

    return NextResponse.json({ ok: true, usuarios });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

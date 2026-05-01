import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyIdToken } from "@/lib/auth-server";

// GET /api/admin/usuarios — devuelve todos los usuarios
export async function GET() {
  try {
    // Obtener todos los usuarios
    const snapshot = await adminDb
      .collection("users")
      .get();

    const usuarios = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        email: data.email || "",
        displayName: data.displayName || "",
        role: String (data.role ??"user"),
        createdAt: data.createdAt || null,
      };
    });

    return NextResponse.json({ ok: true, usuarios });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
import { NextResponse, NextRequest } from "next/server";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

// GET /api/user — devuelve todos los usuarios o uno por uid
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (uid) {
      // Devolver datos de un usuario específico
      const doc = await adminDb.collection("users").doc(uid).get();
      if (!doc.exists) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
      }
      const data = doc.data()!;
      return NextResponse.json({
        ok: true,
        usuario: {
          uid: doc.id,
          email: data.email || "",
          displayName: data.displayName || "",
          username: data.username || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
          role: String(data.role ?? "user"),
        },
      });
    }

    // Devolver todos los usuarios
    const snapshot = await adminDb.collection("users").orderBy("createdAt", "desc").get();
    const usuarios = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        uid: doc.id,
        email: data.email || "",
        displayName: data.displayName || "",
        username: data.username || "",
        role: String(data.role ?? "user"),
        createdAt: data.createdAt || null,
      };
    });

    return NextResponse.json({ ok: true, usuarios });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// POST /api/user — actualiza datos del usuario desde configuración
export async function POST(request: NextRequest) {
  try {
    const { uid, displayName, username, telefono, direccion } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: "UID requerido" }, { status: 400 });
    }

    const userRef = adminDb.collection("users").doc(uid);
    const snap = await userRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Guarda todos los campos incluyendo telefono y direccion
    await userRef.update({
      displayName: displayName ?? "",
      username: username ?? "",
      telefono: telefono ?? "",
      direccion: direccion ?? "",
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, message: "Usuario actualizado" });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

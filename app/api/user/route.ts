import { NextResponse, NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

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
        username: data.username || "",
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
// POST /api/admin/usuarios -- actualiza un usuario desdde configuracion
export async function POST(request: NextRequest) {
  try 
  {
    const { uid, displayName, username, telefono,  } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: "UID requerido" }, { status: 400 });
    }

    const userRef = adminDb.collection("users").doc(uid).get();
    if (!(await userRef).exists) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    await adminDb.collection("users").doc(uid).update({
      displayName: displayName || "",
      username: username || "",
    });

    return NextResponse.json({ ok: true, message: "Usuario actualizado" });

  }catch (error) 
  {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

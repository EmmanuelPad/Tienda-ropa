import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyIdToken } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ role: "user" }, { status: 400 });
  }

  try {
    const userDoc = await adminDb.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ role: "user" });
    }

    const userData = userDoc.data();
    return NextResponse.json({ role: userData?.role || "user" });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json({ role: "user" });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await verifyIdToken(token);
    
    const adminDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
    const adminData = adminDoc.data();
    
    if (adminData?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
    }

    const body = await request.json();
    const { targetUid, role } = body;

    if (!targetUid || !role) {
      return NextResponse.json({ error: "Missing targetUid or role" }, { status: 400 });
    }

    await adminDb.collection("users").doc(targetUid).set(
      { role },
      { merge: true }
    );

    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error("Error assigning role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
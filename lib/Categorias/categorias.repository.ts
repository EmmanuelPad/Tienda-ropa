import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "../firebase-admin";
import { CreateCategoryInput, Category } from "./categorias";

const COLLECTION_NAME = "categories"; // ← CORREGIDO: se quitó el espacio al final

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const now = Timestamp.now();

  const categoryData = {
    name: input.name,
    description: input.description,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await adminDb.collection(COLLECTION_NAME).add(categoryData);

  return {
    id: docRef.id,
    name: categoryData.name,
    description: categoryData.description,
    createdAt: now.toDate().toISOString(),
    updatedAt: now.toDate().toISOString(),
  };
}

export async function getCategory(): Promise<Category[]> {
  const snapshot = await adminDb
    .collection(COLLECTION_NAME)
    .orderBy("createdAt", "desc")
    .get();

  const categories = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: String(data.name ?? ""),
      description: String(data.description ?? ""),
      createdAt: data.createdAt?.toDate?.().toISOString(),
      updatedAt: data.updatedAt?.toDate?.().toISOString(),
    };
  });

  return categories;
}

export async function deleteCategory(id: string): Promise<boolean> {
  await adminDb.collection(COLLECTION_NAME).doc(id).delete();
  return true;
}

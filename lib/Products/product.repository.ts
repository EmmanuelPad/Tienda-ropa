import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "../firebase-admin";
import { CreateProductInput, Product } from "./product";

const COLLECTION_NAME = "products";

export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const now = Timestamp.now();

  const productData = {
    name: input.name,
    categories: input.categories,
    price: input.price,
    stock: input.stock,
    description: input.description,
    imageUrl: input.imageUrl ?? "",
    publicId: input.publicId ?? "",
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await adminDb.collection(COLLECTION_NAME).add(productData);

  return {
    id: docRef.id,
    name: productData.name,
    categories: productData.categories,
    price: productData.price,
    stock: productData.stock,
    description: productData.description,
    imageUrl: productData.imageUrl,
    publicId: productData.publicId,
    createdAt: now.toDate().toISOString(),
    updatedAt: now.toDate().toISOString(),
  };
}

export async function getProduct(): Promise<Product[]> {
  const snapshot = await adminDb
    .collection(COLLECTION_NAME)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: String(data.name ?? ""),
      categories: Array.isArray(data.categories)
        ? data.categories.map(String)
        : [],
      price: Number(data.price ?? 0),
      stock: Number(data.stock ?? 0),
      description: String(data.description ?? ""),
      imageUrl: String(data.imageUrl ?? ""),
      publicId: String(data.publicId ?? ""),
      createdAt: data.createdAt?.toDate?.().toISOString(),
      updatedAt: data.updatedAt?.toDate?.().toISOString(),
    };
  });
}

export async function getProductById(id: string): Promise<Product | null> {
  const doc = await adminDb.collection(COLLECTION_NAME).doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data()!;
  return {
    id: doc.id,
    name: String(data.name ?? ""),
    categories: Array.isArray(data.categories)
      ? data.categories.map(String)
      : [],
    price: Number(data.price ?? 0),
    stock: Number(data.stock ?? 0),
    description: String(data.description ?? ""),
    imageUrl: String(data.imageUrl ?? ""),
    publicId: String(data.publicId ?? ""),
    createdAt: data.createdAt?.toDate?.().toISOString(),
    updatedAt: data.updatedAt?.toDate?.().toISOString(),
  };
}

export async function updateProduct(
  id: string,
  input: Partial<CreateProductInput>,
): Promise<Product> {
  const now = Timestamp.now();
  await adminDb
    .collection(COLLECTION_NAME)
    .doc(id)
    .update({ ...input, updatedAt: now });
  const updated = await getProductById(id);
  return updated!;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await adminDb.collection(COLLECTION_NAME).doc(id).delete();
  return true;
}

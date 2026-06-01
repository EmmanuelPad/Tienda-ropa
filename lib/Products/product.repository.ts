import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "../firebase-admin";
import { CreateProductInput, Product } from "./product";

const COLLECTION_NAME = "products";

export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const now = Timestamp.now();
  const imageUrls =
    input.imageUrls?.length
      ? input.imageUrls
      : input.imageUrl
      ? [input.imageUrl]
      : [];
  const publicIds =
    input.publicIds?.length
      ? input.publicIds
      : input.publicId
      ? [input.publicId]
      : [];

  const productData = {
    name: input.name,
    categories: input.categories,
    price: input.price,
    stock: input.stock,
    description: input.description,
    imageUrl: imageUrls[0] ?? "",
    publicId: publicIds[0] ?? "",
    imageUrls,
    publicIds,
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
    imageUrls: productData.imageUrls,
    publicIds: productData.publicIds,
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
    const imageUrls = Array.isArray(data.imageUrls)
      ? data.imageUrls.map(String)
      : data.imageUrl
      ? [String(data.imageUrl)]
      : [];
    const publicIds = Array.isArray(data.publicIds)
      ? data.publicIds.map(String)
      : data.publicId
      ? [String(data.publicId)]
      : [];

    return {
      id: doc.id,
      name: String(data.name ?? ""),
      categories: Array.isArray(data.categories)
        ? data.categories.map(String)
        : [],
      price: Number(data.price ?? 0),
      stock: Number(data.stock ?? 0),
      description: String(data.description ?? ""),
      imageUrl: imageUrls[0] ?? String(data.imageUrl ?? ""),
      publicId: publicIds[0] ?? String(data.publicId ?? ""),
      imageUrls,
      publicIds,
      createdAt: data.createdAt?.toDate?.().toISOString(),
      updatedAt: data.updatedAt?.toDate?.().toISOString(),
    };
  });
}

export async function getProductById(id: string): Promise<Product | null> {
  const doc = await adminDb.collection(COLLECTION_NAME).doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data()!;
  const imageUrls = Array.isArray(data.imageUrls)
    ? data.imageUrls.map(String)
    : data.imageUrl
    ? [String(data.imageUrl)]
    : [];
  const publicIds = Array.isArray(data.publicIds)
    ? data.publicIds.map(String)
    : data.publicId
    ? [String(data.publicId)]
    : [];

  return {
    id: doc.id,
    name: String(data.name ?? ""),
    categories: Array.isArray(data.categories)
      ? data.categories.map(String)
      : [],
    price: Number(data.price ?? 0),
    stock: Number(data.stock ?? 0),
    description: String(data.description ?? ""),
    imageUrl: imageUrls[0] ?? String(data.imageUrl ?? ""),
    publicId: publicIds[0] ?? String(data.publicId ?? ""),
    imageUrls,
    publicIds,
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

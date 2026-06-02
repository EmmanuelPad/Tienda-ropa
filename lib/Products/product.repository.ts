import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "../firebase-admin";
import {
  AddProductReviewInput,
  CreateProductInput,
  Product,
  Review,
} from "./product";

const COLLECTION_NAME = "products";

function parseReviews(value: unknown): Review[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item !== "object" || item === null) return null;
      const raw = item as Record<string, unknown>;
      const createdAt =
        typeof raw.createdAt === "string"
          ? raw.createdAt
          : raw.createdAt?.toDate?.()?.toISOString?.() ?? "";
      return {
        id: String(raw.id ?? ""),
        userId: String(raw.userId ?? ""),
        userName: String(raw.userName ?? ""),
        rating: Number(raw.rating ?? 0),
        comment: String(raw.comment ?? ""),
        createdAt,
      };
    })
    .filter((review): review is Review => review !== null);
}

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
    rating: input.rating ?? 0,
    reviewCount: input.reviewCount ?? 0,
    reviews: input.reviews ?? [],
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
    rating: productData.rating,
    reviewCount: productData.reviewCount,
    reviews: productData.reviews,
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
      rating: Number(data.rating ?? 0),
      reviewCount: Number(data.reviewCount ?? 0),
      reviews: parseReviews(data.reviews),
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
    rating: Number(data.rating ?? 0),
    reviewCount: Number(data.reviewCount ?? 0),
    reviews: parseReviews(data.reviews),
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

export async function addProductReview(
  id: string,
  input: AddProductReviewInput,
): Promise<Product | null> {
  const docRef = adminDb.collection(COLLECTION_NAME).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;

  const data = doc.data()!;
  const currentReviews = parseReviews(data.reviews);
  const currentRating = Number(data.rating ?? 0);
  const currentReviewCount = Number(data.reviewCount ?? 0);
  const nextReviewCount = currentReviewCount + 1;
  const nextRating =
    nextReviewCount > 0
      ? Number(((currentRating * currentReviewCount + input.rating) / nextReviewCount).toFixed(1))
      : input.rating;

  const now = Timestamp.now();
  const newReview: Review = {
    id: `${doc.id}-${now.toMillis()}`,
    userId: input.userId,
    userName: input.userName,
    rating: Number(input.rating),
    comment: input.comment,
    createdAt: now.toDate().toISOString(),
  };

  const nextReviews = [...currentReviews, newReview];

  await docRef.update({
    reviews: nextReviews,
    rating: nextRating,
    reviewCount: nextReviewCount,
    updatedAt: now,
  });

  return getProductById(id);
}

export async function deleteProduct(id: string): Promise<boolean> {
  await adminDb.collection(COLLECTION_NAME).doc(id).delete();
  return true;
}

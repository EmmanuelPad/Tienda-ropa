export interface Product {
  id: string;
  name: string;
  categories: string[];
  price: number;
  stock: number;
  description: string;
  imageUrl?: string;   // ← URL pública de Cloudinary (primera imagen)
  publicId?: string;   // ← ID en Cloudinary (primera imagen)
  imageUrls?: string[]; // ← URLs públicas de Cloudinary
  publicIds?: string[]; // ← IDs en Cloudinary
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  categories: string[];
  price: number;
  stock: number;
  description: string;
  imageUrl?: string;
  publicId?: string;
  imageUrls?: string[];
  publicIds?: string[];
}

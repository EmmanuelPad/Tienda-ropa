export interface Product {
  id: string;
  name: string;
  categories: string[];
  price: number;
  stock: number;
  description: string;
  imageUrl?: string;   // ← URL pública de Cloudinary
  publicId?: string;   // ← ID en Cloudinary (para borrar/reemplazar)
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
}

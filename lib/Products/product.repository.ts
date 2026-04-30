import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "../firebase-admin";
import { CreateProductInput, Product } from "./product";

const COLLECTION_NAME = "products";

export async function createProduct(input: CreateProductInput) : Promise<Product>
{
    const now = Timestamp.now();

    const productData = 
    {
        name: input.name,
        category: input.category,
        price: input.price,
        stock: input.stock,
        description: input.description,
        createdAt: now,
        updatedAt: now,
    };
    const docRef = await adminDb.collection(COLLECTION_NAME).add(productData);

    return {
        id: docRef.id,
        name: productData.name,
        category: productData.category,
        price: productData.price,
        stock: productData.stock,
        description: productData.description,
        createdAt: now.toDate().toISOString(),
        updatedAt: now.toDate().toISOString(),
    };
}

export async function getProduct() : Promise<Product []>
{
    const snapshot = await adminDb.collection(COLLECTION_NAME).orderBy("createdAt", "desc").get();
    const products = snapshot.docs.map((doc) =>
    {
        const data = doc.data();
        return {
            id: doc.id,
            name: String(data.name?? ""),
            category: String(data.category?? ""),
            price: Number(data.price?? 0),
            stock: Number(data.stock?? 0),
            description: String(data.description?? ""),
            createdAt: data.createdAt?.toDate?.().toISOString() ,
            updatedAt: data.updatedAt?.toDate?.().toISOString() ,
        };
    });
    return products;
}

export async function deleteProduct(id: string): Promise<boolean>
{
    await adminDb.collection(COLLECTION_NAME).doc(id).delete();
    return true;
}
export interface Product
{
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductInput
{
    name: string;
    category: string;
    price: number;
    stock: number;
    description: string;
}
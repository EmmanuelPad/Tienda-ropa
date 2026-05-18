export interface Product
{
    id: string;
    name: string;
    idcategories: string[];
    price: number;
    stock: number;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductInput
{
    name: string;
    idcategories: string[];
    price: number;
    stock: number;
    description: string;
}
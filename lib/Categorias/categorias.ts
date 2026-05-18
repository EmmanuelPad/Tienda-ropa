export interface Category
{
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryInput
{
    name: string;
    description: string;
}
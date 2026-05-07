export interface User
{
    uid: string;
    email: string;
    displayName: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserInput
{
    email: string;
    displayName: string;
    role?: string;
}
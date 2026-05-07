import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "../firebase-admin";
import { CreateUserInput, User } from "./user";

const COLLECTION_NAME = "users";

export async function createUser(input: CreateUserInput) : Promise<User>
{
    const now = Timestamp.now();

    const userData = 
    {
        email: input.email,
        displayName: input.displayName,
        role: input.role || "user",
        createdAt: now,
        updatedAt: now,
    };
    const docRef = await adminDb.collection(COLLECTION_NAME).add(userData);

    return {
        uid: docRef.id,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role ?? "user",
        createdAt: now.toDate().toISOString(),
        updatedAt: now.toDate().toISOString(),
    };
}

export async function getUser(): Promise<User []>
{
    const snapshot = await adminDb.collection(COLLECTION_NAME).orderBy("createdAt", "desc").get();
    const users = snapshot.docs.map((doc) =>
    {
        const data = doc.data();
        return {
            uid: doc.id,
            email: String(data.email?? ""),
            displayName: String(data.displayName?? ""),
            role: String(data.role?? "user"),
            createdAt: data.createdAt?.toDate?.().toISOString() ,
            updatedAt: data.updatedAt?.toDate?.().toISOString() ,
        };
    });
    return users;
}

export async function deleteuser(id: string): Promise<boolean>
{
    await adminDb.collection(COLLECTION_NAME).doc(id).delete();
    return true;
}
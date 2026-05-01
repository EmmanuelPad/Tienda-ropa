import { getApps, initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = 
    {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

// Initialize Firebase
export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const firestore = getFirestore(app);
export async function configureAuthPersistence(remember: boolean) 
{
    await auth.setPersistence(remember ? browserLocalPersistence : browserSessionPersistence);
}

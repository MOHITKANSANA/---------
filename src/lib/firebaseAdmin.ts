// This file is server-only. Do not use 'use client' here.
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountString) {
      console.warn("Firebase Admin SDK: FIREBASE_SERVICE_ACCOUNT env var not set. Admin features may not work.");
    } else {
      const serviceAccount = JSON.parse(serviceAccountString);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  } catch (error: any) {
     console.error("Firebase Admin SDK initialization failed:", error.message);
  }
}

// Export a function to get the DB instance to ensure it's accessed only when available.
const getAdminDB = () => {
    if (!admin.apps.length) {
        // This is a fallback to prevent crashing if initialization failed.
        // It returns a mock or limited functionality object.
        // In a real app, you might throw an error or handle it differently.
        console.error("Firebase Admin is not initialized. Firestore operations will fail.");
        return null;
    }
    return admin.firestore();
};


const getAdminMessaging = () => {
    if (!admin.apps.length) {
        console.error("Firebase Admin is not initialized. Messaging operations will fail.");
        return null;
    }
    return admin.messaging();
};

export const adminDB = getAdminDB()!;
export const adminMessaging = getAdminMessaging()!;


import { MetadataRoute } from 'next'
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
// This setup is safe for server-side execution.
if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountString) {
      throw new Error("Firebase Admin SDK service account is not set in environment variables (FIREBASE_SERVICE_ACCOUNT).");
    }
    const serviceAccount = JSON.parse(serviceAccountString);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error("Firebase Admin SDK for sitemap failed:", error.message);
    // In a production environment, you might want to handle this more gracefully.
    // For now, we log the error. The sitemap will be generated with static routes only.
  }
}

const db = admin.firestore();

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://quklystudy.com'; // Fallback URL

type SitemapEntry = {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
};

async function generateDynamicSitemaps(): Promise<SitemapEntry[]> {
    const sitemapEntries: SitemapEntry[] = [];
    const today = new Date().toISOString().split('T')[0];

    // Check if the admin app was initialized successfully before proceeding
    if (!admin.apps.length) {
        console.warn("Admin SDK not initialized, skipping dynamic sitemap generation.");
        return [];
    }

    // Collections to fetch for dynamic routes
    const collectionsToFetch = ['courses', 'ebooks', 'pyqs', 'tests', 'books'];

    for (const collectionName of collectionsToFetch) {
        try {
            const querySnapshot = await db.collection(collectionName).get();
            querySnapshot.forEach((doc) => {
                // Special handling for 'books' collection which maps to 'bookshala' route
                const routePath = collectionName === 'books' ? 'bookshala' : collectionName;
                sitemapEntries.push({
                    url: `${APP_URL}/${routePath}/${doc.id}`,
                    lastModified: today,
                    changeFrequency: 'weekly',
                    priority: 0.8,
                });
            });
        } catch (error) {
            console.error(`Error fetching ${collectionName} for sitemap:`, error);
        }
    }
    
    return sitemapEntries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date().toISOString().split('T')[0];

  const staticRoutes: SitemapEntry[] = [
    { url: `${APP_URL}/`, lastModified: today, changeFrequency: 'daily', priority: 1.0 },
    { url: `${APP_URL}/courses`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
    { url: `${APP_URL}/ebooks`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
    { url: `${APP_URL}/pyqs`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
    { url: `${APP_URL}/test-series`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
    { url: `${APP_URL}/bookshala`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
    { url: `${APP_URL}/feed`, lastModified: today, changeFrequency: 'hourly', priority: 0.8 },
    { url: `${APP_URL}/refer`, lastModified: today, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/support`, lastModified: today, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${APP_URL}/login`, lastModified: today, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${APP_URL}/signup`, lastModified: today, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${APP_URL}/ai-doubt-solver`, lastModified: today, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/ai-test`, lastModified: today, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/ai-trick-generator`, lastModified: today, changeFrequency: 'monthly', priority: 0.7 },
  ];

  const dynamicRoutes = await generateDynamicSitemaps();

  return [...staticRoutes, ...dynamicRoutes];
}

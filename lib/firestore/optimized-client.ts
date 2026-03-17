import { getFirestore, doc, getDoc, collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { app } from '@/lib/firebase/client';
import { handleFirestoreError } from '@/lib/firebase/connection-health';

const db = getFirestore(app);

// Simple in-memory cache with TTL
const cache = new Map<string, { data: any; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(collection: string, docId?: string, queryKey?: string): string {
  return docId ? `${collection}:${docId}` : `${collection}:${queryKey}`;
}

function isCacheValid(expires: number): boolean {
  return Date.now() < expires;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

function getCache(key: string): any | null {
  const cached = cache.get(key);
  if (cached && isCacheValid(cached.expires)) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

// Optimized document get with caching
export async function getCachedDoc(collectionPath: string, docId: string): Promise<DocumentData | null> {
  const cacheKey = getCacheKey(collectionPath, docId);
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const docRef = doc(db, collectionPath, docId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.exists() ? docSnap.data() : null;
    if (data) setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error getting document ${collectionPath}/${docId}:`, error);
    // Return user-friendly error message
    throw new Error(handleFirestoreError(error));
  }
}

// Optimized query with caching
export async function getCachedQuery(
  collectionPath: string,
  constraints: any[],
  queryKey: string
): Promise<DocumentData[]> {
  const cacheKey = getCacheKey(collectionPath, undefined, queryKey);
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const q = query(collection(db, collectionPath), ...constraints);
    const querySnap = await getDocs(q);
    const data = querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error querying ${collectionPath}:`, error);
    // Return user-friendly error message
    throw new Error(handleFirestoreError(error));
  }
}

// Batch multiple document gets
export async function batchGetDocs(
  gets: Array<{ collection: string; docId: string }>
): Promise<Array<DocumentData | null>> {
  const results = await Promise.all(
    gets.map(({ collection, docId }) => getCachedDoc(collection, docId))
  );
  return results;
}

// Clear cache for a specific collection or all cache
export function clearCache(collectionPath?: string): void {
  if (collectionPath) {
    for (const key of cache.keys()) {
      if (key.startsWith(`${collectionPath}:`)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}

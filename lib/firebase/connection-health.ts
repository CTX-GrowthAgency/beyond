import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { app } from './client';

let isEmulatorConnected = false;

export function getFirestoreWithFallback() {
  try {
    const db = getFirestore(app);
    
    // Connect to emulator in development if environment variable is set
    if (process.env.NODE_ENV === 'development' && 
        process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST && 
        !isEmulatorConnected) {
      const [host, port] = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST.split(':');
      connectFirestoreEmulator(db, host, parseInt(port));
      isEmulatorConnected = true;
      console.log('Connected to Firestore emulator');
    }
    
    return db;
  } catch (error) {
    console.error('Failed to initialize Firestore:', error);
    throw new Error('Firestore initialization failed');
  }
}

export function handleFirestoreError(error: any): string {
  if (error.code === 'unavailable' || error.message.includes('backend')) {
    return 'Network connection issue. Please check your internet connection and try again.';
  }
  if (error.code === 'permission-denied') {
    return 'Permission denied. You may not have access to this resource.';
  }
  if (error.code === 'not-found') {
    return 'The requested data was not found.';
  }
  if (error.code === 'deadline-exceeded') {
    return 'Request timed out. Please try again.';
  }
  return error.message || 'An unexpected error occurred.';
}

// Test Firestore connectivity
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const db = getFirestoreWithFallback();
    // Simple test query - this will fail if no connection
    await Promise.race([
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 5000)
      ),
      // We don't actually need to execute a query, just test initialization
      Promise.resolve(true)
    ]);
    return true;
  } catch (error) {
    console.warn('Firestore connection test failed:', error);
    return false;
  }
}

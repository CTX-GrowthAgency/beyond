# Firestore Connection Troubleshooting

## Common Issue: "Could not reach Cloud Firestore backend"

This error occurs when Firestore cannot connect within the 10-second timeout. Here are the solutions:

## 🔧 **Immediate Solutions**

### 1. **Check Internet Connection**
- Ensure you have a stable internet connection
- Try accessing other Firebase services
- Test with a different network if possible

### 2. **Firebase Configuration**
Verify your environment variables in `.env.local`:

```env
# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin Config
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
```

### 3. **Firestore Security Rules**
Ensure your Firestore rules allow access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Allow public read access to events
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Users can only access their own bookings
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Users can access their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🛠️ **Development Setup**

### Option 1: Use Firestore Emulator (Recommended for Development)

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Initialize Emulator**
```bash
firebase init emulators
# Select Firestore
# Choose default ports
```

3. **Start Emulator**
```bash
firebase emulators:start
```

4. **Add Environment Variable**
```env
NEXT_PUBLIC_FIREBASE_EMULATOR_HOST=localhost:8080
```

### Option 2: Check Network Configuration

1. **Firewall/Proxy Settings**
   - Check if firewall blocks Firebase ports
   - Verify proxy settings don't interfere
   - Try disabling VPN temporarily

2. **DNS Resolution**
```bash
# Test DNS resolution
nslookup firestore.googleapis.com
ping firestore.googleapis.com
```

## 🚀 **Production Deployment**

### 1. **Vercel Configuration**
Ensure your environment variables are set in Vercel dashboard:
- Go to Project Settings > Environment Variables
- Add all Firebase configuration variables
- Redeploy after adding variables

### 2. **Firebase Project Settings**
1. Go to Firebase Console
2. Project Settings > General
3. Verify your project ID and configuration
4. Check if Firestore is enabled

### 3. **Service Account Permissions**
Ensure your service account has:
- Cloud Firestore Admin role
- Or custom role with Firestore permissions

## 🐛 **Debugging Steps**

### 1. **Enable Debug Logging**
Add this to your Firebase client initialization:

```javascript
// In lib/firebase/client.ts
import { getApps, initializeApp, connectAuthEmulator } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Enable debug logging in development
if (process.env.NODE_ENV === 'development') {
  import('firebase/firestore').then(({ getFirestore }) => {
    // This enables detailed logging
  });
}
```

### 2. **Test Connection Manually**
Create a test endpoint:

```typescript
// app/api/test-firestore/route.ts
import { getAdminDb } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = getAdminDb();
    const testDoc = await db.collection('test').doc('connection').get();
    return NextResponse.json({ 
      success: true, 
      timestamp: new Date().toISOString(),
      exists: testDoc.exists 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
```

### 3. **Browser Console Debugging**
Open browser console and check for:
- Network requests to Firestore
- Authentication token errors
- CORS issues

## 📊 **Performance Optimization**

### 1. **Reduce Connection Time**
- Use the optimized client we implemented
- Enable caching (already done)
- Use batch operations

### 2. **Monitor Connection Health**
The app now includes connection health monitoring and graceful error handling.

## 🆘 **When to Contact Support**

Contact Firebase support if:
- Multiple users experience the same issue
- Problem persists across different networks
- Firestore dashboard shows service issues

## 📝 **Quick Checklist**

- [ ] Internet connection is stable
- [ ] Environment variables are correctly set
- [ ] Firestore rules allow access
- [ ] Service account has proper permissions
- [ ] No firewall/proxy interference
- [ ] Try using emulator for development
- [ ] Check Firebase console for service status

## 🔗 **Useful Links**

- [Firebase Status Dashboard](https://status.firebase.google.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Note**: The connection error is usually temporary and resolves itself. The implemented error handling will show user-friendly messages and allow retry functionality.

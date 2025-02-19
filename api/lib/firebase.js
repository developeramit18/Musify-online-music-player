import admin from 'firebase-admin';
import dotenv from 'dotenv'

dotenv.config()


admin.initializeApp({
  credential: admin.credential.cert({
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    project_id: process.env.FIREBASE_PROJECT_ID,
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export const bucket = admin.storage().bucket();

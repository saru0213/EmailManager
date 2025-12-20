import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: "217338211214",
  appId: "1:217338211214:web:a0d6645901d3ebe23cd2df",
  measurementId: "G-8L0LW93R3X",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };

// Firebase Modular SDK v10+ (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAjNVTi5ZjZDLRcfxXmf2gWmHswSHM4d8E",
  authDomain: "karteji.firebaseapp.com",
  projectId: "karteji",
  storageBucket: "karteji.appspot.com",
  messagingSenderId: "828706251907",
  appId: "1:828706251907:web:54825185b074209c4fe7b6",
  measurementId: "G-PPGRMBXGHW"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

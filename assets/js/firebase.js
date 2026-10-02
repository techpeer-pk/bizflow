/*
 * Firebase — shared app and Firestore instance, and saving contact-form enquiries.
 * Loaded on demand by app.js (only when someone sends the contact form) and by the admin page (admin.js).
 * Enquiries are in Firestore → "enquiries". Security rules: firestore.rules.
 * The project keys live in firebase-config.js (not in git — see firebase-config.example.js).
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore-lite.js";
import { firebaseConfig } from "./firebase-config.js";

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export function saveEnquiry(enquiry) {
  return addDoc(collection(db, "enquiries"), { ...enquiry, createdAt: serverTimestamp() });
}

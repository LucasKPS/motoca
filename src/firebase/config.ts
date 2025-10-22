import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  "projectId": "studio-397848186-8ac18",
  "appId": "1:486015888893:web:406ab4521fa85134077d94",
  "apiKey": "AIzaSyBEvUNEkpkQRpyUhMfEFbWBKJiRtYddNO8",
  "authDomain": "studio-397848186-8ac18.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "486015888893"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

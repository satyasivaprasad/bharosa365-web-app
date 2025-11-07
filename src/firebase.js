import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBgImh5hfgzPeFed63h3w5h42-TTeLMpLc",
  authDomain: "weprotect-dfcd7.firebaseapp.com",
  projectId: "weprotect-dfcd7",
  storageBucket: "weprotect-dfcd7.firebasestorage.app",
  messagingSenderId: "778608960757",
  appId: "1:778608960757:web:e1ad7ef91b4947f8ba51bc",
  measurementId: "G-3Q5544BHMJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export default app;
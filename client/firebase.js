// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCS8ZEdEeL7TmhF_FkjxSsCYHqF5QI-kJI",
  authDomain: "napa-marroquineria-4c90d.firebaseapp.com",
  projectId: "napa-marroquineria-4c90d",
  storageBucket: "napa-marroquineria-4c90d.firebasestorage.app",
  messagingSenderId: "181163187596",
  appId: "1:181163187596:web:9b78e576f6f77b7dff0aa9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Exportamos solo el servicio de almacenamiento (Storage)
export const storage = getStorage(app);
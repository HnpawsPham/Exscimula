import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyCR1_KRvwc4CAX8_shJRfjEzqpjpbNadTE",
  authDomain: "exscimula.firebaseapp.com",
  databaseURL: "https://exscimula-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "exscimula",
  storageBucket: "exscimula.firebasestorage.app",
  messagingSenderId: "509213416938",
  appId: "1:509213416938:web:422dbbc09b962618562693",
  measurementId: "G-5KX0B7RE6K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdfLupGy0SooxUmcud8bhO9W3J--DO-js",
  authDomain: "naruto-galaxy.firebaseapp.com",
  projectId: "naruto-galaxy",
  storageBucket: "naruto-galaxy.firebasestorage.app",
  messagingSenderId: "280703897192",
  appId: "1:280703897192:web:dfa9da3d373005ccd335dd",
  databaseURL: "https://naruto-galaxy-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);  // app = your firebase project
const db = getDatabase(app);                // db = realtime database of that project

export const DB = ref(db);                  // DB = reference to database root
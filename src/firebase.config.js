import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD3ZmADugMcQ1aSv4bCLWiO_NJWuW1kZ8I",
    authDomain: "verdant-d0978.firebaseapp.com",
    databaseURL: "https://verdant-d0978-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "verdant-d0978",
    storageBucket: "verdant-d0978.appspot.com",
    messagingSenderId: "573012916649",
    appId: "1:573012916649:web:a6a02f9193b59ec53bacb8"
  };  

  const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
  
  const firestore = getFirestore(app);

  const storage = getStorage(app);

  const rdb = getDatabase(app);

  export { app, firestore, storage, rdb};

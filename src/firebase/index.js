import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyA0tLJINOKMs2mcJENZ0C_EtDIdx03l1wE",
    authDomain: "neehafathima.firebaseapp.com",
    projectId: "neehafathima",
    storageBucket: "neehafathima.appspot.com",
    messagingSenderId: "156015786259",
    appId: "1:156015786259:web:a430ba7c094355911e02e6"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
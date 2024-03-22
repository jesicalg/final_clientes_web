// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Agregamos el SDK de Firestore, e importamos las funciones que vamos a necesitar.
import { 
    getFirestore,
} from "firebase/firestore"
import{
    getAuth,
}from "firebase/auth";
import{
    getStorage,
}from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/learn-more#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC9sDexIvp_adKIr_-zzJnvDgrSodZfGag",
    authDomain: "dw-2023-clientes-web.firebaseapp.com",
    projectId: "dw-2023-clientes-web",
    storageBucket: "dw-2023-clientes-web.appspot.com",
    messagingSenderId: "418379352501",
    appId: "1:418379352501:web:9800ae38af04fa6d4a31fc"
    };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicializamos Firestore y obtenemos la referencia a la base de datos.
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export{app, db, auth, storage};
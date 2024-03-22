import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";
import {auth, db} from "./firebase.js";
import {createUser, getUserById, updateUser} from "./users.js";
import {getFileURL, uploadFileUsingString} from "./storage.js";
import {doc, updateDoc} from "firebase/firestore";

//datos del usuario autenticado
let user = {
    id: null,
    email: null,
    displayName: null,
    photoURL: null,
    role: null,
    currentIssue: null
}

export const ERROR_TYPES = {
    EMAIL: 'invalid_email',
    PASSWORD: 'invalid_password'
} 

if (localStorage.getItem('user')) {
    user = JSON.parse(localStorage.getItem('user'));
}

onAuthStateChanged(auth, newUser => {
    if (newUser) {
        setUser({
            id: newUser.uid,
            email: newUser.email,
            displayName: newUser.displayName,
            photoURL: newUser.photoURL,
        });

        if (newUser.photoURL) {
            getFileURL(newUser.photoURL)
                .then(url => {
                    setUser({photoURL: url})
                })
        }

        /**datos adicionales que no estan en autentication */
        getUserById(newUser.uid)
            .then(userData => {
                setUser({
                    role: userData.role,
                    currentIssue: userData.currentIssue,
                    contractedService: userData.contractedService
                });
            })
    } else {
        clearUser();
    }
});

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{error:string}|{id:string, email:string}>}
 */
export async function login({email, password}) {

    try {
        if (!validEmail(email)) {
            return {error: 'Email invalido', errorType:ERROR_TYPES.EMAIL}
        }

        if (!validPassword(password)) {
            return {error: 'Contraseña invalida', errorType:ERROR_TYPES.PASSWORD}
        }

        const credentials = await signInWithEmailAndPassword(auth, email, password);
        const user = credentials.user;

        return {
            id: user.uid,
            email: user.email,
        };
    } catch (error) {
        console.error("[auth.js login()] Error al autentificar el usuario", error);
        return {error};
    }
}

/**
 * Cierra sesión.
 * @returns {Promise<void>}
 */
export function logout() {
    return signOut(auth);
}

let observer = [];

/**
 * Agrega el callback al stack
 *
 * @param {(user:{id:string|null, email:string|null})=>void} callback
 * @returns {()=>{}} para cancelar la suscripción
 */
export function subscribeToAuth(callback) {
    observer.push(callback);
    notify(callback);
    return () => observer = observer.filter(obs => obs !== callback)
}

/**
 * Notifica a todos los observer de los datos del usuario
 *
 *
 */
export function notifyAll() {
    observer.forEach(callback => notify(callback));
}

/**
 * Notifica el observer de los datos del usuario
 *
 * @param {(user:{id:string|null, email:string|null})=>void} callback
 */
export function notify(callback) {

    callback({...user});
}

/**
 * Crea cuenta
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{id:string, email:string}|{error:string}>}
 */
export async function register({email, password}) {

    try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        const user = credentials.user;
        await createUser(user.uid, {
            email: user.email,
        })
        return {
            id: user.uid,
            email: user.email,
        };
    } catch (error) {
        console.error('firebaseError', error)
        return {error: `(${error})`}
    }
}

/**
 *
 * @param {string} id
 * @param {string} displayName
 * @param {string|null} photoURL
 * @returns {Promise}
 */
export async function updateUserProfile(id, {displayName, photoURL}) {
    try {
        if (!validDisplayName(displayName)) {
            return {error: 'Nombre de usuario invalido'}
        }

        const promise = [];
        let photoPath = user.photoURL;

        if (photoURL) {
            photoPath = user.id + 'avatar.jpg';
            promise.push(uploadFileUsingString(photoPath, photoURL));
        }

        promise.push(updateProfile(auth.currentUser, {displayName, photoURL: photoPath}));
        promise.push(updateUser(id, {displayName, photoURL: photoPath}));

        await Promise.all(promise).then(() => {
            setUser({
                displayName,
            });
            if (photoURL) getFileURL(photoPath).then(url => setUser({photoURL: url}))
        })
        return {}
    } catch (error) {
        return {error}
    }
}

export async function contractService({uid, product}) {
    try {
        await updateDoc(doc(db, 'users', uid), {
                contractedService: product
            }
        );
        
        setUser({contractedService: product})
        
        return {}
    } catch (error) {
        return {error}
    }
}

function setUser(newData) {
    user = {
        ...user,
        ...newData,
    }
    localStorage.setItem('user', JSON.stringify(user));
    notifyAll();
}

function clearUser() {
    user = {
        id: null,
        email: null,
        displayName: null,
        photoURL: null,
    };
    localStorage.removeItem('user');
    notifyAll();
}

function validDisplayName(value) {
    return !!value;
}

function validEmail(value) {
    return !!value;
}

function validPassword(password) {
    return !!password && password.length>=6;
}
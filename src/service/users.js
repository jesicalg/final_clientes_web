import { db } from "./firebase";
import { 
    setDoc, 
    doc, 
    getDoc, 
    updateDoc, 
    getDocs,
    collection,
    query,
    where
} from "firebase/firestore";
import { Collections } from './collections';

/**
 * 
 * @param {string} id 
 * @param {string} email 
 * @return Promise<void>
 */
export function createUser(id, {email}){
    const userRef = doc(db, 'users', id );
    return setDoc(userRef, {
        email
    });
}
/**
 * 
 * @param {string} id 
 * @returns {Promise<{id:string, email:string}>}
 */
export async function getUserById(id){
    const userRef = doc(db, 'users', id);
    const user = await getDoc(userRef);

    if(!user.exists()){
        throw new Error('[user.js getUserById] No existe el usuario con el id provisto')
    }
    return {
        id: user.id, ...user.data()
    }
}

/**
 * 
 * @param {string} id 
 * @param {string|null} displayName
 * @param {string|null} photoURL 
 * @returns {Promise<void>}
 */
export async function updateUser(id,{displayName, photoURL}){
    return updateDoc(
        doc(db, 'users', id),
        {
            displayName,
            photoURL,
        }
    );
}

export async function getClients(){
    try {
        const clientsCollection = collection(db, Collections.USER)
        const clientsQuery = query(clientsCollection,
            where('contractedService', '!=', null)
        )
        const clientsSnapshot = await getDocs(clientsQuery)

        const clients = []
        clientsSnapshot.forEach(docSnap => {
            clients.push({ id: docSnap.id, ...docSnap.data() })
        });

        return { data: clients }
    } catch (error) {
        return { error }
    }
}
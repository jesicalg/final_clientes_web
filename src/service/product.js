import {
    doc,
    addDoc,
    collection,
    getDocs,
    onSnapshot,
    query,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';
import {db} from './firebase.js';
import {Collections} from './collections';
import {getDoc} from 'firebase/firestore';
import {updateUser} from "./users.js";

export async function subscribeToProducts(callback) {
    const productsCollection = collection(db, Collections.PRODUCT_SERVICE);
    const q = query(productsCollection);
    return onSnapshot(q, snapshot => {
        const docs = snapshot.docs.map(doc => {
            return {id: doc.id, ...doc.data()}
        });

        callback(docs);
    });
}

/**
 * Crea el producto valido y lo guarda en firestore
 * @param {string} name
 * @param {string} description
 * @param {string} price
 * @returns {error: string} Si hubo error
 */
export async function createProduct({name, description, price}) {
    try {
        if (!ValidName(name)) {
            return {error: 'El nombre del producto es invalido'}
        }

        if (!ValidDescription(description)) {
            return {error: 'La descripcion del producto es invalido'}
        }

        if (!ValidPrice(price)) {
            return {error: 'El precio del producto es invalido'}
        }

        await addDoc(collection(db, Collections.PRODUCT_SERVICE), {
            name, description, price: Number.parseInt(price)
        })

        return {}
    } catch (error) {
        return {error}
    }
}

export async function updateProduct(product) {
    try {
        if (!ValidName(product.name)) {
            return {error: 'El nombre del producto es invalido'}
        }

        if (!ValidDescription(product.description)) {
            return {error: 'La descripcion del producto es invalido'}
        }

        if (!ValidPrice(product.price)) {
            return {error: 'El precio del producto es invalido'}
        }

        const productRef = doc(db, Collections.PRODUCT_SERVICE, product.id)
        delete product.id;
        product.price = Number.parseInt(product.price)
        
        await updateDoc(productRef, {...product})
        return {}
    } catch (error) {
        return {error}
    }
}

export async function deleteProduct({id}) {
    try {
        const productRef = doc(db, Collections.PRODUCT_SERVICE, id)
        await deleteDoc(productRef)
        return {}
    } catch (error) {
        return {error}
    }
}

export async function getProduct({id}) {
    try {
        const productRef = doc(db, Collections.PRODUCT_SERVICE, id)
        const productSnapshot = await getDoc(productRef)
        const product = productSnapshot.data()
        product.id = id
        return {data: product}
    } catch (error) {
        return {error}
    }
}

export async function getProducts() {
    try {
        const productRef = collection(db, Collections.PRODUCT_SERVICE)
        const productsSnapshot = await getDocs(productRef)

        const products = []
        productsSnapshot.forEach(docSnap => {
            products.push({id: docSnap.id, ...docSnap.data()})
        });

        return {data: products}
    } catch (error) {
        return {error}
    }
}

function ValidName(value) {
    return !!value
}

function ValidDescription(value) {
    return !!value
}

function ValidPrice(value) {
    const parseValue = Number.parseInt(value)
    return !Number.isNaN(parseValue) && parseValue > 0
}
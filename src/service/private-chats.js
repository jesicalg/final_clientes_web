import {db} from './firebase.js';
import {
    doc,
    addDoc,
    collection,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    where
} from 'firebase/firestore';

const cache = {};

/**
 *
 * @param {string} from
 * @param {string} to
 * @param {(data:{userId:string, message:string, created_at:date|null}[])=>void} callback
 * @returns {Promise<Unsuscribe>}
 */
export async function subscribeToPrivateChat(from, to, callback) {
    const docRef = await getPrivateChatRef(from, to);
    const messageCollection = collection(db, 'private-chats', docRef.id, 'messages');

    const q = query(
        messageCollection,
        orderBy('created_at')
    );
    return onSnapshot(q, snapshot => {
        const docs = snapshot.docs.map(doc => {
            return {
                userId: doc.data().userId,
                message: doc.data().message,
                created_at: doc.data().created_at?.toDate(),
            }
        });
        callback(docs);
    });
}

/***
 * Envia el nuevo mensaje al destinatario
 * @param from
 * @param to
 * @param message
 * @returns {Promise<{error}|{}>}
 */
export async function sendPrivateMessage(from, to, message) {
    try {
        if(!_validMessage(message)){
            return {error: 'El mensaje no puede estar vacio'}
        }
        
        const docRef = await getPrivateChatRef(from, to)
        const messagesRef = collection(db, 'private-chats', docRef.id, 'messages');
        const messageRef = await addDoc(messagesRef, {
            userId: from,
            message,
            created_at: serverTimestamp(),
        })

        return {}
    } catch (error) {
        return {error}
    }
}

export async function getSupportUser() {
    try {
        const userRef = collection(db, "users");
        const snapshotUserSupport = await getDocs(query(userRef,
                where("role", "==", "admin")),
            orderBy("currentIssuesCount", "desc",
                limit(1))
        );

        if (snapshotUserSupport.size > 0) {
            return {data: {id: snapshotUserSupport.docs[0].id, ...snapshotUserSupport.docs[0].data()}}
        }

        return {};
    } catch (error) {
        console.error('getSupportUser', error);
        return {error}
    }
}

/**
 *
 * @param {string} user1
 * @param {string} user2
 * @returns {Promise<QueryDocumentSnapshot<DocumentData>|DocumentReference<(users:{}|{})>>}
 */
async function getPrivateChatRef(user1, user2) {

    const cacheRef = getFromCache(user1, user2);

    if (cacheRef) return cacheRef;

    const chatRef = await searchPrivateChat(user1, user2) || await createPrivateChat(user1, user2);

    addToCache(user1, user2, chatRef);
    return chatRef
}

/**
 *
 * @param {string} user1
 * @param {string} user2
 * @returns
 */
async function searchPrivateChat(user1, user2) {
    const users = {
        [user1]: true,
        [user2]: true,
    }
    const q = query(
        collection(db, 'private-chats'),
        where('users', '==', users),
        limit(1),
    );

    const chatSnap = await getDocs(q);

    return !chatSnap.empty ? chatSnap.docs[0] : null;
}

/**
 *
 * @param {string} user1
 * @param {string} user2
 * @returns
 */
async function createPrivateChat(user1, user2) {
    return await addDoc(collection(db, 'private-chats'), {
        users: {
            [user1]: true,
            [user2]: true,
        }
    });
}

/**
 *
 * @param {string} from
 * @param {string} to
 * @returns {string}
 */
function getCacheKey(from, to) {
    return from < to ?
        from + to :
        to + from;
}

/**
 *
 * @param {string} from
 * @param {string} to
 * @returns {*}
 */
function getFromCache(from, to) {

    return cache[getCacheKey(from, to)] || null;
}

/**
 *
 * @param {string} from
 * @param {string} to
 * @param {{}} ref
 */
function addToCache(from, to, ref) {
    cache[getCacheKey(from, to)] = ref;
}

function _validMessage(value){
    return !!value
}
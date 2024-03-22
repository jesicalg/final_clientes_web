import { ref } from "vue";
import { getUserById } from "../service/users.js";
import { getFileURL } from "../service/storage.js";


export function useUser(id){
    const user = ref({
        id:null,
        user:null,
        displayName:null,
        photoURL:null,
    });
    const loading = ref(true);

    loadUser();

    async function loadUser(){
        const userData = await getUserById(id);
        user.value = userData;
        user.value.photoURL = await getFileURL(userData.photoURL);
        loading.value = false;
    }
    
    return{
        user,
        loading
    }
}

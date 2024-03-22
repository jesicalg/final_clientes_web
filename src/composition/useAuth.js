import { onMounted, onUnmounted, ref } from 'vue';
import {subscribeToAuth } from '../service/auth.js';

/**
 * subscribe al usuario
 * @returns {user}
 */
export function useAuth(){
    const user = ref({
        id:null,
        email:null,
        displayName:null,
        photoURL:null,
        role: null,
        currentIssue: null,
        contractedService: null
    })
    
    let unsubscribe = () => {}
    
    onMounted(()=>{
        unsubscribe = subscribeToAuth(newUser=>{
            user.value=newUser
        });
    });

    onUnmounted(()=>{
        unsubscribe();
    });

    return{
        user,
    }
}
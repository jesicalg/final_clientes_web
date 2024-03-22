<script setup>

import V_Button from '../components/V_Button.vue';
import V_Label from '../components/V_Label.vue';
import V_Input from '../components/V_Input.vue';
import {login, ERROR_TYPES} from '../service/auth.js'
import {inject, onUnmounted, ref} from 'vue';
import { useRouter } from 'vue-router';
import {notificationProvider} from "../symbols/symbols.js";


const { feedback, setFeedbackMessage, clearFeedbackMessage } = inject(notificationProvider)

const {fields, loading,formError, handleSubmit} = useLogin();

function useLogin(){
    const router = useRouter();
    const fields = ref({
        email:'',
        password:'',
    });
    const loading = ref(false);
    const formError = ref('')
    
    onUnmounted(()=>{
      clearFeedbackMessage();
    })
    
    async function handleSubmit(){
        loading.value = true;
        
        const response = await login({
            ...fields.value,
        })

        if(response.error){
            console.error(response)
            formError.value = response.errorType;
            loading.value = false;
            setFeedbackMessage({
              type: 'error',
              message: `Ocurrio un error al iniciar sesión. (${response.error})`,
            })
            return;
        }

        loading.value = false;
        router.push('/');    
    }

    return{
        fields,
        loading,
        formError,
        handleSubmit,
    }
}
</script>
<template>
    <h1 class="text-4xl mb-4">Iniciar sesion</h1>

    <form 
        action="#"
        method="post"
        @submit.prevent="handleSubmit"
        >
        <V_Label for="email">Email: </V_Label>
        <V_Input 
            :class="formError === ERROR_TYPES.EMAIL? 'border-2 border-red-800 shadow-inner shadow-red-500/50':''"
            type="email" 
            name="email" 
            id="email" 
            placeholder="email"
            v-model="fields.email"
            />
        <p class=" text-red-600 text-xs py-2" v-if="formError === ERROR_TYPES.EMAIL">Email no valido</p>
        <V_Label for="password">Contraseña: </V_Label>
        <V_Input 
            :class="formError === ERROR_TYPES.PASSWORD? 'border-2 border-red-800 shadow-inner shadow-red-500/50':''"
            type="password" 
            name="password" 
            id="password" 
            placeholder="contraseña"
            v-model="fields.password"
        />
        <p class="text-red-600 text-xs py-2" v-if="formError === ERROR_TYPES.PASSWORD">Contraseña no valida</p>
        <V_Button full>Ingresar</V_Button>
    </form>
</template>
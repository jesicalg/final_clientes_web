<script setup>
import V_Label from '../components/V_Label.vue';
import V_Button from '../components/V_Button.vue';
import V_Input from '../components/V_Input.vue';
import V_Image from '../components/V_Image.vue'
import { useAuth } from '../composition/useAuth';

import {inject, onUnmounted, ref, watch} from 'vue';
import { notificationProvider } from '../symbols/symbols';
import { updateUserProfile } from '../service/auth.js'

const { user } = useAuth();
const { form, loading, handleSubmit, handleFile } = useEditProfile(user)
const { feedback, setFeedbackMessage, clearFeedbackMessage } = inject(notificationProvider)

onUnmounted(()=>{
  clearFeedbackMessage()
})

function useEditProfile(user) {
    const form = ref({
        displayName: '',
        photoURL: null,
    });
    const loading = ref(false);

    watch(user, newUser => {
        form.value.displayName = newUser.displayName;

    });

    async function handleSubmit() {
        loading.value = true;
        
        clearFeedbackMessage();
        const response = await updateUserProfile(user.value.id, {
            ...form.value,
        });

        if (response.error) {
            console.error('handleSubmit', response.error)
            setFeedbackMessage({
                type: 'error',
                message: 'Ocurrió un error inesperado al tratar de actualizar la información de tu perfil. (' + response.error + ')' ,
            })
            return;
        }

        loading.value = false;
        form.value.photoURL = null;
        setFeedbackMessage({
            type: 'success',
            message: 'La información de tu perfil fue actualiza con éxito.',
        });
    }
    async function handleFile(ev) {
        const file = ev.target.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', () => {
            form.value.photoURL = reader.result;
        })
        reader.readAsDataURL(file)
    }

    return {
        form,
        loading,
        handleSubmit,
        handleFile,
    }
}
</script>
<template>
    <div>
        <div>
            <V_Image :src="user.photoURL" class="rounded-full object-cover object-center aspect-square w-36 bg-slate-800"/>
        </div>
        <div>
            <form action="#" method="post" @submit.prevent="handleSubmit">
                <div class="mb-4">
                    <V_Label for="displayName">Nombre del usuario</V_Label>
                    <V_Input id="displayName" v-model="form.displayName" />
                </div>
                <div class="mb-4">
                    <V_Label for="photoURL">Foto de Perfil</V_Label>
                    <V_Input type="file" id="photoURL" @change="handleFile" />
                </div>
                <div v-if="form.photoURL !== null" class="mb-4">
                    <p class="mb-1">Previsualizacion</p>
                    <img :src="form.photoURL" alt="">

                </div>
                <V_Button>

                    Actualizar los datos
                </V_Button>

            </form>
        </div>
    </div>
</template>
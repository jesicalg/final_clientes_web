<script setup>
import V_LoadingContext from '../components/V_LoadingContext.vue';
import {useRoute} from 'vue-router'
import {useUser} from '../composition/useUser.js'
import { PATHS } from '../router/router.js'
const route = useRoute(); 
const {user, loading} =useUser(route.params.id);

</script>
<template>
    <V_LoadingContext :loading="loading">
        <h1 class=" text-4xl ">Perfil de {{ user.email }}</h1>
        <h2>Chat privado</h2>
        <router-link 
            :to="PATHS.PRIVATE_CHAT + '/' + user.id"
            class="text-blue-400 underline"
        >Iniciar chat privado con {{ user.email }}</router-link>
    </V_LoadingContext>

</template>
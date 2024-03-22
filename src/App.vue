<script setup>

import V_Notification from './components/V_Notification.vue'
import {logout} from './service/auth';
import {useRouter} from 'vue-router';
import {useAuth} from './composition/useAuth.js';
import {provide, ref} from 'vue';
import {notificationProvider} from './symbols/symbols.js'
import {PATHS} from "./router/router.js";
import V_Image from './components/V_Image.vue';
import imgLogo from './assets/imgs/logo.svg'

const {user} = useAuth();
const {handleLogout} = useLogout();

const feedback = ref({
  message: '',
  type: '',
  title: '',
  closable: true,
})

function setFeedbackMessage({message, type = 'success', title = ''}) {
  feedback.value = {
    ...feedback.value,
    message,
    type,
    title,
  }
}
function clearFeedbackMessage() {
  feedback.value = {
    ...feedback.value,
    message: '',
    type: '',
    title: '',
  };
}

provide(notificationProvider, {
  feedback,
  setFeedbackMessage,
  clearFeedbackMessage,
});

function useLogout() {

  const router = useRouter();

  return {
    handleLogout() {
      logout();
      router.push({path: '/iniciar-sesion'});
    }
  }
}

</script>
<template>
  <div class="bg-gray-900 md:grid  grid-rows-app min-h-full">
    <nav class="sm:flex justify-between p-4 bg-gray-400 bg-opacity-30 text-gray-100 items-center">
      <router-link class="text-2xl" :to="PATHS.HOME"> <V_Image class=" w-52" :src="imgLogo" :alt="`Superserver`"/> </router-link>
      <ul class="sm:flex gap-4">
        <li>
          <router-link class="block py-2 sm:p-0" :to="PATHS.HOME">Home</router-link>
        </li>
        <li v-if="user.role !== 'admin'">
          <router-link class="block py-2 sm:p-0" to="/hostings">Web Hostings</router-link>
        </li>
        <template v-if="user.id !== null">
          <li>
            <router-link class="block py-2 sm:p-0" :to="PATHS.PROFILE">Mi perfil</router-link>
          </li>
          <li v-if="user.role === 'admin'">
            <router-link class="block py-2 sm:p-0" :to="PATHS.CONTROL_PANEL">Panel de control</router-link>
          </li>
          <li>
            <form action="#" method="post" @submit.prevent="handleLogout">
              <button type="submit">{{ user.email }}(Cerrar Sesión)</button>
            </form>
          </li>
        </template>
        <template v-else>
          <li>
            <router-link class="block py-2 sm:p-0" :to="PATHS.LOGIN">Iniciar Sesión</router-link>
          </li>
          <li>
            <router-link class="block py-2 sm:p-0" :to="PATHS.SING_IN">Registrar</router-link>
          </li>
        </template>
      </ul>
    </nav>
    <main class="container h-full m-auto p-4  text-white">
      <V_Notification :data="feedback" @close="clearFeedbackMessage"/>
      <router-view/>
    </main>
    <footer class="flex flex-col justify-center items-center bg-green-neon  text-white h-[150px] ">
      <V_Image class="w-48" :src="imgLogo" :alt="`Superserver`"/>
      <p class=" text-xs">&#169;Superserver</p>
    </footer>
  </div>
</template>
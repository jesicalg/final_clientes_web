<script setup>
import V_UserProfileForm from "../components/V_UserProfileForm.vue";
import V_Button from "../components/V_Button.vue";
import V_UserProfileData from "../components/V_UserProfileData.vue";
import V_Link from "../components/V_Link.vue";
import {useAuth} from "../composition/useAuth.js";
import {getSupportUser} from '../service/private-chats'
import {onMounted, ref} from "vue";
import {PATHS} from '../router/router.js'
import V_CardProductService from "../components/V_CardProductService.vue";
import {getClients} from "../service/users.js";

const {user} = useAuth();
const editing = ref(false);
const toggleEditing = () => editing.value = !editing.value;
const {availableSupport, loading} = useProfile();

function useProfile() {
  const availableSupport = ref(null);
  const loading = ref(false);

  onMounted(() => {
    handleGetClients();
  });

  async function handleGetClients() {
    loading.value = true;
    const response = await getSupportUser();
    
    if (response.error) {
      console.error(response.error)
      loading.value = false;
      return;
    }
    
    availableSupport.value = response.data.id;
    loading.value = false;
  }

  return {
    availableSupport,
    loading
  }
}



</script>
<template>
  <h1 class="text-3xl font-bold mb-4">Mi Perfil</h1>
  <div class="md:flex flex-wrap">
    <div class="md:w-1/3">
      <div class="mb-4">
        <V_Button @click="toggleEditing">{{ editing ? "Dejar de Editar" : "Editar mi Perfil" }}</V_Button>
      </div>
      <template v-if="editing">
        <V_UserProfileForm/>
      </template>
      <template v-else>
        <V_UserProfileData :user="user"/>
      </template>
    </div>
    <div class="md:w-2/3 md:ps-8">
      <template v-if="user.role !== 'admin'">
        <template v-if="user.currentIssue != null">
          <V_Link :route="PATHS.PRIVATE_CHAT + '/' + user.currentIssue">
            Retomar Chat de soporte
          </V_Link>
        </template>
        <template v-else-if="availableSupport">
          <V_Link :route="PATHS.PRIVATE_CHAT + '/' + availableSupport">
            Iniciar nuevo chat de soporte
          </V_Link>
        </template>
        <template v-if="user.contractedService">
          <h2 class="font-bold text-2xl mb-4">Servicio contratado</h2>
          <V_CardProductService :viewMode="true" :product="user.contractedService"
                                class="md:w-1/2"></V_CardProductService>
        </template>
      </template>
    </div>
  </div>
</template>
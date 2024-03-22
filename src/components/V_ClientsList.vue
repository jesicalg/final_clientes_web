<script setup>
import {getClients} from '../service/users.js'
import {ref, onMounted} from 'vue'
import V_ClientRow from './V_ClientRow.vue'

const {clients, loading} = useRegister();

function useRegister() {
  const clients = ref([]);
  const loading = ref(false);

  onMounted(() => {
    handleGetClients();
  });

  async function handleGetClients() {
    loading.value = true;
    const response = await getClients();
    if (response.error) {
      console.error(response.error)
      loading.value = false;
    }

    clients.value = response.data;
    loading.value = false;
  }

  return {
    clients,
    loading
  }
}
</script>
<template>
  <h2 class="text-3xl font-bold my-6 text-center md:text-left">Clientes</h2>
  <div class="border border-gray-300  rounded-2xl px-4">
    <template v-for="client of clients">
      <V_ClientRow :client="client"></V_ClientRow>
    </template>
  </div>
</template>
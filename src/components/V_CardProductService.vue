<script setup>
import V_Button from '../components/V_Button.vue'
import {useAuth} from '../composition/useAuth.js'
import V_ButtonLink from '../components/V_ButtonLink.vue'
import {PATHS} from '../router/router.js';



const {user} = useAuth();

defineEmits(['contract'])

defineProps({
  product: {
    type: Object,
    default: {
      name: null,
      description: null,
      price: null
    },
  },
  loading: {
    type: Boolean,
    default: false
  },
  viewMode:{
    type: Boolean,
    default: false
  }
})

</script>
<template>
  <div
      class=" hover:shadow-lg hover:opacity-100 rounded-xl  border-2 border-gray-100 flex flex-col items-center p-4 opacity-90 ">
    <h3 class="font-bold text-2xl">{{ product.name }}</h3>
    <p class="text-xl"><span class="font-bold">AR$</span> {{ product.price }}</p>
    <p>{{ product.description }}</p>
  <template v-if="user.id">
    <V_Button v-if="!viewMode" :loading="loading" @click="$emit('contract')" class="mt-10">Contratar</V_Button>
  </template>
  <template v-else>
    <V_ButtonLink :route="PATHS.SING_IN">Contratar</V_ButtonLink>
  </template>
  </div>
</template>
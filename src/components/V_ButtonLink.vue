<script setup>
defineProps({
  route: {
    type: String,
    default: '',
  },
  back: {
    type: Boolean,
    default: false,
  }
})
</script>
<template>
  <router-link v-if="!back" :to="route" 
    class="bg-green-neon transition-colors text-white p-2 hover:bg-blue-400 focus:bg-blue-400 active:bg-blue-800 rounded mt-2">
    <slot>V_Link</slot>
  </router-link>
  <a v-else 
    class="bg-green-neon transition-colors text-white p-2 hover:bg-blue-400 focus:bg-blue-400 active:bg-blue-800 rounded mt-2" 
    @click="$router.go(-1)">
      <slot>V_Link</slot>
  </a>
</template>
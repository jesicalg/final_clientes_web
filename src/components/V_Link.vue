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
  <router-link v-if="!back" :to="route" class="text-blue-400 underline">
    <slot>V_Link</slot>
  </router-link>
  <a v-else class="text-blue-400 underline cursor-pointer" @click="$router.go(-1)"><slot>V_Link</slot></a>
</template>
<script setup>
import V_Image from './V_Image.vue';
import V_Button from './V_Button.vue';

defineEmits(['close', 'confirmed'])

defineProps({
  tittle: {
    type: String,
    default: 'N/A',
  },
  description: {
    type: String,
    default: 'N/A'
  },
  buttonName: {
    type: String,
    default: 'N/A'
  },
  icon: {
    type: String,
    default: null
  }
})

</script>
<template>
  <div class="bg-opacity-50 bg-black fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center">
    <div class="w-1/3 shadow  bg-gray-950 text-white rounded-3xl flex flex-col justify-evenly items-center p-4">
      <button
          @click="$emit('close')"
          type="button"
          class="px-2 text-2xl self-end hover:text-yellow-400"
      >&times;
      </button>
      <h3 class="text-xl font-bold text-center">{{ tittle }}</h3>
      <h4>{{ description }}</h4>
      <V_Image :src="icon" class="border-blue-500 max-w-full invert"/>
      <V_Button @click="$emit('confirmed')" class="bg-yellow-600 hover:bg-yellow-400">
        {{ buttonName }}
      </V_Button>
    </div>
  </div>
</template>
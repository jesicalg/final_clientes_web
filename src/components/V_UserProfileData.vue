
<script setup>
import V_Image from "./V_Image.vue";

defineProps({
    user:{
        type: Object,
        required:true,
    }
})
</script>
<template>
    <div>
        <div>
            <V_Image :src="user.photoURL" class="rounded-full object-cover object-center aspect-square w-36 bg-slate-800 "/>
        </div>
        <div>            
            <p class="text-lg font-bold">{{ user.displayName || 'No especificado' }}</p>
        </div>
    </div>
</template>
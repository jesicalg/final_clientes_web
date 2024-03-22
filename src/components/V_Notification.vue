<script setup>
import { computed, ref } from 'vue';
defineEmits(['close'])
const props = defineProps({
    data:{
        type:Object,
        required:true,
    }
});
const notificationClasses = computed(()=>{
    switch (props.data.type) {
        case 'success':
            return 'bg-green-800';
        case 'error':
            return 'bg-red-800';
    
        default:
            return 'bg-cyan-800';
    }
});
</script>
<template>
    <div
        v-if="data.message !==''"
        class="p-4 mb-4 rounded"
        :class="notificationClasses"
    >
        <div class="flex justify-between items-center">
            <div>{{ data.message }}</div>
            <button
                v-if="data.closable"
                type="button"
                class="px-2 text-2xl"
                @click="$emit('close')"
            >&times;</button>
        </div> 
    </div>
</template>
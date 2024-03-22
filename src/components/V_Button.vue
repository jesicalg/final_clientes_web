<script setup>
import V_LoadingContext from './V_LoadingContext.vue'
defineProps({
    full: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    }
})
</script>

<template>
    <button type="submit"
        class="bg-green-neon transition-colors text-white p-2 hover:bg-blue-400 focus:bg-blue-400 active:bg-blue-800 rounded mt-2"
        :class="{
            'w-full': full,
        }" :disabled="loading">
        <V_LoadingContext :loading="loading">
            <slot>Enviar</slot>
        </V_LoadingContext>
    </button>
</template>
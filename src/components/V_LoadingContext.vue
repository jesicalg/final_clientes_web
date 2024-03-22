<script setup>
import V_Loader from './V_Loader.vue';
defineProps({
    loading:{
        type:Boolean,
        default:false,
    }
});
</script>
<template>
    <template v-if="!loading">
        <slot/>
    </template>
    <template v-else>
        <V_Loader/>
    </template>
</template>
<script setup>
import {computed} from 'vue';
import defaultImg from '../assets/imgs/not-image.svg';

const props = defineProps({
    src: {
        required: true,
    },

    alt: {
        type: String,
        default: '',
    }
});

const showSrc = computed(() => props.src != null && props.src !== '' ? props.src : defaultImg);
</script>

<template>
    <img
        :src="showSrc"
        :alt="alt"
    />
</template>
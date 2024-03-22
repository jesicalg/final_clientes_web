
<script setup>
defineProps(['modelValue']);
defineEmits(['update:modelValue']);
</script>
<template>
    <textarea 
        class=" border border-gray-400 rounded p-2 w-full text-slate-800"
        :value="modelValue"
        @input="$emit('update:modelValue',$event.target.value)"
    ></textarea>
</template>
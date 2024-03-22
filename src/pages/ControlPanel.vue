<script setup>
import V_ProductServiceABM from '../components/ProductService/V_ProductServiceABM.vue';
import V_ClientsList from '../components/V_ClientsList.vue'
import {ref} from "vue";

const CONTROL = {
  ABM_PRODUCTS: 'ABM_PRODUCTS',
  CLIENTS: 'CLIENTS'
}

const currentControl = ref(CONTROL.ABM_PRODUCTS)

</script>
<template>
    <div class="md:flex">
        <nav class="border-b md:border-b-0 md:border-r border-white pe-4">
            <ul>
                <li class="py-2 cursor-pointer" @click="()=>{currentControl = CONTROL.ABM_PRODUCTS}">Gestion de productos</li>
                <li class="py-2 cursor-pointer" @click="()=>{currentControl = CONTROL.CLIENTS}">Clientes</li>
            </ul>
        </nav>
        <div class="md:flex-1 ps-4">
            <V_ProductServiceABM v-if="currentControl === CONTROL.ABM_PRODUCTS"></V_ProductServiceABM>
            <V_ClientsList v-if="currentControl === CONTROL.CLIENTS"></V_ClientsList>
        </div>
    </div>
</template>
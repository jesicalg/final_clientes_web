<script setup>
import { PATHS } from '../../router/router.js'
import V_ProductDelete from "./V_ProductDelete.vue";
import V_ButtonLink from "../V_ButtonLink.vue";

defineProps({
  product: {
    type: Object,
    default: {
      name: null,
      description: null,
      price: null
    },
  }
})

</script>
<template>
  <li class="border-b md:flex p-4 justify-between">
    <p class="flex-1 font-bold md:font-normal md:px-4 self-center justify-self-center"><span>{{ product.name }}</span></p>
    <p class="flex-1 md-px-4 self-center justify-self-center w-80 whitespace-nowrap overflow-hidden text-ellipsis"> <span>{{ product.description }}</span>
    </p>
    <p class="flex-1 md-px-4 self-center justify-self-center"><span>$ {{ product.price }}</span></p>
    <V_ButtonLink class="me-3" :route="PATHS.EDIT_PRODUCT_FORM + '/' + product.id">Editar</V_ButtonLink>
    <V_ProductDelete :product="product"></V_ProductDelete>
  </li>
</template>
<script setup>
import V_ProductRow from './V_ProductRow.vue';
import V_ButtonLink from '../V_ButtonLink.vue';
import V_ProductDelete from './V_ProductDelete.vue';
import {subscribeToProducts} from '../../service/product.js'
import {ref, onMounted, onUnmounted} from 'vue'
import {PATHS} from '../../router/router.js'

const {products, loading} = userProductsListener();

function userProductsListener() {
  const products = ref([]);
  const loading = ref(false);

  let unsubscribe = () => {};

  onMounted(() => {
    setSubscription();
  });

  async function setSubscription() {
    unsubscribe = await subscribeToProducts(
        ps => {
          products.value = ps
        }
    );
    onUnmounted(() => {
      unsubscribe();
    });
  }
  
  return {
    loading,
    products,
  }
}

</script>
<template>
  <h2 class="text-3xl font-bold my-6 text-center md:text-left">Administración de servicios</h2>
  <V_ButtonLink :route="PATHS.NEW_PRODUCT_FORM">Nuevo</V_ButtonLink>
  <ul class="mt-6">
    <template v-for="product of products">
      <V_ProductRow :product=product>
        Producto
      </V_ProductRow>
    </template>
  </ul>
</template>
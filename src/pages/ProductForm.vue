<script setup>
import V_Input from '../components/V_Input.vue'
import V_Label from '../components/V_Label.vue'
import V_Link from '../components/V_Link.vue'
import V_Button from '../components/V_Button.vue'
import { useRoute, useRouter } from 'vue-router'
import {ref, onMounted, inject, onUnmounted} from 'vue'
import { createProduct, updateProduct, getProduct } from '../service/product.js'
import V_ButtonLink from "../components/V_ButtonLink.vue";
import {notificationProvider} from "../symbols/symbols.js";

const { feedback, setFeedbackMessage, clearFeedbackMessage } = inject(notificationProvider)
const router = useRoute();
const id = router.params.id;
const buttonConfirmMessage = id ? 'Confirmar Cambios' : 'Crear';

const {fields, loading, handleSubmit} = useRegister();

function useRegister() {
  const router = useRouter();
  const fields = ref({
    id: id,
    name: null,
    description: null,
    photo: null,
    price: 0
  });
  const loading = ref(false);
  
  if (id) {
    onMounted(() => {
      handleGetProduct();
    });
  }

  onUnmounted(()=>{
    clearFeedbackMessage()
  })
  
  async function handleSubmit() {
    clearFeedbackMessage()
    loading.value = true;
    
    setTimeout(async () => {
      const handleMethod = id ? updateProduct : createProduct;
      const response = await handleMethod({
        ...fields.value,
      })

      if (response.error) {
        console.error(response.error);
        setFeedbackMessage({
          type: 'error',
          message: `Ocurrio un error al confirmar los cambios. (${response.error})`,
        })
        loading.value = false;
        return
      }

      loading.value = false;
      router.push('/panel-control');
    }, 1000)
  }

  async function handleGetProduct() {
    loading.value = true;
    const response = await getProduct({id});
    if(response.error){
      console.error(response.error)
      loading.value = false;
    }

    fields.value.name = response.data.name;
    fields.value.description = response.data.description;
    fields.value.price = response.data.price;    

    loading.value = false;
  }

  return {
    fields,
    loading,
    handleSubmit,
  }
}

</script>
<template>
  <form action="#" method="post" @submit.prevent="handleSubmit">
    <V_Label for="product-name-id">Nombre</V_Label>
    <V_Input 
      id="product-name-id" 
      type="text"
      name="name"
      v-model="fields.name"
    />
    <V_Label for="product-name-id">Descripción</V_Label>
    <V_Input 
      id="product-name-id" 
      type="text" 
      name="description"
      v-model="fields.description"
    />
    <V_Label for="product-name-id">Precio</V_Label>
    <V_Input 
      id="product-name-id" 
      type="number" 
      name="price"
      v-model="fields.price"
    />
    <V_ButtonLink class="me-2" back>Cancelar</V_ButtonLink>
    <V_Button :loading="loading">
        {{ buttonConfirmMessage }}
    </V_Button>
  </form>
</template>
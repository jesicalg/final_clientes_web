<script setup>
import V_Button from '../V_Button.vue';
import deleteImg from '../../assets/imgs/delete_img.svg';
import V_Modal from "../V_Modal.vue";
import {ref} from "vue";
import {deleteProduct} from "../../service/product.js";

defineProps({
  product: {
    type: Object,
    default: {
      name: 'N/A',
      description: 'N/A',
      price: 'N/A'
    },
  }
})

const {loading, showAnswer, handleDelete, deleteAnswer, closeAnswer} = useRegister();

function useRegister() {
  const loading = ref(false)
  const showAnswer = ref(false)

  const deleteAnswer = () => showAnswer.value = true
  const closeAnswer = () => showAnswer.value = false

  async function handleDelete(product) {
    loading.value = true;

    const response = await deleteProduct({id: product.id})

    if (response.error) {
      console.error(response.error)
      loading.value = false;
    }

    loading.value = false;
  }

  return {
    loading,
    showAnswer,
    handleDelete,
    deleteAnswer,
    closeAnswer
  }
}


</script>
<template>
  <V_Button :loading="loading" @click="deleteAnswer">
    Eliminar
  </V_Button>
  <V_Modal v-if="showAnswer"
           tittle="¿Estás seguro de que deseas eliminarlo?"
           :description="product.name"
           :icon="deleteImg"
           button-name="Eliminar"
           @close="closeAnswer"
           @confirmed="()=>{handleDelete(product)}"
  ></V_Modal>
</template>
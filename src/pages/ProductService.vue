<script setup>
import V_Image from '../components/V_Image.vue'
import bgPricing from '../assets/imgs/bg-pricingpage.png'
import V_CardProductService from '../components/V_CardProductService.vue';
import {inject, onMounted, onUnmounted, ref} from "vue";
import { subscribeToProducts} from "../service/product.js";
import {useAuth} from "../composition/useAuth.js";
import {contractService} from "../service/auth.js";
import {notificationProvider} from "../symbols/symbols.js";

const { feedback, setFeedbackMessage, clearFeedbackMessage } = inject(notificationProvider)
const {products, loading, selectedPlan, handleContract} = userProductsListener();
const {user} = useAuth()

onUnmounted(()=>{
  clearFeedbackMessage()
})

function userProductsListener() {
  const products = ref([]);
  const loading = ref(false);
  const selectedPlan = ref(null);

  let unsubscribe = () => {};

  onMounted(() => {
    setSubscription();
  });

  async function handleContract({uid, product}) {
    clearFeedbackMessage();
    
    loading.value = true;
    selectedPlan.value = product.id;

    const response = await contractService({uid, product})
    if (response.error) {
      console.error('Error al contratar el servicio', response.error)

      setFeedbackMessage({
        type: 'error',
        message: `Ocurrio un error al contratar el servicio. (${response.error})`,
      })
      
      loading.value = false;
      selectedPlan.value = null
      return
    }
    
    setFeedbackMessage({
      type: 'success',
      message: `¡Bienvenido/a a SuperServer!.`,
    })

    loading.value = false;
  }

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
    selectedPlan,
    handleContract
  }
}

</script>
<template>
  <div class="md:flex md:items-center">
    <div class="md:w-2/4">
      <h1 class="font-bold text-3xl pb-6">El hosting que la rompe: La mejor elección para tu sitio web</h1>
      <p>En Superserver, estamos comprometidos con la excelencia en el hosting. Nos esforzamos por superar tus
        expectativas y brindarte una experiencia excepcional que te permita impulsar tu negocio en línea de manera
        exitosa.
      </p>
    </div>
    <div class="md:w-2/4">
      <V_Image :src="bgPricing" class="w-full max-w-md m-auto"/>
    </div>
  </div>
  <div class="bg-circle-2 bg-center bg-contain bg-no-repeat  py-20">
    <h2 class="font-bold text-3xl pb-6  mb-6">Planes y Precios</h2>
    <div class="md:flex md:gap-4">
      <template v-for="product of products">
        <V_CardProductService class="md:w-1/3 md:ps-8" :product="product" :loading="loading && selectedPlan === product.id"
                              @contract="()=>{handleContract({uid:user.id, product})}"></V_CardProductService>
      </template>
    </div>
  </div>
</template>
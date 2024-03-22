<script setup>
import V_LoadingContext from '../components/V_LoadingContext.vue';
import {useRoute} from 'vue-router'
import {useUser} from '../composition/useUser.js'
import {useAuth} from '../composition/useAuth';
import {inject, onMounted, onUnmounted, ref, watch} from 'vue';
import {dateToString} from "../helpers/date.js";
import V_Textarea from '../components/V_Textarea.vue';
import V_Button from '../components/V_Button.vue'
import V_Label from '../components/V_Label.vue'
import {sendPrivateMessage, subscribeToPrivateChat, getSupportUser} from '../service/private-chats.js'
import {notificationProvider} from "../symbols/symbols.js";

const route = useRoute();
const {user: otherUser, loading} = useUser(route.params.id);
const {user: authUser} = useAuth();
const {handleSubmit, fields, formLoading} = usePrivateChatForm(authUser, otherUser);
const {messages, loading: loadingMessages} = usePrivateChat(authUser, otherUser);
const {feedback, setFeedbackMessage, clearFeedbackMessage} = inject(notificationProvider)

onUnmounted(() => {
  clearFeedbackMessage()
})

function usePrivateChat(authUser, otherUser) {
  const loading = ref(true);
  const messages = ref([]);

  let unsubscribe = () => {
  };

  watch(otherUser, newOtherUser => {
    if (newOtherUser.id != null) {
      setSubscription();
    }
  });

  async function setSubscription() {
    unsubscribe = await subscribeToPrivateChat(
        authUser.value.id,
        otherUser.value.id,
        newMessages => {
          messages.value = newMessages;
          loading.value = false;
        }
    );
  }

  onUnmounted(() => {
    unsubscribe();
  });

  return {
    loading,
    messages,
  }
}

function usePrivateChatForm(authUser, otherUser) {
  const formLoading = ref(false);
  const fields = ref({
    message: '',
  });

  async function handleSubmit() {
    clearFeedbackMessage()
    formLoading.value = true;

    const response = await sendPrivateMessage(authUser.value.id, otherUser.value.id, fields.value.message);

    if (response.error) {
      formLoading.value = false;
      console.error("[PrivateChat] ", response.error);
      setFeedbackMessage({
        type: 'error',
        message: `No se pudo enviar el mensaje. (${response.error})`,
      })
      return
    }

    formLoading.value = false;
    fields.value.message = '';
  }

  return {
    formLoading,
    fields,
    handleSubmit,
  }
}
</script>
<template>
  <V_LoadingContext :loading="loading">
    <h1 class="mb-4 text-3xl font-bold">Chat privado con {{ otherUser.displayName }}</h1>

    <div class="mb-3 bg-white bg-opacity-20 rounded-2xl p-2 md:p-6">
      <V_LoadingContext :loading="loadingMessages">
        <ul>
          <li
              v-for="message in messages"
              class="mb-3"
              :class="{'text-end': message.userId === authUser.id}"
          >
            <p v-if="message.userId === authUser.id">
              <span class="font-bold">{{ authUser.email.split('@')[0] + '@' }}</span>
              <span class="text-sm text-gray-400"> ({{ authUser.displayName }})</span>
            </p>
            <p v-else>
              <span class="font-bold">{{ otherUser.email.split('@')[0] + '@' }}</span>
              <span class="text-sm text-gray-400"> ({{ otherUser.displayName }})</span>
            </p>
            <div
                v-if="message.created_at"
                class="text-sm font-extralight text-gray-400"
            >
              {{ dateToString(message.created_at) }}
            </div>
            {{ message.message }}
          </li>
        </ul>
      </V_LoadingContext>
    </div>
    <div class="mb-2">
      <form
          action="#"
          method="post"
          id="form-message"
          @submit.prevent="handleSubmit"
      >
        <div class="mb-3">
          <V_Label for="message">Mensaje</V_Label>
          <V_Textarea
              id="message"
              v-model="fields.message"
          ></V_Textarea>
        </div>
        <V_Button full/>
      </form>

      <div
          v-if="formLoading"
          class="mb-3"
      >Enviando mensaje...
      </div>
    </div>
  </V_LoadingContext>
</template>

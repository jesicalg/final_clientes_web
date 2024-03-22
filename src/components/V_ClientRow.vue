<script setup>
import V_ButtonLink from './V_ButtonLink.vue';
import {PATHS} from "../router/router.js";
defineProps({
  client: {
    type: Object,
    default: {
      id: null,
      displayName: null,
      email: null,
      price: null,
      photoURL: null,
      contractedService: {
        description:null,
        name:null,
        price: null
      },
      currentIssue:null
    },
  }
})
</script>
<template>
    <ul class="border-b border-gray-200 md:flex justify-between px-1 py-4">
        <li>{{client.displayName}}</li>
        <li>{{client.email}}</li>
        <li class="mt-4 md:mt-0">
            <V_ButtonLink :route="PATHS.PRIVATE_CHAT + '/' + client.id">Chat</V_ButtonLink>
        </li>
    </ul>
</template>
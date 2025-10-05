<template>
  <q-img class="absolute-top" :src="user?.profile.background_image || 'https://cdn.quasar.dev/img/material.png'" style="height: 150px">
    <div class="absolute-bottom bg-transparent text-center full-width q-pa-md">

      <q-avatar
        v-if="user"
        size="56px"
        class="q-mb-sm cursor-pointer"
        @click="handleEditProfile"
      >
        <img :src="user.profile.avatar || 'https://cdn.quasar.dev/img/boy-avatar.png'" />
        <q-tooltip>Editar seu perfil</q-tooltip>
      </q-avatar>

      <div v-if="user" class="text-weight-bold">{{ user.profile.nickname }}</div>
      <span v-if="user?.type === 'ADMIN'">
        <q-badge class="text-weight-bold q-pa-xs" color="primary">Administrador</q-badge>
      </span>
    </div>
  </q-img>
</template>

<script setup lang="ts">
import type { User } from 'src/types/auth';
import { useUsersStore } from 'src/stores/users-store';

const props = defineProps<{
  user: User | null;
}>();

const usersStore = useUsersStore();

function handleEditProfile() {
  if (props.user) {
    usersStore.openUserDialog(props.user);
  }
}
</script>
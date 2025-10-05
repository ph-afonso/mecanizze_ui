<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>Mecanizze</q-toolbar-title>
        <div>
          <span v-if="authStore.user" class="q-mr-md gt-xs">{{ authStore.user.profile.nickname }}</span>
          <q-btn
            flat
            round
            dense
            icon="logout"
            aria-label="Sair do sistema"
            @click="handleLogout"
          >
            <q-tooltip>Sair</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="250"
    >
      <UserProfile :user="authStore.user" @edit-profile="openEditProfileDialog" />
      <NavigationLinks :links="linksList" />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <UserFormDialog
      :model-value="dialogOpen"
      @update:model-value="usersStore.closeUserDialog()"
      :user-to-edit="editingUser"
      @submit="onFormSubmit"
    />
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useUsersStore } from 'src/stores/users-store';
import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';
import UserProfile from 'src/components/UserProfile.vue';
import NavigationLinks, { type Link } from 'src/components/NavigationLinks.vue';
import UserFormDialog from 'src/components/UserFormDialog.vue';
import type { User } from 'src/types/auth';

const authStore = useAuthStore();
const usersStore = useUsersStore();
const $q = useQuasar();

const { dialogOpen, editingUser } = storeToRefs(usersStore);
const leftDrawerOpen = ref(false);

const linksList: Link[] = [
  { title: 'Dashboard', icon: 'dashboard', to: '/' },
  { title: 'Gerenciar Usuários', icon: 'people', to: '/users' },
  { title: 'Configurações', icon: 'settings', to: '/settings' },
];

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function handleLogout() {
  $q.dialog({
    title: 'Confirmar Saída',
    message: 'Você tem certeza que deseja sair do sistema?',
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Sair', color: 'negative', flat: true },
    persistent: true,
  }).onOk(() => {
    authStore.logout();
  });
}

function openEditProfileDialog() {
  if (authStore.user) {
    usersStore.openUserDialog(authStore.user);
  }
}

// --- FUNÇÃO CORRIGIDA ---
// A função agora recebe apenas 'userData', pois a imagem base64 já está dentro dele.
async function onFormSubmit(userData: User) {
  if (editingUser.value && editingUser.value.id) {
    // A chamada para updateUser agora tem 2 argumentos, como esperado.
    await usersStore.updateUser(editingUser.value.id, userData);
  } else {
    // A chamada para createUser agora tem 1 argumento, como esperado.
    await usersStore.createUser(userData);
  }
  usersStore.closeUserDialog();
}
</script>
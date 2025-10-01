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

        <q-toolbar-title>
          Mecanizze
        </q-toolbar-title>

        <div>
          <span v-if="authStore.user" class="q-mr-md">{{ authStore.user.name }}</span>
          
          <q-btn
            flat
            round
            dense
            icon="logout"
            aria-label="Sair do sistema"
            @click="handleLogout"
          >
            <q-tooltip>
              Sair
            </q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useQuasar } from 'quasar';

const authStore = useAuthStore();
const $q = useQuasar();

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

// FUNÇÃO CHAMADA PELO BOTÃO
function handleLogout() {
  // Adiciona um diálogo de confirmação para uma melhor UX
  $q.dialog({
    title: 'Confirmar Saída',
    message: 'Você tem certeza que deseja sair do sistema?',
    cancel: true,
    persistent: true,
    ok: {
      label: 'Sair',
      color: 'negative',
      flat: true
    },
  }).onOk(() => {
    // Se o usuário confirmar, chama a ação da store
    authStore.logout();
  });
}


onMounted(async () => {
  await authStore.checkAuth();
});
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Mecanizze</q-toolbar-title>
        <div>
          <span v-if="authStore.user" class="q-mr-md gt-xs">{{ authStore.user.profile.nickname }}</span>
          <q-btn flat round dense icon="logout" aria-label="Sair do sistema" @click="handleLogout">
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
      
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          
          <template v-for="link in linksList" :key="link.title">

            <q-item v-if="!link.children" :to="link.to" exact clickable v-ripple>
              <q-item-section avatar>
                <q-icon :name="link.icon" />
              </q-item-section>
              <q-item-section>
                {{ link.title }}
              </q-item-section>
            </q-item>

            <q-expansion-item
              v-else
              :icon="link.icon"
              :label="link.title"
              group="menu-group"
            >
              <template v-for="child in link.children" :key="child.title">
                
                <q-expansion-item
                  v-if="child.children"
                  :label="child.title"
                  :icon="child.icon"
                  :header-inset-level="0.5"
                >
                  <q-item
                    v-for="grandchild in child.children"
                    :key="grandchild.title"
                    :to="grandchild.to"
                    clickable
                    v-ripple
                    :inset-level="1"
                  >
                    <q-item-section avatar>
                      <q-icon :name="grandchild.icon" />
                    </q-item-section>
                    <q-item-section>
                      {{ grandchild.title }}
                    </q-item-section>
                  </q-item>
                </q-expansion-item>
                
                <q-item
                  v-else
                  :to="child.to"
                  clickable
                  v-ripple
                  :inset-level="0.5"
                >
                  <q-item-section avatar>
                    <q-icon :name="child.icon" />
                  </q-item-section>
                  <q-item-section>
                    {{ child.title }}
                  </q-item-section>
                </q-item>

              </template>
            </q-expansion-item>

          </template>
        </q-list>
      </q-scroll-area>
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

// Removemos a importação do NavigationLink, pois não o usamos mais
import UserProfile from 'src/components/UserProfile.vue';
import UserFormDialog from 'src/components/UserFormDialog.vue';
import type { User } from 'src/types/auth';

// A interface Link agora pode ser local
export interface Link {
  title: string;
  icon?: string;
  to?: string;
  children?: Link[];
}

const authStore = useAuthStore();
const usersStore = useUsersStore();
const $q = useQuasar();

const { dialogOpen, editingUser } = storeToRefs(usersStore);
const leftDrawerOpen = ref(false);

const linksList: Link[] = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    to: '/',
  },
  {
    title: 'Configurações',
    icon: 'settings',
    children: [
      {
        title: 'Usuários',
        icon: 'people',
        children: [
          {
            title: 'Gerenciar',
            icon: 'manage_accounts',
            to: '/users',
          },
        ],
      },
      {
        title: 'Financeiro',
        icon: 'monetization_on',
        children: [
          {
            title: 'Categorias',
            icon: 'category',
            to: '/categories',
          },
          {
            title: 'Contas',
            icon: 'account_balance_wallet',
            to: '/financial/accounts',
          },
        ],
      },
    ],
  },
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

async function onFormSubmit(userData: User) {
  if (editingUser.value && editingUser.value.id) {
    await usersStore.updateUser(editingUser.value.id, userData);
  } else {
    await usersStore.createUser(userData);
  }
  usersStore.closeUserDialog();
}
</script>
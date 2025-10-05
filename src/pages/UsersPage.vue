<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        title="Usuários"
        :rows="users"
        :columns="columns"
        row-key="id"
        :loading="loading"
        v-model:pagination="pagination"
      >
        <template v-slot:top-right>
          <q-btn color="primary" icon="add" label="Cadastrar Usuário" @click="openAddUserDialog" />
        </template>

        <template v-slot:body-cell-avatar="props">
          <q-td :props="props">
            <q-avatar size="40px">
              <img :src="props.row.profile.avatar || 'https://cdn.quasar.dev/img/avatar.png'" />
            </q-avatar>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn dense round flat icon="edit" @click="openEditUserDialog(props.row)"></q-btn>
            <q-btn dense round flat color="negative" icon="delete" @click="confirmDeleteUser(props.row)"></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <UserFormDialog
      :model-value="dialogOpen"
      @update:model-value="usersStore.closeUserDialog()"
      :user-to-edit="editingUser"
      @submit="onFormSubmit"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar, type QTableColumn } from 'quasar';
import { useUsersStore } from 'src/stores/users-store';
import { storeToRefs } from 'pinia';
import UserFormDialog from 'src/components/UserFormDialog.vue';
import type { User } from 'src/types/auth';

const $q = useQuasar();
const usersStore = useUsersStore();
const { users, loading, dialogOpen, editingUser } = storeToRefs(usersStore);

const columns: QTableColumn[] = [
    { name: 'avatar', label: 'Avatar', align: 'center', field: row => row.profile.avatar },
    { name: 'nickname', label: 'Nickname', field: row => row.profile.nickname, align: 'left', sortable: true },
    { name: 'full_name', label: 'Nome Completo', field: row => row.profile.full_name, align: 'left', sortable: true },
    { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
    { name: 'type', label: 'Tipo', field: 'type', align: 'center', sortable: true },
    { name: 'actions', label: 'Ações', align: 'right', field: '' },
];

const pagination = ref({ rowsPerPage: 10 });

onMounted(() => {
  if (users.value.length === 0) {
    void usersStore.fetchUsers();
  }
});

function openAddUserDialog() {
  usersStore.openUserDialog(null);
}

function openEditUserDialog(user: User) {
  usersStore.openUserDialog(user);
}

async function onFormSubmit(userData: User) {
  if (editingUser.value && editingUser.value.id) {
    await usersStore.updateUser(editingUser.value.id, userData);
  } else {
    await usersStore.createUser(userData);
  }
  usersStore.closeUserDialog();
}

function confirmDeleteUser(user: User) {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Tem certeza que deseja excluir o usuário ${user.profile.full_name}?`,
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Excluir', color: 'negative' },
    persistent: true,
  }).onOk(() => {
    if (user.id) {
      void usersStore.deleteUser(user.id);
    }
  });
}
</script>
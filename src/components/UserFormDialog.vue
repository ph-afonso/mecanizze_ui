<template>
  <q-dialog v-model="showDialog">
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">{{ isEditing ? 'Editar Usuário' : 'Cadastrar Usuário' }}</div>
      </q-card-section>

      <q-form @submit.prevent="handleSubmit">
        <q-card-section class="q-pt-none">

          <div class="profile-header q-mb-md">

            <div class="profile-background-container" @click="triggerBackgroundInput">
              <q-img
                :src="backgroundPreview || 'https://cdn.quasar.dev/img/material.png'"
                class="profile-background"
              />
              <div class="background-overlay">
                <q-btn
                  class="absolute-top-right q-ma-sm"
                  round dense icon="edit"
                  color="white"
                  flat
                >
                  <q-tooltip>Trocar plano de fundo</q-tooltip>
                </q-btn>
              </div>
            </div>
            <q-file ref="backgroundInputRef" v-model="backgroundFile" @update:model-value="handleBackgroundUpload" style="display: none" />

            <div class="avatar-container" @click="triggerAvatarInput">
              <q-avatar size="100px">
                <img :src="avatarPreview || 'https://cdn.quasar.dev/img/avatar.png'">
              </q-avatar>
              <div class="avatar-overlay">
                <q-icon name="photo_camera" size="sm" color="white" />
              </div>
            </div>
            <q-file ref="avatarInputRef" v-model="avatarFile" @update:model-value="handleAvatarUpload" style="display: none" />
          </div>

          <q-input v-model="formData.profile.full_name" label="Nome Completo *" :rules="[val => !!val || 'Nome é obrigatório']" autofocus />
          <q-input v-model="formData.profile.nickname" label="Nickname *" :rules="[val => !!val || 'Nickname é obrigatório']" />
          <q-input v-model="formData.email" label="Email *" type="email" :rules="[val => !!val || 'Email é obrigatório']" :disable="isEditing ? true : false"/>
          <q-select v-model="formData.type" :options="typeOptions" label="Tipo de Usuário *" :rules="[val => !!val || 'Tipo é obrigatório']" emit-value map-options />
          <q-input v-model="formData.password" label="Senha" :type="isPasswordVisible ? 'text' : 'password'" :rules="isEditing ? [] : [val => !!val || 'Senha é obrigatória']" :hint="isEditing ? 'Deixe em branco para não alterar a senha' : ''">
            <template v-slot:append>
              <q-icon :name="isPasswordVisible ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPasswordVisible = !isPasswordVisible" />
            </template>
          </q-input>

        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Salvar" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
// O SCRIPT SETUP CONTINUA EXATAMENTE O MESMO
import { ref, computed, watch } from 'vue';
import type { QFile } from 'quasar';
import type { User } from 'src/types/auth';

const props = defineProps<{
  modelValue: boolean;
  userToEdit: User | null;
}>();

const emit = defineEmits(['update:modelValue', 'submit']);

const createEmptyUser = (): User => ({
  email: '',
  password: '',
  type: 'USER',
  profile: { avatar: '', full_name: '', nickname: '', background_image: '' }
});

const formData = ref<User>(createEmptyUser());
const avatarFile = ref<File | null>(null);
const backgroundFile = ref<File | null>(null);
const avatarPreview = ref<string>('');
const backgroundPreview = ref<string>('');
const isPasswordVisible = ref(false);
const avatarInputRef = ref<QFile | null>(null);
const backgroundInputRef = ref<QFile | null>(null);

const typeOptions = [
  { label: 'Administrador', value: 'ADMIN' },
  { label: 'Usuário', value: 'USER' },
];

const isEditing = computed(() => !!props.userToEdit);

watch(() => props.userToEdit, (newUser) => {
  avatarFile.value = null;
  backgroundFile.value = null;
  if (newUser) {
    formData.value = JSON.parse(JSON.stringify(newUser));
    avatarPreview.value = newUser.profile.avatar || '';
    backgroundPreview.value = newUser.profile.background_image || '';
  } else {
    formData.value = createEmptyUser();
    avatarPreview.value = '';
    backgroundPreview.value = '';
  }
  formData.value.password = '';
  isPasswordVisible.value = false;
});

function handleAvatarUpload(file: File | null) {
  if (!file) { formData.value.profile.avatar = ''; avatarPreview.value = ''; return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64String = e.target?.result as string;
    formData.value.profile.avatar = base64String;
    avatarPreview.value = base64String;
  };
  reader.readAsDataURL(file);
}

function handleBackgroundUpload(file: File | null) {
  if (!file) { formData.value.profile.background_image = ''; backgroundPreview.value = ''; return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64String = e.target?.result as string;
    formData.value.profile.background_image = base64String;
    backgroundPreview.value = base64String;
  };
  reader.readAsDataURL(file);
}

function triggerAvatarInput() {
  avatarInputRef.value?.pickFiles();
}

function triggerBackgroundInput() {
  backgroundInputRef.value?.pickFiles();
}

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function handleSubmit() {
  if (isEditing.value && !formData.value.password) {
    delete formData.value.password;
  }
  emit('submit', formData.value);
  showDialog.value = false;
}
</script>

<style scoped>
.profile-header {
  position: relative;
  height: 150px;
  width: 100%;
}

.profile-background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden; /* Garante que o conteúdo do overlay não vaze */
}

.profile-background {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Garante que a imagem cubra a área */
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0; /* Começa invisível */
  transition: opacity 0.3s ease; /* Efeito de transição suave */
}

/* O overlay (e o botão dentro dele) aparece quando o mouse passa sobre o container */
.profile-background-container:hover .background-overlay {
  opacity: 1;
}

.avatar-container {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  border-radius: 50%;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}
</style>
<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md shadow-2 my_card" bordered>
          <q-card-section class="text-center">
            <div class="text-grey-9 text-h5 text-weight-bold">Acessar Sistema</div>
            <div class="text-grey-8">Faça login para continuar</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="handleLogin">
              <q-input
                dense
                outlined
                v-model="form.email"
                label="Email"
                type="email"
                lazy-rules
                :rules="[val => !!val || 'O email é obrigatório']"
              />

              <q-input
                class="q-mt-md"
                dense
                outlined
                v-model="form.password"
                label="Senha"
                type="password"
                lazy-rules
                :rules="[val => !!val || 'A senha é obrigatória']"
              />

              <div class="q-mt-lg">
                <q-btn
                  label="Entrar"
                  color="primary"
                  class="full-width"
                  type="submit"
                  :loading="loading"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAuthStore } from 'src/stores/auth-store';
    import type { LoginCredentials } from 'src/types/auth';
    import { useQuasar } from 'quasar';

    const router = useRouter();
    const authStore = useAuthStore();
    const $q = useQuasar();

    const form = ref<LoginCredentials>({
    email: '',
    password: '',
    });

    const loading = ref(false);

    const handleLogin = async () => {
        try {
            loading.value = true;
            await authStore.login(form.value);
            await router.push({ name: 'home' });

            const successMessage = 'Login realizado com sucesso';

            $q.notify({
                type: 'positive',
                message: successMessage,
                position: 'top',
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido';
            
            $q.notify({
                type: 'negative',
                message: errorMessage,
                position: 'top',
            });
        } finally {
            loading.value = false;
        }
    };
</script>

<style scoped>
    .my_card {
    width: 100%;
    max-width: 400px;
    border-radius: 8px;
    }
</style>
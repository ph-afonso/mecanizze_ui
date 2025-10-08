<template>
  <q-layout>
    <q-page-container>
      <q-page class="row items-stretch">

        <div class="col-12 col-md-5 flex flex-center">
          <q-card flat class="q-pa-lg" style="width: 100%; max-width: 400px;">
            <q-card-section class="text-center q-pb-none">
              <q-avatar size="100px" :class="{ 'spinning': loading }">
                <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" alt="Logo do App">
              </q-avatar>
              <div class="text-h5 text-weight-bold q-mt-md">Mecanizze</div>
              <div class="text-grey-8">Gestão Pessoal</div>
            </q-card-section>

            <q-card-section>
              <q-form @submit.prevent="handleLogin" class="q-gutter-md">
                <q-input
                  v-model="form.email"
                  label="Email"
                  type="email"
                  outlined
                  lazy-rules
                  :rules="[val => !!val || 'O email é obrigatório']"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>

                <q-input
                  v-model="form.password"
                  label="Senha"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  outlined
                  lazy-rules
                  :rules="[val => !!val || 'A senha é obrigatória']"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPasswordVisible = !isPasswordVisible"
                    />
                  </template>
                </q-input>

                <div>
                  <q-btn
                    label="Login"
                    color="primary"
                    class="full-width"
                    size="lg"
                    type="submit"
                    :loading="loading"
                    unelevated
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-md-7 gt-sm">
          <q-carousel
            animated
            v-model="slide"
            arrows
            infinite
            autoplay
            transition-prev="slide-right"
            transition-next="slide-left"
            class="full-height"
          >
            <q-carousel-slide :name="1" img-src="banners/banner-1.png">
              <div class="absolute-bottom custom-caption">
                <div class="text-subtitle1">Cansado de viver na correria, com métodos antigos que só aumentam o caos?</div>
              </div>
            </q-carousel-slide>
            <q-carousel-slide :name="2" img-src="banners/banner-2.png">
              <div class="absolute-bottom custom-caption">
                <div class="text-subtitle1">A Mecanizze chegou para transformar sua rotina: mais organização, menos estresse – tudo na palma da sua mão.</div>
              </div>
            </q-carousel-slide>
            <q-carousel-slide :name="3" img-src="banners/banner-3.png">
              <div class="absolute-bottom custom-caption">
                <div class="text-subtitle1">Agora, com tudo sob controle, você tem tempo para o que realmente importa.</div>
              </div>
            </q-carousel-slide>
          </q-carousel>
        </div>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'stores/auth-store';
import { useQuasar } from 'quasar';

// Nenhuma mudança é necessária no script. A variável 'loading' que já existe
// vai controlar nossa animação.
const slide = ref(1);
const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();
const form = ref({
  email: '',
  password: ''
});
const loading = ref(false);
const isPasswordVisible = ref(false);

const handleLogin = async () => {
  try {
    loading.value = true;
    await authStore.login(form.value);
    await router.push({ name: 'home' });
    
    $q.notify({
      type: 'positive',
      message: `Bem-vindo, ${authStore.user?.profile.nickname || 'usuário'}!`,
      position: 'top-right',
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Falha ao fazer login.';
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
/* Estilo para a legenda sobreposta na imagem do carrossel */
.custom-caption {
  text-align: center;
  padding: 24px;
  color: white;
  background-color: rgba(66, 164, 245, 0.226); /* Fundo semitransparente para legibilidade */
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
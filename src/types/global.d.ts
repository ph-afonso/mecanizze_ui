// src/types/global.d.ts

// 1. Usamos 'import type', que é a sintaxe que o seu ESLint exige.
import type { AxiosInstance } from 'axios';
import type { QSingleton } from 'quasar';

// 2. Removemos o 'export {}' para garantir que o arquivo seja global.

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    // 3. Usamos os tipos importados diretamente.
    $api: AxiosInstance;
    $q: QSingleton;
  }
}
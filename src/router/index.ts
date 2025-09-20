// src/router/index.ts

import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'stores/auth-store';

// Não precisamos mais de tipos manuais aqui
export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, _from, next) => {
    // Chamamos useAuthStore() sem parâmetros. O Pinia encontrará a store ativa.
    const authStore = useAuthStore();
    const needsAuth = to.meta.requiresAuth;

    if (needsAuth && !authStore.isAuthenticated) {
      next({ name: 'login' });
    } else if (to.name === 'login' && authStore.isAuthenticated) {
      next({ name: 'home' });
    } else {
      next();
    }
  });

  return Router;
});
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "home",
        component: () => import('pages/IndexPage.vue')
      },
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import('pages/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;

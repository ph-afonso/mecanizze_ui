<template>
  <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
    <q-list padding>
      <q-item
        v-for="link in links"
        :key="link.title"
        :to="link.to"
        exact
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-icon :name="link.icon" />
        </q-item-section>

        <q-item-section>
          {{ link.title }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
export interface Link {
  title: string;
  icon: string;
  to: string;
}

// Este componente espera receber um array de 'links' como propriedade
defineProps<{
  links: Link[];
}>();
</script>
<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        title="Categorias"
        :rows="categories"
        :columns="columns"
        row-key="id"
        :loading="loading"
      >
        <template v-slot:top-right>
          <q-btn color="primary" icon="add" label="Nova Categoria" @click="openAddCategoryDialog" />
        </template>
        </q-table>
    </div>
    
    <CategoryFormDialog
      :model-value="dialogOpen"
      @update:model-value="categoriesStore.closeCategoryDialog()"
      :category-to-edit="editingCategory"
      @submit="onFormSubmit"
    />
  </q-page>
</template>

<script setup lang="ts">
// CORREÇÃO: 'ref' foi removido da importação
import { onMounted } from 'vue';
import { useCategoriesStore } from 'src/stores/categories-store';
import { storeToRefs } from 'pinia';
import type { QTableColumn } from 'quasar';
import CategoryFormDialog from 'src/components/CategoryFormDialog.vue';
import type { Category } from 'src/types/category';

const categoriesStore = useCategoriesStore();
const { categories, loading, dialogOpen, editingCategory } = storeToRefs(categoriesStore);

const columns: QTableColumn[] = [
  { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true },
  { name: 'description', label: 'Descrição', field: 'description', align: 'left' },
  { name: 'color', label: 'Cor', field: 'color', align: 'center' },
  // CORREÇÃO: Adicionado 'field: ""' para a coluna de ações
  { name: 'actions', label: 'Ações', align: 'right', field: '' },
];

onMounted(() => {
  void categoriesStore.fetchCategories();
});

function openAddCategoryDialog() {
  categoriesStore.openCategoryDialog(null);
}

async function onFormSubmit(categoryData: Category) {
  if (editingCategory.value) {
    // Lógica de update virá aqui
  } else {
    await categoriesStore.createCategory(categoryData);
  }
  categoriesStore.closeCategoryDialog();
}
</script>
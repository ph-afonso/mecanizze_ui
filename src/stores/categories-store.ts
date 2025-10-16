// /src/stores/categories-store.ts
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { Category } from 'src/types/category';
import { Notify } from 'quasar';

export interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  dialogOpen: boolean;
  editingCategory: Category | null;
}

export const useCategoriesStore = defineStore('categories', {
  state: (): CategoriesState => ({
    categories: [],
    loading: false,
    error: null,
    dialogOpen: false,
    editingCategory: null,
  }),

  actions: {
    openCategoryDialog(category: Category | null) {
      this.editingCategory = category ? JSON.parse(JSON.stringify(category)) : null;
      this.dialogOpen = true;
    },

    closeCategoryDialog() {
      this.dialogOpen = false;
      setTimeout(() => {
        this.editingCategory = null;
      }, 300);
    },

    async createCategory(categoryData: Omit<Category, 'id'>) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post<Category>('/categories', categoryData);
        this.categories.unshift(response.data);
        Notify.create({ type: 'positive', message: 'Categoria criada com sucesso!' });
      } catch (err) {
        this.error = 'Falha ao criar categoria.';
        Notify.create({ type: 'negative', message: this.error });
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    // CORREÇÃO: 'async' removido
    fetchCategories() {
      console.log('Buscando categorias...');
      // Lógica para GET /categories virá aqui
    },
    // CORREÇÃO: 'async' removido
    updateCategory(id: number, data: Category) {
      console.log('Atualizando categoria...', id, data);
      // Lógica para PUT /categories/:id virá aqui
    },
    // CORREÇÃO: 'async' removido
    deleteCategory(id: number) {
      console.log('Deletando categoria...', id);
      // Lógica para DELETE /categories/:id virá aqui
    },
  },
});
<template>
  <q-dialog v-model="showDialog">
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">{{ isEditing ? 'Editar Categoria' : 'Nova Categoria' }}</div>
      </q-card-section>

      <q-form @submit.prevent="handleSubmit">
        <q-card-section class="q-gutter-md">
          <q-input v-model="formData.name" label="Nome *" :rules="[val => !!val || 'Nome é obrigatório']" autofocus />
          
          <q-select
            v-model="formData.type"
            :options="typeOptions"
            label="Tipo *"
            :rules="[val => !!val || 'Tipo é obrigatório']"
            outlined
            emit-value
            map-options
          />

          <q-input v-model="formData.description" label="Descrição" type="textarea" outlined />
          
          <div class="text-subtitle2 q-mt-md">Cor da Categoria</div>
          <q-color v-model="formData.color" default-value="#000000" class="q-mx-auto" />
          <q-input v-model="formData.color" label="Código Hex" readonly outlined class="q-mt-sm">
            <template v-slot:prepend>
              <q-icon name="palette" :style="{ color: formData.color }" />
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
import { ref, computed, watch } from 'vue';
import type { Category } from 'src/types/category';

const props = defineProps<{
  modelValue: boolean;
  categoryToEdit: Category | null;
}>();

const emit = defineEmits(['update:modelValue', 'submit']);

const createEmptyCategory = (): Omit<Category, 'id'> => ({
  name: '',
  description: '',
  color: '#1976D2',
  type: 'Despesa', // Valor padrão em português
});

const formData = ref(createEmptyCategory());

// --- CORREÇÃO DEFINITIVA AQUI ---
// Os valores ('value') agora são as strings exatas que o seu banco de dados aceita.
const typeOptions = [
  { label: 'Receita', value: 'Receita' },
  { label: 'Despesa', value: 'Despesa' },
  { label: 'Transferência', value: 'Transferencia' }, // Sem acento, como retornado pelo banco
  { label: 'Investimento', value: 'Investimento' },
];

const isEditing = computed(() => !!props.categoryToEdit);

watch(() => props.categoryToEdit, (newCategory) => {
  if (newCategory) {
    formData.value = { ...newCategory };
  } else {
    formData.value = createEmptyCategory();
  }
});

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function handleSubmit() {
  emit('submit', formData.value);
  showDialog.value = false;
}
</script>
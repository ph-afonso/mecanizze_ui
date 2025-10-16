// /src/types/category.ts
export interface Category {
  id?: number;
  name: string;
  description: string;
  color: string; // Ex: '#FF0000'
  owner_id?: number;
  created_at?: string;
  updated_at?: string;
  type: 'Receita' | 'Despesa' | 'Transferencia' | 'Investimento';
}
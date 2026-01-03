import { api } from './api';
import { Category } from '../types/Category';

export async function getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories/');
    return response.data;
}

export async function createCategory(data: Omit<Category, 'id'>) {
  const response = await api.post('/categories/', data);
  return response.data;
}
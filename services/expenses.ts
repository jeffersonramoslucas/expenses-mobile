import { api } from './api';
import { Expense } from '../types/Expense';

export async function getExpenses(): Promise<Expense[]> {
    const response = await api.get<Expense[]>('/expenses/');
    return response.data;
}

export async function createExpense(data: Omit<Expense, 'id'>) {
  const response = await api.post('/expenses/', data);
  return response.data;
}
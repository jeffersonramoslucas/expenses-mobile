export type Expense = {
  id: string;
  category_id: string;
  value: number;
  description?: string;
  date: Date;
};
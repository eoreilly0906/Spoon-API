export interface Recipe {
  id: number;
  title: string;
  mealType: 'Breakfast' | 'Lunch/Dinner' | 'Dessert';
  region: string;
  ingredients: string;
  instructions: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
} 
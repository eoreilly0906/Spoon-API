export const MealTypes = {
  Breakfast: 'Breakfast',
  LunchDinner: 'Lunch/Dinner',
  Dessert: 'Dessert'
} as const;

export type MealType = typeof MealTypes[keyof typeof MealTypes];

export interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  instructions: string;
  mealType: MealType;
  region: string;
  userId: number;
  createdAt: string | Date;
  updatedAt: string | Date;
} 
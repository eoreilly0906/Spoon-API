export const MealTypes = {
  Breakfast: 'Breakfast',
  LunchDinner: 'Lunch/Dinner',
  Dessert: 'Dessert'
} as const;

export type MealType = typeof MealTypes[keyof typeof MealTypes];

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  ingredients: string;
  instructions: string;
  imageUrl?: string;
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  sourceUrl?: string;
  mealType: MealType;
  region: string;
  userId: number;
  createdAt: string | Date;
  updatedAt: string | Date;
} 
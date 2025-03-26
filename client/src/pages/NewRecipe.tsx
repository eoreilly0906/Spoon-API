import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createRecipe } from '../api/recipeAPI';
import { MealTypes, type MealType } from '../interfaces/Recipe';

type CreateRecipeInput = {
  title: string;
  ingredients: string;
  instructions: string;
  mealType: MealType;
  region: string;
  userId: number;
};

export default function NewRecipe() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipeData, setRecipeData] = useState<CreateRecipeInput>({
    title: '',
    ingredients: '',
    instructions: '',
    mealType: MealTypes.LunchDinner,
    region: '',
    userId: user?.id || 0
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRecipeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createRecipe(recipeData);
      navigate('/recipes');
    } catch (error) {
      console.error('Failed to create recipe:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={recipeData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ingredients</label>
          <textarea
            name="ingredients"
            value={recipeData.ingredients}
            onChange={handleChange}
            rows={5}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Instructions</label>
          <textarea
            name="instructions"
            value={recipeData.instructions}
            onChange={handleChange}
            rows={5}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Meal Type</label>
          <select
            name="mealType"
            value={recipeData.mealType}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value={MealTypes.Breakfast}>Breakfast</option>
            <option value={MealTypes.LunchDinner}>Lunch/Dinner</option>
            <option value={MealTypes.Dessert}>Dessert</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Region</label>
          <input
            type="text"
            name="region"
            value={recipeData.region}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/recipes')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Recipe
          </button>
        </div>
      </form>
    </div>
  );
} 
import Auth from '../utils/auth';
import type { Recipe } from '../interfaces/Recipe';

const retrieveRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await fetch('/api/recipes', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`
      }
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }

    return data;
  } catch (err) {
    console.log('Error from recipe retrieval:', err);
    return [];
  }
};

const createRecipe = async (recipeData: Omit<Recipe, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Recipe> => {
  try {
    const response = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`
      },
      body: JSON.stringify(recipeData)
    });

    if (!response.ok) {
      throw new Error('Failed to create recipe');
    }

    return await response.json();
  } catch (err) {
    console.log('Error from recipe creation:', err);
    throw err;
  }
};

const updateRecipe = async (id: number, recipeData: Partial<Recipe>): Promise<Recipe> => {
  try {
    const response = await fetch(`/api/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`
      },
      body: JSON.stringify(recipeData)
    });

    if (!response.ok) {
      throw new Error('Failed to update recipe');
    }

    return await response.json();
  } catch (err) {
    console.log('Error from recipe update:', err);
    throw err;
  }
};

const deleteRecipe = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`/api/recipes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete recipe');
    }
  } catch (err) {
    console.log('Error from recipe deletion:', err);
    throw err;
  }
};

export { retrieveRecipes, createRecipe, updateRecipe, deleteRecipe }; 
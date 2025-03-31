import type { Recipe } from '../interfaces/Recipe';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const API_BASE_URL = 'http://localhost:3001';

export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/recipes`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log('Error from recipe retrieval:', err);
    return [];
  }
};

export const createRecipe = async (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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

export const updateRecipe = async (id: number, recipeData: Partial<Recipe>): Promise<Recipe> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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

export const deleteRecipe = async (id: number): Promise<void> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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

export const getRecipe = async (id: number): Promise<Recipe> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recipe');
    }

    return await response.json();
  } catch (err) {
    console.log('Error from recipe retrieval:', err);
    throw err;
  }
}; 
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

if (!SPOONACULAR_API_KEY) {
  console.error('Spoonacular API key is not set. Please check your .env file.');
}

export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: Array<{
    id: number;
    amount: number;
    unit: string;
    unitLong: string;
    unitShort: string;
    aisle: string;
    name: string;
    original: string;
    originalName: string;
    meta: string[];
    image: string;
  }>;
  usedIngredients: Array<{
    id: number;
    amount: number;
    unit: string;
    unitLong: string;
    unitShort: string;
    aisle: string;
    name: string;
    original: string;
    originalName: string;
    meta: string[];
    image: string;
  }>;
  unusedIngredients: Array<{
    id: number;
    amount: number;
    unit: string;
    unitLong: string;
    unitShort: string;
    aisle: string;
    name: string;
    original: string;
    originalName: string;
    meta: string[];
    image: string;
  }>;
  likes: number;
}

export interface SpoonacularRecipeDetails {
  id: number;
  title: string;
  image: string;
  servings: number;
  readyInMinutes: number;
  sourceUrl: string;
  summary: string;
  instructions: string;
  extendedIngredients: Array<{
    id: number;
    aisle: string;
    image: string;
    consistency: string;
    name: string;
    nameClean: string;
    original: string;
    originalName: string;
    amount: number;
    unit: string;
    meta: string[];
    measures: {
      us: {
        amount: number;
        unitShort: string;
        unitLong: string;
      };
      metric: {
        amount: number;
        unitShort: string;
        unitLong: string;
      };
    };
  }>;
}

const searchRecipes = async (query: string): Promise<SpoonacularRecipe[]> => {
  if (!SPOONACULAR_API_KEY) {
    console.error('Cannot search recipes: API key is not set');
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/findByIngredients?apiKey=${SPOONACULAR_API_KEY}&ingredients=${encodeURIComponent(query)}&number=10&ranking=2&ignorePantry=true`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Spoonacular API error:', errorData);
      throw new Error(`Failed to fetch recipes: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Error from recipe search:', err);
    return [];
  }
};

const getRecipeDetails = async (id: number): Promise<SpoonacularRecipeDetails> => {
  if (!SPOONACULAR_API_KEY) {
    throw new Error('Cannot fetch recipe details: API key is not set');
  }

  try {
    const response = await fetch(
      `${BASE_URL}/${id}/information?apiKey=${SPOONACULAR_API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Spoonacular API error:', errorData);
      throw new Error(`Failed to fetch recipe details: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Error from recipe details:', err);
    throw err;
  }
};

export { searchRecipes, getRecipeDetails }; 
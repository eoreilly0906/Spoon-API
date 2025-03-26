import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecipes, createRecipe } from '../api/recipeAPI';
import { searchRecipes, getRecipeDetails, type SpoonacularRecipe } from '../api/spoonacularAPI';
import { type Recipe, MealTypes } from '../interfaces/Recipe';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

type CreateRecipeInput = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;

export default function YourRecipes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SpoonacularRecipe[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchRecipes();
  }, [user, navigate]);

  const fetchRecipes = async () => {
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const results = await searchRecipes(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleImportRecipe = async (spoonacularRecipe: SpoonacularRecipe) => {
    try {
      const details = await getRecipeDetails(spoonacularRecipe.id);
      const newRecipe: CreateRecipeInput = {
        title: details.title,
        description: details.summary,
        ingredients: details.extendedIngredients.map(ing => ing.original).join('\n'),
        instructions: details.instructions,
        imageUrl: details.image,
        servings: details.servings,
        prepTime: details.readyInMinutes,
        cookTime: 0,
        totalTime: details.readyInMinutes,
        sourceUrl: details.sourceUrl,
        mealType: MealTypes.LunchDinner,
        region: 'International',
        userId: user!.id
      };

      await createRecipe(newRecipe);
      await fetchRecipes();
      setSearchResults([]);
      setSearchQuery('');
    } catch (error) {
      console.error('Error importing recipe:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Recipes</h1>
        <Button onClick={() => navigate('/recipes/new')}>Add New Recipe</Button>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for recipes by ingredients..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={searching}>
            {searching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            ) : (
              'Search'
            )}
          </Button>
        </div>
      </form>

      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((recipe) => (
              <Card key={recipe.id}>
                <CardHeader>
                  <CardTitle>{recipe.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <Button
                    onClick={() => handleImportRecipe(recipe)}
                    className="w-full"
                  >
                    Import Recipe
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <Card 
            key={recipe.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={() => navigate(`/recipes/${recipe.id}`)}
          >
            <CardHeader>
              <CardTitle>{recipe.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {recipe.imageUrl && (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <p className="text-gray-600 line-clamp-3">{recipe.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecipes, deleteRecipe } from '../api/recipeAPI';
import { type Recipe } from '../interfaces/Recipe';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function YourRecipes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (e: React.MouseEvent, recipeId: number) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      await deleteRecipe(recipeId);
      await fetchRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const handleEdit = (e: React.MouseEvent, recipeId: number) => {
    e.stopPropagation();
    navigate(`/recipes/edit/${recipeId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold mb-6">Your Recipes</h1>
        <Button 
          onClick={() => navigate('/recipes/new')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full"
        >
          Add New Recipe
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <Card 
            key={recipe.id} 
            className="overflow-hidden rounded-xl hover:shadow-xl transition-all duration-300 border-2 border-gray-100"
          >
            <CardHeader className="pb-3 bg-gray-50">
              <CardTitle className="text-xl text-center">{recipe.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                  <span className="font-medium">Meal Type:</span>
                  <span>{recipe.mealType}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                  <span className="font-medium">Region:</span>
                  <span>{recipe.region}</span>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h3 className="font-medium text-sm mb-2 text-center">Ingredients</h3>
                  <p className="text-sm text-gray-600 line-clamp-3 text-center">{recipe.ingredients}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h3 className="font-medium text-sm mb-2 text-center">Instructions</h3>
                  <p className="text-sm text-gray-600 line-clamp-3 text-center">{recipe.instructions}</p>
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button
                    onClick={(e) => handleEdit(e, recipe.id)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={(e) => handleDelete(e, recipe.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 
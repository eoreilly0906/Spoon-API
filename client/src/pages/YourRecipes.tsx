import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes, deleteRecipe } from '../api/recipeAPI';

interface Recipe {
  id: number;
  title: string;
  image: string;
  ingredients: string[];
  instructions: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

const YourRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (err) {
      setError('Failed to fetch recipes');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    try {
      await deleteRecipe(id);
      setRecipes(recipes.filter(recipe => recipe.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete recipe');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16 min-h-screen bg-dark-background">
        <div className="text-dark-text text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 min-h-screen bg-dark-background">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-dark-text">Your Recipes</h1>
        <Link
          to="/recipes/new"
          className="px-6 py-3 bg-dark-primary text-dark-text rounded hover:bg-opacity-80 transition-colors"
        >
          Add New Recipe
        </Link>
      </div>

      {error && (
        <div className="p-4 mb-8 bg-red-900/50 border-l-4 border-red-600 text-dark-text">
          {error}
        </div>
      )}

      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dark-text-muted text-lg">
            You haven't saved any recipes yet.
          </p>
          <p className="text-dark-text-muted mt-2">
            Try searching for recipes or create your own!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-dark-surface rounded-lg shadow-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-200"
            >
              <img
                src={recipe.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-4 text-dark-text">
                  {recipe.title}
                </h3>
                <div className="flex justify-between gap-4">
                  <Link
                    to={`/recipes/edit/${recipe.id}`}
                    className="flex-1 py-2 bg-dark-primary text-dark-text rounded hover:bg-opacity-80 transition-colors text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourRecipes; 
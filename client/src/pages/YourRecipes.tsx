import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes, deleteRecipe } from '../api/recipeAPI';
import { MealTypes } from '../interfaces/Recipe';

interface Recipe {
  id: number;
  title: string;
  image: string;
  ingredients: string;
  instructions: string;
  mealType: string;
  region: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

const YourRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [filterBy, setFilterBy] = useState<string>('all');

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

  const sortedAndFilteredRecipes = [...recipes]
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.title.localeCompare(b.title);
    })
    .filter(recipe => filterBy === 'all' || recipe.mealType === filterBy);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16 min-h-screen bg-dark-background">
        <div className="text-dark-text text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 min-h-screen bg-dark-background">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-dark-text">Your Recipes</h1>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
              className="px-3 py-1.5 bg-dark-surface border border-dark-border text-dark-text rounded"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-1.5 bg-dark-surface border border-dark-border text-dark-text rounded"
            >
              <option value="all">All Meal Types</option>
              {Object.values(MealTypes).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <Link
              to="/recipes/new"
              className="px-4 py-1.5 bg-dark-primary text-dark-text rounded hover:bg-opacity-80"
            >
              Add Recipe
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-red-900/50 border-l-4 border-red-600 text-dark-text rounded">
            {error}
          </div>
        )}

        {recipes.length === 0 ? (
          <div className="text-center py-8 bg-dark-surface rounded">
            <p className="text-dark-text-muted">No recipes found. Try adding some!</p>
          </div>
        ) : (
          <div className="bg-dark-surface rounded overflow-hidden">
            <div className="divide-y divide-dark-border">
              {sortedAndFilteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center px-4 py-3 hover:bg-dark-surface/50"
                >
                  <img
                    src={recipe.image || 'https://placehold.co/100x100/1a1a1a/ffffff?text=No+Image'}
                    alt={recipe.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-dark-text">
                      {recipe.title}
                    </h3>
                    <div className="text-sm text-dark-text-muted">
                      {recipe.mealType} • {recipe.ingredients.split('\n').length} ingredients
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/recipes/edit/${recipe.id}`}
                      className="px-3 py-1.5 bg-dark-primary text-dark-text rounded hover:bg-opacity-80"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="px-3 py-1.5 bg-red-600/10 text-red-500 rounded hover:bg-red-600/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourRecipes; 
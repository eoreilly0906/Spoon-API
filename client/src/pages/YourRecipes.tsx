import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes, deleteRecipe } from '../api/recipeAPI';
import { MealTypes, Recipe } from '../interfaces/Recipe';

const REGIONS = [
  'All Regions',
  'Asian',
  'Mediterranean',
  'Mexican',
  'Italian',
  'Indian',
  'Middle Eastern',
  'Caribbean',
  'African',
  'Latin American',
  'European',
  'American',
  'Japanese',
  'Chinese',
  'Thai',
  'Greek',
  'Spanish',
  'French',
  'German',
  'British',
  'Fusion',
  'Other'
];

const YourRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
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
    .filter(recipe => {
      // First filter by meal type
      const mealTypeMatch = filterBy === 'all' || recipe.mealType === filterBy;
      // Then filter by region
      const regionMatch = selectedRegion === 'All Regions' || recipe.region === selectedRegion;
      return mealTypeMatch && regionMatch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="text-dark-text text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="main-content">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
              <h1 className="text-4xl font-bold text-dark-text">Your Recipes</h1>
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-4 py-2 bg-dark-surface border border-dark-border text-dark-text rounded-lg flex-1 sm:flex-none text-base"
                >
                  {REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-4 py-2 bg-dark-surface border border-dark-border text-dark-text rounded-lg flex-1 sm:flex-none text-base"
                >
                  <option value="all">All Meal Types</option>
                  {Object.values(MealTypes).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <Link
                  to="/recipes/new"
                  className="px-6 py-2 bg-dark-primary text-dark-text rounded-lg hover:bg-opacity-80 flex-1 sm:flex-none text-center text-base font-medium"
                >
                  Add Recipe
                </Link>
              </div>
            </div>

            {error && (
              <div className="p-4 mb-8 bg-red-900/50 border-l-4 border-red-600 text-dark-text rounded-lg">
                {error}
              </div>
            )}

            {recipes.length === 0 ? (
              <div className="text-center py-12 bg-dark-surface rounded-lg">
                <p className="text-dark-text-muted text-lg">No recipes found. Try adding some!</p>
              </div>
            ) : (
              <div className="bg-dark-surface rounded-lg shadow-lg overflow-hidden">
                <div className="divide-y divide-dark-border">
                  {sortedAndFilteredRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="flex items-center p-8 hover:bg-dark-surface/50 transition-colors duration-200"
                    >
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <img
                          src={recipe.image || 'https://placehold.co/200x200/1a1a1a/ffffff?text=No+Image'}
                          alt={recipe.title}
                          className="w-full h-full rounded-lg object-cover shadow-md"
                        />
                      </div>
                      <div className="ml-8 flex-1">
                        <h3 className="text-2xl font-semibold text-dark-text mb-3">
                          {recipe.title}
                        </h3>
                        <div className="flex items-center gap-6 text-base text-dark-text-muted">
                          <span className="px-4 py-1.5 bg-dark-surface/50 rounded-full">
                            {recipe.mealType}
                          </span>
                          <span className="px-4 py-1.5 bg-dark-surface/50 rounded-full">
                            {recipe.region}
                          </span>
                          <span>{recipe.ingredients.split('\n').length} ingredients</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-8">
                        <Link
                          to={`/recipes/edit/${recipe.id}`}
                          className="px-6 py-2.5 bg-dark-primary text-dark-text rounded-lg hover:bg-opacity-90 transition-colors duration-200 font-medium text-base"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(recipe.id)}
                          className="px-6 py-2.5 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600/20 transition-colors duration-200 font-medium text-base"
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
      </div>
    </div>
  );
};

export default YourRecipes;



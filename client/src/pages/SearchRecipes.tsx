import { useState } from 'react';
import { searchRecipes, getRecipeDetails } from '../api/spoonacularAPI';
import { createRecipe } from '../api/recipeAPI';
import { useAuth } from '../context/AuthContext';
import { MealTypes } from '../interfaces/Recipe';

interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  missedIngredientCount: number;
  usedIngredientCount: number;
}

const SearchRecipes = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<SpoonacularRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const results = await searchRecipes(searchQuery);
      setRecipes(results);
    } catch (err) {
      setError('Failed to search recipes. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async (recipe: SpoonacularRecipe) => {
    try {
      // Fetch detailed recipe information
      const details = await getRecipeDetails(recipe.id);
      
      // Create recipe with all required fields
      await createRecipe({
        title: details.title,
        image: details.image,
        ingredients: details.extendedIngredients.map(ing => ing.original).join('\n'),
        instructions: details.instructions,
        mealType: MealTypes.LunchDinner,
        region: 'International',
        userId: user!.id
      });
      
      alert('Recipe saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save recipe. Please try again.');
    }
  };

  return (
    <div className="container" style={{ marginTop: '4rem', minHeight: '100vh' }}>
      <h1 className="page-title">Search Recipes</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter ingredients (comma separated)"
            className="search-input"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {recipes.length === 0 && !loading && !error ? (
        <p className="empty-state">
          Search for recipes using ingredients you have!
        </p>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="card recipe-card"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="recipe-image"
              />
              <div className="recipe-content">
                <h3 className="recipe-title">
                  {recipe.title}
                </h3>
                <div className="recipe-info">
                  <span className="recipe-stat">
                    {recipe.usedIngredientCount} ingredients matched
                  </span>
                  <span className="recipe-stat">
                    {recipe.missedIngredientCount} ingredients needed
                  </span>
                </div>
                <button
                  onClick={() => handleSaveRecipe(recipe)}
                  className="btn btn-primary"
                >
                  Save Recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchRecipes; 
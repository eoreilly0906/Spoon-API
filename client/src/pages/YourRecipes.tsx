import { useState, useEffect } from 'react';
import { retrieveRecipes, createRecipe } from '../api/recipeAPI';
import type { Recipe } from '../interfaces/Recipe';
import auth from '../utils/auth';

const YourRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    mealType: 'Breakfast',
    region: '',
    ingredients: '',
    instructions: ''
  });

  useEffect(() => {
    if (auth.loggedIn()) {
      fetchRecipes();
    }
  }, []);

  const fetchRecipes = async () => {
    try {
      const data = await retrieveRecipes();
      setRecipes(data);
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRecipe(formData);
      setShowForm(false);
      setFormData({
        title: '',
        mealType: 'Breakfast',
        region: '',
        ingredients: '',
        instructions: ''
      });
      fetchRecipes();
    } catch (err) {
      console.error('Failed to create recipe:', err);
    }
  };

  if (!auth.loggedIn()) {
    return <div>Please log in to view your recipes.</div>;
  }

  return (
    <div className="container">
      <h1>Your Recipes</h1>
      
      <button 
        className="btn btn-primary mb-4"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : 'Add New Recipe'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-4">
          <div className="card-body">
            <h2>Add New Recipe</h2>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mealType">Meal Type</label>
              <select
                id="mealType"
                name="mealType"
                value={formData.mealType}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch/Dinner">Lunch/Dinner</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="region">Region</label>
              <input
                type="text"
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="ingredients">Ingredients</label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleInputChange}
                className="form-input"
                rows={5}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="instructions">Instructions</label>
              <textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                className="form-input"
                rows={5}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Save Recipe
            </button>
          </div>
        </form>
      )}

      <div className="row">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h3>{recipe.title}</h3>
                <p><strong>Meal Type:</strong> {recipe.mealType}</p>
                <p><strong>Region:</strong> {recipe.region}</p>
                <h4>Ingredients:</h4>
                <p>{recipe.ingredients}</p>
                <h4>Instructions:</h4>
                <p>{recipe.instructions}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourRecipes; 
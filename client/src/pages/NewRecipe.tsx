import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createRecipe } from '../api/recipeAPI';
import { searchRecipes, getRecipeDetails, type SpoonacularRecipe } from '../api/spoonacularAPI';
import { type Recipe, MealTypes } from '../interfaces/Recipe';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Textarea, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui';

type CreateRecipeInput = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;

export default function NewRecipe() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SpoonacularRecipe[]>([]);
  const [searching, setSearching] = useState(false);
  const [formData, setFormData] = useState<CreateRecipeInput>({
    title: '',
    ingredients: '',
    instructions: '',
    mealType: MealTypes.LunchDinner,
    region: 'International',
    userId: user!.id
  });

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
      setFormData({
        ...formData,
        title: details.title,
        ingredients: details.extendedIngredients.map(ing => ing.original).join('\n'),
        instructions: details.instructions,
        mealType: MealTypes.LunchDinner,
        region: 'International',
        userId: user!.id
      });
      setSearchResults([]);
      setSearchQuery('');
    } catch (error) {
      console.error('Error importing recipe:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      navigate('/recipes');
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold mb-6">Add New Recipe</h1>
        <Button 
          onClick={() => navigate('/recipes')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-2 rounded-full"
        >
          Back to Recipes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-center">Search Existing Recipes</h2>
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Search for recipes by ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 rounded-lg"
              />
              <Button 
                type="submit" 
                disabled={searching}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-lg"
              >
                {searching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  'Search'
                )}
              </Button>
            </div>
          </form>

          {searchResults.length > 0 && (
            <div className="space-y-6">
              {searchResults.map((recipe) => (
                <Card key={recipe.id} className="overflow-hidden rounded-xl hover:shadow-md transition-all duration-300 border-2 border-gray-100">
                  <CardHeader className="pb-3 bg-gray-50">
                    <CardTitle className="text-lg text-center">{recipe.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <Button
                      onClick={() => handleImportRecipe(recipe)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg"
                    >
                      Import Recipe
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-center">Recipe Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-base block text-center mb-2">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="rounded-lg"
                placeholder="Enter recipe title"
              />
            </div>

            <div>
              <Label htmlFor="ingredients" className="text-base block text-center mb-2">Ingredients</Label>
              <Textarea
                id="ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                required
                className="min-h-[150px] rounded-lg"
                placeholder="Enter ingredients (one per line)"
              />
            </div>

            <div>
              <Label htmlFor="instructions" className="text-base block text-center mb-2">Instructions</Label>
              <Textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                required
                className="min-h-[200px] rounded-lg"
                placeholder="Enter step-by-step instructions"
              />
            </div>

            <div>
              <Label htmlFor="mealType" className="text-base block text-center mb-2">Meal Type</Label>
              <Select
                value={formData.mealType}
                onValueChange={(value: typeof MealTypes[keyof typeof MealTypes]) => setFormData(prev => ({ ...prev, mealType: value }))}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MealTypes).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="region" className="text-base block text-center mb-2">Region</Label>
              <Input
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                className="rounded-lg"
                placeholder="Enter recipe region"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2"
            >
              Create Recipe
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 
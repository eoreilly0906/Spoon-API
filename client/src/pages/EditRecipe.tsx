import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecipe, updateRecipe } from '../api/recipeAPI';
import { type Recipe, MealTypes } from '../interfaces/Recipe';
import { Button, Input, Textarea, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui';

export default function EditRecipe() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>({
    title: '',
    ingredients: '',
    instructions: '',
    mealType: MealTypes.LunchDinner,
    region: 'International'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) {
      navigate('/login');
      return;
    }
    fetchRecipe();
  }, [user, id, navigate]);

  const fetchRecipe = async () => {
    try {
      const recipe = await getRecipe(parseInt(id!));
      setFormData({
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        mealType: recipe.mealType,
        region: recipe.region
      });
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
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
      await updateRecipe(parseInt(id!), {
        ...formData,
        userId: user!.id
      });
      navigate('/recipes');
    } catch (error) {
      console.error('Error updating recipe:', error);
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
        <h1 className="text-3xl font-bold">Edit Recipe</h1>
        <Button onClick={() => navigate('/recipes')}>Back to Recipes</Button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="ingredients">Ingredients</Label>
          <Textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="instructions">Instructions</Label>
          <Textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="mealType">Meal Type</Label>
          <Select
            value={formData.mealType}
            onValueChange={(value: typeof MealTypes[keyof typeof MealTypes]) => setFormData(prev => ({ ...prev, mealType: value }))}
          >
            <SelectTrigger>
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
          <Label htmlFor="region">Region</Label>
          <Input
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Update Recipe
        </Button>
      </form>
    </div>
  );
} 
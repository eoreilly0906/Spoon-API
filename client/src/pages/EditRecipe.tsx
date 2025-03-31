import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecipe, updateRecipe } from '../api/recipeAPI';
import { type Recipe, MealTypes } from '../interfaces/Recipe';
import { Button, Input, Textarea, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, CardHeader, CardTitle, CardContent } from '../components/ui';

export default function EditRecipe() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>({
    title: '',
    ingredients: '',
    instructions: '',
    mealType: MealTypes.LunchDinner,
    region: 'International',
    image: ''
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
        region: recipe.region,
        image: recipe.image || ''
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
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-text"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="main-content">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-dark-text text-center">Edit Recipe</h1>

            <Card className="bg-dark-surface border-dark-border">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-dark-text text-center">
                  Recipe Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-dark-text">Recipe Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="bg-dark-surface border-dark-border text-dark-text"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-dark-text">Image URL</Label>
                    <Input
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="bg-dark-surface border-dark-border text-dark-text"
                      placeholder="Enter image URL"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mealType" className="text-dark-text">Meal Type</Label>
                    <Select
                      value={formData.mealType}
                      onValueChange={(value: typeof MealTypes[keyof typeof MealTypes]) => setFormData(prev => ({ ...prev, mealType: value }))}
                    >
                      <SelectTrigger className="bg-dark-surface border-dark-border text-dark-text">
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

                  <div className="space-y-2">
                    <Label htmlFor="ingredients" className="text-dark-text">Ingredients</Label>
                    <Textarea
                      id="ingredients"
                      name="ingredients"
                      value={formData.ingredients}
                      onChange={handleChange}
                      required
                      className="min-h-[200px] bg-dark-surface border-dark-border text-dark-text"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions" className="text-dark-text">Instructions</Label>
                    <Textarea
                      id="instructions"
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleChange}
                      required
                      className="min-h-[200px] bg-dark-surface border-dark-border text-dark-text"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region" className="text-dark-text">Region</Label>
                    <Input
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      required
                      className="bg-dark-surface border-dark-border text-dark-text"
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      type="button"
                      onClick={() => navigate('/recipes')}
                      className="bg-dark-surface border-dark-border text-dark-text hover:bg-dark-surface/80"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-dark-primary text-dark-text hover:bg-dark-primary/80"
                    >
                      Update Recipe
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 
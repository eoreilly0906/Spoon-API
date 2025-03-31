import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createRecipe } from '../api/recipeAPI';
import { type Recipe, MealTypes } from '../interfaces/Recipe';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Textarea, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui';

type CreateRecipeInput = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;

export default function NewRecipe() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateRecipeInput>({
    title: '',
    ingredients: '',
    instructions: '',
    mealType: MealTypes.LunchDinner,
    region: 'International',
    userId: user!.id
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await createRecipe(formData);
      navigate('/recipes');
    } catch (err) {
      console.error('Submit error:', err);
      setError('Failed to create recipe. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="main-content">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-dark-text text-center">Create New Recipe</h1>

            {error && (
              <div className="p-4 mb-8 bg-red-900/50 border-l-4 border-red-600 text-dark-text rounded-lg">
                {error}
              </div>
            )}

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
                      placeholder="Enter recipe title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mealType" className="text-dark-text">Meal Type</Label>
                    <Select
                      value={formData.mealType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, mealType: value as typeof MealTypes[keyof typeof MealTypes] }))}
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
                      placeholder="Enter ingredients (one per line)"
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
                      placeholder="Enter cooking instructions"
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
                      Create Recipe
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
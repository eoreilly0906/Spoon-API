import express from 'express';
import type { Request, Response } from 'express';
import { Recipe } from '../../models/index.js';

const router = express.Router();

// GET /recipes - Get all recipes for the logged-in user
router.get('/', async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const recipes = await Recipe.findAll({
      where: { userId: req.user.userId },
      order: [['createdAt', 'DESC']]
    });
    return res.json(recipes);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

// POST /recipes - Create a new recipe
router.post('/', async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  const { title, mealType, region, ingredients, instructions } = req.body;
  try {
    const newRecipe = await Recipe.create({
      title,
      mealType,
      region,
      ingredients,
      instructions,
      userId: req.user.userId
    });
    return res.status(201).json(newRecipe);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

// PUT /recipes/:id - Update a recipe
router.put('/:id', async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  const { id } = req.params;
  const { title, mealType, region, ingredients, instructions } = req.body;
  try {
    const recipe = await Recipe.findOne({
      where: { id, userId: req.user.userId }
    });
    if (recipe) {
      await recipe.update({
        title,
        mealType,
        region,
        ingredients,
        instructions
      });
      return res.json(recipe);
    } else {
      return res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

// DELETE /recipes/:id - Delete a recipe
router.delete('/:id', async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  const { id } = req.params;
  try {
    const recipe = await Recipe.findOne({
      where: { id, userId: req.user.userId }
    });
    if (recipe) {
      await recipe.destroy();
      return res.json({ message: 'Recipe deleted' });
    } else {
      return res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

export { router as recipeRouter }; 
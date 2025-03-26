import sequelize from '../config/connection.js'
import { UserFactory } from './user.js';
import { RecipeFactory } from './recipe.js';

const User = UserFactory(sequelize);
const Recipe = RecipeFactory(sequelize);

// Set up associations
User.hasMany(Recipe, {
  foreignKey: 'userId',
  as: 'recipes'
});

Recipe.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

export { User, Recipe };

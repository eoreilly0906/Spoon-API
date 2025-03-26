import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

// Define the attributes for the Recipe model
interface RecipeAttributes {
  id: number;
  title: string;
  mealType: string;
  region: string;
  ingredients: string;
  instructions: string;
  userId: number;
}

// Define the optional attributes for creating a new Recipe
interface RecipeCreationAttributes extends Optional<RecipeAttributes, 'id'> {}

// Define the Recipe class extending Sequelize's Model
export class Recipe extends Model<RecipeAttributes, RecipeCreationAttributes> implements RecipeAttributes {
  public id!: number;
  public title!: string;
  public mealType!: string;
  public region!: string;
  public ingredients!: string;
  public instructions!: string;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Define the RecipeFactory function to initialize the Recipe model
export function RecipeFactory(sequelize: Sequelize): typeof Recipe {
  Recipe.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mealType: {
        type: DataTypes.ENUM('Breakfast', 'Lunch/Dinner', 'Dessert'),
        allowNull: false,
      },
      region: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ingredients: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    },
    {
      tableName: 'recipes',
      sequelize,
    }
  );

  return Recipe;
} 
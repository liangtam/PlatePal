const Recipe = require("../models/recipeModel");
const User = require("../models/userModel");
const Groq = require("groq-sdk");
require("dotenv").config();
const { v4: uuidv4 } = require('uuid');

const handleGenerateRecipes = async (req, res) => {
  console.log("Trying to generate recipes with groq", req.query.ingredients);
  let givenIngredients = req.query.ingredients;
  if (!Array.isArray(givenIngredients)) {
    givenIngredients = [givenIngredients];
  }
  try {
    const groq = new Groq({ apiKey: `${process.env.GROQ_API_KEY}` });

    const schema = {
      $defs: {
        Recipe: {
          properties: {
            name: { title: "Recipe name", type: "string" },
            ingredients: {
              items: { type: "string" },
              title: "Recipe ingredients",
              type: "array",
            },
            instructions: {
              items: { type: "string" },
              title: "Recipe instructions",
              type: "array",
            },
            estimatedTime: {
                title: "Estimated recipe cooking time in minutes",
                type: "integer"
            },
            required: ["name", "ingredients", "instructions", "estimatedTime"],
            title: "Recipe",
            type: "object",
          },
        },
      },
      properties: {
        recipes: { title: "Recipes", type: "array" },
      },
      required: ["recipes"],
      title: "Recipes",
      type: "object",
    };

    const recipeSchema = JSON.stringify(schema, null, 4);
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a recipe database that outputs at most 8 different recipes that include all ${givenIngredients} in JSON.\n'The JSON object must use the schema: ${recipeSchema}`,
        },

        {
          role: "user",
          content: `Fetching recipes with ${givenIngredients}`,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.6,
      stream: false,
      response_format: { type: "json_object" },
    });

    const json = await JSON.parse(chatCompletion.choices[0].message.content);
    const recipes = json.recipes;
    // console.log(
    //   "Generated recipes: ",
    //   recipes
    // );

    if (!recipes) {
      return res.status(400).json({ error: "Could not generate recipes." });
    }

    const fullRecipes = await Promise.all(recipes.map(async (recipe) => {
        const encodedRecipeName = encodeURIComponent(recipe.name);

        try {
            const response = await fetch(`https://api.pexels.com/v1/search?query=${encodedRecipeName}&per_page=2`, {
                headers: {
                    "Authorization": process.env.PEXEL_API_KEY
                }
            });
            if (response.ok) {
                const json = await response.json();
                let imageUrl = "";
                if (json.photos.length >= 1) {
                    imageUrl = json.photos[0].src.medium;
                }
                return recipe = {...recipe, generatedId: uuidv4() , image: imageUrl};
            }
        } catch (err) {
            console.log("Could not get image for recipe " + recipe.name);
            console.log(err.message);
            return recipe;
        }
    }))

    console.log("Full recipes: ", fullRecipes);
    return res.status(200).json(fullRecipes);
  } catch (err) {
    res.status(500).json({ error: "Could not generate recipes." });
  }
};

const handleGetRecipe = (req, res) => {
  try {
    const { id } = req.params;
    const recipe = Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    return res.status(200).json(recipe);
  } catch (err) {
    res.status(400).json({ message: "Could not fetch recipe." });
  }
};

const handleCreateRecipe = async (req, res) => {
    const { name, ingredients, instructions, estimatedTime, userId } = req.body;

    let imageBase64 = null;
    if (req.file) {
        const base64String = req.file.buffer.toString('base64');
        imageBase64 = `data:${req.file.mimetype};base64,${base64String}`;
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const recipe = await Recipe.create({ name, ingredients, instructions, image: imageBase64, estimatedTime, userId });
        if (!recipe) {
            return res.status(400).json({message: "Could not create recipe"});
        }
        user.recipes.push(recipe);
        await user.save();
        return res.status(201).json(recipe);
    } catch (err) {
        console.error(`Error on create recipe ${err}`);
        return res.status(500).json({ message: "Internal error" });
    }
};

const handleDeleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Recipe.findByIdAndDelete(id);

    if (!result) {
        return res.status(404).json({ message: 'Recipe not found' });
    }

    const user = await User.findById(result.userId);

    if (!user) {
        return res.status(404).json({error: "User not found."});
    }

    user.recipes = user.recipes.filter(
      (recipeId) => recipeId.toString() !== id
    );
    await user.save();

    return res.status(200).json({ message: "Successfully deleted recipe!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const handleUpdateRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRecipe = await Recipe.findOneAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(updatedRecipe);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const handleGetAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    name: 1,
                    ingredients: 1,
                    instructions: 1,
                    estimatedTime: 1,
                    image: 1,
                    favoriteCount: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    user: '$user.email'
                }
            }
        ]);

        res.status(200).json(recipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching recipes' });
    }
};

module.exports = {
  handleGenerateRecipes,
  handleGetRecipe,
  handleCreateRecipe,
  handleDeleteRecipe,
  handleUpdateRecipe,
    handleGetAllRecipes
};

const Recipe = require("../models/recipeModel");
const User = require("../models/userModel");
const Groq = require("groq-sdk");
require("dotenv").config();
const { v4: uuidv4 } = require('uuid');

const handleGenerateRecipes = async (req, res) => {
  console.log("Trying to generate recipes with groq", req.query);
  let givenIngredients = req.query.ingredients;
  let allergies = req.query.allergies;
  let dislikedRecipes = req.query.dislikedRecipes;


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

    let message = `You are a recipe database that outputs at most 8 different recipes `;
    if (givenIngredients && givenIngredients.length > 0) {
      message += `that include all ${givenIngredients} `;
    } else {
      message += `that are healthy.`;
    }
    message += "in JSON.";

    if (allergies && allergies.length > 0) {
      message += `But, the recipes must NEVER have ingredients that contain any of ${allergies}.`;
    }

    if (dislikedRecipes && dislikedRecipes.length > 0) {
      message += `The recipes cannot be any of ${dislikedRecipes}.`;
    }


    message += `\nThe JSON object must use the schema: ${recipeSchema}.`

    console.log(message)
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: message,
        },

        {
          role: "user",
          content: `Fetching recipes with ${givenIngredients}`,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      stream: false,
      response_format: { type: "json_object" },
    });


    const json = await JSON.parse(chatCompletion.choices[0].message.content);
    const recipes = json.recipes;

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

    // console.log("Full recipes: ", fullRecipes);
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

        const io = req.io;
        io.emit('newRecipe', {newRecipe: recipe});

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

        const io = req.io;
        io.emit('recipeRemoved', { recipeId: id });

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
        const updatedRecipe = await Recipe.findOneAndUpdate({_id: id}, req.body, {
            new: true,
            runValidators: true,
            upsert: true
        });

        if (!updatedRecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        const io = req.io;

        if (req.body.shareToPublic) {
            io.emit('newRecipe', { newRecipe: updatedRecipe });
        } else if (req.body.shareToPublic === false) {
            io.emit('recipeRemoved', { recipeId: id });
        }

        return res.status(200).json(updatedRecipe);
    } catch (err) {
        console.error(`Error on update recipe ${err}`);
        return res.status(400).json({ message: err.message });
    }
};

// claud 3.5 sonnet 16:32 7/26/2024 get the correct favorite count on load
const handleGetAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.aggregate([
            {
                $lookup: {
                    from: 'favorites',
                    localField: '_id',
                    foreignField: 'recipeId',
                    as: 'favorites'
                }
            },
            {
                $addFields: {
                    favoriteCount: { $size: "$favorites" }
                }
            },
            {
              $lookup: {
                  from: 'users',
                  localField: 'userId',
                  foreignField: '_id',
                  as: 'userDetails'
              }
          },
          {
            $unwind: '$userDetails'
        },
        {
            $addFields: {
                userEmail: '$userDetails.email'
            }
        },

            {
                $project: {
                    favorites: 0 // Remove the favorites array from the output
                }
            }
        ]);
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes', error: error.message });
    }
};


const handleGetRecipesToPublic = async (req, res) => {
  try {
      const recipes = await Recipe.aggregate([
          {
              $match: { shareToPublic: true }
          },
          {
              $lookup: {
                  from: 'favorites',
                  localField: '_id',
                  foreignField: 'recipeId',
                  as: 'favorites'
              }
          },
          {
              $addFields: {
                  favoriteCount: { $size: "$favorites" }
              }
          },
          {
              $lookup: {
                  from: 'users',
                  localField: 'userId',
                  foreignField: '_id',
                  as: 'userDetails'
              }
          },
          {
              $unwind: '$userDetails'
          },
          {
              $addFields: {
                  userEmail: '$userDetails.email'
              }
          },
          {
              $project: {
                  favorites: 0 // Remove the favorites array from the output
              }
          }
      ]);
      res.json(recipes);
  } catch (error) {
      console.error('Error fetching recipes:', error);
      res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
};

module.exports = {
  handleGenerateRecipes,
  handleGetRecipe,
  handleCreateRecipe,
  handleDeleteRecipe,
  handleUpdateRecipe,
  handleGetAllRecipes,
  handleGetRecipesToPublic
};

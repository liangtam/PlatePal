const Recipe = require("../models/recipeModel");
const User = require("../models/userModel");
const Groq = require("groq-sdk");
require("dotenv").config();
const {v4: uuidv4} = require("uuid");

const handleGenerateRecipes = async (req, res) => {
    console.log("Trying to generate recipes with groq", req.query);
    let givenIngredients = req.query.ingredients;
    let allergies = req.query.allergies;
    let dislikedRecipes = req.query.dislikedRecipes;
    let preferences = req.query.preferences;
    try {
        const groq = new Groq({apiKey: `${process.env.GROQ_API_KEY}`});

        const schema = {
            $defs: {
                FoodProperties: {
                    properties: {
                        isVegan: {title: "Is the recipe vegan?", type: "boolean"},
                        isLactoseFree: {
                            title: "Is the recipe lactose free?",
                            type: "boolean",
                        },
                        isSpicy: {
                            title: "Does the recipe contain spicy ingredients like chili?",
                            type: "boolean",
                        },
                    },
                    required: ["isVegan", "isLactoseFree", "isSpicy"],
                    title: "FoodProperties",
                    type: "object",
                },
                Recipe: {
                    properties: {
                        name: {title: "Recipe name", type: "string"},
                        ingredients: {
                            items: {type: "string"},
                            title: "Recipe ingredients",
                            type: "array",
                        },
                        instructions: {
                            items: {type: "string"},
                            title: "Recipe instructions",
                            type: "array",
                        },
                        estimatedTime: {
                            title: "Estimated recipe cooking time in minutes",
                            type: "integer",
                        },
                        foodProperties: {
                            title: "Properties of the food",
                            type: "FoodProperties",
                        },
                        required: [
                            "name",
                            "ingredients",
                            "instructions",
                            "estimatedTime",
                            "foodProperties",
                        ],
                        title: "Recipe",
                        type: "object",
                    },
                },
            },
            properties: {
                recipes: {title: "Recipes", type: "array"},
            },
            required: ["recipes"],
            title: "Recipes",
            type: "object",
        };

        const recipeSchema = JSON.stringify(schema, null, 4);

        let message = `You are a recipe database that outputs at most 8 different recipes `;
        if (givenIngredients && givenIngredients.length > 0) {
            message += `that only include all ${givenIngredients} `;
        } else {
            message += `that are healthy.`;
        }
        message += "in JSON.";

        if (allergies && allergies.length > 0) {
            message += `But, the recipes must NEVER have ingredients that contain any of ${allergies}.`;
        }

        if (dislikedRecipes && dislikedRecipes.length > 0) {
            message += `\n The recipes cannot be any of ${dislikedRecipes}.`;
        }

        if (preferences) {
            if (preferences.isVegan === "true") {
                message +=
                    " All of the recipes MUST be vegan. Do NOT generate any recipes with meat in it.";
            }
            if (preferences.isLactoseFree === "true") {
                message += " ALl of the recipes must also be lactose free.";
            }

            if (preferences.isSpicy === "true") {
                message += " All the recipes must be spicy.";
            } else if (preferences.isNotSpicy === "true") {
                message += " All the recipes must NOT be spicy.";
            }

            if (preferences.maxTime) {
                message += `The recipes' estimated cooking time must be less than or equal to ${preferences.maxTime} minutes.`;
            }
        }
        message += `\n If the recipe is vegan, lactose-free, or spicy indicate in the food properties.`;

        message += `\nThe JSON object must use the schema: ${recipeSchema}.`;

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
            temperature: 0.9,
            stream: false,
            response_format: {type: "json_object"},
        });

        const json = await JSON.parse(chatCompletion.choices[0].message.content);
        const recipes = json.recipes;

        if (!recipes) {
            return res.status(400).json({error: "Could not generate recipes."});
        }

        console.log(recipes)
        const fullRecipes = await Promise.all(
            recipes.map(async (recipe) => {
                const encodedRecipeName = encodeURIComponent(recipe.name + " food");

                try {
                    const response = await fetch(
                        `https://api.pexels.com/v1/search?query=${encodedRecipeName}&per_page=2`,
                        {
                            headers: {
                                Authorization: process.env.PEXEL_API_KEY,
                            },
                        }
                    );
                    if (response.ok) {
                        const json = await response.json();
                        let imageUrl = "";
                        if (json.photos.length >= 1) {
                            imageUrl = json.photos[0].src.medium;
                        }
                        return (recipe = {
                            ...recipe,
                            generatedId: uuidv4(),
                            image: imageUrl,
                        });
                    }
                } catch (err) {
                    console.log("Could not get image for recipe " + recipe.name);
                    console.log(err.message);
                    return recipe;
                }
            })
        );

        return res.status(200).json(fullRecipes);
    } catch (err) {
        res.status(500).json({error: "Could not generate recipes."});
    }
};

const handleGetRecipe = async (req, res) => {
    try {
        const {id} = req.params;
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({message: "Recipe not found"});
        }
        return res.status(200).json(recipe);
    } catch (err) {
        res.status(400).json({message: "Could not fetch recipe."});
    }
};

const handleCreateRecipe = async (req, res) => {
    const {name, estimatedTime, userId, ingredients, instructions} = req.body;
    console.log(req.body);

    const foodProperties = await JSON.parse(req.body.foodProperties);
    let imageBase64 = null;
    if (req.file) {
        const base64String = req.file.buffer.toString("base64");
        imageBase64 = `data:${req.file.mimetype};base64,${base64String}`;
    }
    console.log("ingredients: ", ingredients);

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const recipe = await Recipe.create({
            name,
            ingredients,
            instructions,
            image: imageBase64,
            estimatedTime,
            userId,
            foodProperties,
        });
        if (!recipe) {
            return res.status(400).json({message: "Could not create recipe"});
        }
        user.recipes.push(recipe);
        await user.save();

        return res.status(201).json(recipe);
    } catch (err) {
        console.error(`Error on create recipe ${err}`);
        return res.status(500).json({message: "Internal error"});
    }
};

const handleDeleteRecipe = async (req, res) => {
    try {
        const {id} = req.params;

        const result = await Recipe.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({message: "Recipe not found"});
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
        io.emit("recipeRemoved", {recipeId: id});

        return res.status(200).json({message: "Successfully deleted recipe!"});
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({message: "Server error", error: error.message});
    }
};

const handleUpdateRecipe = async (req, res) => {
    let foodProperties;
    if (req.body.foodProperties) {
        foodProperties = JSON.parse(req.body.foodProperties);
    }
    let updateData;
    if (foodProperties) {
        updateData = {...req.body, foodProperties};
    } else {
        updateData = req.body;
    }
    try {
        const {id} = req.params;
        const updatedRecipe = await Recipe.findOneAndUpdate({_id: id}, updateData, {
            new: true,
            runValidators: true,
            upsert: true,
        });

        if (!updatedRecipe) {
            return res.status(404).json({message: "Recipe not found"});
        }

        const io = req.io;
        console.log(updatedRecipe);

        if (req.body.shareToPublic) {
            // Fetch the user's email
            const user = await User.findById(updatedRecipe.userId);
            if (user) {
                io.emit("newRecipe", {
                    newRecipe: {...updatedRecipe.toObject(), userEmail: user.email},
                });
            } else {
                console.error(`User not found for recipe ${updatedRecipe._id}`);
                io.emit("newRecipe", {
                    newRecipe: {...updatedRecipe.toObject(), userEmail: "Anonymous"},
                });
            }
        } else if (req.body.shareToPublic === false) {
            io.emit("recipeRemoved", {recipeId: id});
        }

        return res.status(200).json(updatedRecipe);
    } catch (err) {
        console.error(`Error on update recipe ${err}`);
        return res.status(400).json({message: err.message});
    }
};

// claud 3.5 sonnet 16:32 7/26/2024 get the correct favorite count on load
const handleGetAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.aggregate([
            {
                $lookup: {
                    from: "favorites",
                    localField: "_id",
                    foreignField: "recipeId",
                    as: "favorites",
                },
            },
            {
                $addFields: {
                    favoriteCount: {$size: "$favorites"},
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $unwind: "$userDetails",
            },
            {
                $addFields: {
                    userEmail: "$userDetails.email",
                },
            },

            {
                $project: {
                    favorites: 0, // Remove the favorites array from the output
                },
            },
        ]);
        res.json(recipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res
            .status(500)
            .json({message: "Error fetching recipes", error: error.message});
    }
};

const handleGetRecipesToPublic = async (req, res) => {
    try {
        const recipes = await Recipe.aggregate([
            {
                $match: {shareToPublic: true},
            },
            {
                $lookup: {
                    from: "favorites",
                    localField: "_id",
                    foreignField: "recipeId",
                    as: "favorites",
                },
            },
            {
                $addFields: {
                    favoriteCount: {$size: "$favorites"},
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $unwind: "$userDetails",
            },
            {
                $addFields: {
                    userEmail: "$userDetails.email",
                },
            },
            {
                $project: {
                    favorites: 0, // Remove the favorites array from the output
                },
            },
        ]);
        res.json(recipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res
            .status(500)
            .json({message: "Error fetching recipes", error: error.message});
    }
};

module.exports = {
    handleGenerateRecipes,
    handleGetRecipe,
    handleCreateRecipe,
    handleDeleteRecipe,
    handleUpdateRecipe,
    handleGetAllRecipes,
    handleGetRecipesToPublic,
};

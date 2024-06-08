export const dummyRecipe1 = {
  name: "Pizza",
  image:
    "https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg",
  ingredients: "salt, pepper",
  instructions: "put pizza in the oven",
};

export const dummyRecipe2 = {
  name: "Chicken Caesar Salad",
  image:
    "https://www.eatingwell.com/thmb/rmLlvSjdnJCCy_7iqqj3x7XS72c=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/chopped-power-salad-with-chicken-0ad93f1931524a679c0f8854d74e6e57.jpg",
  ingredients: "salt, pepper, chicken",
  instructions: "defroze chicken",
};

export const dummyUser = {
  _id: "defaultId",
  email: "dummyuser.email.com",
  recipes: [
    dummyRecipe1,
    dummyRecipe2
  ]
};


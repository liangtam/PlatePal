export const dummyRecipe1 = {
  _id: "test1",
  name: "Pizza",
  image:
    "https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg",
  ingredients: [
    "salt",
    "pepper",
    "flour",
    "peperroni",
    "mozzarella cheese",
    "tomato sauce",
  ],
  instructions: ["put pizza in the oven", "Baking for 40 mins"],
};

export const dummyRecipe2 = {
  _id: "test2",
  name: "Chicken Caesar Salad",
  image:
    "https://www.eatingwell.com/thmb/rmLlvSjdnJCCy_7iqqj3x7XS72c=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/chopped-power-salad-with-chicken-0ad93f1931524a679c0f8854d74e6e57.jpg",
  ingredients: [
    "salt",
    "pepper",
    "chicken",
    "lettuce",
    "bread crumbs",
    "cucumber",
    "caeser dressing",
    "cherry tomatoes",
    "parmesan cheese",
  ],
  instructions: ["defrost chicken", "boil water"],
};

export const dummyRecipe3 = {
  _id: "test3",
  name: "Teokbokki",
  image:
    "https://tiffanyangela.com/wp-content/uploads/2020/09/Tteokbokki-8-scaled-e1601441187516.jpg",
  ingredients: [
    "salt",
    "pepper",
    "green onion",
    "cheese",
    "rice cakes",
    "gocchujang"
  ],
  instructions: ["defrost chicken", "boil water"],
};

export const dummyRecipe4 = {
  _id: "test4",
  name: "Chow mein",
  image:
    "https://www.cookwithmanali.com/wp-content/uploads/2024/01/Veg-Chowmein-500x500.jpg",
  ingredients: [
    "salt",
    "pepper",
    "chow mein noodles",
    "garlic",
    "green onion",
    "chicken",
    "soy sauce"
  ],
  instructions: ["boil noodles in water", "put noodles in pan"],
};

export const dummyUser = {
  _id: "defaultId",
  email: "dummyuser.email.com",
  recipes: [dummyRecipe1, dummyRecipe2, dummyRecipe3],
};

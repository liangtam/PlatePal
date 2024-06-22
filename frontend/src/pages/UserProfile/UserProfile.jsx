import { useSelector } from "react-redux";
import styles from "./UserProfile.module.css";
import { useState } from "react";
import { ProfileRecipeSnippet } from "../../components";
import { ChakraProvider } from "@chakra-ui/react";

const UserProfile = () => {
  const user = useSelector((state) => state.user.value);

  const [recipes, setRecipes] = useState(user ? user.recipes : []);
  console.log(recipes)

  const handleDelete = (id) => {
    setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
  };

  return (
    <ChakraProvider>
      <div className="flex-col align-items-center">
        <div className="flex-col align-items-center" style={{ width: "80%" }}>
          <div className="marY-4 w-100 flex-row justify-content-between">
            <h2>{user && user.email}</h2>
            <div
              className="flex-row w-100"
              style={{ justifyContent: "flex-end" }}
            >
              <p
                className={`${styles.noOfRecipes} flex-row align-items-center pad-3 radius-10`}
              >
                Number of recipes: {recipes.length}
              </p>
            </div>
          </div>
          <div className="h-1 bg-base-1000 marY-3 w-100"></div>
          <div
            className={`${styles.recipes} flex-row gap-5 justify-content-center align-items-center padY-5`}
          >
            {recipes &&
              recipes.map((recipe, index) => {
                return (
                  <ProfileRecipeSnippet
                    key={index}
                    recipe={recipe}
                    onClick={() => handleDelete(recipe._id)}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default UserProfile;

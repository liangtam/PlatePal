import { useDispatch, useSelector } from "react-redux";
import styles from "./UserProfile.module.css";
import { useState } from "react";
import { ProfileRecipeSnippet, UserInfo } from "../../components";
import { deleteUserRecipe } from "../../redux/users/userSlice";

const UserProfile = () => {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  console.log(user.recipes);

  const handleDelete = (id) => {
    dispatch(deleteUserRecipe(id));
  };

  return (
      <div className={`${styles.container} flex-col align-items-center padT-5`}>
        <div className="flex-row gap-6" style={{ width: "80%" }}>
          <UserInfo user={user}/>
          <div className="flex-col gap-3 align-items-start">
            <h1 className="b"> Saved recipes </h1>
          <div
            className={`${styles.recipes} flex-row gap-5 justify-content-center align-items-center padY-5`}
          >
            {user.recipes &&
              user.recipes.map((recipe, index) => {
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
      </div>
  );
};

export default UserProfile;

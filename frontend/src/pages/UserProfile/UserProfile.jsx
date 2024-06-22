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
      <div className={`${styles.container} flex-col align-items-center padT-5 h-100`}>
        <div className="flex-row gap-6 h-100" style={{ width: "80%" }}>
          <UserInfo user={user}/>
          <div style={{overflow: 'auto', maxHeight: 'fit-content', height: '100%'}}>
          <div className="flex-col gap-3 align-items-start padL-5" style={{borderLeft: '1px solid rgb(214, 214, 214)'}}>
            <h1 className="b"> Saved recipes </h1>
          <div
            className={`${styles.recipes} flex-row gap-5 align-items-center padY-5`}
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
      </div>
  );
};

export default UserProfile;

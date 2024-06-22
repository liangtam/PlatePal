import React from "react";
import styles from "./ProfileRecipeSnippet.module.css";
import { useNavigate } from "react-router-dom";

const ProfileRecipeSnippet = ({ recipe, onClick }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div>
        <h3 className="padB-2" style={{ textAlign: "left" }}>
          {recipe && recipe.name}
        </h3>

        <div className="flex-row gap-3 w-100">
          <img className={styles.image} src={recipe.image} alt={recipe.name} />
          <div className={`${styles.ingredients}`}>
            <h3 className="padB-2">Ingredients</h3>
            {recipe &&
              recipe.ingredients.map((ingredient) => {
                return <div>{ingredient}</div>;
              })}
          </div>
        </div>
      </div>
      <div>
        <div className="h-1 bg-base-1000 marY-3 w-100"></div>

        <div className="flex-row w-100 gap-2" style={{justifyContent: 'flex-end'}}>
        <button className={styles.editBtn} disabled>
            Edit
          </button>
          <button className={styles.deleteBtn} onClick={onClick}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileRecipeSnippet;

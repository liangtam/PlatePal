import React from "react";
import styles from "./ProfileRecipeSnippet.module.css";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const ProfileRecipeSnippet = ({ fetchingData, setFetchingData, recipe, onClick }) => {
  const navigate = useNavigate();


  const handleDelete = async () => {
    try {
      const response = await api.delete('/recipes/' + recipe._id);
      if (response.status === 200) {
          alert('Successfully Deleted');
          setFetchingData(!fetchingData);
      } else {
          alert(response.data.error);
      }
  } catch (error) {
      if (error.response) {
          if (error.response.status >= 400 && error.response.status < 500) {
              alert(error.response.data.error || 'An error occurred.');
          } else {
              alert('Internal Server Error');
          }
      } else {
          alert('Network error or server is not reachable.');
      }
  }
  };


  return (
    <div className={styles.container}>
      <div>
        <h3 className="padB-2" style={{ textAlign: "left" }}>
          {recipe && recipe.name}
        </h3>

        <div className="profile flex-row gap-3 w-100">
          {/* <img className={styles.image} src={recipe.image} alt={recipe.name} /> */}
          <div className={`${styles.ingredients}`}>
            <h3 className="padB-2">Ingredients</h3>
            {recipe &&
              recipe.ingredients.map((ingredient) => {
                return <div>{ingredient}</div>;
              })}
          </div>
          <div className={`${styles.ingredients}`}>
            <h3 className="padB-2">Instructions</h3>
            {recipe &&
              recipe.instructions.map((instruction) => {
                return <div>{instruction}</div>;
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
          <button className={styles.deleteBtn} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileRecipeSnippet;

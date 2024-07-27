import React, { useState, useEffect } from "react";
import styles from "./ProfileRecipeSnippet.module.css";
import api from "../../api";
import defaultRecipeImage from "../../assets/455-platepal-logo-color.png";
import { deleteUserRecipe } from "../../redux/users/userSlice";
import { useDispatch } from "react-redux";

const ProfileRecipeSnippet = ({ fetchingData, setFetchingData, recipe }) => {
    const dispatch = useDispatch();
    const [isRecipeShared, setIsRecipeShare] = useState(recipe.shareToPublic ?? false);

    const setFallback = (e) => {
        e.target.src = defaultRecipeImage;
    };
    useEffect(()=>{
      setIsRecipeShare(recipe.shareToPublic ?? false);
    }, [fetchingData, recipe])

    const handleDelete = async () => {
        try {
            const response = await api.delete('/recipes/' + recipe._id);
            if (response.status === 200) {
                alert('Successfully Deleted');
                setFetchingData(!fetchingData);
                dispatch(deleteUserRecipe(recipe._id));
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

  //   const handleCreate = async () => {
  //     const filteredIngredients = ingredients.filter(item => item.trim() !== "");
  //     const filteredInstructions = instructions.filter(item => item.trim() !== "");

  //     const formData = new FormData();
  //     formData.append("name", name);
  //     formData.append("ingredients", filteredIngredients);
  //     formData.append("instructions", filteredInstructions);
  //     if (image) {
  //         formData.append("image", image);
  //     }
  //     formData.append("userId", userId);
  //     formData.append("estimatedTime", Number(estimatedTime));

  //     try {
  //         const response = await api.post('/recipes/', formData, {
  //             headers: {
  //                 'auth-token': localStorage.getItem('authToken'),
  //                 'Content-Type': 'multipart/form-data'
  //             }
  //         });
  //         if (response.status === 201) {
  //             alert('Successfully created');
  //             setFetchingData(!fetchingData);
  //             onClose();
  //         } else {
  //             alert(response.data.error);
  //         }
  //     } catch (error) {
  //         if (error.response) {
  //             if (error.response.status >= 400 && error.response.status < 500) {
  //                 alert(error.response.data.error || 'An error occurred.');
  //             } else {
  //                 alert('Internal Server Error');
  //             }
  //         } else {
  //             alert('Network error or server is not reachable.');
  //         }
  //     }
  //     setName("");
  //     setIngredients([""]);
  //     setInstructions([""]);
  //     setImage(null);
  //     setEstimatedTime("");
  // };

    const handleShare = async () => {
      
      const formData = {shareToPublic: !isRecipeShared};

      try {
        const response = await api.patch('/recipes/' + recipe._id, formData, {
          headers: {
              'auth-token': localStorage.getItem('authToken'),
              'Content-Type': 'application/json'
          }
      });
        if (response.status === 200) {
            alert('Successfully Updated');
            setFetchingData(!fetchingData);
           // dispatch(deleteUserRecipe(recipe._id));
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

    }

    return (
        <div className={styles.container}>
            <div>
                <h3 className="padB-2 font-weight-700" style={{ textAlign: "left" }}>
                    {recipe && recipe.name}
                </h3>

                <div className="profile flex-row gap-3 w-100">
                    {recipe && (
                        <img
                            className={styles.image}
                            src={recipe.image ? recipe.image : defaultRecipeImage}
                            onError={setFallback}
                            alt={recipe.name}
                        />
                    )}
                    <div className={`${styles.ingredients}`}>
                        <b className="padB-2">Ingredients</b>
                        {recipe && recipe.ingredients && Array.isArray(recipe.ingredients) &&
                            recipe.ingredients.map((ingredient, index) => (
                                <div key={index}>{ingredient}</div>
                            ))}
                    </div>
                    <div className={`${styles.ingredients}`}>
                        <b className="padB-2">Instructions</b>
                        {recipe && recipe.instructions && Array.isArray(recipe.instructions) &&
                            recipe.instructions.map((instruction, index) => (
                                <div key={index}>{instruction}</div>
                            ))}
                    </div>
                </div>
            </div>
            <div>
                <div className="h-1 bg-base-1000 marY-3 w-100"></div>

                <div className="flex-row w-100 gap-2" style={{ justifyContent: 'flex-end' }}>
                    {/* <button className={styles.editBtn} disabled>
            Edit
          </button> */}
                   <button className={styles.shareBtn} onClick={handleShare}>
                        {isRecipeShared ? "Private" : "Share"}
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

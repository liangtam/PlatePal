import React, {useEffect, useState} from "react";
import styles from "./ProfileRecipeSnippet.module.css";
import api from "../../api";
import noMedia from "../../assets/455-no-media.png";
import {deleteUserRecipe} from "../../redux/users/userSlice";
import {useDispatch} from "react-redux";
import EditRecipeModal from "../EditRecipeModal/EditRecipeModal";
import vegIcon from "../../assets/vegan_flaticon.png";
import lactoseFreeIcon from "../../assets/lactose-free_flaticon.png";
import spicyIcon from "../../assets/chili-pepper_flaticon.png";

const ProfileRecipeSnippet = ({fetchingData, setFetchingData, recipe}) => {
    const dispatch = useDispatch();
    const [isRecipeShared, setIsRecipeShare] = useState(
        recipe.shareToPublic ?? false
    );
    const [isEditModelShow, setIsEditModelShow] = useState(false);

    const setFallback = (e) => {
        e.target.src = noMedia;
    };
    useEffect(() => {
        setIsRecipeShare(recipe.shareToPublic ?? false);
    }, [fetchingData, recipe]);

    const handleDelete = async () => {
        try {
            const response = await api.delete("/recipes/" + recipe._id);
            if (response.status === 200) {
                alert("Successfully Deleted");
                setFetchingData(!fetchingData);
                dispatch(deleteUserRecipe(recipe._id));
            } else {
                alert(response.data.error);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status >= 400 && error.response.status < 500) {
                    alert(error.response.data.error || "An error occurred.");
                } else {
                    alert("Internal Server Error");
                }
            } else {
                alert("Network error or server is not reachable.");
            }
        }
    };

    const handleModalClose = () => {
        setIsEditModelShow(false);
    };

    const handleEdit = () => {
        setIsEditModelShow(true);
    };

    const handleShare = async () => {
        const formData = {shareToPublic: !isRecipeShared};

        try {
            const response = await api.patch("/recipes/" + recipe._id, formData, {
                headers: {
                    "auth-token": localStorage.getItem("authToken"),
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                if (!isRecipeShared) {
                    alert(`Your recipe is now in the 'Explore' page!`);
                } else {
                    alert(`Your recipe is now taken off the 'Explore' page.`);
                }
                setFetchingData(!fetchingData);
            } else {
                alert(response.data.error);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status >= 400 && error.response.status < 500) {
                    alert(error.response.data.error || "An error occurred.");
                } else {
                    alert("Internal Server Error");
                }
            } else {
                alert("Network error or server is not reachable.");
            }
        }
    };

    return (
        <div className={styles.container}>
            <div>
                <h3 className="padB-2 font-weight-700" style={{textAlign: "left"}}>
                    {recipe && recipe.name}
                </h3>

                <div className="profile flex-row gap-3 w-100">
                    {recipe && (
                        <img
                            className={styles.image}
                            src={recipe.image ? recipe.image : noMedia}
                            onError={setFallback}
                            alt={recipe.name}
                        />
                    )}
                    <div
                        className="flex-col gap-2"
                        style={{justifyContent: "space-between"}}
                    >
                        <div className="flex-col gap-2">
                            <div className="flex-row gap-2" style={{alignItems: "start"}}>
                                <b>Cooking time:</b>
                                ~{recipe.estimatedTime} min
                            </div>
                            {recipe.favouriteCount && <div className="flex-row gap-2" style={{alignItems: "start"}}>
                                <b>Likes:</b>
                                {recipe.favouriteCount}
                            </div>}
                            {recipe.foodProperties &&
                                (recipe.foodProperties.isVegan ||
                                    recipe.foodProperties.isSpicy ||
                                    recipe.foodProperties.isLactoseFree) && (
                                    <div
                                        justify="center"
                                        className="flex-row gap-2 recipe-snippet-properties padY-1"
                                    >
                                        {recipe.foodProperties.isVegan && (
                                            <img
                                                src={vegIcon}
                                                className="recipe-snippet-icon"
                                                aria-label="Vegan"
                                            />
                                        )}
                                        {recipe.foodProperties.isLactoseFree && (
                                            <img
                                                src={lactoseFreeIcon}
                                                className="recipe-snippet-icon"
                                                aria-label="Lactose free"
                                            />
                                        )}
                                        {recipe.foodProperties.isSpicy && (
                                            <img
                                                src={spicyIcon}
                                                className="recipe-snippet-icon"
                                                aria-label="spicy"
                                            />
                                        )}
                                    </div>
                                )}
                        </div>

                        <div
                            className="flex-row w-100 gap-2"
                            style={{justifyContent: "flex-end"}}
                        >
                            <button className={styles.editBtn} onClick={handleEdit}>
                                Edit
                            </button>
                            <button className={styles.shareBtn} onClick={handleShare}>
                                {isRecipeShared ? "Unshare" : "Share"}
                            </button>
                            <button className={styles.deleteBtn} onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isEditModelShow && (
                <EditRecipeModal
                    recipe={recipe}
                    isModalShow={isEditModelShow}
                    setIsModalShow={setIsEditModelShow}
                    setFetchingData={setFetchingData}
                    fetchingData={fetchingData}
                />
            )}
        </div>
    );
};

export default ProfileRecipeSnippet;

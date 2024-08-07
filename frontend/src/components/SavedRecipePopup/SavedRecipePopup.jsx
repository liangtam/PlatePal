import styles from "./SavedRecipePopup.module.css";

const SavedRecipePopup = ({recipe, onClose}) => {
    return (
        <dialog className={styles.popup}>
            <div className="flex-col gap-3">
                <h3>{recipe.name}</h3>
                <img src={recipe.image}/>
                <div className="flex-col gap-2 align-items-start">
                    <h3>Ingredients</h3>
                    {recipe &&
                        recipe.ingredients.map((ingredient) => {
                            return <div>{ingredient}</div>;
                        })}
                </div>
                <div className="flex-col gap-2 align-items-start">
                    <h3>Instructions</h3>
                    {recipe &&
                        recipe.ingredients.map((ingredient) => {
                            return <div>{ingredient}</div>;
                        })}
                </div>
                <div className={styles.popupButtons}>
                    <button onClick={onClose} className="pad-2">
                        Close
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default SavedRecipePopup;

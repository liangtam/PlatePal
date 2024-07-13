import styles from "./UserInfo.module.css";
import userAvatar from "../../assets/455-user-avatar.png";
import CreateRecipe from "../CreateRecipe/CreateRecipe";

const UserInfo = ({ fetchingData, setFetchingData, user, recipes, favouriteRecipes }) => {
  return (
    <div className={styles.container} >
        <div className="flex-col gap-2 align-items-center marB-3">
        <img src={userAvatar} alt="user-avatar" style={{ width: "120px" }} />
        <h3>{user.email}</h3>
        </div>

      <div className="h-1 bg-base-1000 marT-3 marB-5 w-100"></div>
      <div className="flex-col gap-2 align-items-start w-100">
      <span>
        <b>Saved recipes: </b> {recipes.length}
      </span>
      <span>
        <b>Created recipes: </b> {favouriteRecipes.length}
      </span>
      <p>Bro's cooking today!</p>
      </div>
      <CreateRecipe fetchingData = {fetchingData} setFetchingData = {setFetchingData} ></CreateRecipe>
    </div>
  );
};

export default UserInfo;

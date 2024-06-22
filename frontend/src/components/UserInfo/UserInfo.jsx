import styles from "./UserInfo.module.css";
import userAvatar from "../../assets/455-user-avatar.png";

const UserInfo = ({ user }) => {
  return (
    <div className={styles.container} >
        <div className="flex-col gap-2 align-items-center marB-3">
        <img src={userAvatar} alt="user-avatar" style={{ width: "120px" }} />
        <h3>{user.email}</h3>
        </div>

      <div className="h-1 bg-base-1000 marT-3 marB-5 w-100"></div>
      <div className="flex-col gap-2 align-items-start w-100">
      <span>
        <b>Saved recipes: </b> {user.recipes.length}
      </span>
      <span>
        <b>Created recipes: </b> 0
      </span>
      <p>Bro's cooking today!</p>
      </div>
      <button className="pad-3 marY-5 w-100 radius-25" style={{border: '1px solid grey', background: 'none'}} disabled>Create Recipe</button>

    </div>
  );
};

export default UserInfo;

import styles from "./UserInfo.module.css";
import userAvatar from "../../assets/455-user-avatar.png";

const UserInfo = ({ user }) => {
  return (
    <div className={styles.container} >
        <div className="flex-col gap-2 align-items-center">
        <img src={userAvatar} alt="user-avatar" style={{ width: "120px" }} />
        <h3>{user.email}</h3>
        </div>

      <div className="h-1 bg-base-1000 marY-3 w-100"></div>
      <div className="flex-col gap-2">
      <span>
        <b>Saved recipes: </b> {user.recipes.length}
      </span>
      <p>Bro's cooking!</p>
      </div>

    </div>
  );
};

export default UserInfo;

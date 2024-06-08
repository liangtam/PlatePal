import { useSelector } from "react-redux";

const UserProfile = () => {
    const user = useSelector((state) => state.user.value);

    return (
        <div>
            <h1>{user.email}</h1>
        </div>
    )
}

export default UserProfile;

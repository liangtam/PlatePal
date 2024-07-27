import { useDispatch, useSelector } from "react-redux";
import styles from "./UserProfile.module.css";
import { useState, useEffect } from "react";
import api from "../../api.js";
import { ProfileRecipeSnippet, UserInfo } from "../../components";
import { setUserRecipes } from "../../redux/users/userSlice";

const UserProfile = () => {
  const [fetchingData, setFetchingData] = useState(false);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const fetchUserRecipes = async () => {
    try {
      const response = await api.get('/users/recipes/' + user.id);
      if (response.status >= 200 && response.status < 300) {
        console.log('Request was successful:', response.data);
        dispatch(setUserRecipes(response.data));
      } else {
          alert("An error occurred")
      }
    } catch (err) {
      alert("Could not load user recipes.")
    }
  }

  useEffect(() => {
    fetchUserRecipes();
  }, [fetchingData]);

  return (
      <div className={`${styles.container} flex-col align-items-center padT-5 h-100 bg-radial`}>
        <div className="flex-row gap-6 h-100" style={{ width: "80%" }}>
          {user && user.recipes && <UserInfo user={user} fetchingData={fetchingData} setFetchingData={setFetchingData} recipes={user.recipes} favouriteRecipes={[]}/>}
          <div style={{overflow: 'auto', maxHeight: 'fit-content', height: '100%'}}>
          <div className="flex-col gap-3 align-items-start padL-5" style={{borderLeft: '1px solid white'}}>
            <h1 className="font-size-7 font-weight-700" style={{color: "#b86c1c"}}> Saved recipes </h1>
          <div
            className={`${styles.recipes} flex-row gap-5 align-items-center padY-5`}
          >
            {user.recipes &&
              user.recipes.map((recipe, index) => {
                return (
                  <ProfileRecipeSnippet
                    key={index}
                    recipe={recipe}
                    fetchingData={fetchingData}
                    setFetchingData={setFetchingData}
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

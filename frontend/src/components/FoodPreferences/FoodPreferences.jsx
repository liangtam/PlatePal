import { useContext } from "react";
import { FoodPreferencesContext } from "../context/FoodPreferencesContext";
import vegIcon from "../../assets/vegan_flaticon.png";
import lactoseFreeIcon from "../../assets/lactose-free_flaticon.png";
import spicyIcon from "../../assets/chili-pepper_flaticon.png";
import timeIcon from "../../assets/time-left_flaticon.png";
import styles from "./FoodPreferences.module.css";
const FoodPreferences = () => {
  const { preferences, setPreferences } = useContext(FoodPreferencesContext);
  console.log(preferences);

  return (
    <div className={styles.preferenceOptions}>
      {/* <h1 className="font-size-5 font-weight-500 marT-1 flex-col base-50" style={{height: '100%', justifyContent: 'end'}}>Preferences</h1> */}

      <div
        className={`${styles.option} ${
          preferences.isVegan ? styles.checked : ""
        }`}
        onClick={() =>
          setPreferences({
            ...preferences,
            isVegan: !preferences.isVegan,
          })
        }
      >
        <img src={vegIcon} className={styles.icon} />
        <span className={styles.text}>Vegan only</span>
      </div>
      <div
        className={`${styles.option} ${
          preferences.isLactoseFree ? styles.checked : ""
        }`}
      >
        <div
          className="flex-row align-items-center"
          onClick={() =>
            setPreferences({
              ...preferences,
              isLactoseFree: !preferences.isLactoseFree,
            })
          }
        >
          <img src={lactoseFreeIcon} className={styles.icon} />
          <span className={styles.text}>Lactose free</span>
        </div>
      </div>
      <div
        className={`${styles.option} ${
          preferences.isNotSpicy ? styles.checked : ""
        }`}
        onClick={() =>
          setPreferences({
            ...preferences,
            isNotSpicy: !preferences.isNotSpicy,
          })
        }
      >
        <img src={spicyIcon} className={styles.icon} />
        <span className={styles.text}>No spicy</span>
      </div>
      <div className={styles.time}>
        <img src={timeIcon} className={styles.icon} />
        <div className="flex-col gap-2">
          <input
            type="range"
            min="1"
            max="180"
            step="1"
            value={preferences.maxTime}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                maxTime: parseInt(e.target.value),
              })
            }
          />
          Max cooking time: {preferences.maxTime} min
        </div>
      </div>
    </div>
  );
};

export default FoodPreferences;

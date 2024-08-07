import {useContext} from "react";
import {FoodPreferencesContext} from "../context/FoodPreferencesContext";
import vegIcon from "../../assets/vegan_flaticon.png";
import lactoseFreeIcon from "../../assets/lactose-free_flaticon.png";
import spicyIcon from "../../assets/chili-pepper_flaticon.png";
import notSpicyIcon from "../../assets/not-spicy.png";
import timeIcon from "../../assets/time-left_flaticon.png";
import styles from "./FoodPreferences.module.css";

const FoodPreferences = ({handleSave}) => {
    const {preferences, setPreferences} = useContext(FoodPreferencesContext);
    console.log(preferences);

    const handleNotSpicyClick = () => {
        if (preferences.isNotSpicy) {
            setPreferences({
                ...preferences,
                isNotSpicy: false,
            });
            return;
        }
        setPreferences({
            ...preferences,
            isNotSpicy: true,
            isSpicy: false,
        });
    };

    const handleSpicyClick = () => {
        if (preferences.isSpicy) {
            setPreferences({
                ...preferences,
                isSpicy: false,
            });
            return;
        }
        setPreferences({
            ...preferences,
            isNotSpicy: false,
            isSpicy: true,
        });
    };

    return (
        <div className={styles.preferenceOptions}>

            <div
                className={`${styles.shortOption} ${
                    preferences.isVegan ? styles.checked : ""
                }`}
                onClick={() =>
                    setPreferences({
                        ...preferences,
                        isVegan: !preferences.isVegan,
                    })
                }
            >
                <img src={vegIcon} className={styles.icon}/>
                <span className={styles.text}>Vegan</span>
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
                    <img src={lactoseFreeIcon} className={styles.icon}/>
                    <span className={styles.text}>Lactose free</span>
                </div>
            </div>
            <div
                className={`${styles.option} ${
                    preferences.isNotSpicy ? styles.checked : ""
                }`}
                onClick={handleNotSpicyClick}
            >
                <img src={notSpicyIcon} className={styles.icon}/>
                <span className={styles.text}>No spicy</span>
            </div>
            <div
                className={`${styles.shortOption} ${
                    preferences.isSpicy ? styles.checked : ""
                }`}
                onClick={handleSpicyClick}
            >
                <img src={spicyIcon} className={styles.icon}/>
                <span className={styles.text}>Spicy</span>
            </div>
            <div className={styles.time}>
                <img src={timeIcon} className={styles.icon}/>
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
            <button className={styles.saveBtn} onClick={handleSave}>
                Save
            </button>
        </div>
    );
};

export default FoodPreferences;

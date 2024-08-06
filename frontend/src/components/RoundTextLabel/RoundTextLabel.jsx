import styles from "./RoundTextLabel.module.css";

const RoundTextLabel = ({text, classNames, leftIcon}) => {

    return (
        <div className={`${styles.text} ${classNames}`}>
            {leftIcon && 
            <img src={leftIcon} className={styles.icon}/>}
            {text}
        </div>
    )
}

export default RoundTextLabel;
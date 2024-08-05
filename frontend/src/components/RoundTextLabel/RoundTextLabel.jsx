import styles from "./RoundTextLabel.module.css";

const RoundTextLabel = ({text, className}) => {

    return (
        <div className={`${styles.text} ${className}`}>
            {text}
        </div>
    )
}

export default RoundTextLabel;
import { MessageType } from "../../constants/constants";
import styles from "./ResponseMessage.module.css";

const ResponseMessage = ({type, message}) => {
    return (
        <div className={`${styles.message} ${styles[type]}`}>
            {message}
        </div>
    )
}

export default ResponseMessage;


import {
  ChakraProvider,
  Flex,
  Wrap,
  WrapItem,
  Tag,
  TagCloseButton,
  TagLabel,
} from "@chakra-ui/react";
import styles from "./Allergies.module.css";
import AllergiesInputBar from "../InputBars/AllergiesInputBar";
import { useContext } from "react";
import { AllergiesContext } from "../context/AllergiesContext";
import RoundTextLabel from "../RoundTextLabel/RoundTextLabel";

const Allergies = ({ handleSave }) => {
  const { allergies, setAllergies } = useContext(AllergiesContext);

  const handleTagClose = (allergyToRemove) => {
    setAllergies(allergies.filter((allergy) => allergy !== allergyToRemove));
  };
  return (
    <ChakraProvider>
      <Flex
        className={`${styles.container} justify-content-between align-items-between soft-light-shadow`}
        direction="column"
      >
        <div className={styles.title}>
          <b>Allergies / Disliked Ingredients</b>
        </div>
        <div className="flex-col pad-3">
        <AllergiesInputBar />

          <div className="flex-row allergies gap-2">
            {allergies &&
              allergies.length > 0 &&
              allergies.map((allergy, index) => (
                <WrapItem key={index}>
                  <Tag size="lg" className={styles.allergyTag}>
                    <TagLabel>{allergy}</TagLabel>
                    <TagCloseButton
                      onClick={() => handleTagClose(allergy)}
                      className={styles.tagCloseButtonn}
                    />
                  </Tag>
                </WrapItem>
              ))}
            {!allergies ||
              (allergies.length === 0 && (
                <div className="w-100">You have no allergies.</div>
              ))}
          </div>
          <Flex justify="flex-end">
            <button
              onClick={handleSave}
              className={`${styles.btn} padY-2 padX-3 radius-5 font-weight-500`}
            >
              Save
            </button>
          </Flex>
        </div>
      </Flex>
    </ChakraProvider>
  );
};

export default Allergies;

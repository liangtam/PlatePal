import { ChakraProvider, Box, Flex, Button } from "@chakra-ui/react";
import styles from "./Allergies.module.css";
import { useContext } from "react";
import { AllergiesContext } from "../context/AllergiesContext";
import AllergiesInputBar from "../InputBars/AllergiesInputBar";

const Allergies = ({ handleSave }) => {
  const { allergies, setAllergies } = useContext(AllergiesContext);

  return (
    <ChakraProvider>
      <Flex
        className={`${styles.container} justify-content-between align-items-between soft-light-shadow`}
        direction="column"
      >
        <b className={styles.title}>Allergies</b>
        <div className="flex-col pad-3">
          <AllergiesInputBar />
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

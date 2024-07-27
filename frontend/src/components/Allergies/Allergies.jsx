import { ChakraProvider, Box, Flex, Button } from "@chakra-ui/react";
import styles from "./Allergies.module.css";
import { useContext } from "react";
import { AllergiesContext } from "../context/AllergiesContext";
import AllergiesInputBar from "../InputBars/AllergiesInputBar";

const Allergies = ({ handleSave }) => {

    const {allergies, setAllergies} = useContext(AllergiesContext);

    const handleRemoveAllergy = (allergyToRemove) => {
        setAllergies(allergies.filter((allergy) => allergy !== allergyToRemove));
    }

  return (
    <ChakraProvider>
      <Flex className={`${styles.container} justify-content-between align-items-between`} direction="column">
        <b>Allergies</b>
        <div className="h-1 bg-base-1000 marT-3 w-100"></div>
        <AllergiesInputBar/>
        <Flex justify="flex-end">
          <button onClick={handleSave} disabled={!allergies || allergies.length === 0} className={`${styles.btn} padY-2 padX-3 radius-5 yellow-400 font-weight-500`}>Save</button>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default Allergies;

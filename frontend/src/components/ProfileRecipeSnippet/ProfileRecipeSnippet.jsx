import React from "react";
import {
  Flex,
  Card,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";

const ProfileRecipeSnippet = ({ recipe, onClick }) => {
  return (
    <div>
      <Card maxW="sm" onClick={() => onClick()}>
        <CardBody>
          <Stack spacing="3">
            <Heading size="md">{recipe.name}</Heading>

            <Image
              src={recipe.image}
              width={200}
              height={200}
              borderRadius="lg"
            />
          </Stack>
          <Stack align="flex-start" mt='3'>
            <b>Ingredients:</b>
            <Flex align="flex-start" spacing="2">
              {recipe &&
                recipe.ingredients.map((ingredient, index) => {
                  return <Text>{`${ingredient}${index===recipe.ingredients.length - 1 ? "" : ','}`}</Text>;
                })}
            </Flex>
            <b>Instructions:</b>
            <Flex align="flex-start" spacing="2">
              {recipe &&
                recipe.instructions.map((instruction, index) => {
                  return <Text>{`${instruction}${index===recipe.instructions.length - 1 ? "" : ','}`}</Text>;
                })}
            </Flex>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <Flex justify="flex-end" w="100%">
            <ButtonGroup spacing="2">
              <Button
                size="sm"
                onClick={() => onClick()}
                variant="solid"
                colorScheme="red"
              >
                Delete
              </Button>
            </ButtonGroup>
          </Flex>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileRecipeSnippet;

import React from "react";
import {
  Flex,
  Text,
  CardBody,
  Heading,
  Card, IconButton
} from "@chakra-ui/react";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
import vegIcon from "../../assets/vegan_flaticon.png";
import lactoseFreeIcon from "../../assets/lactose-free_flaticon.png";
import spicyIcon from "../../assets/chili-pepper_flaticon.png";
import noMedia from "../../assets/455-no-media.png";

import styles from "./ExploreBox.module.css";
import RoundTextLabel from "../RoundTextLabel/RoundTextLabel";

const ExploreBox = ({ recipe, onClick, onFavorite, isFavorite }) => {
  const handleFavorite = (e) => {
    e.stopPropagation();
    onFavorite(recipe._id);
  };

  return (
      <Card
          onClick={onClick}
          className={`${styles.exploreCard}`}
          display="flex"
          flexDirection="column"
      >
        <CardBody
            className={styles.body}
            style={{ backgroundImage: `url(${recipe.image || noMedia})` }}
        >
          <Flex justify="space-between">
            <Flex className={styles.heading} gap="1" alignItems="center">
              <IconButton
                  icon={isFavorite ? <BiSolidHeart /> : <BiHeart />}
                  onClick={handleFavorite}
                  aria-label={isFavorite ? "Unfavorite" : "Favorite"}
                  variant="ghost"
                  colorScheme={isFavorite ? "red" : "gray"}
              />
              <Text>{recipe.favoriteCount || 0}</Text>
            </Flex>
          {recipe.foodProperties &&
            (recipe.foodProperties.isVegan ||
              recipe.foodProperties.isSpicy ||
              recipe.foodProperties.isLactoseFree) && (
              <div
                justify="center"
                className="flex-row gap-2 padY-1 padX-3 bg-base-50 align-items-center"
                style={{
                  boxShadow: "0px 5px 10px rgba(113, 113, 113, 0.5)",
                  borderRadius: "30px",
                }}
              >
                {recipe.foodProperties.isVegan && (
                  <img
                    src={vegIcon}
                    className="recipe-snippet-icon"
                    aria-label="Vegan"
                  />
                )}
                {recipe.foodProperties.isLactoseFree && (
                  <img
                    src={lactoseFreeIcon}
                    className="recipe-snippet-icon"
                    aria-label="Lactose free"
                  />
                )}
                {recipe.foodProperties.isSpicy && (
                  <img
                    src={spicyIcon}
                    className="recipe-snippet-icon"
                    aria-label="spicy"
                  />
                )}
              </div>
            )}
        </Flex>

      </CardBody>

      <div
        className={styles.footer}
      >
        <Heading size="sm" fontSize={17} textAlign={'left'}>
          {recipe.name}
        </Heading>
        <Text fontSize={15}>Estimated time: {recipe.estimatedTime} min</Text>
        <Flex flex="1" gap="3" alignItems="center" flexWrap="wrap">
          <RoundTextLabel text={recipe.userEmail?.split("@")[0]} classNames={"font-weight-500 font-size-2"}/>
        </Flex>
      </div>
    </Card>
  );
};

export default ExploreBox;

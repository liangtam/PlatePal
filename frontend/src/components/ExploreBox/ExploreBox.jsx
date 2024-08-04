import React from "react";
import { Box, Flex, Text, Button, CardFooter, CardBody, Avatar, Heading, Card, CardHeader, Image } from "@chakra-ui/react";
import { BiLike } from "react-icons/bi";
import userAvatar from "../../assets/455-user-avatar.png";

import styles from "./ExploreBox.module.css";

const ExploreBox = ({ recipe, onClick, onLike, isFavorite }) => {
    return (
        <Card
            onClick={() => onClick()}
            className={`${styles.ExploreCard}`}
            height="100%"
            display="flex"
            flexDirection="column"
        >
            <CardHeader>
                <Flex spacing='4'>
                    <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                        <Avatar size='sm' src={userAvatar} />
                        <Box>
                            <Heading className={`${styles.Heading}`} size='sm'>{(recipe.userEmail)?.split('@')[0]}</Heading>
                        </Box>
                    </Flex>
                </Flex>
            </CardHeader>
            <CardBody flex="1">
                <Heading size='sm' mb={2}>{recipe.name}</Heading>
                <Text>
                    Estimated time: {recipe.estimatedTime}
                </Text>
            </CardBody>
            <Image
                className={`${styles.image}`}
                objectFit='cover'
                src={recipe.image}
                alt={recipe.name}
            />
            <CardFooter
                justify='space-between'
                flexWrap='wrap'
                sx={{
                    '& > button': {
                        minW: '136px',
                    },
                }}
            >
                <Button
                    flex='1'
                    variant='ghost'
                    leftIcon={<BiLike />}
                    onClick={(e) => {
                        e.stopPropagation();
                        onLike();
                    }}
                    style={{width: '110px'}}
                >
                    {isFavorite ? 'Unlike' : 'Like'} {recipe.favoriteCount || 0}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ExploreBox;

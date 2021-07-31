import React, { FC, useState, useEffect } from 'react';
import 'firebase/auth';
import 'firebase/firestore';
import { useAuthentication } from 'hooks/authentication';
import firebase from 'firebase/app';
import { Box, Text, Icon, Tooltip } from '@chakra-ui/react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

export type LikeButtonWithCountProps = {
    count: number;
    isLiked: boolean;
};

const LikeButton: FC = () => {
    const { user } = useAuthentication();

    useEffect(() => {}, []);

    const [isLike, setIsLike] = useState(false);

    const toggleLike = () => {
        setIsLike(!isLike);
    };

    return (
        <Box display="flex" alignItems="center" color="gray.500">
            <Tooltip label="いいね！" bg="gray.400" fontSize="11px">
                <Text cursor="pointer" onClick={toggleLike}>
                    <Icon
                        as={isLike ? AiFillHeart : AiOutlineHeart}
                        mr="2.5"
                        fontSize="22px"
                        color={isLike ? 'red.400' : ''}
                    />
                </Text>
            </Tooltip>
        </Box>
    );
};
export default LikeButton;

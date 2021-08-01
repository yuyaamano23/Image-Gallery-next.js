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

export type PostIdProps = {
    postId: string;
};

const LikeButton: FC<PostIdProps> = ({ postId }) => {
    const { user } = useAuthentication();

    useEffect(() => {}, []);

    const [isLike, setIsLike] = useState(false);

    const like = async () => {
        try {
            // userId,postIdのref型をstoreへ保存
            const userRef = firebase
                .firestore()
                .collection('users')
                .doc(user.uid);

            const postRef = firebase
                .firestore()
                .collection('posts')
                .doc(postId);

            const db = firebase
                .firestore()
                .collection('likes_posts_users')
                .doc(user.uid);

            // フィールドに値が1つもないとudpateできないので、初めてのいいねの時はsetを使う
            const firstLike = await db.get();

            if (!firstLike.exists) {
                await db.set({
                    items_array: [postRef],
                    updateAt: new Date(),
                });
                console.log(postId, 'はじめてのいいねをしました');
            } else {
                await db.update({
                    items_array:
                        firebase.firestore.FieldValue.arrayUnion(postRef),
                    updateAt: new Date(),
                });
                console.log(postId, 'に2回目以降のいいねをしました');
            }
        } catch (err) {
            console.log('いいねに失敗しました');
        }
    };
    const unlike = async () => {
        try {
            // userId,postIdのref型をstoreへ保存
            const userRef = firebase
                .firestore()
                .collection('users')
                .doc(user.uid);

            const postRef = firebase
                .firestore()
                .collection('posts')
                .doc(postId);

            // await firebase
            //     .firestore()
            //     .collection('likes_posts_users')
            //     .where('userId', '==', userRef)
            //     .where('postId', '==', postRef)
            //     .delete()

            console.log(postId, 'のいいねを解除しました');
        } catch (err) {
            console.log('いいね解除に失敗しました');
        }
    };

    const toggleLike = () => {
        if (!user) {
            return;
        }

        isLike ? unlike() : like();
        setIsLike(!isLike);
    };

    return (
        <Box display="flex" alignItems="center" color="gray.500">
            <Tooltip
                label={user ? 'いいね' : 'いいねするにはログインが必要です'}
                bg="gray.400"
                fontSize="11px"
            >
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

import React, { FC, useEffect, useState } from 'react';
import { User } from 'models/User';
import { Post } from 'models/Post';
import firebase from 'firebase/app';
import Image from 'next/image';
import Link from 'next/link';
import styles from 'styles/components/postsIndex.module.scss';
import LikeButton from 'components/likeButton';
import { DeleteIcon } from '@chakra-ui/icons';
import { Tooltip, useToast } from '@chakra-ui/react';

type MyPostsProps = {
    user: User;
};

const MyPosts: FC<MyPostsProps> = ({ user }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isReloaded, setIsReloaded] = useState<boolean>(true);
    const toast = useToast();

    useEffect(() => {
        async function loadPosts() {
            const userRef = firebase
                .firestore()
                .collection('users')
                .doc(user?.uid);

            const querySnapshot = await firebase
                .firestore()
                .collection('posts')
                .where('userId', '==', userRef)
                .orderBy('createdAt', 'desc')
                .get();
            const fetchPosts = querySnapshot.docs.map((doc) => {
                const fetchPost = doc.data() as Post;
                fetchPost.id = doc.id;

                return fetchPost;
            });
            setPosts(fetchPosts);
            setIsReloaded(true);
        }
        // useEffectはasyncが使えないから関数を分けている;
        loadPosts();
    }, [user?.uid, isReloaded]);

    async function deletePost(post: Post) {
        const db = firebase.firestore();
        const postRef = firebase.firestore().collection('posts').doc(post.id);

        // postsコレクションから削除
        await db
            .collection('posts')
            .doc(post.id)
            .delete()
            .then(() =>
                console.log('postsコレクションからpostIDを削除しました')
            );
        // commentsコレクションから
        // まずは取得
        const fromCommentsQuerySnapshot = await db
            .collection('comments')
            .where('postId', '==', postRef)
            .get();
        // 削除
        fromCommentsQuerySnapshot.docs.forEach(async (doc) => {
            await doc.ref
                .delete()
                .then(() =>
                    console.log('commentsコレクションからpostIDを削除しました')
                );
        });
        // likes_posts_usersコレクションから
        // まずは取得
        const fromLikesPostsUsers = await db
            .collection('likes_posts_users')
            .where('posts_array', 'array-contains', postRef)
            .get();
        // 削除
        fromLikesPostsUsers.docs.forEach(async (doc) => {
            await doc.ref
                .update({
                    posts_array:
                        firebase.firestore.FieldValue.arrayRemove(postRef), // usersフィールド（配列）から要素'user1','user2'を削除
                })
                .then(() =>
                    console.log(
                        'likes_posts_usersコレクションからpotIDを削除しました'
                    )
                );
        });

        // storageから画像ファイルを削除
        const desertRef = firebase.storage().refFromURL(post.downloadUrl);
        desertRef.delete().then(() => {
            console.log('storageから画像を削除しました');
        });

        setIsReloaded(false);

        toast({
            title: '投稿を削除しました',
            status: 'info',
            duration: 5000,
            isClosable: true,
        });
    }

    return (
        <React.Fragment>
            <p>マイページからのみ自分の投稿を削除できます</p>
            {posts.map((post) => {
                const parsedCreatedAt = new Date(post.createdAt.seconds * 1000);
                return (
                    <div className={styles.link} key={post.id}>
                        <div className={styles.card}>
                            <Link href={`/postDetail/${post.id}`} passHref>
                                <a>
                                    <Image
                                        src={`${post.downloadUrl}`}
                                        // この数字を大きくする分には比率は崩れなさそう
                                        width={1000}
                                        height={1000}
                                        objectFit="contain"
                                        alt={`${post.title}`}
                                        className={styles.img}
                                    />
                                </a>
                            </Link>
                            <div className={styles.container}>
                                <Link href={`/postDetail/${post.id}`} passHref>
                                    <a>
                                        <h4>
                                            <b>{post.title}</b>
                                        </h4>
                                        <p>
                                            {parsedCreatedAt
                                                .toLocaleString('ja-JP')
                                                .toString()}
                                        </p>
                                        <p>投稿者:{user.name}</p>
                                    </a>
                                </Link>
                                <LikeButton postId={post.id} />
                                <Tooltip
                                    label={'投稿を削除します'}
                                    bg="gray.400"
                                    fontSize="11px"
                                >
                                    <DeleteIcon
                                        boxSize={6}
                                        cursor={'pointer'}
                                        onClick={() => deletePost(post)}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                );
            })}
        </React.Fragment>
    );
};
export default MyPosts;

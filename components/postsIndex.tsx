import React, { FC, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import Image from 'next/image';
import { Post } from 'models/Post';
import styles from 'styles/components/postsIndex.module.scss';
import Link from 'next/link';
import {
    Box,
    Button,
    Divider,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    Spinner,
    Stack,
    useColorModeValue,
} from '@chakra-ui/react';
import { RepeatIcon, Search2Icon } from '@chakra-ui/icons';
import LikeButton from './likeButton';

const PostsIndex: FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isReloaded, setIsReloaded] = useState<boolean>(true);
    const cardBg = useColorModeValue('white', 'gray.800');

    let [value, setValue] = React.useState('');

    let handleInputChange = (e) => {
        let inputValue = e.target.value;
        setValue(inputValue);
    };

    useEffect(() => {
        let isMounted = true;
        async function loadPosts() {
            const querySnapshot = await firebase
                .firestore()
                .collection('posts')
                // 登校日順に並び替え
                .orderBy('createdAt', 'desc')
                .get();

            const fetchPosts = querySnapshot.docs.map((doc) => {
                const fetchPost = doc.data() as Post;

                fetchPost.id = doc.id;
                fetchPost.authorId = doc.data().userId.id;

                return fetchPost;
            });

            // mapの中で非同期関数を呼ぶ,こんな感じでPromise.all()で囲むと全部取れます。
            // 紐づいたauthorNameを取得したい。
            await Promise.all(
                fetchPosts.map(async (i) => {
                    const fetchUser = await firebase
                        .firestore()
                        .collection('users')
                        .doc(i.authorId)
                        .get();

                    i.authorName = fetchUser.data().name;
                    return;
                })
            );
            if (isMounted) {
                setPosts(fetchPosts);
            }
        }
        // useEffectはasyncが使えないから関数を分けている;
        loadPosts();
        setIsReloaded(true);
        return () => {
            isMounted = false;
        };
    }, [isReloaded]);

    return (
        <React.Fragment>
            <div className={styles.top}>
                <Button
                    onClick={() => {
                        setIsReloaded(false);
                    }}
                >
                    <RepeatIcon w={6} h={6} color="#58b0b6" />
                </Button>
                <Stack spacing={6}>
                    <InputGroup>
                        <InputLeftElement
                            pointerEvents="none"
                            // eslint-disable-next-line react/no-children-prop
                            children={<Search2Icon color="black" />}
                        />
                        <Input
                            value={value}
                            onChange={handleInputChange}
                            placeholder="search words"
                            color="black"
                            bg="gray.300"
                            w={400}
                        />
                    </InputGroup>
                </Stack>
            </div>
            <p>{value}</p>
            <h1 className={styles.h1}>投稿一覧ページ</h1>

            <div className={styles.flex}>
                {posts ? (
                    <>
                        {posts.map((post) => {
                            const parsedCreatedAt = new Date(
                                post.createdAt.seconds * 1000
                            );
                            return (
                                <div className={styles.link} key={post.id}>
                                    <Box bg={cardBg}>
                                        <div className={styles.card}>
                                            <div className={styles.imageBlock}>
                                                <Link
                                                    href={`/postDetail/${post.id}`}
                                                    passHref
                                                >
                                                    <a>
                                                        <Image
                                                            src={`${post.downloadUrl}`}
                                                            // この数字を大きくする分には比率は崩れなさそう
                                                            width={1000}
                                                            height={680}
                                                            objectFit="contain"
                                                            alt={`${post.title}`}
                                                            className={
                                                                styles.img
                                                            }
                                                        />
                                                    </a>
                                                </Link>
                                            </div>
                                            <div className={styles.container}>
                                                <Link
                                                    href={`/postDetail/${post.id}`}
                                                    passHref
                                                >
                                                    <a>
                                                        <h4
                                                            className={
                                                                styles.title
                                                            }
                                                        >
                                                            <b>
                                                                『{post.title}』
                                                            </b>
                                                        </h4>
                                                        <div
                                                            className={
                                                                styles.imgInfo
                                                            }
                                                        >
                                                            <p>
                                                                {parsedCreatedAt
                                                                    .toLocaleString(
                                                                        'ja-JP'
                                                                    )
                                                                    .toString()}
                                                            </p>
                                                            <p>
                                                                投稿者:
                                                                {
                                                                    post.authorName
                                                                }
                                                            </p>
                                                        </div>
                                                    </a>
                                                </Link>
                                                <LikeButton postId={post.id} />
                                            </div>
                                        </div>
                                    </Box>
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <>
                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="blue.500"
                            size="xl"
                        />
                    </>
                )}
            </div>
        </React.Fragment>
    );
};
export default PostsIndex;

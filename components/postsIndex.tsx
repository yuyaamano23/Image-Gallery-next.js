import React, { FC, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import Image from 'next/image';
import { Post } from 'models/Post';
import styles from 'styles/components/postsIndex.module.scss';
import Link from 'next/link';
import { Button } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';

const PostsIndex: FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
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

            setPosts(fetchPosts);
        }
        // useEffectはasyncが使えないから関数を分けている;
        loadPosts();
    }, []);

    return (
        <React.Fragment>
            <Button
                onClick={() => {
                    location.reload();
                }}
            >
                <RepeatIcon w={6} h={6} color="red.500" />
            </Button>

            {posts.map((post) => {
                const parsedCreatedAt = new Date(post.createdAt.seconds * 1000);
                return (
                    <div className={styles.link} key={post.id}>
                        <Link href={`/postDetail/${post.id}`} passHref>
                            <div>
                                <div className={styles.card}>
                                    <Image
                                        src={`${post.downloadUrl}`}
                                        // この数字を大きくする分には比率は崩れなさそう
                                        width={1000}
                                        height={1000}
                                        objectFit="contain"
                                        alt={`${post.title}`}
                                        className={styles.img}
                                    />
                                    <div className={styles.container}>
                                        <h4>
                                            <b>{post.title}</b>
                                        </h4>
                                        <p>
                                            {parsedCreatedAt
                                                .toLocaleString('ja-JP')
                                                .toString()}
                                        </p>
                                        <p>投稿者:{post.authorName}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            })}
        </React.Fragment>
    );
};
export default PostsIndex;

import React, { FC, useEffect, useState } from 'react';
import { User } from 'models/User';
import { Post } from 'models/Post';
import firebase from 'firebase/app';
import Image from 'next/image';
import Link from 'next/link';
import styles from 'styles/components/postsIndex.module.scss';
import LikeButton from 'components/likeButton';

type MyPostsProps = {
    user: User;
};

const MyPost: FC<MyPostsProps> = ({ user }) => {
    const [posts, setPosts] = useState<Post[]>([]);

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
        }
        // useEffectはasyncが使えないから関数を分けている;
        loadPosts();
    }, [user?.uid]);

    return (
        <React.Fragment>
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
                            </div>
                        </div>
                    </div>
                );
            })}
        </React.Fragment>
    );
};
export default MyPost;

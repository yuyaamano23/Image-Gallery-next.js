import React, { FC, useEffect, useState } from 'react';
import { User } from 'models/User';
import { Post } from 'models/Post';
import firebase from 'firebase/app';
import Image from 'next/image';
import Link from 'next/link';
import styles from 'styles/components/postsIndex.module.scss';
import LikeButton from 'components/likeButton';

type LikedPostsProps = {
    user: User;
};

const LikedPosts: FC<LikedPostsProps> = ({ user }) => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        async function loadPosts() {
            // 初回レンダリングを考慮
            if (user?.uid === undefined) {
                return;
            }

            const userRef = firebase
                .firestore()
                .collection('users')
                .doc(user?.uid);

            const likesPostsUsersSnapshot = await firebase
                .firestore()
                .collection('likes_posts_users')
                .doc(user?.uid)
                .get();

            const fetchPosts = likesPostsUsersSnapshot
                .data()
                .posts_array.map((doc, index) => {
                    return likesPostsUsersSnapshot.data()?.posts_array[index]
                        .id;
                });

            console.log(fetchPosts);

            // setPosts(fetchPosts);
        }
        // useEffectはasyncが使えないから関数を分けている;
        loadPosts();
    }, [user?.uid]);

    return (
        <React.Fragment>
            aaaaaa
            {/* {posts.map((post) => {
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
            })} */}
        </React.Fragment>
    );
};
export default LikedPosts;

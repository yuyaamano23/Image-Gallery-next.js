import React, { FC, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import Image from 'next/image';
import { Post } from 'models/Post';
import styles from 'styles/components/postsIndex.module.scss';

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

                return fetchPost;
            });
            console.log(fetchPosts);
            setPosts(fetchPosts);
        }
        // useEffectはasyncが使えないから関数を分けている;
        loadPosts();
    }, []);

    return (
        <React.Fragment>
            {posts.map((post) => {
                const parsedCreatedAt = new Date(post.createdAt.seconds * 1000);
                return (
                    <div key={post.id}>
                        <div className={styles.card}>
                            <Image
                                src={`${post.downloadUrl}`}
                                width={200}
                                height={200}
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
                            </div>
                        </div>
                    </div>
                );
            })}
        </React.Fragment>
    );
};
export default PostsIndex;

import React, { FC, useEffect, useState } from 'react';
import { User } from 'models/User';
import { Post } from 'models/Post';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import Image from 'next/image';
import Link from 'next/link';
import styles from 'styles/components/postsIndex.module.scss';

type Query = {
    uid: string;
};

const UserMypage: FC = () => {
    const [user, setUser] = useState<User>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const router = useRouter();
    const query = router.query as Query;

    useEffect(() => {
        // 初回レンダリングを考慮するために query に値がある場合だけ処理するように調整します。
        if (query.uid === undefined) {
            return;
        }

        async function loadUser() {
            const doc = await firebase
                .firestore()
                .collection('users')
                .doc(query.uid)
                .get();

            if (!doc.exists) {
                return;
            }

            const gotUser = doc.data() as User;
            gotUser.uid = doc.id;
            setUser(gotUser);
        }
        // useEffectはasyncが使えないから関数を分けている;
        loadUser();

        async function loadPosts() {
            const userRef = firebase
                .firestore()
                .collection('users')
                .doc(query.uid);

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
    }, [query.uid]);

    return (
        <React.Fragment>
            <div>{user ? user.name : 'ロード中...'}さんのページ</div>
            <div>いままでの投稿</div>
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
                                        <p>投稿者:{user.name}</p>
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
export default UserMypage;

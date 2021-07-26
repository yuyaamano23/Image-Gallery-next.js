import React, { FC, useEffect, useState } from 'react';
import { Post } from 'models/Post';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import styles from 'styles/components/postsIndex.module.scss';
import Image from 'next/image';

type Query = {
    postId: string;
};

const PostDetail: FC = () => {
    const [post, setPost] = useState<Post>(null);
    const router = useRouter();
    const query = router.query as Query;

    useEffect(() => {
        // 初回レンダリングを考慮するために query に値がある場合だけ処理するように調整します。
        if (query.postId === undefined) {
            return;
        }

        async function loadPost() {
            const doc = await firebase
                .firestore()
                .collection('posts')
                .doc(query.postId)
                .get();

            if (!doc.exists) {
                return;
            }

            const gotPost = doc.data() as Post;
            gotPost.id = doc.id;
            gotPost.createdAt = new Date(gotPost.createdAt.seconds * 1000);
            setPost(gotPost);
        }
        // useEffectはasyncが使えないから関数を分けている;
        loadPost();
    }, [query.postId]);

    return (
        <div>
            {post ? (
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
                            {post.createdAt.toLocaleString('ja-JP').toString()}
                        </p>
                    </div>
                </div>
            ) : (
                'ロード中...'
            )}
        </div>
    );
};
export default PostDetail;

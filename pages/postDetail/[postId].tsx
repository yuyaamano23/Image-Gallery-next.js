import React, { FC, useEffect, useState } from 'react';
import { Post } from 'models/Post';
import { Comment } from 'models/Comment';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import styles from 'styles/pages/postId.module.scss';
import Image from 'next/image';
import { Textarea, Text, Button } from '@chakra-ui/react';
import { useAuthentication } from 'hooks/authentication';
import { AddIcon, ChatIcon } from '@chakra-ui/icons';
import LikeButton from 'components/likeButton';

type Query = {
    postId: string;
};

const PostDetail: FC = () => {
    const { user } = useAuthentication();
    const [post, setPost] = useState<Post>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const router = useRouter();
    const query = router.query as Query;

    let [value, setValue] = React.useState('');

    let handleInputChange = (e) => {
        let inputValue = e.target.value;
        setValue(inputValue);
    };

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
            // 紐づいたauthorNameを取得したい。
            const fetchUser = await firebase
                .firestore()
                .collection('users')
                .doc(doc.data().userId.id)
                .get();
            gotPost.authorName = fetchUser.data().name;

            setPost(gotPost);
        }
        async function loadComments() {
            const postRef = firebase
                .firestore()
                .collection('posts')
                .doc(query.postId);

            const querySnapshot = await firebase
                .firestore()
                .collection('comments')
                .where('postId', '==', postRef)
                .orderBy('createdAt', 'desc')
                .get();

            const fetchComments = querySnapshot.docs.map((doc) => {
                const fetchComment = doc.data() as Comment;
                fetchComment.id = doc.id;

                return fetchComment;
            });
            setComments(fetchComments);
        }
        // useEffectはasyncが使えないから関数を分けている;
        loadPost();
        loadComments();
    }, [query.postId]);

    const createComment = (e) => {
        e.preventDefault();
        try {
            // userIdのref型をstoreへ保存
            const userRef = firebase
                .firestore()
                .collection('users')
                .doc(user.uid);

            // postIdのref型をstoreへ保存
            const postRef = firebase
                .firestore()
                .collection('posts')
                .doc(post.id);

            firebase.firestore().collection('comments').doc().set({
                body: value,
                createdAt: new Date(),
                userId: userRef,
                postId: postRef,
            });

            setValue('');
            console.log('コメントを追加しました');
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <React.Fragment>
            {post ? (
                <div>
                    画像詳細ページです
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
                                {post.createdAt
                                    .toLocaleString('ja-JP')
                                    .toString()}
                            </p>
                            <p>投稿者:{post.authorName}</p>
                            <LikeButton />
                        </div>
                    </div>
                    <div>
                        <Text mb="8px">【コメント一覧】</Text>
                        {comments.map((comment) => {
                            const parsedCreatedAt = new Date(
                                comment.createdAt.seconds * 1000
                            );
                            return (
                                <div
                                    className={styles.comment}
                                    key={comment.id}
                                >
                                    <ChatIcon w={6} h={6} />
                                    <p>{comment.body}</p>
                                    <p>
                                        {parsedCreatedAt
                                            .toLocaleString('ja-JP')
                                            .toString()}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        <Text mb="8px">コメントを投稿する{value}</Text>
                        <Textarea
                            value={value}
                            onChange={handleInputChange}
                            placeholder="くそみてぃな写真ですね"
                            size="sm"
                            style={{ width: '500px' }}
                        />
                        <Button
                            onClick={createComment}
                            bgColor="tomato"
                            style={{
                                opacity: '0.7',
                            }}
                        >
                            追加する
                        </Button>
                    </div>
                </div>
            ) : (
                'ロード中...'
            )}
        </React.Fragment>
    );
};
export default PostDetail;

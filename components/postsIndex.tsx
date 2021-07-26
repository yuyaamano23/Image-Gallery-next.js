import React, { FC, useEffect, useState } from 'react';
import firebase from 'firebase/app';

interface Post {
    id: string;
    downloadUrl: string;
    title: string;
    createdAt: string;
}

const PostsIndex: FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    useEffect(() => {
        async function loadPosts() {
            const querySnapshot = await firebase
                .firestore()
                .collection('posts')
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
            {posts.map((post) => (
                // kyeはpostDoc.idnにしたい
                <div key={post.createdAt}>
                    <p>fetchpost↓</p>
                    <p>{post.title}</p>
                </div>
            ))}
        </React.Fragment>
    );
};
export default PostsIndex;

import Head from 'next/head';
import Image from 'next/image';
import Uploader from 'components/uploader';
import PostsIndex from 'components/postsIndex';
import React from 'react';

export default function Home() {
    return (
        <React.Fragment>
            <div>投稿一覧ページです</div>
            <PostsIndex />
            <Uploader />
        </React.Fragment>
    );
}

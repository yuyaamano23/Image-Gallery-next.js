import Uploader from 'components/uploader';
import PostsIndex from 'components/postsIndex';
import React from 'react';

export default function Home() {
    return (
        <React.Fragment>
            <PostsIndex />
            <Uploader />
        </React.Fragment>
    );
}

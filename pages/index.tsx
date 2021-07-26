import Head from 'next/head';
import Image from 'next/image';
import Uploader from 'components/uploader';
import PostsIndex from 'components/postsIndex';
import React from 'react';
import { Box, chakra } from '@chakra-ui/react';

export default function Home() {
    return (
        <React.Fragment>
            <Box>
                <chakra.h1 color="tomato">Hello, World!!</chakra.h1>
            </Box>
            <div>投稿一覧ページです</div>
            <PostsIndex />
            <Uploader />
        </React.Fragment>
    );
}

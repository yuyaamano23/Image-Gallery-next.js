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
                <chakra.h1>投稿一覧ページ</chakra.h1>
            </Box>
            <PostsIndex />
            <Uploader />
        </React.Fragment>
    );
}

import React, { FC } from 'react';
import firebase from 'firebase/app';
import Link from 'next/link';
import { Button, useToast } from '@chakra-ui/react';

const Logout: FC = () => {
    const toast = useToast();

    const logout = async () => {
        try {
            await firebase.auth().signOut();
            toast({
                title: 'ログアウトをしました',
                description: 'またきてね!!!!',
                status: 'info',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <Link href="/" passHref>
            <div onClick={logout}>
                <a>ログアウト</a>
            </div>
        </Link>
    );
};
export default Logout;

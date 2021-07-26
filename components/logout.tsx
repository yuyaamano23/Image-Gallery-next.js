import React, { FC } from 'react';
import firebase from 'firebase/app';
import Link from 'next/link';
import { Button } from '@chakra-ui/react';

const logout = async () => {
    try {
        await firebase.auth().signOut();
    } catch (error) {
        console.log(error.message);
    }
};

const Logout: FC = () => {
    return (
        <button onClick={logout} className="btn btn-danger">
            <Link href="/" passHref>
                <Button>
                    <a>ログアウト</a>
                </Button>
            </Link>
        </button>
    );
};
export default Logout;

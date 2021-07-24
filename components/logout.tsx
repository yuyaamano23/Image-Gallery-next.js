import React, { FC } from 'react';
import firebase from 'firebase/app';
import Link from 'next/link';

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
            <Link href="/">
                <a>ログアウト</a>
            </Link>
        </button>
    );
};
export default Logout;

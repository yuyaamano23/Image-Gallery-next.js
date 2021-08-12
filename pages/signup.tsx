import React, { FC, useState, useEffect } from 'react';
import 'firebase/auth';
import 'firebase/firestore';
import Router from 'next/router';
import { useAuthentication } from 'hooks/authentication';
import firebase from 'firebase/app';
import Link from 'next/link';
import GoogleLoginButton from 'components/googleLogin';
import { useToast } from '@chakra-ui/react';

const Signup: FC = () => {
    const { user } = useAuthentication();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const toast = useToast();

    useEffect(() => {
        user && Router.push('/');
        // 第2引数にuserを指定してあげないとauthentication.tsのuseEffectよりも先にここのuseEffectが呼ばれてしまう
    }, [user]);

    const createUser = async (e) => {
        e.preventDefault();
        try {
            //emailとpwを使って登録。currentUserでログイン中のユーザを取得して氏名の登録も同時に行う。
            await firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(() => {
                    let currentUser = firebase.auth().currentUser;
                    if (currentUser) {
                        currentUser
                            .updateProfile({
                                displayName: name,
                            })
                            .then(() => {
                                Router.push('/');
                            });
                    }
                    firebase
                        .firestore()
                        .collection('users')
                        .doc(currentUser.uid)
                        .set({
                            name: name,
                            createdAt: new Date(),
                        });
                });
            toast({
                title: '新規ユーザを作成しました',
                description: '画像の投稿と、いいねができます',
                status: 'info',
                duration: 5000,
                isClosable: true,
            });
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <div style={{ marginTop: '65px' }}>
            <h2>新規登録</h2>
            <form onSubmit={createUser}>
                <div className="form-group">
                    <label htmlFor="name">氏名:</label>
                    <input
                        type="text"
                        name="name"
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">メールアドレス:</label>
                    <input
                        type="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">パスワード:</label>
                    <input
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-success">
                    add!
                </button>
            </form>
            <button>
                <Link href="/login">
                    <a>ログイン画面へ</a>
                </Link>
            </button>
            <GoogleLoginButton />
        </div>
    );
};
export default Signup;

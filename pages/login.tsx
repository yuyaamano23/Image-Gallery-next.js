import React, { FC, useState, useEffect } from 'react';
import 'firebase/auth';
import 'firebase/firestore';
import Router from 'next/router';
import Link from 'next/link';
import { useAuthentication } from 'hooks/authentication';
import firebase from 'firebase/app';
import GoogleLoginButton from 'components/googleLogin';
import { useToast } from '@chakra-ui/react';

const Login: FC = () => {
    const { user } = useAuthentication();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const toast = useToast();

    useEffect(() => {
        user && Router.push('/');
        // 第2引数にuserを指定してあげないとauthentication.tsのuseEffectよりも先にここのuseEffectが呼ばれてしまう
    }, [user]);

    const login = async (e) => {
        e.preventDefault();
        try {
            //emailとpwでログイン
            await firebase.auth().signInWithEmailAndPassword(email, password);
            toast({
                title: 'ログインしました',
                description: '画像の投稿と、いいねができます',
                status: 'info',
                duration: 5000,
                isClosable: true,
            });
            Router.push('/');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{ marginTop: '65px' }}>
            <h2>ログイン</h2>
            <form onSubmit={login}>
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
                    login!
                </button>
            </form>
            <button>
                <Link href="/signup">
                    <a>新規登録画面へ</a>
                </Link>
            </button>
            <GoogleLoginButton />
        </div>
    );
};

export default Login;

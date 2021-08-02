import React, { FC, useState, useEffect } from 'react';
import 'firebase/auth';
import 'firebase/firestore';
import Router from 'next/router';
import Link from 'next/link';
import { useAuthentication } from 'hooks/authentication';
import firebase from 'firebase/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const Login: FC = () => {
    const { user } = useAuthentication();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    useEffect(() => {
        user && Router.push('/');
        // 第2引数にuserを指定してあげないとauthentication.tsのuseEffectよりも先にここのuseEffectが呼ばれてしまう
    }, [user]);

    const login = async (e) => {
        e.preventDefault();
        try {
            //emailとpwでログイン
            await firebase.auth().signInWithEmailAndPassword(email, password);
            Router.push('/');
        } catch (err) {
            alert(err.message);
        }
    };

    const createUserIfNotfound = async () => {
        let currentUser = firebase.auth().currentUser;
        const doc = await firebase
            .firestore()
            .collection('users')
            .doc(currentUser.uid)
            .get();

        if (doc.exists) {
            // すでに登録済み
            return;
        } else {
            await firebase
                .firestore()
                .collection('users')
                .doc(currentUser.uid)
                .set({
                    name: currentUser.displayName,
                    createdAt: new Date(),
                });
            console.log('createUserwithGoogle');
        }
    };

    // Configure FirebaseUI.
    const uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // We will display Google and Facebook as auth providers.
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
        credentialHelper: 'none',
        // calbacksに以下のように関数を与えることで実行される。
        callbacks: {
            // Avoid redirects after sign-in.

            signInSuccessWithAuthResult: () => {
                createUserIfNotfound();
                // Booleanを返さなきゃ型エラー起きる
                return true;
            },
        },
    };

    return (
        <div>
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
            <StyledFirebaseAuth
                uiConfig={uiConfig}
                firebaseAuth={firebase.auth()}
            />
        </div>
    );
};

export default Login;

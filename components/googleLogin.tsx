import React, { FC } from 'react';
import 'firebase/auth';
import 'firebase/firestore';
import firebase from 'firebase/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useToast } from '@chakra-ui/react';

const GoogleLoginButton: FC = () => {
    const toast = useToast();

    const createUserIfNotfound = async () => {
        let currentUser = firebase.auth().currentUser;
        toast({
            title: 'ログインしました',
            description: '画像の投稿と、いいねができます',
            status: 'info',
            duration: 5000,
            isClosable: true,
        });
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
        <>
            <StyledFirebaseAuth
                uiConfig={uiConfig}
                firebaseAuth={firebase.auth()}
            />
        </>
    );
};

export default GoogleLoginButton;

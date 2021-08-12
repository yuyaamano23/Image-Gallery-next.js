import firebase from 'firebase/app';
import { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';
import { User } from 'models/User';

const userState = atom<User>({
    key: 'user',
    default: null,
});

export function useAuthentication() {
    const [user, setUser] = useRecoilState(userState);

    useEffect(() => {
        if (user !== null) {
            return;
        }
        firebase.auth().onAuthStateChanged(function (firebaseUser) {
            if (firebaseUser) {
                const loginUesr: User = {
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName,
                    photoUrl: firebaseUser.photoURL,
                };
                setUser(loginUesr);
            } else {
                // User is signed out.
                setUser(null);
            }
        });
    }, []);
    return { user };
}

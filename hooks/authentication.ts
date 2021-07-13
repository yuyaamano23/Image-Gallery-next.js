import firebase from "firebase/app";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { User } from "models/User";

const userState = atom<User>({
	key: "user",
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
				console.log("auth.tsnの");
				console.log(firebaseUser);
				setUser({
					uid: firebaseUser.uid,
					name: firebaseUser.displayName,
				});
			} else {
				// User is signed out.
				setUser(null);
				console.log("set null");
			}
		});
	}, []);
	return { user };
}

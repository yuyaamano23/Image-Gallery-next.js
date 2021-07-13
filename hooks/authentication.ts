import firebase from "firebase/app";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { User } from "models/User";

const userState = atom<User>({
	key: "user",
	default: null,
});

async function createUserIfNotFound(user: User) {
	const userRef = firebase.firestore().collection("users").doc(user.uid);
	const doc = await userRef.get();
	if (doc.exists) {
		return;
	}

	await userRef.set({
		name: user.name,
	});
}

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
				const loginUesr: User = {
					uid: firebaseUser.uid,
					name: firebaseUser.displayName,
				};
				setUser(loginUesr);
				createUserIfNotFound(loginUesr);
			} else {
				// User is signed out.
				setUser(null);
				console.log("set null");
			}
		});
	}, []);
	return { user };
}

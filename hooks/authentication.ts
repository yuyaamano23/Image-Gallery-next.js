import firebase from "firebase/app";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";

const userState = atom({
	key: "user",
	default: null,
});

export function useAuthentication() {
	const [user, setUser] = useRecoilState(userState);

	useEffect(() => {
		if (user !== null) {
			return;
		}
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				console.log(user);
			} else {
				// User is signed out.
				setUser(null);
				console.log("set null");
			}
		});
	}, []);
	return { user };
}

import React, { FC } from "react";
import firebase from "firebase/app";

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
			Logout
		</button>
	);
};
export default Logout;

import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import { useAuthentication } from "hooks/authentication";
import firebase from "firebase/app";
import Link from "next/link";

const logout = async () => {
	try {
		await firebase.auth().signOut();
	} catch (error) {
		console.log(error.message);
	}
};

export default function Home() {
	const { user } = useAuthentication();
	return (
		<div>
			<Header />
			<div>投稿一覧ページ</div>
			<div>
				{user ? (
					<button onClick={logout} className="btn btn-danger">
						Logout
					</button>
				) : (
					<Link href="/login">
						<button>ログインする</button>
					</Link>
				)}
			</div>
		</div>
	);
}

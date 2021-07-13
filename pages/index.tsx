import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import { useAuthentication } from "hooks/authentication";

export default function Home() {
	const { user } = useAuthentication();
	return (
		<div>
			<Header />
			<div>投稿一覧ページ</div>
			<p>{user?.name} </p>
		</div>
	);
}

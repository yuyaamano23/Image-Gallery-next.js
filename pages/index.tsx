import Head from 'next/head';
import Image from 'next/image';
import Logout from 'components/logout';
import { useAuthentication } from 'hooks/authentication';
import Link from 'next/link';

export default function Home() {
    const { user } = useAuthentication();
    return (
        <div>
            <div>投稿一覧ページ</div>
            <div>
                {user ? (
                    <Logout />
                ) : (
                    <Link href="/login" passHref>
                        <button>ログインする</button>
                    </Link>
                )}
            </div>
        </div>
    );
}

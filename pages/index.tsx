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
                    <div>
                        <Link href="/login" passHref>
                            <button>ログインする</button>
                        </Link>
                        <button className="w-24 m-4 p-4 rounded-sm bg-yellow-500 text-center text-white">
                            test
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

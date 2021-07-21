import React, { FC } from 'react';
import styles from 'styles/components/Header.module.scss';
import { useAuthentication } from 'hooks/authentication';
import Logout from 'components/logout';
import Link from 'next/link';

const Header: FC = () => {
    const { user } = useAuthentication();
    return (
        <div>
            <div className="bg-red-500">
                <button>
                    <Link href="/">
                        <a>投稿一覧ページへ</a>
                    </Link>
                </button>
                <div>
                    {user ? (
                        <div>
                            <Logout />
                            <button>
                                <Link href={`/mypage/${user.uid}`}>
                                    <a>マイページ</a>
                                </Link>
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" passHref>
                            <button>ログインする</button>
                        </Link>
                    )}
                </div>
            </div>
            <div className={styles.test}>Header.module.scssの確認</div>
        </div>
    );
};
export default Header;

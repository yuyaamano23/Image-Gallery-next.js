import React, { FC, useEffect, useState } from 'react';
import styles from 'styles/components/Header.module.scss';
import { useAuthentication } from 'hooks/authentication';
import Logout from 'components/logout';
import Link from 'next/link';
import firebase from 'firebase/app';
import { User } from 'models/User';

const Header: FC = () => {
    const { user } = useAuthentication();
    const [NotRecoilUser, setNotRecoilUser] = useState<User>(null);

    useEffect(() => {
        // 初回レンダリングを考慮するために user.uid に値がある場合だけ処理するように調整します。
        if (user?.uid === undefined) {
            return;
        }

        async function loadUser() {
            const doc = await firebase
                .firestore()
                .collection('users')
                .doc(user.uid)
                .get();

            if (!doc.exists) {
                return;
            }

            const gotUser = doc.data() as User;
            gotUser.uid = doc.id;
            setNotRecoilUser(gotUser);
        }
        // useEffectはasyncが使えないから関数を分けている;
        loadUser();
    }, [user]);
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
                            <div>ようこそ{NotRecoilUser?.name}さん</div>
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

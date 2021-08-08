import React, { FC, useEffect, useState } from 'react';
import styles from 'styles/components/Header.module.scss';
import Image from 'next/image';
import { useAuthentication } from 'hooks/authentication';
import Logout from 'components/logout';
import Link from 'next/link';
import firebase from 'firebase/app';
import { User } from 'models/User';
import {
    Button,
    useColorModeValue,
    IconButton,
    IconButtonProps,
    useColorMode,
    Box,
    Spinner,
} from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

type ColorModeSwitcherProps = Omit<IconButtonProps, 'aria-label'>;

const Header: FC = (props: ColorModeSwitcherProps) => {
    const { user } = useAuthentication();
    const [stateUser, setStateUser] = useState<User>(null);
    const { toggleColorMode } = useColorMode();
    const text = useColorModeValue('dark', 'light');
    const SwitchIcon = useColorModeValue(FaMoon, FaSun);

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
            setStateUser(gotUser);
        }
        // useEffectはasyncが使えないから関数を分けている;
        loadUser();
    }, [user]);
    return (
        <Box boxShadow="2xl" p="6" rounded="md">
            <Link href="/" passHref>
                <Button>
                    <a>投稿一覧ページへ</a>
                </Button>
            </Link>
            <header>
                <IconButton
                    size="md"
                    fontSize="lg"
                    variant="ghost"
                    color="current"
                    marginLeft="2"
                    onClick={toggleColorMode}
                    icon={<SwitchIcon />}
                    aria-label={`Switch to ${text} mode`}
                    {...props}
                />
            </header>
            <div>
                {user ? (
                    <div>
                        <Logout />
                        <Link href={`/mypage/${user.uid}`} passHref>
                            <Button>
                                <a>マイページ</a>
                            </Button>
                        </Link>
                        <div>
                            ようこそ
                            {stateUser ? stateUser.name : <Spinner />}
                            さん
                        </div>
                        <Image
                            src={`${user.photoUrl}`}
                            alt="プロフィール画像"
                            objectFit="contain"
                            width={40}
                            height={40}
                        />
                    </div>
                ) : (
                    <Link href="/login" passHref>
                        <Button>ログインする</Button>
                    </Link>
                )}
            </div>
        </Box>
    );
};
export default Header;

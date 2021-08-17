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
    Flex,
    Spacer,
    Heading,
    Divider,
    InputGroup,
    InputLeftElement,
    Input,
    Stack,
    Avatar,
    Menu,
    MenuButton,
    Portal,
    MenuList,
    MenuItem,
} from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import { FaMoon, FaSun } from 'react-icons/fa';
import { AiFillGithub } from 'react-icons/ai';

type ColorModeSwitcherProps = Omit<IconButtonProps, 'aria-label'>;

const Header: FC = (props: ColorModeSwitcherProps) => {
    const { user } = useAuthentication();
    const [stateUser, setStateUser] = useState<User>(null);
    const { toggleColorMode } = useColorMode();
    const text = useColorModeValue('dark', 'light');
    const SwitchIcon = useColorModeValue(FaMoon, FaSun);
    const color = useColorModeValue('white', 'gray.800');

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
        <React.Fragment>
            <Box className={styles.wrapper} bg={color}>
                <Box p="2">
                    <Heading size="md">Image Gallery By Next.js</Heading>
                </Box>
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
                <Link
                    href="https://github.com/yuyaamano23/Image-Gallery-next.js"
                    passHref
                >
                    <a target="_blank">
                        <IconButton
                            size="md"
                            fontSize="24"
                            variant="ghost"
                            color="current"
                            marginLeft="2"
                            icon={<AiFillGithub />}
                            aria-label={`Switch to ${text} mode`}
                            {...props}
                        />
                    </a>
                </Link>
                <Spacer />
                <Link href="/" passHref>
                    <Button
                        _hover={{
                            textDecor: 'none',
                            backgroundColor: '#AEC8CA',
                        }}
                    >
                        <a>投稿一覧ページへ</a>
                    </Button>
                </Link>
                {user ? (
                    <Menu>
                        <MenuButton
                            w={10}
                            h={10}
                            borderRadius={6}
                            _hover={{
                                bg: 'gray.300',
                            }}
                        >
                            <TriangleDownIcon boxSize={4} m={3} />
                        </MenuButton>
                        <Portal>
                            <MenuList>
                                <MenuItem>
                                    <Link href={`/mypage/${user.uid}`} passHref>
                                        <a>マイページ</a>
                                    </Link>
                                </MenuItem>
                                <Divider />
                                <MenuItem>
                                    <Logout />
                                </MenuItem>
                                <Divider />
                                <MenuItem>
                                    <Link href="https://docs.google.com/forms/d/e/1FAIpQLSfE2qcpGN0Fbytipv6hxljZizMnM050vnyQhf4xVgD_FUsmDg/viewform?usp=sf_link">
                                        <a target="_blank">お問い合わせ</a>
                                    </Link>
                                </MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>
                ) : (
                    <Link href="/login" passHref>
                        <Button m={3}>ログインする</Button>
                    </Link>
                )}
                <Avatar
                    size="sm"
                    src={user?.photoUrl ? `${user?.photoUrl}` : null}
                />
                <Heading as="h3" size="sm">
                    {user?.name ? user.name : 'ゲスト'} さん
                </Heading>
            </Box>
        </React.Fragment>
    );
};
export default Header;

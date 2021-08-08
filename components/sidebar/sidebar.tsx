import React, { FC, useState } from 'react';
import {
    Flex,
    IconButton,
    Divider,
    Avatar,
    Heading,
    useColorMode,
    useColorModeValue,
    IconButtonProps,
} from '@chakra-ui/react';
import {
    FiMenu,
    FiHome,
    FiCalendar,
    FiUser,
    FiDollarSign,
    FiBriefcase,
    FiSettings,
} from 'react-icons/fi';
import { IoPawOutline } from 'react-icons/io5';
import NavItem from './navItem';
import { useAuthentication } from 'hooks/authentication';
import { FaMoon, FaSun } from 'react-icons/fa';

type ColorModeSwitcherProps = Omit<IconButtonProps, 'aria-label'>;

const Sidebar: FC = (props: ColorModeSwitcherProps) => {
    const [navSize, changeNavSize] = useState('large');
    const { user } = useAuthentication();
    const { toggleColorMode } = useColorMode();
    const text = useColorModeValue('dark', 'light');
    const SwitchIcon = useColorModeValue(FaMoon, FaSun);
    return (
        <React.Fragment>
            <Flex
                pos="sticky"
                left="5"
                h="95vh"
                marginTop="2.5vh"
                boxShadow="10px 10px 20px 10px rgba(5, 1, 1, 0.05)"
                borderRadius={navSize == 'small' ? '15px' : '30px'}
                w={navSize == 'small' ? '75px' : '200px'}
                flexDir="column"
                justifyContent="space-between"
            >
                <Flex
                    p="5%"
                    flexDir="column"
                    w="100%"
                    alignItems={navSize == 'small' ? 'center' : 'flex-start'}
                    as="nav"
                >
                    <IconButton
                        aria-label="change nav size"
                        background="none"
                        mt={5}
                        _hover={{ background: 'none' }}
                        icon={<FiMenu />}
                        onClick={() => {
                            if (navSize == 'small') changeNavSize('large');
                            else changeNavSize('small');
                        }}
                    />
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
                    <NavItem
                        navSize={navSize}
                        icon={FiHome}
                        title="投稿一覧"
                        description="This is the description for the dashboard."
                    />
                    <NavItem
                        navSize={navSize}
                        icon={FiCalendar}
                        title="マイページ"
                        active
                    />
                    <NavItem navSize={navSize} icon={FiUser} title="Clients" />
                    <NavItem
                        navSize={navSize}
                        icon={IoPawOutline}
                        title="ログイン"
                    />
                    <NavItem
                        navSize={navSize}
                        icon={FiDollarSign}
                        title="ログアウト"
                    />
                    <NavItem
                        navSize={navSize}
                        icon={FiBriefcase}
                        title="これなくしてmargintopでスペースあけよう"
                    />
                    <NavItem
                        navSize={navSize}
                        icon={FiSettings}
                        title="お問い合わせ"
                    />
                </Flex>

                <Flex
                    p="5%"
                    flexDir="column"
                    w="100%"
                    alignItems={navSize == 'small' ? 'center' : 'flex-start'}
                    mb={4}
                >
                    <Divider display={navSize == 'small' ? 'none' : 'flex'} />
                    <Flex mt={4} align="center">
                        <Avatar
                            size="md"
                            src={user?.photoUrl ? `${user?.photoUrl}` : null}
                        />
                        <Flex
                            flexDir="column"
                            ml={4}
                            display={navSize == 'small' ? 'none' : 'flex'}
                        >
                            <Heading as="h3" size="sm">
                                {user?.name ? user.name : 'ゲスト'} さん
                            </Heading>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </React.Fragment>
    );
};
export default Sidebar;

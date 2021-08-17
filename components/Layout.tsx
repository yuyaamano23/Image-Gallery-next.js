import React, { ReactNode } from 'react';
import Header from 'components/Header';
import styles from 'styles/components/Layout.module.scss';
import { Box, useColorModeValue } from '@chakra-ui/react';

type Props = {
    children: ReactNode;
};

export function Layout({ children, ...props }: Props) {
    const bgColor = useColorModeValue('rgba(245, 245, 245, 0.877)', 'gray.600');
    return (
        <div {...props}>
            <Box h="100vh" bg={bgColor}>
                <Header />
                {children}
            </Box>
        </div>
    );
}

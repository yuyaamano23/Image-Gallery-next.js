import '../styles/globals.scss';
import '../lib/firebase';
import { RecoilRoot } from 'recoil';
import Header from 'components/Header';
import { ChakraProvider } from '@chakra-ui/react';
import Sidebar from 'components/sidebar/sidebar';

function MyApp({ Component, pageProps }) {
    return (
        <RecoilRoot>
            <ChakraProvider>
                <Header />
                <Sidebar />
                <Component {...pageProps} />
            </ChakraProvider>
        </RecoilRoot>
    );
}

export default MyApp;

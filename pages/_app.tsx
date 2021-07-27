import '../styles/globals.scss';
import '../lib/firebase';
import { RecoilRoot } from 'recoil';
import Header from 'components/Header';
import { ChakraProvider } from '@chakra-ui/react';

function MyApp({ Component, pageProps }) {
    return (
        <RecoilRoot>
            <ChakraProvider>
                <Header />
                <Component {...pageProps} />
            </ChakraProvider>
        </RecoilRoot>
    );
}

export default MyApp;

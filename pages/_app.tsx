import '../styles/globals.scss';
import '../lib/firebase';
import { RecoilRoot } from 'recoil';
import { ChakraProvider } from '@chakra-ui/react';
import { Layout } from 'components/Layout';

function MyApp({ Component, pageProps }) {
    return (
        <RecoilRoot>
            <ChakraProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </ChakraProvider>
        </RecoilRoot>
    );
}

export default MyApp;

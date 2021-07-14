import '../styles/globals.scss';
import '../lib/firebase';
import { RecoilRoot } from 'recoil';
import Header from 'components/Header';

function MyApp({ Component, pageProps }) {
    return (
        <RecoilRoot>
            <Header />
            <Component {...pageProps} />
        </RecoilRoot>
    );
}

export default MyApp;

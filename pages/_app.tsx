import "../styles/globals.scss";
import "../lib/firebase";
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps }) {
	return (
		<RecoilRoot>
			<Component {...pageProps} />
		</RecoilRoot>
	);
}

export default MyApp;

import Head from 'next/head';
import Image from 'next/image';
import Uploader from 'components/uploader';

export default function Home() {
    return (
        <div>
            <div>投稿一覧ページです</div>
            <Uploader />
        </div>
    );
}

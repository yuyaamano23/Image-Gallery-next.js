import React, { FC } from 'react';
import styles from 'styles/components/Header.module.scss';

const Header: FC = () => {
    return (
        <div>
            <div className="bg-yellow-500">
                ここに共通ヘッダーを書いていくンゴ
            </div>
            <div className={styles.test}>Header.module.scssの確認</div>
        </div>
    );
};
export default Header;

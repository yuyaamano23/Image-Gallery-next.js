import styles from "styles/components/Header.module.scss";

export default function Header() {
	return (
		<div>
			<div className="navbar navbar-light bg-info">
				ここに共通ヘッダーを書いていくンゴ
			</div>
			<div className={styles.test}>Header.module.scssの確認</div>
		</div>
	);
}

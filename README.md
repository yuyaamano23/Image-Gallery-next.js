# 画像ギャラリー開発用リポジトリ
このリポジトリでは、Next.jsを用いて画像ギャラリーを開発しています。
### 今回のプロジェクトで使う技術の勉強に役立つリンク集↓
#### Next.js
- [普段使いから始めるNext.js](https://zenn.dev/terrierscript/books/2020-09-next-js/viewer/0-0-intro)
#### Git
- [覚えておくと便利なGitコマンド](https://qiita.com/yoshie8423/items/8ba2b06e99c8749d6855)
- [aliasの設定方法](https://qiita.com/chihiro/items/04813c707cc665de67c5)

# 開発にあたって
## gitを使った共同開発
①リモートリポジトリとローカルリポジトリを同期する
```
$ git switch main
$ git pull
```
②作業用のブランチをきる
```
$ git switch -c "<issueの番号を先頭につけるといいかも>"
```
`-c`はcreateから由来する。<br>
③ファイルに変更を加える
```
$ git add <ファイル名>
```
`git add .`とするとディレクトリ配下の全ての変更をaddすることができる。
```
$ git commit -m "コミットメッセージ"
```
④自分が加えた変更をリモートリポジトリへpushする。<br>
__【pushする前に確認すること】__<br>
複数人で開発していくと自分が作業している間にリモートリポジトリのmainブランチがどんどん更新されていきます。<br>
そのためpushする直前にローカルのmainブランチを更新して自分の作業ブランチに取り込む必要があります。<br>
`$ git switch main`→`$ git pull`→`$ git switch <自分の作業ブランチ>`→`$ git merge main`<br>
これで最新のmainブランチからブランチを切って作業したPRを作成することができます。
```
$ git push origin <自分の作業ブランチ>
```
`git push origin HEAD`とすると自分が現在作業しているブランチを指定することができる。<br>
⑤github上で作業ブランチ→mainブランチへのPRを作成する。<br>

⑥レビューが通ったらmergeする。

## ローカルサーバの立ち上げ方法

```
$ yarn dev
```
http://localhost:3000 
## その他注意点
- 今回のプロジェクトではyarnを採用しています。そのため、ライブラリなどを追加したい場合はyarnを用いてください。<br>
[npmとyarnの違い](https://qiita.com/Hai-dozo/items/90b852ac29b79a7ea02b)<br>
[npmとyarnのコマンド早見表](https://qiita.com/rubytomato@github/items/1696530bb9fd59aa28d8)


# ドキュメント

## サーバー構成図
<img width="1110" alt="スクリーンショット 2021-07-05 21 40 43" src="https://user-images.githubusercontent.com/58542696/124472975-b76dcc00-ddd9-11eb-99cc-3453200ff82b.png">

## ER図
<img width="824" alt="スクリーンショット 2021-07-05 21 40 52" src="https://user-images.githubusercontent.com/58542696/124472989-bb015300-ddd9-11eb-98db-d80d9828915e.png">


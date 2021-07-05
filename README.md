# 画像ギャラリー開発用リポジトリ
このリポジトリでは、画像ギャラリーをNext.jsを用いて開発しています。

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
`-c`はcreateから由来する。
③ファイルに変更を加える
```
$ git add <ファイル名>
```
`git add .`とするとディレクトリ配下の全ての変更をaddすることができる。
```
$ git commit -m "コミットメッセージ"
```
④自分が加えた変更をリモートリポジトリへpushする
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


# 画像ギャラリー開発用リポジトリ

このリポジトリでは、Next.js を用いて画像ギャラリーを開発しています。

### 参考記事
- [開発に関するwiki（とりあえずこれに目を通すと良いかも）](https://github.com/yuyaamano23/Image-Gallery-next.js/wiki/%E3%81%A8%E3%82%8A%E3%81%82%E3%81%88%E3%81%9A%E3%81%93%E3%81%93%E3%81%AB%E6%9B%B8%E3%81%8D%E8%BE%BC%E3%82%82%E3%81%86)
- [ZennnのScraps](https://zenn.dev/yuyaamano23/scraps/efea136ab2063a)


# 開発にあたって

## git を使った共同開発

⓪ 自分の担当したい issue を選んで Assignees を自分に設定する。
<img width="580" alt="スクリーンショット 2021-07-05 22 21 47" src="https://user-images.githubusercontent.com/58542696/124477921-8db7a380-dddf-11eb-9831-a84a1b9022f0.png">

① リモートリポジトリとローカルリポジトリを同期する

```
$ git switch main
$ git pull
```

② 作業用のブランチをきる

```
$ git switch -c "<issueの番号を先頭につけるといいかも>"
```

`-c`は create から由来する。<br>
③ ファイルに変更を加える

```
$ git add <ファイル名>
```

`git add .`とするとディレクトリ配下の全ての変更を add することができる。

```
$ git commit -m "コミットメッセージ"
```

④ 自分が加えた変更をリモートリポジトリへ push する。<br>
**【push する前に確認すること】**<br>
複数人で開発していくと自分が作業している間にリモートリポジトリの main ブランチがどんどん更新されていきます。<br>
そのため push する直前にローカルの main ブランチを更新して自分の作業ブランチに取り込む必要があります。<br>
`$ git switch main`→`$ git pull`→`$ git switch <自分の作業ブランチ>`→`$ git merge main`<br>
これで最新の main ブランチからブランチを切って作業した PR を作成することができます。

```
$ git push origin <自分の作業ブランチ>
```

`git push origin HEAD`とすると自分が現在作業しているブランチを指定することができる。<br>
⑤github 上で作業ブランチ →main ブランチへの PR を作成する。<br>

⑥ レビューが通ったら merge する。

## ローカルサーバの立ち上げ方法

```
$ yarn dev
```

http://localhost:3000

## その他注意点

- 今回のプロジェクトでは yarn を採用しています。そのため、ライブラリなどを追加したい場合は yarn を用いてください。<br>
  [npm と yarn の違い](https://qiita.com/Hai-dozo/items/90b852ac29b79a7ea02b)<br>
  [npm と yarn のコマンド早見表](https://qiita.com/rubytomato@github/items/1696530bb9fd59aa28d8)

# ドキュメント

## サーバー構成図

<img width="1110" alt="スクリーンショット 2021-07-05 21 40 43" src="https://user-images.githubusercontent.com/58542696/124472975-b76dcc00-ddd9-11eb-99cc-3453200ff82b.png">

## ER 図

<img width="824" alt="スクリーンショット 2021-07-05 21 40 52" src="https://user-images.githubusercontent.com/58542696/124472989-bb015300-ddd9-11eb-98db-d80d9828915e.png">

## 次のプロジェクトで導入してみたい技術
- バックエンドをLaravelでレプレイス

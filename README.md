# static-dev-template

## 前提条件

- nodenv 経由で Node.js の「v14.16.1」を Install していること
- yarn を使用するので、yarn も Install されていること
- VSCode ので「sytlelint」と「Prettier」のプラグインをインストールしていること
  【Install されていない方は下記リンクから Install してください】
  <https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint>
  <https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode>
- テンプレートに nunjacks を使用するため、vscode の settings.json に設定の追加が必要です。
  以下の設定を追加してください。
  ```
  {
    "files.associations": {
      "*.njk": "html"
    },
    "emmet.includeLanguages": {
      "nunjucks": "html"
    }
  }
  ```

## 使い方

### scripts

開発サーバーの起動、ファイルの Watch

```shell
yarn dev
```

build

```shell
yarn build
```

lint を実行

```shell
yarn lint
```

lint で検知したエラーのフォーマット

```shell
yarn fix
```

dist ディレクトリの削除

```shell
yarn clean
```

### 複数ページ案件でのページ作成

トップページだけではなく、複数のページを作成する必要がある場合、`src/template`に`xxx.njk`のように任意の名前でファイルを作成することで対応できます。

`dist`ディレクトリに吐き出されたときに xx.html といった形で吐き出したいときにこの設定が必要になります。

ex)about.njk を作成したい場合

```nunjacks
---
title: アバウトページ
description: about
---

{% extends 'layout/_base.njk' %} {% block main -%}
<h1>Hello World! About</h1>
{%- endblock %}
```

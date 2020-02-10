---
Title: 新しいコンポーネントを追加する
Level: Basic
---

# 新しいコンポーネントを追加する

このチュートリアルでは、既存のアプリケーション内で [Angular CLI](https://cli.angular.io/) を使用してコンポーネントを作成する方法を学習します。

定義により、_コンポーネント_ は _ビュー_ と呼ばれる画面のパッチを制御します。たとえば、個々のコンポーネントは、メニュー、タブ、フォーム、ボタン、およびアプリケーションのレイアウトのすべての単純または複雑な部分を定義および制御します。

## コンポーネントを作成する

プロジェクトのルートから開始して、ターミナルで次のコマンドを実行します。

    ng generate component my-first-component

複数のモジュールを持つアプリケーションにコンポーネントを追加する場合、`--module` パラメーターを使用して指定することができます。たとえば、`--module app` を使用して、アプリケーションのルートアプリに新しいコンポーネントを追加します。

## コンポーネントを使用する

コンポーネントが作成されると、要素を使用できます。

```html
<app-my-first-component></app-my-first-component>
```

別のコンポーネントの HTML ファイル内の任意の場所で、`my-first-component` のコンテンツをレンダリングします。

例として、`src` フォルダーの [`app.component`](../../demo-shell/src/app/app.component.ts)`.html` ファイルの先頭に `<app-my-first-component></app-my-first-component>` を追加し、
アプリケーションを再度実行します。
ブラウザーでは、コンポーネントがレイアウト内でレンダリングされる場所を示すプレースホルダーとして、
"my-first-component works!" というテキストが間もなく表示されます。

## Anatomy of the component

デフォルトでは、新しいコンポーネントは `src/app` パスに作成され、すべてがコンポーネント自体と同じ名前のフォルダーに保存されます。
ここで、`my-first-component` という名前のフォルダーが `src/app` に追加されており、
次の内容が含まれているはずです。

-   コンポーネントが使用する CSS を含む`my-first-component.component.scss`。最初は空です。
-   コンポーネントのレンダリングに使用される HTML を含む `my-first-component.component.html` 。
    このファイルは、`p` タグ内のコンポーネントの名前を表示する非常に基本的なプレースホルダーメッセージで作成されます。
-   コンポーネントの単体テストを含む `my-first-component.component.spec.ts`。
-   typescript でビジネスロジックを実装する
    `MyFirstComponentComponent` クラスを含む `my-first-component.component.ts`。

コンポーネントを使用するには、1つ以上のモジュールでコンポーネントを宣言またはインポートする必要があります。
この例では、`src/app` に保存されている `app.module.ts` ファイルには次のコードが含まれています。

```ts
import { MyFirstComponentComponent } from './my-first-component/my-first-component.component';

@NgModule({
    declarations: [
        ...
        MyFirstComponentComponent
    ],
```

これらは、コンポーネントについて知る必要がある最も基本的な情報です。
ここに記載されているものはすべて、ADF アプリケーションに固有の標準的な Angular コードです。

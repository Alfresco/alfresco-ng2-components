---
Title: 新しいビューを追加する
Level: Beginner
---

# 新しいビューを追加する

このチュートリアルでは、アプリケーションで新しいビューを作成する方法と、定義されたエンドポイントを使用してビューにアクセスする方法を学習します。

Angular で開発されたすべてのアプリケーションは、*ビュー* および *ルーティング* の概念がユーザーエクスペリエンスで重要な役割を果たす単一ページのアプリケーションです。単一ページのアプリケーションであるため、(*views* と呼ばれる) 異なるレイアウト間のナビゲーションは *ルーティング* によって有効になります。

## ビューを作成する

Angular アプリケーションでは、ビューは通常のコンポーネントによって実装されます。
ビューは他のビュー (つまり、他のコンポーネント) を使用できますが、ビューを使用してアプリケーションの完全なレイアウトを実装することもできます。
これが、ビューの作成が必ずしもコンポーネントの作成と同じタスクではない理由です。

ビューを作成するには、プロジェクトのルートからターミナルで次のコマンドを実行します。

    ng generate component my-first-view

コンポーネントの作成の詳細については、[こちら](new-component.md)のチュートリアルを参照してください。

## ビューのルーティング

Angular アプリケーションには、ブラウザーの URL と表示する対応するコンポーネントを一致させるために使用される `Router` サービスのシングルトンインスタンスが1つあります。 `Router` サービスは、次のソースコードに類似した構文で Typescript ファイルで設定する必要があります。

```ts
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  { path: 'path-in-the-app', component: ExistingComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- デバッグ目的のみ.
    )
    // 他のインポートはこちら
  ],
  ...
})
```

新しいビューをルーティングに追加するには、`appRoutes` 定数を次のように変更します。

```ts
const appRoutes: Routes = [
  { path: 'path-in-the-app', component: ExistingComponent },
  { path: 'my-first-view', component: MyFirstViewComponent }, // <-- これを追加!
  { path: '**', component: PageNotFoundComponent }
];
```

そして、次の構文で同じファイルにコンポーネントをインポートすることを忘れないでください。

```ts
import { MyFirstViewComponent } from './my-first-view/my-first-view.component';
```

`Router` サービスは、アプリケーションの構造内のさまざまな場所に保存できるファイルで宣言できることに注意してください。
通常、`Router` サービスは、ルートモジュールを含むファイルに近い場所で宣言されます。

## ビューをテストする

アプリケーションを介して新しいビューをレンダリングし、ユーザーエクスペリエンスを確認するには、アプリケーションを再起動し、次の URL でブラウザーを開きます。

    http://<ip_address>:<port>/my-first-view

結果は、次のコンテンツを含む非常にシンプルなページになります。

    my-first-view works!

## パラメーターの表示 （オプション）

ほとんどのユースケースでは、ビューのエンドポイントにパラメーターを追加する必要があります。これを有効にするには、`appRoutes` 定数を次のように変更します。

```ts
const appRoutes: Routes = [
  { path: 'path-in-the-app', component: ExistingComponent },
  { path: 'my-first-view/:name', component: MyFirstViewComponent }, // <-- これを変える!
  { path: '**', component: PageNotFoundComponent }
];
```

次に、`src/app/my-first-view` (`my-first-view.component.ts`) に保存されている `MyFirstViewComponent` の Typescript コントローラーを開きます。ここにいくつか追加する必要があります。

1. ルーターをクラスに `インポート` して `インジェクト` する必要があります。
2. ルーターのパラメーターをサブスクライブし、値を取得します。
3. ルーターのパラメーターをサブスクライブ解除します。

#3 は必須ではありませんが、最終的にはアプリケーションでメモリリークが発生するため、
登録を解除してください。

typescript コントローラーの `my-first-view.component.ts` を次のように変更します。

```ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-first-view',
  templateUrl: './my-first-view.component.html',
  styleUrls: ['./my-first-view.component.scss']
})
export class MyFirstViewComponent implements OnInit {

  private params: any;
  name: String;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.params = this.route.params.subscribe(params => {
      this.name = params['name'];
    });
  }

  ngOnDestroy() {
    this.params.unsubscribe();
  }
}
```

次に、同じフォルダーで `my-first-view.component.html` テンプレートを開き、
次のソースコードのようにグリーティングを追加します。

```html
	<p>
	  Hello {{ name }}
	</p>
```

これで、`http://<ip_address>:<port>/my-first-view/sir` に移動して、"Hello sir" という素敵なメッセージを見ることができます。


---
Title: ADF の概要
Added: 2019-03-13
---

# Application Development Framework （ADF） の概要

Alfresco の Application Development Framework (ADF) を使用すると、既存の Alfresco サービスに独自のカスタムフロントエンドを追加できます。

ADF は、[Angular](https://angular.io/) Web アプリケーションフレームワークに基づいたカスタム [TypeScript](https://www.typescriptlang.org/) クラスのセットです。
最も重要なクラスは、対話型 UI 機能を実装する **コンポーネント** です。
コンポーネントおよびその他のクラスは、
Alfresco のメインバックエンド製品である [Content Services](https://www.alfresco.com/platform/content-services-ecm) 
および [Process Services](https://www.alfresco.com/platform/process-services-bpm) の情報にアクセスします。
これらのクラスを組み合わせて、必要なスタイル、ブランド、機能を備えた
独自のカスタム Web アプリを作成できます。
これが役立つ場所の例を次に示します。

-   ビジネスで頻繁に発生するタスクに基づいた機能を備えた **機能ベースのアプリ** 。
-   特定のタイプのユーザーが独自の機能セットを持ち、
    ビジネスにおける役割に合わせてカスタマイズされた **ロールベースのアプリ** 。
-   Alfresco サービスが
    同じアプリ内の他のサプライヤーのサービスと統合されている [**マッシュアップ**](https://whatis.techtarget.com/definition/mash-up) 。

## ADF の使用を開始する

ADF のインストールに関する完全な手順とその前提条件については、
チュートリアル[_はじめての ADF アプリケーションを作成する_](../tutorials/creating-your-first-adf-application.md)を参照してください。
環境と scaffold アプリをセットアップしたら、
他の[チュートリアル](../tutorials/README.md) でバックエンドサービスに接続し、
アプリにカスタム機能を追加する方法を説明します。
[コンポーネントのリファレンス](../README.md)ページを使用して
[about コンポーネント](../core/components/about.component.md)の機能を学習し、
[ユーザーガイド](../user-guide/README.md)を使用して特定のタスクとトピックについて詳しく学習します。

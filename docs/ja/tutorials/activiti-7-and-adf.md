---
Title: Activiti 7 と ADF
Level: Intermediate
---

# Activiti Cloud 7.0.0 GA Community Edition の上に ADF アプリケーションを構築する

このチュートリアルでは、Activiti Cloud 7 に接続するように ADF アプリを構成する方法を説明します。

[Activiti Cloud 7](https://www.activiti.org/) は、Activiti BPM エンジンの新世代のクラウドネイティブ実装です。
[ADF 3 メジャーリリース](../release-notes/relnote300.md#activiti-7-support-experimental)以降、
Alfresco は ADF フレームワーク内で Activiti 7 エンジンのサポートを開始しました。
必要なすべての機能の実装がほぼ完了したので、
このチュートリアルでは、Activiti Cloud 7.0.0 GA Community Edition 上に
ADF アプリケーションを構築する方法を説明します。

## Activiti 7 サービスの準備

ご想像のとおり、このような ADF アプリを作成するための前提条件は、
Activiti 7 のインスタンスを起動して実行することです。
独自の Activiti 7 インスタンスをインストールおよびセットアップする方法については、
[公式ドキュメント]([https://activiti.gitbook.io/activiti-7-developers-guide)に従ってください。

Activiti 7 の独自のインスタンスがすでに稼働していると仮定すると、ADF アプリケーションで正常に動作させるために少し調整が必要です。
これは、以下で詳しく説明するように、主にアプリケーションの命名方法の問題です。

### ADF が Activiti 7 バックエンドサービスに必要なもの

デフォルトでは、Activiti 7 は各アプリケーションの既知のサービスリスト (Kubernetes の [pods](https://kubernetes.io/docs/concepts/workloads/pods/pod/)) を開始します。
具体的には、これらにはランタイムバンドル、
コネクタ、監査、クエリなどが含まれます。
ここでの関心は、すべての ADF アプリケーションで直接使用される
ランタイムバンドルサービスです。

(デフォルトのインストールによって生成される) ランタイムバンドルサービスポッドの名前は、
最初は `rb-[appName]`  (通常は `rb-my-app`) です。
ADF アプリケーションでは、ランタイムバンドルサービスが `[appName]/rb` (通常は `my-app/rb`) という名前で使用可能である必要があります。

### ランタイムバンドルサービスの名前を変更する方法

[Helm チャート](https://github.com/Activiti/activiti-cloud-charts)を使用して、
ランタイムバンドルのデフォルト名を簡単に変更できます。
[クイックスタートガイド](https://activiti.gitbook.io/activiti-7-developers-guide/getting-started/getting-started-activiti-cloud) (Activiti Cloud Full Example のデプロイ) を使用した場合、
[values.yaml](https://github.com/Activiti/activiti-cloud-charts/blob/master/activiti-cloud-full-example/values.yaml) ファイルを次のように変更できます。

```yaml
    application:
      runtime-bundle:
        enabled: true
        service:
          name: rb \\ <-- ここを変更してください!
    ...
```

これが完了したら、デプロイメント環境をクリーンアップし
(Pod と新しい環境を作成するために必要なすべてを削除し、再度デプロイする準備ができます)、
修正された Helm チャートを使用して Activiti 7 を再度展開します。

Activiti 7 が再度稼働すると、その上に独自の Alfresco ADF アプリケーションを構築する準備が整います。

## ADF アプリケーションの構築

[Yeoman ジェネレーター](https://yeoman.io/)を使用して、ADF アプリケーションを簡単に作成できます。
これを行う方法の詳細については、[チュートリアル](creating-the-app-using-yeoman.md) を参照してください。
作成するプロジェクトのタイプとして
"Process Services with Activiti" を選択してください。

これが作成されたら、`proxy.conf.json` ファイルを変更せずに、次の段落で説明されている構成を続行します。
これで、Activiti 7 Community Edition バックエンドサービスに対して独自の ADF アプリケーションを動作させるという目標に非常に近づきました。

## ADF アプリケーションの構成

既存の ADF アプリケーションを設定するには、`app.config.json` ファイルを編集するだけです。

まず、Activiti 7 デプロイメントの正しいURLで `bpmHost`、`identityHost` および `host` プロパティを設定してください。
次に、`identityHost` と `host` の URI を `/auth/realms/activiti` になっていることをチェックします(おそらく変更します)。

変更後、`app.config.json` ファイルは次の例のようになります。

```json
    ...
    "bpmHost": "<Activiti7BaseUrl>",
    "identityHost": "<Activiti7BaseUrl>/auth/realms/activiti",
    "providers": "BPM",
    "application": {
        "name": "Alfresco ADF Application"
    },
    "authType": "OAUTH",
    "oauth2": {
        "host": "<Activiti7BaseUrl>/auth/realms/activiti",
    ...
```

次に、以下に示すように `alfresco-deployed-apps` プロパティを設定します。

    "alfresco-deployed-apps": [{"name":""}]

完了したら、`app.config.json` ファイルを保存し、`npm start` コマンドを実行してアプリケーションを起動します。 
これで、Activiti 7 Community Edition バックエンドサービス上で
独自の ADF アプリケーションを使用できるようになります。

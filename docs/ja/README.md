---
Title: Component docs
Github only: true
---

# コンポーネントドキュメントインデックス

以下は、ADFのドキュメントの索引です。
[ユーザーガイド](#user-guide)のセクションでは、特定の手法について詳しく説明します。 
他のセクションは、ADF ライブラリのリファレンスです。アイテムの名前をクリックしてそのドキュメントを表示するか、ソースリンクをクリックしてメインのソースファイルを表示します。 
ADF は継続的に開発されるため、一部のアイテムのソースファイルは、ドキュメントが利用可能になる前にここにリストされる場合があります。

コンポーネントには、ステータスを示すアイコンが付いている場合があります。
コンポーネントが完全であり、通常の使用に適していることを示すアイコンはありません。他のステータスレベルは次のとおりです。

- **Deprecated** ![](docassets/images/DeprecatedIcon.png) - このコンポーネントは引き続き使用可能ですが、現在は廃止されており、
 ADF の将来のバージョンで削除される可能性があります。
- **Experimental** ![](docassets/images/ExperimentalIcon.png) - このコンポーネントは実験的に使用できますが、
 完全には完成しておらず、プロダクションコードでもテストされていません。
- **Internal** ![](docassets/images/InternalIcon.png) - コンポーネントは内部テストで使用できますが、
 実稼働で使用することを意図したものではありません

また、タスクを段階的に実行する方法を説明する一連のADFチュートリアルもあります。
完全なリストについては [チュートリアルインデックス](tutorials/README.md) を参照してください。

他にもいくつかのページの情報も利用できます:

- [バージョンインデックス](versionIndex.md) には、
 コンポーネントが導入された ADF バージョンによって順序付けられたコンポーネントのリストがあります。
- [リリースノートセクション](release-notes/README.md) には、
 各リリースで導入されたすべての機能と修正されたバグの詳細が記載されています。
- [バージョン互換性](compatibility.md) ページには、
 Alfresco のバックエンドサービス (ACS および APS) のどのバージョンが
 ADF の各リリースバージョンと互換性があるかが表示されます。
- [ロードマップ](roadmap.md) には、
 ADF の将来のバージョンでリリースする予定の機能のプレビューが含まれています。
- [ライセンス情報](license-info/README.md) セクションには、ADF が使用するサードパーティライブラリとそのオープンソースライセンスへのリンクがリストされています。
- [脆弱性セクション](vulnerability/README.md) には、
 サードパーティライブラリの既知の脆弱性がリストされています。
 ADF が使用するライブラリとそのオープンソースライセンスへのリンクがあります。
- [破壊的変更](breaking-changes/breaking-change-2.6.0-3.0.0.md) セクションには、
 非推奨アイテムの削除など、メジャーバージョン間のすべての重大な変更がリストされています。
- [アップグレードガイド](upgrade-guide/README.md) では、プロジェクトを以前のバージョンの ADF から現在のバージョンにアップグレードする方法について説明しています。

## Contents

- [ユーザーガイド](#user-guide)
- [Core API](#core-api)
- [Content Services API](#content-services-api)
- [Process Services API](#process-services-api)
- [Process Services Cloud API](#process-services-cloud-api)
- [Extensions API](#extensions-api)
- [Insights API](#insights-api)

## User guide

<!--guide start-->

- [Angular Material Design](user-guide/angular-material-design.md)
- [フォームの拡張性とカスタマイズ](user-guide/extensibility.md)
- [ADF の国際化(i18n)](user-guide/internationalization.md)
- [ADF のローカライズ](user-guide/localization.md)
- [テーマ](user-guide/theming.md)
- [トランスクルージョン](user-guide/transclusion.md)
- [タイポグラフィ](user-guide/typography.md)
- [ウォークスルー - インジケーターを追加してノードに関する情報を強調する](user-guide/metadata-indicators.md)

<!--guide end-->

[(Back to Contents)](#contents)

## Core API

ADF 全体で使用されるさまざまなコンポーネントが含まれています。
ソースコードのインストールと
使用の詳細については、
ライブラリの[READMEファイル](../lib/core/README.md)を参照してください。

<!--core start-->

### Components

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [About Application Modules コンポーネント](core/components/about-application.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | アプリケーションが使用している ADF ライブラリとプラグインを表示します。 | [ソース](../lib/core/about/about-application-modules/about-application-modules.component.ts) |
| [About GitHub Link コンポーネント](core/components/about-github-link.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | 最新の GitHub コミット、およびアプリケーションのサーバー設定に基づいて、実行中のアプリケーションのバージョンを表示します。 | [ソース](../lib/core/about/about-github-link/about-github-link.component.ts) |
| [About Product Version コンポーネント](core/components/about-product-version.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | アプリケーションが実行されている Process Services (BPM) および Content Services (ECM) のバージョンを表示します。また、関連するライセンス情報、アプリケーションステータス、およびアプリケーションで実行されている Alfresco モジュールも表示されます。 | [ソース](../lib/core/about/about-product-version/about-product-version.component.ts) |
| [Buttons Menu コンポーネント](core/components/buttons-menu.component.md) | レスポンシブメニューにボタンを表示します。 | [ソース](../lib/core/buttons-menu/buttons-menu.component.ts) |
| [Card View コンポーネント](core/components/card-view.component.md) | 構成可能なプロパティリストレンダラーを表示します。 | [ソース](../lib/core/card-view/components/card-view/card-view.component.ts) |
| [Comment list コンポーネント](core/components/comment-list.component.md) | コメントのリストを表示します。 | [ソース](../lib/core/comments/comment-list.component.ts) |
| [Comments コンポーネント](core/components/comments.component.md) | 指定したタスクまたはコンテンツに関係するユーザーからのコメントを表示し、関係するユーザーがタスクまたはコンテンツにコメントを追加できるようにします。 | [ソース](../lib/core/comments/comments.component.ts) |
| [Data Column コンポーネント](core/components/data-column.component.md) | DataTable、Tasklist、Document List、およびその他のコンポーネントの列プロパティを定義します。 | [ソース](../lib/core/data-column/data-column.component.ts) |
| [DataTable コンポーネント](core/components/datatable.component.md) | カスタマイズ可能な列とプレゼンテーションを含むテーブルとしてデータを表示します。 | [ソース](../lib/core/datatable/components/datatable/datatable.component.ts) |
| [Empty Content コンポーネント](core/components/empty-content.component.md) | コンポーネントの一般的な「空のコンテンツ」プレースホルダーを提供します。 | [ソース](../lib/core/templates/empty-content/empty-content.component.ts) |
| [Empty list コンポーネント](core/components/empty-list.component.md) | リストが空であることを示すメッセージを表示します。 | [ソース](../lib/core/datatable/components/datatable/empty-list.component.ts) |
| [Error Content コンポーネント](core/components/error-content.component.md) | 特定のエラーに関する情報を表示します。 | [ソース](../lib/core/templates/error-content/error-content.component.ts) |
| [Form field コンポーネント](core/components/form-field.component.md) | フォーム内のUIフィールドを表します。 | [ソース](../lib/core/form/components/form-field/form-field.component.ts) |
| [Form List コンポーネント](core/components/form-list.component.md) | フォームをリストとして表示します。 | [ソース](../lib/core/form/components/form-list.component.ts) |
| [Header コンポーネント](core/components/header.component.md) | Alfresco アプリケーション用の再利用可能なヘッダー。 | [ソース](../lib/core/layout/components/header/header.component.ts) |
| [Host settings コンポーネント](core/components/host-settings.component.md) ![Internal](docassets/images/InternalIcon.png) | ACS および APS の URL を検証し、ユーザーのローカルストレージに保存します | [ソース](../lib/core/settings/host-settings.component.ts) |
| [Icon コンポーネント](core/components/icon.component.md) | 登録済みおよび名前付きのアイコンをレンダリングする普遍的な方法を提供します。 | [ソース](../lib/core/icon/icon.component.ts) |
| [Infinite Pagination コンポーネント](core/components/infinite-pagination.component.md) | 使用されるコンポーネントに「無限」のページネーションを追加します。 | [ソース](../lib/core/pagination/infinite-pagination.component.ts) |
| [Info drawer layout コンポーネント](core/components/info-drawer-layout.component.md) | サイドバースタイルのインフォメーションパネルを表示します。 | [ソース](../lib/core/info-drawer/info-drawer-layout.component.ts) |
| [Info Drawer Tab コンポーネント](core/components/info-drawer-tab.component.md) | Info Drawer コンポーネントのタブをレンダリングします。 | [ソース](../lib/core/info-drawer/info-drawer.component.ts) |
| [Info Drawer コンポーネント](core/components/info-drawer.component.md) | タブ付きのサイドバースタイルのインフォメーションパネルを表示します。 | [ソース](../lib/core/info-drawer/info-drawer.component.ts) |
| [Json Cell コンポーネント](core/components/json-cell.component.md) | DataTable コンポーネント内の JSON 形式の値を表示します。 | [ソース](../lib/core/datatable/components/datatable/json-cell.component.ts) |
| [Language Menu コンポーネント](core/components/language-menu.component.md) | "app.config.json" に存在するすべての言語を表示します。デフォルトは (EN) です。 | [ソース](../lib/core/language-menu/language-menu.component.ts) |
| [Login Dialog Panel コンポーネント](core/components/login-dialog-panel.component.md) | ログインダイアログを表示および管理します。 | [ソース](../lib/core/login/components/login-dialog-panel.component.ts) |
| [Login Dialog コンポーネント](core/components/login-dialog.component.md) | ユーザーがダイアログを介してログインを実行できるようにします。 | [ソース](../lib/core/login/components/login-dialog.component.ts) |
| [Login コンポーネント](core/components/login.component.md) | Alfresco Content Services および Alfresco Process Services に対して認証します。 | [ソース](../lib/core/login/components/login.component.ts) |
| [Notification History コンポーネント](core/components/notification-history.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | このコンポーネントは、現在は単なる実験的なコンポーネントです。<br><br>Notification History コンポーネントの主な目的は、現在のセッションで受信したすべての通知をリストすることです。更新後にリストから消えます。 | [ソース](../lib/core/notifications/components/notification-history.component.ts) |  |
| [Pagination コンポーネント](core/components/pagination.component.md) | 使用されるコンポーネントにページネーションを追加します。 | [ソース](../lib/core/pagination/pagination.component.ts) |
| [Search Text Input コンポーネント](core/components/search-text-input.component.md) | オートコンプリートをサポートする入力テキストを表示します | [ソース](../lib/core/search-text/search-text-input.component.ts) |
| [Sidebar action menu コンポーネント](core/components/sidebar-action-menu.component.md) | サイドバーアクションメニューインフォメーションパネルを表示します。 | [ソース](../lib/core/layout/components/sidebar-action/sidebar-action-menu.component.ts) |
| [Sidenav Layout コンポーネント](core/components/sidenav-layout.component.md) | 標準の領域が 3 つの ADF アプリケーションレイアウトを表示します。 | [ソース](../lib/core/layout/components/sidenav-layout/sidenav-layout.component.ts) |
| [Sorting Picker コンポーネント](core/components/sorting-picker.component.md) | 定義済みの並べ替えの定義と方向のセットから選択します。 | [ソース](../lib/core/sorting-picker/sorting-picker.component.ts) |
| [Start Form コンポーネント](core/components/start-form.component.md) | プロセスの開始フォームを表示します。 | [ソース](../lib/process-services/src/lib/form/start-form.component.ts) |
| [Text Mask ディレクティブ](core/components/text-mask.component.md) | テキストフィールドの入力マスクを実装します。 | [ソース](../lib/core/form/components/widgets/text/text-mask.component.ts) |
| [Toolbar Divider コンポーネント](core/components/toolbar-divider.component.md) | 視覚的な区切り線でツールバーの要素のグループを分割します。 | [ソース](../lib/core/toolbar/toolbar-divider.component.ts) |
| [Toolbar Title コンポーネント](core/components/toolbar-title.component.md) | ツールバーコンポーネントのタイトルに含めるカスタム HTML を提供します。 | [ソース](../lib/core/toolbar/toolbar-title.component.ts) |
| [Toolbar コンポーネント](core/components/toolbar.component.md) | ヘッダー、タイトル、アクション、パンくずリストのシンプルなコンテナ。 | [ソース](../lib/core/toolbar/toolbar.component.ts) |
| [User Info コンポーネント](core/components/user-info.component.md) | ユーザー情報を表示します。 | [ソース](../lib/core/userinfo/components/user-info.component.ts) |
| [Viewer コンポーネント](core/components/viewer.component.md) | ACS リポジトリのコンテンツを表示します。 | [ソース](../lib/core/viewer/components/viewer.component.ts) |

### Directives

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [Check Allowable Operation ディレクティブ](core/directives/check-allowable-operation.directive.md) | 選択的にHTML要素または角度成分を無効にします。 | [ソース](../lib/core/directives/check-allowable-operation.directive.ts) |
| [Clipboard ディレクティブ](core/directives/clipboard.directive.md) | クリップボードにコピーしたテキスト。 | [ソース](../lib/core/clipboard/clipboard.directive.ts) |
| [Context Menu ディレクティブ](core/directives/context-menu.directive.md) | コンポーネントにコンテキストメニューを追加します。 | [ソース](../lib/core/context-menu/context-menu.directive.ts) |
| [Highlight ディレクティブ](core/directives/highlight.directive.md) | HTML要素のコンテンツの選択のセクションを強調表示する追加します。 | [ソース](../lib/core/directives/highlight.directive.ts) |
| [Logout ディレクティブ](core/directives/logout.directive.md) | 装飾された要素がクリックされたときにユーザをログアウト。 | [ソース](../lib/core/directives/logout.directive.ts) |
| [Node Delete ディレクティブ](core/directives/node-delete.directive.md) | 複数のファイルやフォルダを削除します。 | [ソース](../lib/core/directives/node-delete.directive.ts) |
| [Node Download ディレクティブ](core/directives/node-download.directive.md) | フォルダおよび/またはファイルは「.ZIP」のアーカイブとしてパック、複数のノードと、ダウンロードすることができます。 | [ソース](../lib/core/directives/node-download.directive.ts) |
| [Node Favorite ディレクティブ](core/directives/node-favorite.directive.md) | 選択お気に入りとしてノードをトグルします。 | [ソース](../lib/core/directives/node-favorite.directive.ts) |
| [Node Restore ディレクティブ](core/directives/node-restore.directive.md) | リストアは元の場所にノードを削除しました。 | [ソース](../lib/core/directives/node-restore.directive.ts) |
| [Upload ディレクティブ](core/directives/upload.directive.md) | ファイルのドラッグ＆ドロップに対応してアップロードコンテンツ。 | [ソース](../lib/core/directives/upload.directive.ts) |

### Dialogs

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [Edit JSON ダイアログ](core/dialogs/edit-json.dialog.md) | ユーザーがダイアログでJSONコンテンツをプレビューまたは編集できるようにします。 | [ソース](../lib/testing/src/lib/core/dialog/edit-json-dialog.ts) |

### Interfaces

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [Card View Item インターフェース](core/interfaces/card-view-item.interface.md) | カードビューコンポーネント内のアイテムの実装を定義します。 | [ソース](../lib/core/card-view/interfaces/card-view-item.interface.ts) |
| [DataTableAdapter インターフェース](core/interfaces/datatable-adapter.interface.md) | 表データがデータテーブルとタスクリストコンポーネントに供給されている方法を定義します。 | [ソース](../lib/core/datatable/data/datatable-adapter.ts) |
| [FormFieldValidator インターフェース](core/interfaces/form-field-validator.interface.md) | フォームとタスクの詳細コンポーネントの入力フィールドが検証される方法を定義します。 | [ソース](../lib/core/form/components/widgets/core/form-field-validator.ts) |
| [Search Configuration インターフェース](core/interfaces/search-configuration.interface.md) | 検索にパラメータの微調整を提供します。 | [ソース](../lib/core/interface/search-configuration.interface.ts) |

### Models

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
 [Bpm User モデル](core/models/bpm-user.model.md) | Process Services のユーザーに関する情報が含まれています。 | [ソース](../lib/core/models/bpm-user.model.ts) |
| [Ecm User モデル](core/models/ecm-user.model.md) | Content Services のユーザーに関する情報が含まれます。 | [ソース](../lib/core/models/ecm-user.model.ts) |
| [Form Field モデル](core/models/form-field.model.md) | Form コンポーネントのフィールドの値とメタデータが含まれています。 | [ソース](../lib/core/form/components/widgets/core/form-field.model.ts) |
| [Product Version モデル](core/models/product-version.model.md) | Alfresco は製品のバージョンとライセンス情報のクラスが含まれています。 | [ソース](../lib/core/models/product-version.model.ts) |
| [User Process モデル](core/models/user-process.model.md) | Process Services のユーザーを表します。 | [ソース](../lib/core/models/user-process.model.ts) |

### Pipes

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [App Config パイプ](core/pipes/app-config.pipe.md) | 直接アプリケーション構成ファイルから値を取得します。 | [ソース](../lib/core/app-config/app-config.pipe.ts) |
| [Decimal Number パイプ](core/pipes/decimal-number.pipe.md) | その整数部分で、また、その小数部の桁の一定量を持っている番号を変換します。 | [ソース](../lib/core/pipes/decimal-number.pipe.ts) |
| [File Size パイプ](core/pipes/file-size.pipe.md) | 等KB、MB、の等価に変換されたバイト数 | [ソース](../lib/core/pipes/file-size.pipe.ts) |
| [Format Space パイプ](core/pipes/format-space.pipe.md) | 付属の文字の文字列内のすべての空白を置き換えます。 | [ソース](../lib/core/pipes/format-space.pipe.ts) |
| [Full name パイプ](core/pipes/full-name.pipe.md) | 単一の文字列に UserProcessModel オブジェクトから最初と最後の名前のプロパティを結合します。 | [ソース](../lib/core/pipes/full-name.pipe.ts) |
| [Localized Date パイプ](core/pipes/localized-date.pipe.md) | 指定した形式とロケールに日付を変換します。 | [ソース](../lib/core/pipes/localized-date.pipe.ts) |
| [Mime Type Icon パイプ](core/pipes/mime-type-icon.pipe.md) | MIME タイプを表すアイコンを検索します。 | [ソース](../lib/core/pipes/mime-type-icon.pipe.ts) |
| [Multi Value パイプ](core/pipes/multi-value.pipe.md) | 文字列の配列を受け取り、アイテムはセパレータによって分離されている1つの文字列に変換します。リストに適用されるデフォルトのセパレータはカンマである、しかし、あなたは、パイプののparamsに独自の区切り文字を設定することができます。 | [ソース](../lib/core/pipes/multi-value.pipe.ts) |
| [Node Name Tooltip パイプ](core/pipes/node-name-tooltip.pipe.md) | ノードのツールチップをフォーマットします。 | [ソース](../lib/core/pipes/node-name-tooltip.pipe.ts) |
| [Text Highlight パイプ](core/pipes/text-highlight.pipe.md) | 検索文字列に一致する単語またはテキストのセクションを強調表示する追加します。 | [ソース](../lib/core/pipes/text-highlight.pipe.ts) |
| [Time Ago パイプ](core/pipes/time-ago.pipe.md) | 前の日数に最近の過去の日付に変換します。 | [ソース](../lib/core/pipes/time-ago.pipe.ts) |
| [User Initial パイプ](core/pipes/user-initial.pipe.md) | 名前UserProcessModelオブジェクトのフィールドを抽出し、フォーマットイニシャルをとります。 | [ソース](../lib/core/pipes/user-initial.pipe.ts) |

### Services

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [APS Alfresco Content サービス](core/services/activiti-alfresco.service.md) | Alfrescoのプロセスサービス（APS）に設定したリポジトリアカウントに基づいAlfrescoのリポジトリフォルダの内容を取得します。 | [ソース](../lib/core/form/services/activiti-alfresco.service.ts) |
| [Alfresco Api サービス](core/services/alfresco-api.service.md) | 初期化 AlfrescoJSApi インスタンスへのアクセスを提供します。 | [ソース](../lib/core/services/alfresco-api.service.ts) |
| [App Config サービス](core/services/app-config.service.md) | 支持体は、構成設定、保存されたサーバ側のアプリ。 | [ソース](../lib/core/app-config/app-config.service.ts) |
| [Apps Process サービス](core/services/apps-process.service.md) | ユーザーのために配備されている Process Services のアプリの詳細を取得します。 | [ソース](../lib/core/services/apps-process.service.ts) |
| [Auth Guard Bpm サービス](core/services/auth-guard-bpm.service.md) | アプリ内のルートに Process Services との認証を追加します。 | [ソース](../lib/core/services/auth-guard-bpm.service.ts) |
| [Auth Guard Ecm サービス](core/services/auth-guard-ecm.service.md) | アプリ内のルートにコンテンツサービスとの認証を追加します。 | [ソース](../lib/core/services/auth-guard-ecm.service.ts) |
| [Auth Guard SSO Role サービス](core/services/auth-guard-sso-role.service.md) | チェックしたユーザのユーザの役割。 | [ソース](../lib/core/services/auth-guard-sso-role.service.ts) |
| [Auth Guard サービス](core/services/auth-guard.service.md) | アプリ内のルートに認証を追加します。 | [ソース](../lib/core/services/auth-guard.service.ts) |
| [Authentication サービス](core/services/authentication.service.md) | ACS と APS への認証を提供します。 | [ソース](../lib/core/services/authentication.service.ts) |
| [Bpm User サービス](core/services/bpm-user.service.md) | 現在のProcess Servicesのユーザーに関する情報を取得します。 | [ソース](../lib/core/services/bpm-user.service.ts) |
| [Card Item Type サービス](core/services/card-item-types.service.md) | カードビューコンポーネントのコンポーネントタイプをフィールドにマップするタイプ名。 | [ソース](../lib/core/card-view/services/card-item-types.service.ts)  |
| [Card View Update サービス](core/services/card-view-update.service.md) | カードビューコンポーネントのフィールド内の編集とクリックをレポートします。 | [ソース](../lib/core/card-view/services/card-view-update.service.ts) |
| [Clipboard サービス](core/services/clipboard.service.md) | クリップボードにコピーしたテキスト。 | [ソース](../lib/core/clipboard/clipboard.service.ts) |
| [Comment Content サービス](core/services/comment-content.service.md) | コンテンツサービス内のノードのための追加や取り出しコメント。 | [ソース](../lib/core/services/comment-content.service.ts) |
| [Comment Process サービス](core/services/comment-process.service.md) | Process Servicesでのタスクやプロセスインスタンスの追加や取り出しコメント。 | [ソース](../lib/core/services/comment-process.service.ts) |
| [Content サービス](core/services/content.service.md) | アクセスアプリ-生成されたデータは、URLやファイルのダウンロードを経由してオブジェクト。 | [ソース](../lib/core/services/content.service.ts) |
| [Cookie サービス](core/services/cookie.service.md) | ブラウザのクッキーなどを格納したキーと値のデータ項目。 | [ソース](../lib/core/services/cookie.service.ts) |
| [Deleted Nodes Api サービス](core/services/deleted-nodes-api.service.md) | 現在、ごみ箱内のコンテンツサービスノードのリストを取得します。 | [ソース](../lib/core/services/deleted-nodes-api.service.ts) |
| [Discovery Api サービス](core/services/discovery-api.service.md) | プロセスのサービスやコンテンツサービスのバージョンやライセンス情報を取得します。 | [ソース](../lib/core/services/discovery-api.service.ts) |
| [Download zip サービス](core/services/download-zip.service.md) | 作成し、ダウンロードを管理します。 | [ソース](../lib/core/services/download-zip.service.ts) |
| [Ecm User サービス](core/services/ecm-user.service.md) | コンテンツサービスのユーザーに関する情報を取得します。 | [ソース](../lib/core/services/ecm-user.service.ts) |
| [Favorites Api サービス](core/services/favorites-api.service.md) | ユーザーは自分のお気に入りとしてマークされた項目のリストを取得します。 | [ソース](../lib/core/services/favorites-api.service.ts) |
| [Form Rendering サービス](core/services/form-rendering.service.md) | マップコンポーネントタイプウィジェット対応するフォームにフォームフィールド型文字列。 | [ソース](../lib/core/form/services/form-rendering.service.ts) |
| [Form サービス](core/services/form.service.md) | 実装は、サービスフォームのメソッドを処理します | [ソース](../lib/core/form/services/form.service.ts) |
| [Highlight Transform サービス](core/services/highlight-transform.service.md) | ハイライト選択したセクションに文字列を追加HTML。 | [ソース](../lib/core/services/highlight-transform.service.ts) |
| [Identity Group サービス](core/services/identity-group.service.md) | アイデンティティ・グループの実行CRUD操作を。 | [ソース](../lib/core/services/identity-group.service.ts) |
| [Identity role サービス](core/services/identity-role.service.md) | アイデンティティ・サービスのロールを操作するためのAPIを提供します。 | [ソース](../lib/core/services/identity-role.service.ts) |
| [Identity user サービス](core/services/identity-user.service.md) | アイデンティティユーザーのユーザーと行いCRUD操作のためのOAuth2個人情報と役割を取得します。 | [ソース](../lib/core/services/identity-user.service.ts) |
| [JWT helper サービス](core/services/jwt-helper.service.md) | JavaScriptオブジェクトにJSONウェブトークン（JWT）をデコードします。 | [ソース](../lib/core/services/jwt-helper.service.ts) |
| [Log サービス](core/services/log.service.md) | ログ機能を提供します。 | [ソース](../lib/core/services/log.service.ts) |
| [Login Dialog サービス](core/services/login-dialog.service.md) | ログインダイアログを管理します。 | [ソース](../lib/core/services/login-dialog.service.ts) |
| [Node サービス](core/services/node.service.md) | Alfrescoのリポジトリノードのメタデータを取得し、メタデータを用いてノードを作成します。 | [ソース](../lib/core/form/services/node.service.ts) |
| [Nodes Api サービス](core/services/nodes-api.service.md) | アクセスして操作するには、そのノードIDを使用して文書ノードをACS。 | [ソース](../lib/core/services/nodes-api.service.ts) |
| [Notification サービス](core/services/notification.service.md) | オプションのフィードバックと、通知メッセージを表示します。 | [ソース](../lib/core/notifications/services/notification.service.ts) |
| [Page Title サービス](core/services/page-title.service.md) | ページタイトルを設定します。 | [ソース](../lib/core/services/page-title.service.ts) |
| [People Content サービス](core/services/people-content.service.md) | コンテンツサービスのユーザーに関する情報を取得します。 | [ソース](../lib/core/services/people-content.service.ts) |
| [People Process サービス](core/services/people-process.service.md) | Process Servicesのユーザーに関する情報を取得します。 | [ソース](../lib/core/services/people-process.service.ts) |
| [Process Content サービス](core/services/process-content.service.md) | APSにおけるプロセスインスタンスまたはタスクインスタンスに関連した操作するコンテンツ。 | [ソース](../lib/core/form/services/process-content.service.ts) |
| [Renditions サービス](core/services/renditions.service.md) | 異なるフォーマットにコンテンツの事前に決められた変換を管理します。 | [ソース](../lib/core/services/renditions.service.ts) |
| [Search Configuration サービス](core/services/search-configuration.service.md) | 検索にパラメータの微調整を提供します。 | [ソース](../lib/core/services/search-configuration.service.ts) |
| [Search サービス](core/services/search.service.md) | コンテンツサービスの検索APIにアクセスします。 | [ソース](../lib/core/services/search.service.ts) |
| [Shared Links Api サービス](core/services/shared-links-api.service.md) | 見つかったコンテンツサービス項目へのリンクを共有しました。 | [ソース](../lib/core/services/shared-links-api.service.ts) |
| [Sites サービス](core/services/sites.service.md) | コンテンツサービスリポジトリからアクセスし、操作するサイト。 | [ソース](../lib/core/services/sites.service.ts) |
| [Storage サービス](core/services/storage.service.md) | キーと値のペアの形式で格納しアイテム。 | [ソース](../lib/core/services/storage.service.ts) |
| [Thumbnail サービス](core/services/thumbnail.service.md) | 文書タイプを表現する画像のサムネイルSVGを検索します。 | [ソース](../lib/core/services/thumbnail.service.ts) |
| [Translation サービス](core/services/translation.service.md) | サポートのローカライズ。 | [ソース](../lib/core/services/translation.service.ts) |
| [Upload サービス](core/services/upload.service.md) | ファイルアップロード機能に関連する様々なAPIへのアクセスを提供します。 | [ソース](../lib/core/services/upload.service.ts) |
| [User Preferences サービス](core/services/user-preferences.service.md) | アプリのために、個々のコンポーネントを格納するための設定。 | [ソース](../lib/core/services/user-preferences.service.ts) |

### Widgets

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [APS Content コンポーネント](core/widgets/content.widget.md) | コンテンツのプレビューを表示します。 | [ソース](../lib/core/form/components/widgets/content/content.widget.ts) |

<!--core end-->

[(Back to Contents)](#contents)

## Content Services API

Content Services に関連するコンポーネントが含まれています。
ソースコードのインストールと
使用の詳細については、
ライブラリの [README ファイル](../lib/content-services/README.md)を参照してください。

<!--content-services start-->

### Components

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [Add Permission Dialog コンポーネント](content-services/components/add-permission-dialog.component.md) | 現在のノードの権限に追加するユーザーまたはグループを検索するためのダイアログが表示されます。 | [ソース](../lib/content-services/src/lib/permission-manager/components/add-permission/add-permission-dialog.component.ts) |
| [Add Permission Panel コンポーネント](content-services/components/add-permission-panel.component.md) | 現在のノードの権限に追加するユーザーまたはグループを検索します。 | [ソース](../lib/content-services/src/lib/permission-manager/components/add-permission/add-permission-panel.component.ts) |
| [Add Permission コンポーネント](content-services/components/add-permission.component.md) | 現在のノードの権限に追加するユーザーまたはグループを検索します。 | [ソース](../lib/content-services/src/lib/permission-manager/components/add-permission/add-permission.component.ts) |
| [Breadcrumb コンポーネント](content-services/components/breadcrumb.component.md) | ナビゲーション階層内の現在の位置を示します。 | [ソース](../lib/content-services/src/lib/breadcrumb/breadcrumb.component.ts) |
| [Content Action コンポーネント](content-services/components/content-action.component.md) | 特定のコンテンツタイプ用ドキュメント一覧の操作メニューにオプションを追加します。 | [ソース](../lib/content-services/src/lib/document-list/components/content-action/content-action.component.ts) |
| [Content Metadata Card コンポーネント](content-services/components/content-metadata-card.component.md) | 表示および編集がメタデータノードに関連します。 | [ソース](../lib/content-services/src/lib/content-metadata/components/content-metadata-card/content-metadata-card.component.ts) |
| [Content Node Selector Panel コンポーネント](content-services/components/content-node-selector-panel.component.md) | 独自のダイアログウィンドウのコンテンツノードの選択]が開きます。 | [ソース](../lib/content-services/src/lib/content-node-selector/content-node-selector-panel.component.ts) |
| [Content Node Selector コンポーネント](content-services/components/content-node-selector.component.md) | ユーザーがコンテンツサービスリポジトリから項目を選択することができます。 | [ソース](../lib/content-services/src/lib/content-node-selector/content-node-selector.component.ts) |
| [Document List コンポーネント](content-services/components/document-list.component.md) | リポジトリからドキュメントを表示します。 | [ソース](../lib/content-services/src/lib/document-list/components/document-list.component.ts) |
| [Dropdown Breadcrumb コンポーネント](content-services/components/dropdown-breadcrumb.component.md) | ドロップダウンメニューを使用してナビゲーション階層内の現在の位置を示します。 | [ソース](../lib/content-services/src/lib/breadcrumb/dropdown-breadcrumb.component.ts) |
| [File Uploading Dialog コンポーネント](content-services/components/file-uploading-dialog.component.md) | ショーアップロードボタンまたはドラッグエリアコンポーネントでアップロードされたすべてのファイルを一覧表示するダイアログ。 | [ソース](../lib/content-services/src/lib/upload/components/file-uploading-dialog.component.ts) |
| [Like コンポーネント](content-services/components/like.component.md) | ユーザーが項目に「好き」を追加できるようにします。 | [ソース](../lib/content-services/src/lib/social/like.component.ts) |
| [Permission List コンポーネント](content-services/components/permission-list.component.md) | ショーはテーブルとしての権限をノード。 | [ソース](../lib/content-services/src/lib/permission-manager/components/permission-list/permission-list.component.ts) |
| [Rating コンポーネント](content-services/components/rating.component.md) | ユーザーがアイテムに評価を追加したり削除することができます。 | [ソース](../lib/content-services/src/lib/social/rating.component.ts) |
| [Search check list コンポーネント](content-services/components/search-check-list.component.md) | 実装検索フィルタコンポーネントのためのチェックリストウィジェット。 | [ソース](../lib/content-services/src/lib/search/components/search-check-list/search-check-list.component.ts) |
| [Search Chip List コンポーネント](content-services/components/search-chip-list.component.md) | 表示は「チップ」のセットとしての基準を検索します。 | [ソース](../lib/content-services/src/lib/search/components/search-chip-list/search-chip-list.component.ts) |
| [Search control コンポーネント](content-services/components/search-control.component.md) | ディスプレイは、ショーが入力されたテキストを検索-として、あなた型ことを提案。 | [ソース](../lib/content-services/src/lib/search/components/search-control.component.ts) |
| [Search date range コンポーネント](content-services/components/search-date-range.component.md) | 実装検索フィルタコンポーネントの日付範囲ウィジェット。 | [ソース](../lib/content-services/src/lib/search/components/search-date-range/search-date-range.component.ts) |
| [Search Filter コンポーネント](content-services/components/search-filter.component.md) | カスタム検索やファセット検索の設定のための主要なコンテナコンポーネントを表します。 | [ソース](../lib/content-services/src/lib/search/components/search-filter/search-filter.component.ts) |
| [Search number range コンポーネント](content-services/components/search-number-range.component.md) | 実装検索フィルタコンポーネントのための番号範囲ウィジェット。 | [ソース](../lib/content-services/src/lib/search/components/search-number-range/search-number-range.component.ts) |
| [Search radio コンポーネント](content-services/components/search-radio.component.md) | 実装検索フィルタコンポーネントのラジオボタンリストウィジェットを。 | [ソース](../lib/content-services/src/lib/search/components/search-radio/search-radio.component.ts) |
| [Search slider コンポーネント](content-services/components/search-slider.component.md) | 実装検索フィルタコンポーネントの数値スライダーウィジェット。 | [ソース](../lib/content-services/src/lib/search/components/search-slider/search-slider.component.ts) |
| [Search Sorting Picker コンポーネント](content-services/components/search-sorting-picker.component.md) | 検索結果の事前定義のソート定義のいずれかを選択する機能を提供します。 | [ソース](../lib/content-services/src/lib/search/components/search-sorting-picker/search-sorting-picker.component.ts) |
| [Search text コンポーネント](content-services/components/search-text.component.md) | 実装検索フィルタコンポーネントのテキスト入力ウィジェットを。 | [ソース](../lib/content-services/src/lib/search/components/search-text/search-text.component.ts) |
| [Search コンポーネント](content-services/components/search.component.md) | 付属の検索用語を検索する項目。 | [ソース](../lib/content-services/src/lib/search/components/search.component.ts) |
| [Sites Dropdown コンポーネント](content-services/components/sites-dropdown.component.md) | 表示ドロップダウンメニューが表示され、現在のユーザーのサイトと対話します。 | [ソース](../lib/content-services/src/lib/site-dropdown/sites-dropdown.component.ts) |
| [Tag Node Actions List コンポーネント](content-services/components/tag-actions.component.md) | タグに使用可能なアクションを表示します。 | [ソース](../lib/content-services/src/lib/tag/tag-actions.component.ts) |
| [Tag List コンポーネント](content-services/components/tag-list.component.md) | 項目のショータグ。 | [ソース](../lib/content-services/src/lib/tag/tag-list.component.ts) |
| [Tag Node List コンポーネント](content-services/components/tag-node-list.component.md) | ノードのためのショーのタグ。 | [ソース](../lib/content-services/src/lib/tag/tag-node-list.component.ts) |
| [Tree View コンポーネント](content-services/components/tree-view.component.md) | ツリービューとしてノードのフォルダとサブフォルダを表示します。 | [ソース](../lib/content-services/src/lib/tree-view/components/tree-view.component.ts) |
| [Upload Button コンポーネント](content-services/components/upload-button.component.md) | ファイルアップロードを有効にします。 | [ソース](../lib/content-services/src/lib/upload/components/upload-button.component.ts) |
| [Upload Drag Area コンポーネント](content-services/components/upload-drag-area.component.md) | ACSにファイルをアップロードするには、ドラッグ＆ドロップエリアを追加します。 | [ソース](../lib/content-services/src/lib/upload/components/upload-drag-area.component.ts) |
| [Upload Version Button コンポーネント (Workaround)](content-services/components/upload-version-button.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | ファイルバージョンのアップロードを有効にします。 | [ソース](../lib/content-services/src/lib/upload/components/upload-version-button.component.ts) |
| [Version List コンポーネント](content-services/components/version-list.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | バージョンマネージャのコンポーネント内のノードのバージョン履歴を表示します。 | [ソース](../lib/content-services/src/lib/version-manager/version-list.component.ts) |
| [Version Manager コンポーネント](content-services/components/version-manager.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | 新しいバージョンをアップロードする機能を持つノードのバージョン履歴を表示します。 | [ソース](../lib/content-services/src/lib/version-manager/version-manager.component.ts) |
| [Webscript コンポーネント](content-services/components/webscript.component.md) | Webscript機能へのアクセスを提供します。 | [ソース](../lib/content-services/src/lib/webscript/webscript.component.ts) |

### Directives

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [Node Public File Share ディレクティブ](content-services/directives/content-node-share.directive.md) | ファイルの公開、共有リンクを作成し、管理します。 | [ソース](../lib/content-services/src/lib/content-node-share/content-node-share.directive.ts) |
| [File Draggable ディレクティブ](content-services/directives/file-draggable.directive.md) | などのdivなどの要素のためのドラッグアンドドロップ機能を提供します。 | [ソース](../lib/content-services/src/lib/upload/directives/file-draggable.directive.ts) |
| [Folder Create ディレクティブ](content-services/directives/folder-create.directive.md) | フォルダを作成します。 | [ソース](../lib/content-services/src/lib/folder-directive/folder-create.directive.ts) |
| [Folder Edit ディレクティブ](content-services/directives/folder-edit.directive.md) | フォルダを編集することができます。 | [ソース](../lib/content-services/src/lib/folder-directive/folder-edit.directive.ts) |
| [Inherit Permission ディレクティブ](content-services/directives/inherited-button.directive.md) | 継承されたアクセス許可を削除/追加することによって、現在のノードを更新します。 | [ソース](../lib/content-services/src/lib/permission-manager/components/inherited-button.directive.ts) |
| [Node Lock ディレクティブ](content-services/directives/node-lock.directive.md) | ロックまたはロック解除ノード。 | [ソース](../lib/content-services/src/lib/directives/node-lock.directive.ts) |
| [Toggle Icon ディレクティブ](content-services/directives/toggle-icon.directive.md) | 選択可能な要素のためのマウスやキーボードイベントのトグルアイコン。 | [ソース](../lib/content-services/src/lib/upload/directives/toggle-icon.directive.ts) |

### Dialogs

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [Confirm dialog コンポーネント](content-services/dialogs/confirm.dialog.md) | ユーザーに yes/no の選択を要求します。 | [ソース](../lib/content-services/src/lib/dialogs/confirm.dialog.ts) |
| [Library dialog コンポーネント](content-services/dialogs/library.dialog.md) | Content Services の新しいドキュメントライブラリもしくはサイトを作成します。 | [ソース](../lib/content-services/src/lib/dialogs/library/library.dialog.ts) |

### Interfaces

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [Search widget インターフェース](content-services/interfaces/search-widget.interface.md) | 検索フィルターコンポーネントウィジェットに必要なプロパティを指定します。 | [ソース](../lib/content-services/src/lib/search/search-widget.interface.ts) |

### Models

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [Image Resolver モデル](content-services/models/image-resolver.model.md) | ドキュメントリストコンポーネントによって使用される画像リゾルバ機能を定義します。 | [ソース](../lib/content-services/document-list/data/image-resolver.model.ts) |
| [Permission Style モデル](content-services/models/permissions-style.model.md) | アイテムの権限に応じてドキュメントリストの行のためのカスタムCSSスタイルを設定します。 | [ソース](../lib/content-services/src/lib/document-list/models/permissions-style.model.ts) |
| [Row Filter モデル](content-services/models/row-filter.model.md) | ドキュメントリストコンポーネントによって使用される行のフィルタ機能を定義します。 | [ソース](../lib/content-services/document-list/data/row-filter.model.ts) |

### Pipes

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [File upload error パイプ](content-services/pipes/file-upload-error.pipe.md) | アップロードエラーコードをエラーメッセージに変換します。 | [ソース](../lib/content-services/src/lib/upload/pipes/file-upload-error.pipe.ts) |

### Services

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [Content Node Dialog サービス](content-services/services/content-node-dialog.service.md) | 表示およびオープン、コピーやアップロードにコンテンツを選択するためのダイアログを管理します。 | [ソース](../lib/content-services/src/lib/content-node-selector/content-node-dialog.service.ts) |
| [Custom Resources サービス](content-services/services/custom-resources.service.md) | ユーザーに固有のドキュメントリスト情報を管理します。 | [ソース](../lib/content-services/src/lib/document-list/services/custom-resources.service.ts) |
| [Document Actions サービス](content-services/services/document-actions.service.md) | ドキュメントリストコンポーネントのドキュメントのメニュー・アクションを実装します。 | [ソース](../lib/content-services/src/lib/document-list/services/document-actions.service.ts) |
| [Document List サービス](content-services/services/document-list.service.md) | 器具は、ドキュメント一覧コンポーネントによって使用される動作ノード。 | [ソース](../lib/content-services/src/lib/document-list/services/document-list.service.ts) |
| [Folder Actions サービス](content-services/services/folder-actions.service.md) | ドキュメントリストコンポーネントのフォルダのメニュー・アクションを実装します。 | [ソース](../lib/content-services/src/lib/document-list/services/folder-actions.service.ts) |
| [Node permission dialog サービス](content-services/services/node-permission-dialog.service.md) | ユーザ設定ノードの権限をできるように表示したダイアログ。 | [ソース](../lib/content-services/src/lib/permission-manager/services/node-permission-dialog.service.ts) |
| [Node Permission サービス](content-services/services/node-permission.service.md) | コンテンツノードの役割の権限を管理します。 | [ソース](../lib/content-services/src/lib/permission-manager/services/node-permission.service.ts) |
| [Rating サービス](content-services/services/rating.service.md) | コンテンツサービス内の項目の評価を管理します。 | [ソース](../lib/content-services/src/lib/social/services/rating.service.ts) |
| [Search filter サービス](content-services/services/search-filter.service.md) | レジスタは、検索フィルタコンポーネントで使用するためのウィジェット。 | [ソース](../lib/content-services/src/lib/search/components/search-filter/search-filter.service.ts) |
| [Search Query Builder サービス](content-services/services/search-query-builder.service.md) | 店舗のすべてのカスタム検索やファセット検索ウィジェットからの情報、コンパイルして、最終的な検索クエリを実行します。 | [ソース](../lib/content-services/src/lib/search/search-query-builder.service.ts) |
| [Tag サービス](content-services/services/tag.service.md) | コンテンツサービスのタグを管理します。 | [ソース](../lib/content-services/src/lib/tag/services/tag.service.ts) |

<!--content-services end-->

[(Back to Contents)](#contents)

## Process Services API

Process Services に関連するコンポーネントが含まれています。
ソースコードのインストールと
使用の詳細については、
ライブラリの [README ファイル](../lib/process-services/README.md) を参照してください。

<!--process-services start-->

### Components

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [Apps List コンポーネント](process-services/components/apps-list.component.md) | 利用可能なすべてのアプリケーションを表示します。 | [ソース](../lib/process-services/src/lib/app-list/apps-list.component.ts) |
| [Attach Form コンポーネント](process-services/components/attach-form.component.md) | タスクに添付no形式が存在しない場合は、このコンポーネントを使用することができますし、1を追加します。 | [ソース](../lib/process-services/src/lib/task-list/components/attach-form.component.ts) |
| [Checklist コンポーネント](process-services/components/checklist.component.md) | チェックリストのタスク機能を表示します。 | [ソース](../lib/process-services/src/lib/task-list/components/checklist.component.ts) |
| [Create Process Attachment コンポーネント](process-services/components/create-process-attachment.component.md) | 指定されたプロセス・インスタンスに添付ファイルをアップロードするための表示アップロードコンポーネント（ドラッグ＆クリックします）。 | [ソース](../lib/process-services/src/lib/attachment/create-process-attachment.component.ts) |
| [Create Task Attachment コンポーネント](process-services/components/create-task-attachment.component.md) | 指定されたタスクに添付ファイルをアップロードするための表示アップロードコンポーネント（ドラッグ＆クリックします）。 | [ソース](../lib/process-services/src/lib/attachment/create-task-attachment.component.ts) |
| [Form コンポーネント](process-services/components/form.component.md) | APSからショーフォーム | [ソース](../lib/process-services/src/lib/form/form.component.ts) |
| [People list コンポーネント](process-services/components/people-list.component.md) | ユーザー（人）のリストを表示します。 | [ソース](../lib/process-services/src/lib/people/components/people-list/people-list.component.ts) |
| [People Search コンポーネント](process-services/components/people-search.component.md) | 検索ユーザー/人。 | [ソース](../lib/process-services/src/lib/people/components/people-search/people-search.component.ts) |
| [People コンポーネント](process-services/components/people.component.md) | 指定されたタスクに関与表示し、ユーザー | [ソース](../lib/process-services/src/lib/people/components/people/people.component.ts) |
| [Process Attachment List コンポーネント](process-services/components/process-attachment-list.component.md) | 指定されたプロセス・インスタンスに添付を表示した文書。 | [ソース](../lib/process-services/src/lib/attachment/process-attachment-list.component.ts) |
| [Process Instance Comments コンポーネント](process-services/components/process-comments.component.md) | コメントを表示し、特定のプロセス・インスタンスに関連付けられており、ユーザーが新しいコメントを追加することができます。 | [ソース](../lib/process-services/src/lib/process-comments/process-comments.component.ts) |
| [Process Filters コンポーネント](process-services/components/process-filters.component.md) | ユーザによってカスタマイズすることができるフィルタ・プロセス・インスタンスに使用される基準のコレクション。 | [ソース](../lib/process-services/src/lib/process-list/components/process-filters.component.ts) |
| [Process Details コンポーネント](process-services/components/process-instance-details.component.md) | 表示は、指定されたプロセス・インスタンスに関する詳細情報を | [ソース](../lib/process-services/src/lib/process-list/components/process-instance-details.component.ts) |
| [Process Instance Details Header コンポーネント](process-services/components/process-instance-header.component.md) | 選択されたプロセスに関するいくつかの一般的な情報をレンダリング処理の詳細コンポーネントのサブコンポーネント。 | [ソース](../lib/process-services/src/lib/process-list/components/process-instance-header.component.ts)  |
| [Process Instance Tasks コンポーネント](process-services/components/process-instance-tasks.component.md) | リストの両方特定のプロセス・インスタンスに関連付けられたアクティブおよび完了したタスク | [ソース](../lib/process-services/src/lib/process-list/components/process-instance-tasks.component.ts) |
| [Process Instance List](process-services/components/process-list.component.md) | 指定されたパラメータで一致したすべてのプロセス・インスタンスを含むリストをレンダリングします。 | [ソース](../lib/process-services/src/lib/process-list/components/process-list.component.ts) |
| [Select App コンポーネント](process-services/components/select-apps-dialog.component.md) | ショー、利用可能なすべてのアプリケーションと戻り、選択アプリ。 | [ソース](../lib/process-services/src/lib/app-list/select-apps-dialog.component.ts) |
| [Start Process コンポーネント](process-services/components/start-process.component.md) | プロセスを開始します。 | [ソース](../lib/process-services/src/lib/process-list/components/start-process.component.ts) |
| [Start Task コンポーネント](process-services/components/start-task.component.md) | /作成し、指定のアプリのための新しいタスクを開始します。 | [ソース](../lib/process-services/src/lib/task-list/components/start-task.component.ts) |
| [Task Attachment List コンポーネント](process-services/components/task-attachment-list.component.md) | 指定されたタスクに添付を表示した文書。 | [ソース](../lib/process-services/src/lib/attachment/task-attachment-list.component.ts) |
| [Task Details コンポーネント](process-services/components/task-details.component.md) | ショータスクIDの詳細については、入力として渡されました。 | [ソース](../lib/process-services/src/lib/task-list/components/task-details.component.ts) |
| [Task Filters コンポーネント](process-services/components/task-filters.component.md) | 利用可能なすべてのフィルタを表示します。 | [ソース](../lib/process-services/src/lib/task-list/components/task-filters.component.ts) |
| [Task Header コンポーネント](process-services/components/task-header.component.md) | タスクに関連するすべての情報を表示します。 | [ソース](../lib/process-services/src/lib/task-list/components/task-header.component.ts) |
| [Task List コンポーネント](process-services/components/task-list.component.md) | 指定されたパラメータにマッチしたすべてのタスクを含むリストをレンダリングします。 | [ソース](../lib/process-services/src/lib/task-list/components/task-list.component.ts) |
| [Task Standalone コンポーネント](process-services/components/task-standalone.component.md) | タスクは、すべてのプロセスに属していない場合は、このコンポーネントを使用することができます。 | [ソース](../lib/process-services/src/lib/task-list/components/task-standalone.component.ts) |

### Directives

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [Process Audit ディレクティブ](process-services/directives/process-audit.directive.md) | PDF または JSON 形式のプロセス監査情報を取得します。 | [ソース](../lib/process-services/src/lib/process-list/components/process-audit.directive.ts) |
| [Task Audit ディレクティブ](process-services/directives/task-audit.directive.md) | PDF または JSON 形式のタスク監査情報を取得します。 | [ソース](../lib/process-services/src/lib/task-list/components/task-audit.directive.ts) |

### Services

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [Process Filter サービス](process-services/services/process-filter.service.md) | 事前構成されたプロセスインスタンスクエリであるプロセスフィルタを管理します。 | [ソース](../lib/process-services/src/lib/process-list/services/process-filter.service.ts) |
| [Process サービス](process-services/services/process.service.md) | プロセス・インスタンス、プロセス変数、およびプロセス監査ログを管理します。 | [ソース](../lib/process-services/src/lib/process-list/services/process.service.ts) |
| [Task Filter サービス](process-services/services/task-filter.service.md) | タスクインスタンスのクエリを事前に構成されているタスクのフィルタを管理します。 | [ソース](../lib/process-services/src/lib/task-list/services/task-filter.service.ts) |
| [Tasklist サービス](process-services/services/tasklist.service.md) | タスクインスタンスを管理します。 | [ソース](../lib/process-services/src/lib/task-list/services/tasklist.service.ts) |

<!--process-services end-->

[(Back to Contents)](#contents)

## Process Services Cloud API

Process Services Cloud に関連するコンポーネントが含まれています。
ソースコードのインストールと
使用の詳細については、
ライブラリの [README ファイル](../lib/process-services-cloud/README.md)を参照してください。

<!--process-services-cloud start-->

### Components

| コンポーネント名 | 説明 | ソースへのリンク |
| ------------ | ---------- | --------- |
| [App List Cloud コンポーネント](process-services-cloud/components/app-list-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | ショーは、すべてのクラウドアプリケーションのインスタンスを展開します。 | [ソース](../lib/process-services-cloud/src/lib/app/components/app-list-cloud.component.ts) |
| [Edit Process Filter Cloud コンポーネント](process-services-cloud/components/edit-process-filter-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | ショー/編集は、フィルタの詳細を処理します。 | [ソース](../lib/process-services-cloud/src/lib/process/process-filters/components/edit-process-filter-cloud.component.ts) |
| [Edit Task Filter Cloud コンポーネント](process-services-cloud/components/edit-task-filter-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | 編集タスクフィルタの詳細。 | [ソース](../lib/process-services-cloud/src/lib/task/task-filters/components/edit-task-filter-cloud.component.ts) |
| [Form cloud custom outcomes コンポーネント](process-services-cloud/components/form-cloud-custom-outcome.component.md) | フォームクラウドコンポーネントに含まれる用品カスタム成果ボタン。 | [ソース](../lib/process-services-cloud/src/lib/form/components/form-cloud-custom-outcomes.component.ts) |
| [Form cloud コンポーネント](process-services-cloud/components/form-cloud.component.md) | Process Servicesからフォームを表示します。 | [ソース](../lib/process-services-cloud/src/lib/form/components/form-cloud.component.ts) |
| [Form Definition Selector Cloud](process-services-cloud/components/form-definition-selector-cloud.component.md) | 一形態では、ドロップダウンリストから選択できるようにします。フォームがこのコンポーネントで表示されるためには、彼らは、スタンドアロンのタスクと互換性がある必要があります。 | [ソース](../lib/process-services-cloud/src/lib/form/components/form-definition-selector-cloud.component.ts) |
| [Group Cloud コンポーネント](process-services-cloud/components/group-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | 検索グループ。 | [ソース](../lib/process-services-cloud/src/lib/group/components/group-cloud.component.ts) |
| [People Cloud コンポーネント](process-services-cloud/components/people-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | 1人または複数のユーザ入力パラメータに基づいて（自動提案して）​​選択されることを可能にします。 | [ソース](../lib/process-services-cloud/src/lib/people/components/people-cloud.component.ts) |
| [Process Filters Cloud コンポーネント](process-services-cloud/components/process-filters-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | 利用可能なすべてのプロセスのフィルタを一覧表示し、フィルタを選択することができます。 | [ソース](../lib/process-services-cloud/src/lib/process/process-filters/components/process-filters-cloud.component.ts) |
| [Process Header Cloud コンポーネント](process-services-cloud/components/process-header-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | プロセス・インスタンスに関連するすべての情報を表示します。 | [ソース](../lib/process-services-cloud/src/lib/process/process-header/components/process-header-cloud.component.ts) |
| [Process Instance List Cloud コンポーネント](process-services-cloud/components/process-list-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | 指定されたパラメータで一致したすべてのプロセス・インスタンスを含むリストをレンダリングします。 | [ソース](../lib/process-services-cloud/src/lib/process/process-list/components/process-list-cloud.component.ts) |
| [Start Process Cloud コンポーネント](process-services-cloud/components/start-process-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | プロセスを開始します。 | [ソース](../lib/process-services-cloud/src/lib/process/start-process/components/start-process-cloud.component.ts) |
| [Start Task Cloud コンポーネント](process-services-cloud/components/start-task-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | /作成し、指定のアプリのための新しいタスクを開始します。 | [ソース](../lib/process-services-cloud/src/lib/task/start-task/components/start-task-cloud.component.ts) |
| [Task Filters Cloud コンポーネント](process-services-cloud/components/task-filters-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | 利用可能なすべてのフィルタを表示します。 | [ソース](../lib/process-services-cloud/src/lib/task/task-filters/components/task-filters-cloud.component.ts) |
| [Form cloud コンポーネント](process-services-cloud/components/task-form-cloud.component.md) | タスクのためのフォームを表示します。 | [ソース](../lib/testing/src/lib/process-services-cloud/pages/task-form-cloud-component.page.ts) |
| [Task Header Cloud コンポーネント](process-services-cloud/components/task-header-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | タスクに関連するすべての情報を表示します。 | [ソース](../lib/process-services-cloud/src/lib/task/task-header/components/task-header-cloud.component.ts) |
| [Task List Cloud コンポーネント](process-services-cloud/components/task-list-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | 指定されたパラメータにマッチしたすべてのタスクを含むリストをレンダリングします。 | [ソース](../lib/process-services-cloud/src/lib/task/task-list/components/task-list-cloud.component.ts) |

### Directives

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [Cancel Process ディレクティブ](process-services-cloud/directives/cancel-process.directive.md) ![Experimental](docassets/images/ExperimentalIcon.png) | プロセスをキャンセルします | [ソース](../lib/process-services-cloud/src/lib/process/directives/cancel-process.directive.ts) |
| [Claim Task ディレクティブ](process-services-cloud/directives/claim-task.directive.md) ![Experimental](docassets/images/ExperimentalIcon.png) | タスクを申請します | [ソース](../lib/process-services-cloud/src/lib/task/directives/claim-task.directive.ts) |
| [Complete Task ディレクティブ](process-services-cloud/directives/complete-task.directive.md) ![Experimental](docassets/images/ExperimentalIcon.png) | タスクを完了します | [ソース](../lib/process-services-cloud/src/lib/task/directives/complete-task.directive.ts) |
| [Unclaim Task ディレクティブ](process-services-cloud/directives/unclaim-task.directive.md) ![Experimental](docassets/images/ExperimentalIcon.png) | タスクの申請を取り消します | [ソース](../lib/process-services-cloud/src/lib/task/directives/unclaim-task.directive.ts) |

### Pipes

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [Group initial パイプ](process-services-cloud/pipes/group-initial.pipe.md) | グループ名からイニシャルを抽出します。 | [ソース](../lib/process-services-cloud/src/lib/group/pipe/group-initial.pipe.ts) |

### Services

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [Apps Process Cloud サービス](process-services-cloud/services/apps-process-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | 現在のユーザーにデプロイされたアプリの詳細を取得します。 | [ソース](../lib/process-services-cloud/src/lib/app/services/apps-process-cloud.service.ts) |
| [Form cloud サービス](process-services-cloud/services/form-cloud.service.md) | Process Services のフォームメソッドを実装します | [ソース](../lib/testing/src/lib/form-cloud/actions/form-cloud.service.ts) |
| [Group Cloud サービス](process-services-cloud/services/group-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | グループの情報を検索および取得します。 | [ソース](../lib/process-services-cloud/src/lib/group/services/group-cloud.service.ts) |
| [Local Preference Cloud サービス](process-services-cloud/services/local-preference-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | ローカルストレージの設定を管理します。 | [ソース](../lib/process-services-cloud/src/lib/services/local-preference-cloud.service.ts) |
| [Process Cloud サービス](process-services-cloud/services/process-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | クラウドプロセスインスタンスを管理します。 | [ソース](../lib/process-services-cloud/src/lib/process/services/process-cloud.service.ts) |
| [Process Filter Cloud サービス](process-services-cloud/services/process-filter-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | 事前設定されたプロセスインスタンスクエリであるプロセスフィルターを管理します。 | [ソース](../lib/process-services-cloud/src/lib/process/process-filters/services/process-filter-cloud.service.ts) |
| [Process List Cloud サービス](process-services-cloud/services/process-list-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | プロセスを検索します。 | [ソース](../lib/process-services-cloud/src/lib/process/process-list/services/process-list-cloud.service.ts) |
| [Start Process Cloud サービス](process-services-cloud/services/start-process-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | プロセス定義を取得し、プロセスを開始します。 | [ソース](../lib/process-services-cloud/src/lib/process/start-process/services/start-process-cloud.service.ts) |
| [Start Task Cloud サービス](process-services-cloud/services/start-task-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | スタンドアロンタスクを開始します。 | [ソース](../lib/process-services-cloud/src/lib/task/services/start-task-cloud.service.ts) |
| [Task Cloud サービス](process-services-cloud/services/task-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Cloud のタスクを管理します。 | [ソース](../lib/process-services-cloud/src/lib/task/services/task-cloud.service.ts) |
| [Task Filter Cloud サービス](process-services-cloud/services/task-filter-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | タスクフィルターを管理します。 | [ソース](../lib/process-services-cloud/src/lib/task/task-filters/services/task-filter-cloud.service.ts) |
| [Task List Cloud サービス](process-services-cloud/services/task-list-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | タスクを検索します。 | [ソース](../lib/process-services-cloud/src/lib/task/task-list/services/task-list-cloud.service.ts) |
| [User Preference Cloud サービス](process-services-cloud/services/user-preference-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | ユーザー設定を管理します。 | [ソース](../lib/process-services-cloud/src/lib/services/user-preference-cloud.service.ts) |

<!--process-services-cloud end-->

[(Back to Contents)](#contents)

## Extensions API

拡張機能に関連するコンポーネントが含まれています。
ソースコードのインストールと
使用の詳細については、
ライブラリの [README ファイル](../lib/extensions/README.md)を参照してください。

<!--extensions start-->

### Components

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [Dynamic コンポーネント](extensions/components/dynamic.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | 動的にロードされた拡張コンポーネントを表示します。 | [ソース](../lib/extensions/src/lib/components/dynamic-component/dynamic.component.ts) |
| [Preview Extension コンポーネント](extensions/components/preview-extension.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | 動的に読み込まれるビューアプレビュー拡張機能をサポートします。 | [ソース](../lib/extensions/src/lib/components/viewer/preview-extension.component.ts) |

### Services

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [Extension サービス](extensions/services/extension.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | 基本的な拡張機能を管理および実行します。 | [ソース](../lib/extensions/src/lib/services/extension.service.ts) |

<!--extensions end-->

[(Back to Contents)](#contents)

## Insights API

Process Services の分析と
ダイアグラムのコンポーネントが含まれています。
ソースコードのインストールと使用の詳細については、
ライブラリの [README ファイル](../lib/insights/README.md)を参照してください。

<!--insights start-->

### Components

| コンポーネント名 | 説明 | ソースへのリンク |
| ---- | ----------- | ----------- |
| [Analytics Generator コンポーネント](insights/components/analytics-generator.component.md) | チャートを生成して表示します | [ソース](../lib/insights/src/lib/analytics-process/components/analytics-generator.component.ts) |
| [APS Analytics List コンポーネント](insights/components/analytics-report-list.component.md) | 利用可能なすべてのレポートのリストを表示します | [ソース](../lib/insights/src/lib/analytics-process/components/analytics-report-list.component.ts) |
| [APS Analytics コンポーネント](insights/components/analytics.component.md) | 入力として渡された reportId に関連するチャートを表示します | [ソース](../lib/insights/src/lib/analytics-process/components/analytics.component.ts) |
| [Diagram コンポーネント](insights/components/diagram.component.md) | プロセスダイアグラムを表示します。 | [ソース](../lib/insights/src/lib/diagram/components/diagram.component.ts) |
| [Widget コンポーネント](insights/components/widget.component.md) | 標準およびカスタムウィジェットクラスの基本クラス。 | [ソース](../lib/insights/src/lib/analytics-process/components/widgets/widget.component.ts) |

<!--insights end-->

[(Back to Contents)](#contents)

---
Title: Upgrading from ADF v6.4 to v6.5.2
---

# Upgrading from ADF v6.4 to v6.5.2

This guide provides instructions on how to upgrade your v6.4.0 ADF projects to v6.5.2 (covering the
6.5.0, 6.5.1 and 6.5.2 releases).

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup.

Do not skip this task if you want your application to be updated to the most recent version of ADF.
Upgrades of multiple versions of ADF cannot be done in one step only, but should follow the chain of sequential updates.

After the upgrade, check the other sections below to see if there are any changes affecting your project.

## Contents

- [Library updates](#library-updates)
- [Breaking changes](#breaking-changes)
  - [Authentication refactor](#authentication-refactor)
  - [OAuth2 app.config keys](#oauth2-appconfig-keys)
  - [Standalone components and pipes](#standalone-components-and-pipes)
  - [Data table date column](#data-table-date-column)
  - [Search query migration (Elasticsearch)](#search-query-migration-elasticsearch)
  - [Notification history](#notification-history)
  - [Info drawer styling](#info-drawer-styling)
  - [Other breaking changes](#other-breaking-changes)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)
- [Theme changes](#theme-changes)
- [Notable internal changes](#notable-internal-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "6.5.2",
        "@alfresco/adf-content-services": "6.5.2",
        "@alfresco/adf-process-services": "6.5.2",
        "@alfresco/adf-process-services-cloud": "6.5.2",
        "@alfresco/adf-insights": "6.5.2",
        "@alfresco/adf-extensions": "6.5.2",
        "@alfresco/js-api": ">=7.2.0"
    }
}
```

Clean your old distribution and dependencies by deleting `node_modules` and `package-lock.json`, then reinstall:

```sh
npm install
```

## Breaking changes

### Authentication refactor

Authentication was rewritten to run entirely inside ADF (on `AdfHttpClient`) instead of delegating to
`@alfresco/js-api`. The monolithic authentication service was split into dedicated services, and OIDC
logic was relocated. Module registration in your `AppModule` is unchanged (you still import `AuthModule`),
but the following affect consumer code:

- **`OIDCAuthenticationService` was renamed to `OidcAuthenticationService`.** Update any import/usage by name.
- **`addTokenToHeader` now takes the request URL as its first argument:**

  ```ts
  // Before
  addTokenToHeader(headers?: HttpHeaders): Observable<HttpHeaders>
  // After
  addTokenToHeader(requestUrl: string, headersArg?: HttpHeaders): Observable<HttpHeaders>
  ```

  This affects any custom `Authentication` implementation or interceptor.

- **Relocated methods:**
  - `setRedirect()` / `getRedirect()` moved to `BasicAlfrescoAuthService`.
  - `ssoImplicitLogin()` / `isPublicUrl()` moved to `OidcAuthenticationService`.
- **`AuthGuardBase`** switched from `inject()` field injection to an explicit constructor requiring
  `(AuthenticationService, BasicAlfrescoAuthService, OidcAuthenticationService, Router, AppConfigService, MatDialog, StorageService)`. Any subclass with its own constructor must pass these through `super(...)`.
- `CoreModule` no longer imports the legacy JS-API client modules (`LegacyApiClientModule`,
  `AlfrescoJsClientsModule`). If you relied on them being pulled in transitively via core, import them explicitly.

New auth services are exported from `@alfresco/adf-core`: `BasicAlfrescoAuthService`, `ContentAuth`,
`ProcessAuth`, and the `AuthenticationServiceInterface`.

- **The ECM/BPM-specific auth accessors are now `@deprecated`** (still functional): `getEcmUsername()` /
  `getBpmUsername()` on `AuthenticationService` and `OidcAuthenticationService`, and `getTicketEcm()` /
  `getTicketBpm()` on `BasicAlfrescoAuthService`. Migrate to the unified `getUsername()` / token accessors — these
  deprecated methods are removed later, in v8.2.1.

### OAuth2 app.config keys

The OIDC/OAuth2 configuration in `app.config.json` changed:

| Key | Change | Consumer action |
| --- | ------ | --------------- |
| `oauth2.redirectSilentIframeUri` | Silent-refresh now reads this value instead of a hardcoded `/silent-refresh.html`. | **Set this explicitly** if you use silent refresh, otherwise the silent-refresh URL is undefined. |
| `oauth2.redirectUri` | New optional post-login redirect base, appended to the location origin when not `/`. | Optional; useful for apps served from a sub-path. |
| `oauth2.secret` | No longer a **required** schema property (only `host`, `clientId`, `scope` are required). | Public/PKCE clients no longer need to supply `secret`. |

If you ship your own copy of `silent-refresh.html`, add the message-post that returns the token to the
opener/parent window (`(window.opener || window.parent).postMessage(location.hash || ('#' + location.search), location.origin)`),
otherwise the token is not picked up after a silent refresh.

### Standalone components and pipes

The following became **standalone** and were moved from their module's `declarations` to `imports`. If
your own NgModule directly declared any of them, import them instead:

- `DateCellComponent`, `LocationCellComponent` (datatable cells)
- `LocalizedDatePipe`, `TimeAgoPipe`

`LocationCellComponent` now also requires the column's `format` to be set for the value/tooltip to render.

### Data table date column

`date`-type columns are now configurable via a new `dateConfig`, and `DateCellComponent` was reworked:

- New interfaces in `@alfresco/adf-core`: `LocaleConfig { locale?: string }` and
  `DateConfig extends LocaleConfig { format?: string; tooltipFormat?: string }` (`DecimalConfig` now also
  extends `LocaleConfig`).
- New optional `DataColumn.dateConfig?: DateConfig` and `@Input() dateConfig` on `DateCellComponent`.
- **Removed** from `DateCellComponent`: the `static DATE_FORMAT` constant and the public `currentLocale`,
  `dateFormat`, `tooltipDateFormat` fields (and its old multi-argument constructor). Update code referencing them.

Format/tooltip/locale now resolve `dateConfig.*` → app-config `dateValues.*` → defaults (`format: 'medium'`,
`tooltipFormat: 'medium'`).

### Search query migration (Elasticsearch)

Some built-in search queries were migrated from the older Solr-style special properties (`PNAME`, `ANAME`)
to path-based AFTS syntax (`PATH:`) for Elasticsearch compatibility:

- `CustomResourcesService.getRecentFiles()` filter: `-PNAME:"0/wiki"` → `-PATH:"//cm:wiki/*"`.
- Add-permission authority search: `ANAME:("0/APP.DEFAULT")` → `PATH:"//cm:APP.DEFAULT/*"`; `userName` was
  added and `displayName` removed from the matched fields.

If you have a custom `search.config` or `SearchConfigurationService` that emits `PNAME`/`ANAME` fragments,
migrate them to `PATH:"//cm:.../*"` syntax against an Elasticsearch-compatible backend. The
`AutocompleteOption` interface gained an optional `query?: string` so an autocomplete option can supply
its own query fragment instead of the default `field:"value"`.

### Notification history

- The storage key moved from the `NotificationHistoryComponent.NOTIFICATION_STORAGE` static field to an
  exported module-level constant `NOTIFICATION_STORAGE` in `notification.model.ts`. Import it from there
  instead of the component.
- `NotificationModel` gained an optional `read?: boolean`. The history menu now tracks read/unread state
  (see [Behavioural changes](#behavioural-changes)).

### Info drawer styling

`InfoDrawerComponent` tabs no longer override Material's internal `.mat-tab-label` classes; they use
ADF-owned classes (`.adf-info-drawer-tab`, `.adf-info-drawer-tab--active`) driven by design tokens. If you
styled the info-drawer tabs by targeting `.mat-tab-label`, retarget the new classes or the tokens (see
[Theme changes](#theme-changes)).

The internal SCSS mixin signature changed from `adf-components-variables()` to
`adf-components-variables($theme)`. If you call this mixin directly, pass the theme.

### Other breaking changes

- **Insights** — the `analytics.service.mock` test-fixture module (e.g. `fakeReportList`) was removed from
  the `@alfresco/adf-insights` mock public API. Inline your own fixtures if you imported it.

## New components and features

- **Header background** — [`HeaderLayoutComponent`](../core/components/header.component.md) gained
  `@Input() backgroundImage: string` (default `''`), and its `@Input() color` type was widened from
  `ThemePalette` to `ThemePalette | string`, so it now also accepts a hex color (e.g. `'#42f57e'`).
- **Document list resizing** — [`DocumentListComponent`](../content-services/components/document-list.component.md)
  gained `@Input() isResizingEnabled` (default `false`) and `@Input() blurOnResize` (default `true`);
  `DataTableComponent` also gained `@Input() blurOnResize`.
- **Data table date config** — per-column `dateConfig` (see [Data table date column](#data-table-date-column)).
- **Info drawer design tokens** — themeable `--adf-info-drawer-tab-*` CSS custom properties (see [Theme changes](#theme-changes)).
- **Insights** — new exported abstract `DiagramElement` directive base class.

## Behavioural changes

| Area | Change |
| ---- | ------ |
| Auth | Silent refresh now returns a fresh token to the app; `redirectUri`/`redirectSilentIframeUri` from `app.config.json` are honoured for login/silent-refresh URLs. |
| Notifications | The history menu shows only unread notifications; "mark as read" flags notifications as read and keeps them in storage rather than deleting them. New notifications default to `read: false`. |
| Viewer | PDF/TIFF viewer thumbnails now refresh when the displayed file changes. |
| Data table | Very long file/folder names no longer shift column alignment (body width `fit-content` → `100%`). |
| Share dialog | The extra gray area/padding around the share-link dialog content was removed. |
| Custom theme | Custom palette shades 100–300 are now calculated correctly, and custom themes inherit the default font family. |

## Theme changes

- **Info drawer tabs** are now themeable via `--adf-info-drawer-tab-*` CSS custom properties
  (default/hover/active-unfocused/active-focused colors, backgrounds and bottom lines) instead of Material
  internal class overrides.
- **Custom palette** generation was fixed (shades 100–300 now map to the correct base colors), and custom
  themes now use the shared `$default-font-family` rather than a hardcoded Muli stack — expect minor visual
  differences in custom themes.

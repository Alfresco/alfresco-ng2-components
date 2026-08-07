---
Title: Upgrading from ADF v8.4 to v8.5
---

# Upgrading from ADF v8.4 to v8.5

This guide provides instructions on how to upgrade your v8.4.1 ADF projects to v8.5.0.

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. Because this
release changes theming, the HTTP transport, the Node version, and the PDF viewer packaging, budget time to
rebuild, re-theme and re-test your application.

## Contents

- [Library updates](#library-updates)
- [Breaking changes](#breaking-changes)
  - [Node 24 and the fetch HTTP client](#node-24-and-the-fetch-http-client)
  - [Material Design 3 theming](#material-design-3-theming)
  - [Material `color` inputs removed](#material-color-inputs-removed)
  - [PDF viewer moved to a lazy entry point](#pdf-viewer-moved-to-a-lazy-entry-point)
  - [OAuth / JWKS](#oauth--jwks)
  - [Card view select item](#card-view-select-item)
  - [Form widget base class](#form-widget-base-class)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "8.5.0",
        "@alfresco/adf-content-services": "8.5.0",
        "@alfresco/adf-process-services": "8.5.0",
        "@alfresco/adf-process-services-cloud": "8.5.0",
        "@alfresco/adf-insights": "8.5.0",
        "@alfresco/adf-extensions": "8.5.0",
        "@alfresco/js-api": ">=9.5.0",
        "@ngx-translate/core": ">=17.0.0"
    }
}
```

Angular/Material stay on 19.2. Clean `node_modules` and `package-lock.json`, then `npm install`.

## Breaking changes

### Node 24 and the fetch HTTP client

`@alfresco/js-api` replaced its `superagent`-based HTTP client with one built on the native **`fetch`** API
(`FetchHttpClient`), and the repository's `engines.node` was raised to **`>= 24.14.0`**.

- **Upgrade your Node runtime/CI to Node 24.**
- `superagent`, `@types/superagent`, and `nock` were removed (`undici` added). The `AlfrescoApi` / `AlfrescoApiClient` /
  `AdfHttpClient` public `HttpClient` interfaces are **unchanged**, so custom clients still work. Only code deep-importing
  the internal `SuperagentHttpClient` breaks. `FetchHttpClient` accepts an optional `customFetch` implementation.

### Material Design 3 theming

ADF's own custom SCSS theming layer was removed in favour of **Angular Material's M3 system variables (`--mat-sys-*`)**.
This is the largest source of visual/build breakage for themed apps.

- **Define an Angular Material M3 theme in your app** (`mat.define-theme(...)` / `mat.theme(...)` +
  `@include mat.all-component-themes($theme)`, per the [Material theming guide](https://material.angular.dev/guide/theming)).
  ADF ships no theme mixin — it inherits colours and typography from your app's M3 theme automatically.
- **All `--adf-theme-*` and `--theme-*` CSS custom properties were removed** and replaced with `--mat-sys-*` (e.g.
  `--theme-primary-color` → `--mat-sys-primary`, `--theme-warn-color` → `--mat-sys-error`,
  `--adf-theme-foreground-text-color` → `--mat-sys-on-surface`, `--theme-caption-font-size` → `--mat-sys-body-small-size`).
  Any consumer CSS/theme overriding the old variables silently stops working — re-point it at `--mat-sys-*`. A stylelint
  rule now forbids re-introducing `--adf-*`/`--theme-*` properties.
- **The `globals()` SCSS mixin and `_globals.scss` were removed** (the styles entry point now forwards only
  `flex`, `mixins`, `mat-selectors`). If you did `@include globals()`, remove it.
- **Avatar/Header CSS-variable theming removed** — `AvatarComponent` no longer reads `--adf-avatar-size`/`--adf-avatar-cursor`,
  and `HeaderComponent` no longer reads `--adf-header-height`/`--adf-header-logo-height`/`--adf-header-logo-width` (they now
  bind the component `@Input()`s directly). Use the inputs, not the CSS variables.
- Read-only/disabled form fields now render through a shared `.adf-readonly` class and M3 component override mixins
  (`mat.form-field-overrides`, etc.). If you custom-styled disabled fields via `--mdc-*` fallbacks, re-check.

### Material `color` inputs removed

M3 buttons/icons/toolbars no longer support the M2 `color="primary|accent|warn"` palette, so the corresponding
`@Input() color: ThemePalette` was **removed** from `HeaderComponent`, `ToolbarComponent` and `IconComponent`, and
`FormBaseComponent` dropped its static `COMPLETE_BUTTON_COLOR` and `getColorForOutcome()`. Remove any `[color]`
bindings on these components and re-colour via `--mat-sys-*` classes if needed.

### PDF viewer moved to a lazy entry point

To avoid loading `pdfjs-dist` unless a PDF is actually viewed, the PDF viewer moved to a new **secondary entry point
`@alfresco/adf-core/viewer/pdf`**:

- `PdfViewerComponent`, `PdfPasswordDialogComponent`, `PdfThumbListComponent`, `PdfThumbComponent`,
  `RenderingQueueServices`, and the `PDFJS_MODULE` / `PDFJS_VIEWER_MODULE` tokens were **removed from the
  `@alfresco/adf-core` barrel** and now export from `@alfresco/adf-core/viewer/pdf`.
- **You must call `providePdfViewer()`** (from `@alfresco/adf-core/viewer/pdf`) in your app providers, or PDFs won't
  render (the viewer logs a configuration error). Rendering is wired through the new `PDF_VIEWER_COMPONENT` token /
  `PdfViewerRef` interface (still in the main barrel).
- `pdfjs-dist` is now an **optional peer dependency**, and the **pdf worker asset is no longer auto-copied** — configure
  the worker asset yourself.
- An **`ng update` migration `migrate-pdf-viewer-imports` (v9.0.0)** rewrites the moved imports and injects
  `providePdfViewer()` automatically.

### OAuth / JWKS

- `angular-oauth2-oidc` was upgraded **17 → 19** (align your app), and `angular-oauth2-oidc-jwks` (and its transitive
  `jsrsasign`) were **removed**.
- JWT/JWKS signature validation now uses the native Web Crypto API via a new exported
  **`WebCryptoJwksValidationHandler`** (`@alfresco/adf-core`). Consumers referencing the old `JwksValidationHandler`
  must switch to it.

### Card view select item

`CardViewSelectItemComponent` gained multi-value support, with two API changes:

- **The public `value` field was removed** — the component now binds directly to `property.value`. Code reading
  `component.value` must use `property.value`.
- `CardViewSelectItemProperties<T>.value` type widened from `string | number` to `T | T[]`.

The `multivalued` flag now lives on the shared base (`CardViewBaseItemModel.multivalued` / `CardViewItemProperties.multivalued`).

### Form widget base class

`TextWidgetComponent` and `MultilineTextWidgetComponent` now extend a new `FormattableTextWidgetComponent` base
(instead of `WidgetComponent`), and their templates moved off two-way `[(ngModel)]="field.value"` to
`[ngModel]="displayValue"` + `(onValueChange)`. Custom widgets subclassing these must call `super.ngOnInit()`, and
custom templates relying on the old two-way binding should be re-checked. Default behaviour is preserved.

## New components and features

- **Typed-value formatting in display widgets** (opt-in) — a new `FormFieldValueFormatterService`
  (`register`/`format`/`hasFormatter`, with built-in formatters for people/group/dropdown/radio) and the
  `ADF_TYPED_VALUE_FORMATTING_ENABLED` injection token. When enabled, read-only display widgets render friendly
  labels for typed values instead of raw JSON. **Off by default** (no runtime change unless you provide the token).
- **Form tab navigation buttons** — a new `ADF_FORM_TAB_NAV_ENABLED` token (boolean or `Observable<boolean>`) plus the
  form-definition flag `showBottomTabNavButtons` render Previous/Next tab buttons. `FormRendererComponent` /
  `FormCloudComponent` gained `navigateToNextTab()` / `navigateToPreviousTab()` and `canNavigate*` getters; new
  `FORM.PREVIOUS_TAB` / `NEXT_TAB` i18n keys.
- **Card view** — manual input for date **and** datetime fields (`allowManualInput`; `CardViewDateItemModel.format`
  is now a getter/setter with a `formatChanges$` stream); `previousValue` is now sent through the update pipeline
  (`CardViewUpdateService.update(property, value, options?)`, new `CardViewUpdateOptions` / `UpdateNotification.previousValue`);
  multivalued select items.
- **Form data refresh** — when `[data]` is rebound, form runtime state is preserved and rules/visibility re-run; new
  `FormFieldModel.restoreRuntimeValue()`/`restoreRuntimeFlags()` and a `'dataRefreshed'` form-rules event type;
  `FormCloudComponent.visibleOutcomes`.
- **Task cloud** — `TaskCloudService.nextTask(appName, strategy?)`, `wasTaskCompletedByCurrentUser(...)`,
  `getTaskById(..., service: 'query' | 'rb')`; `TaskListCloudService.fetchTaskList_UsingRuntimeBundleService(...)` (also
  added as a required member of `TaskListCloudServiceInterface` — breaking for external implementors of that interface);
  `TaskHeaderCloudComponent.@Input() processInstanceId` (now an input, click-to-copy); `ProcessInstanceCloud.type?`;
  new public `updateSearchControlState()` on `PeopleCloudComponent` / `GroupCloudComponent`.
- **Icons** — a dedicated `fileLink` icon for `app:filelink` nodes (new `NodeAction.LINK`), the sidenav gains M3
  surface colours, and the notification badge size is configurable via `NotificationHistoryComponent.@Input() badgeSize`
  / `app.config.json` `notification.badgeSize`.

## Behavioural changes

| Area | Change |
| ---- | ------ |
| Forms — start button | The Start-process outcome button is now hidden on user-task forms (even read-only) and stripped when a `taskId` is present. |
| Forms — dates | Manual date/datetime typing is allowed; an unparseable value shows a shortened "Invalid date format." error. |
| Forms — read-only | Read-only/disabled fields (including people/group widgets) restyle consistently via `.adf-readonly`; group search control re-syncs its read-only state on every change. |
| Card view | Clearing an int/long text item returns empty string (not `0`); select items no longer crash on a numeric initial value. |
| Viewer | The file-type icon reflects the viewed version's content type when a rendition exists. |
| Search | Facet labels wrapped in quotes by the backend are now unquoted/matched correctly. |
| Layout | Collapsing the left sidenav now closes it correctly, fixing keyboard focus order. |
| People / group widgets | The search input is now disabled while preselect validation is loading (previously only when `readOnly`). |
| Auth config | `AppConfigService.oauth2` no longer throws when the `oauth2` config is explicitly `null` (null-coalesces to `{}`). |

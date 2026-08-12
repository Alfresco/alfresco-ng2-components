---
Title: Upgrading from ADF v6.5.2 to v6.6.0
---

# Upgrading from ADF v6.5.2 to v6.6.0

This guide provides instructions on how to upgrade your v6.5.2 ADF projects to v6.6.0.

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup.

Do not skip this task if you want your application to be updated to the most recent version of ADF.
Upgrades of multiple versions of ADF cannot be done in one step only, but should follow the chain of sequential updates.

After the upgrade, check the other sections below to see if there are any changes affecting your project.

## Contents

- [Library updates](#library-updates)
- [Breaking changes](#breaking-changes)
  - [Search date-range widget replaced](#search-date-range-widget-replaced)
  - [Content metadata property panels](#content-metadata-property-panels)
  - [Authentication and SSO renames](#authentication-and-sso-renames)
  - [JS-API integrated into the monorepo](#js-api-integrated-into-the-monorepo)
  - [Viewer close button](#viewer-close-button)
  - [Notification history reverted](#notification-history-reverted)
  - [Extension configuration](#extension-configuration)
  - [Constructor signature changes](#constructor-signature-changes)
  - [Theme reference variables](#theme-reference-variables)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)
- [Theme changes](#theme-changes)
- [Notable internal changes](#notable-internal-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "6.6.0",
        "@alfresco/adf-content-services": "6.6.0",
        "@alfresco/adf-process-services": "6.6.0",
        "@alfresco/adf-process-services-cloud": "6.6.0",
        "@alfresco/adf-insights": "6.6.0",
        "@alfresco/adf-extensions": "6.6.0",
        "@alfresco/js-api": ">=7.5.0"
    }
}
```

Clean your old distribution and dependencies by deleting `node_modules` and `package-lock.json`, then reinstall:

```sh
npm install
```

## Breaking changes

### Search date-range widget replaced

The simple from-to `date-range` search widget was replaced by the tabbed advanced date-range widget:

- The old `SearchDateRangeComponent` (a `SearchWidget` with `from`/`to` controls, selector `adf-search-date-range`) was **removed**.
- The advanced components were **renamed**: `SearchDateRangeAdvancedComponent` → `SearchDateRangeComponent`
  and `SearchDateRangeAdvancedTabbedComponent` → `SearchDateRangeTabbedComponent`. Update TypeScript imports
  accordingly. Note that `SearchDateRangeComponent` now refers to a **different class** than before.
- The `date-range-advanced` widget selector was **removed**; the `date-range` selector now resolves to
  `SearchDateRangeTabbedComponent`.

**What to change in your `search.config` / `app.config.json`:**

- Replace `"selector": "date-range-advanced"` with `"selector": "date-range"`.
- Existing `"selector": "date-range"` filters now render the tabbed widget. Migrate their settings — `field`
  now supports a comma-separated list (one tab per field), and add `displayedLabelsByField`:

  ```json
  "component": {
      "selector": "date-range",
      "settings": {
          "field": "cm:created",
          "dateFormat": "dd-MMM-yy",
          "maxDate": "today",
          "displayedLabelsByField": { "cm:created": "Created Date" }
      }
  }
  ```

  `dateFormat` now defaults to `dd-MMM-yy` when omitted. Date-range i18n keys were reorganised — re-check any overrides.

Every filter widget in the filter panel now gets default **Clear** / **Apply** buttons via a new
`SearchFilterCardComponent` wrapper (`adf-search-filter-card`), which adds an extra element between the
expansion panel and `adf-search-widget-container` — review custom CSS/E2E selectors.

### Content metadata property panels

`[ContentMetadataComponent](../../lib/content-services/src/lib/content-metadata/components/content-metadata/content-metadata.component.ts)`
was reworked so each panel (General Info, Tags, Categories, and each aspect group) is independently
expandable and editable. Consequently:

- **`ContentMetadataComponent.editable` `@Input` was removed and replaced by `@Input() readOnly` (default `false`)** —
  note the inverted meaning. Migrate `[editable]="x"` to `[readOnly]="!x"`.
- **`ContentMetadataCardComponent`** lost its `@Output() editableChange` and the `toggleEdit()` / `toggleExpanded()` methods.
- `BaseCardView` (core) gained `@Input() editable = false`; `InfoDrawerComponent` gained `@Input() icon: string | null`.
- The `CardViewGroup` and `ContentMetadataCustomPanel` interfaces gained optional `expanded?` (and `editable?` on the group).

### Authentication and SSO renames

Several public authentication members were renamed as part of adding PKCE (authorization-code) flow support:

| Before                                         | After                                                      |
| ---------------------------------------------- | ---------------------------------------------------------- |
| `LoginComponent.implicitFlow` (property)       | `LoginComponent.ssoLogin`                                  |
| `LoginComponent.redirectToImplicitLogin()`     | `LoginComponent.redirectToSSOLogin()`                      |
| `OidcAuthenticationService.ssoImplicitLogin()` | `OidcAuthenticationService.ssoLogin(redirectUrl?: string)` |

- New `app.config.json` OAuth2 key **`oauth2.codeFlow`** enables the PKCE authorization-code flow (set
  `implicitFlow: false` + `codeFlow: true`). A new Docker env var `APP_CONFIG_OAUTH2_CODE_FLOW` maps to it.
- The app-config JSON schema file was renamed from `schema.json` to **`app.config.schema.json`**. The OAuth2
  config now forwards the whole `oauth2` object to `angular-oauth2-oidc`, so additional keys (`oidc`, `issuer`,
  `postLogoutRedirectUri`, `silentRefreshRedirectUri`, `silentRefreshTimeout`, `dummyClientSecret`,
  `skipIssuerCheck`, `strictDiscoveryDocumentValidation`) are now recognised and passed through.

### JS-API integrated into the monorepo

`@alfresco/js-api` source now lives inside the ADF monorepo (`lib/js-api`) and is published at `7.5.0`. The
**package name and import specifier are unchanged** (`import { … } from '@alfresco/js-api'`). However, a number
of Activiti / AGS / Search / Content **model classes were converted to interfaces** to reduce bundle size —
code that used `new SomeModel()` or `instanceof SomeModel` on those models must switch to plain-object usage.

### Viewer close button

`ViewerComponent` and `AlfrescoViewerComponent` gained a configurable close-button position:

- New exported enum `CloseButtonPosition { Right = 'right', Left = 'left' }`.
- New `@Input() closeButtonPosition: CloseButtonPosition` (default `CloseButtonPosition.Left`) and `@Input() hideInfoButton: boolean` (default `false`).
- **The close button's `data-automation-id` changed** from `adf-toolbar-back` to `adf-toolbar-left-back`
  (with a new `adf-toolbar-right-back`). Update any tests/selectors targeting `adf-toolbar-back`.

### Notification history reverted

The read/unread notification model introduced in the 6.5.x line was **reverted** in 6.6.0. Relative to 6.5.2:

- The exported `NOTIFICATION_STORAGE` constant was removed; the storage key is again the static field
  `NotificationHistoryComponent.NOTIFICATION_STORAGE`.
- `NotificationModel.read` and `NotificationHistoryComponent.unreadNotifications` were removed.
- "Mark as read" again clears the notification list (rather than flagging items as read).

If you adopted the 6.5.x read/unread API, revert those usages.

### Extension configuration

`ExtensionService` can now also receive inline `ExtensionConfig` values, not just JSON file names. This
changed some signatures:

- New provider factory `provideExtensionConfigValues(values: ExtensionConfig[])` and injection token `EXTENSION_JSON_VALUES`.
- `ExtensionService` constructor gained the injected `EXTENSION_JSON_VALUES` argument (the token has a default,
  so DI apps are unaffected; manual instantiation/tests must pass the extra array).
- `ExtensionLoaderService.load(...)` gained an optional 4th `extensionValues?: ExtensionConfig[]` parameter.

### Constructor signature changes

These services gained new constructor dependencies (only relevant if you instantiate them manually or in tests):

- `ContentService` (+ optional `ThumbnailService`)
- `TagService`, `CategoryService` (+ `AppConfigService`)
- `DialogAspectListService` (+ `TagService`, `CategoryService`)
- `PropertyGroupTranslatorService` (`NotificationService` replaced by `LogService`)

### Theme reference variables

Alongside the new design tokens (see [Theme changes](#theme-changes)), a theme refactor repointed many
existing `--adf-*` custom properties from static `$adf-ref-*` reference variables to Material palette lookups,
and **deleted several `$adf-ref-*` variables** from `_reference-variables.scss`. Consumers who overrode those
internal SCSS reference variables directly are affected — override the public `--adf-*` CSS custom properties instead.

## New components and features

- **Tabbed date-range search** — the `date-range` widget is now a tabbed component supporting ANY / IN LAST /
  BETWEEN ranges, per-field tabs, per-field labels (`displayedLabelsByField`), and default Clear/Apply actions
  (`SearchFilterCardComponent`). A new `TabLabelsPipe` (`tabLabels`) is exported.
- **Content-metadata property panels** — a new standalone `ContentMetadataHeaderComponent`
  (`adf-content-metadata-header`) and per-panel expand/edit state; the info drawer can show a node icon; new
  `ContentService` helpers (`getNodeIcon`, `isSmartFolder`, `isRuleFolder`, `isLinkFolder`).
- **Disable tags / categories** — new `app.config.json` keys `plugins.tags` and `plugins.categories` (default
  `true`); `TagService.areTagsEnabled()` / `CategoryService.areCategoriesEnabled()`; a new
  `AspectListComponent` `@Input() excludedAspects: string[]`; and an optional `SearchCategory.rules.visible` for
  conditional search-category visibility.
- **Document list column persistence** — `[DocumentListComponent](../content-services/components/document-list.component.md)`
  gained setter inputs `setColumnsVisibility`, `setColumnsWidths`, `setColumnsOrder` and outputs
  `columnsVisibilityChanged`, `columnsWidthChanged`, `columnsOrderChanged`, so a host app can persist and
  restore column configuration.
- **Drag-drop column reordering** — the `DocumentListPresetRef` config gained `draggable?: boolean`; disabled
  columns are skipped as drop targets.
- **Resizable task/process lists** — `TaskListComponent` and `ProcessInstanceListComponent` gained
  `@Input() isResizingEnabled` (default `false`) and `@Input() blurOnResize` (default `true`).
- **Viewer close-button position** — see [Viewer close button](#viewer-close-button).
- **Inline extension config** — `provideExtensionConfigValues([...])` (see [Extension configuration](#extension-configuration)).
- **Icon column cell** — the `icon` data-table column type is now rendered by a dedicated `IconCellComponent`
  with value validation and tooltip support.
- **Tag validation** — creating a tag now blocks illegal characters (`' : " \ | < > / ?`) with an inline error.
- **Design tokens** — new themeable `--adf-*` properties for `PeopleCloudComponent`, `GroupCloudComponent`,
  `TaskAssignmentFilterCloudComponent`, and `ProcessHeaderCloudComponent` (see [Theme changes](#theme-changes)).

## Behavioural changes

| Area          | Change                                                                                                                                 |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Auth (basic)  | On app load, an invalid/stale ECM ticket now triggers an automatic logout (`onLogout`) instead of a false "logged-in" state.           |
| Auth (js-api) | `invalidateSession()` on a 401 only fires when js-api owns authentication (avoids spurious invalidation under ADF-managed OAuth).      |
| Auth (upload) | The `multipart/form-data` header is preserved when the body is a real `FormData` (fixes descriptor import in HXP).                     |
| Forms         | Radio widgets update the form value immediately on selection.                                                                          |
| Viewer        | The PDF viewer works over plain HTTP (no `crypto.randomUUID`), and `AlfrescoViewerComponent` shows the original file's mime type icon. |
| Data table    | Column headers show a tooltip with the (translated) column title.                                                                      |
| Search        | The search-properties facet clear button now actually clears the underlying query.                                                     |

## Theme changes

New themeable CSS custom properties were added for several cloud components (defaults derive from the Material
theme palette):

- **People cloud** — `--adf-people-cloud-input-label-default-color`, `--adf-people-cloud-input-label-focus-color`, `--adf-people-cloud-autosuggest-result-active-color`, `--adf-people-cloud-autosuggest-result-disabled-color`, `--adf-people-cloud-input-caption-error-color`.
- **Group cloud** — the `--adf-group-cloud-*` equivalents of the above.
- **Task assignment filter** — `--adf-task-assignment-filter-option-default-color`, `--adf-task-assignment-filter-option-selected-color`, `--adf-task-assignment-filter-label-default-color`, `--adf-task-assignment-filter-label-focus-color`.
- **Process header** — `--adf-process-header-cloud-card-background`.

A new `--theme-warn-color-a700` theme color was added (used for stronger warning text/borders, e.g. in the
share dialog). See also [Theme reference variables](#theme-reference-variables) for the removed `$adf-ref-*` internals.

## Notable internal changes

- `@alfresco/js-api` was moved into the monorepo (`lib/js-api`) and published at `7.5.0`; the public import
  path is unchanged.
- Numerous `!important` declarations were removed from component styles (toolbar, pagination, permission list,
  card-view date item, version list, task form, add-permission panel, etc.) — low impact, but review custom
  overrides that relied on the old specificity.

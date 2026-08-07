---

## Title: Upgrading from ADF v6.1 to v6.2

# Upgrading from ADF v6.1 to v6.2

This guide provides instructions on how to upgrade your v6.1.0 ADF projects to v6.2.0.

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup.

Do not skip this task if you want your application to be updated to the most recent version of ADF.
Upgrades of multiple versions of ADF cannot be done in one step only, but should follow the chain of sequential updates.

After the upgrade, check the other sections below to see if there are any changes affecting your project.

## Contents

- [Library updates](#library-updates)
- [Breaking changes](#breaking-changes)
  - [Dependency injection refactor (](#dependency-injection-refactor-inject)`inject()`[)](#dependency-injection-refactor-inject)
  - [SharedLinksApiService.createSharedLinks](#sharedlinksapiservicecreatesharedlinks)
  - [Share dialog: expiry is now date-only](#share-dialog-expiry-is-now-date-only)
  - [Route-aware filter selection](#route-aware-filter-selection)
- [Removed items](#removed-items)
- [Renamed items](#renamed-items)
  - [CSS class renames](#css-class-renames)
  - [Encapsulation changes](#encapsulation-changes)
  - [SCSS reference variables](#scss-reference-variables)
- [Third-party libraries](#third-party-libraries)
- [New components and features](#new-components-and-features)
  - [Logical search filter](#logical-search-filter)
  - [Advanced search: autocomplete chips](#advanced-search-autocomplete-chips)
  - [Header customization](#header-customization)
  - [Icon font set](#icon-font-set)
  - [OAuth2 configuration handling](#oauth2-configuration-handling)
- [Behavioural changes](#behavioural-changes)
- [Theme changes](#theme-changes)



## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "6.2.0",
        "@alfresco/adf-content-services": "6.2.0",
        "@alfresco/adf-process-services": "6.2.0",
        "@alfresco/adf-process-services-cloud": "6.2.0",
        "@alfresco/adf-insights": "6.2.0",
        "@alfresco/adf-extensions": "6.2.0",
        "@alfresco/js-api": ">=6.2.0"
    }
}
```

Clean your old distribution and dependencies by deleting `node_modules` and `package-lock.json`.

Reinstall your dependencies

```sh
npm install
```

**Note:** the ADF libraries now depend on `@alfresco/js-api` with a `>=6.2.0` range (previously a `^6.1.0` caret range). Make sure your application resolves a JS-API build of `6.2.0` or later.

## Breaking changes

### Dependency injection refactor (`inject()`)

A large number of exported services, components and abstract base classes were refactored
to use Angular's `inject()` function instead of constructor-parameter injection.
As a result **their public constructor signatures changed** — most now take no arguments
(or a reduced set).

This affects you only if you **subclass** one of these classes and call `super(...)`,
or if you **instantiate them directly** (for example, `new AuthenticationService(...)` in a unit test).


| Library                                | Affected classes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@alfresco/adf-core`                   | `[BaseAuthenticationService](../../lib/core/src/lib/services/base-authentication.service.ts)`, `[AuthenticationService](../core/services/authentication.service.md)`, `[OIDCAuthenticationService](../../lib/core/src/lib/auth/oidc/oidc-authentication.service.ts)`, `[AuthGuardBase](../../lib/core/src/lib/auth/guard/auth-guard-base.ts)`, `AuthGuard`, `AuthGuardBpm`, `AuthGuardEcm`, `BaseCardView`, `[CardViewTextItemComponent](../../lib/core/src/lib/card-view/components/card-view-textitem/card-view-textitem.component.ts)`, `CardViewDateItemComponent`, `CardViewSelectItemComponent`, `CardViewArrayItemComponent`, `CardViewBoolItemComponent`, `CardViewKeyValuePairsItemComponent`, `CardViewMapItemComponent` |
| `@alfresco/adf-content-services`       | `UploadBase`, `[UploadButtonComponent](../content-services/components/upload-button.component.md)`, `[UploadDragAreaComponent](../content-services/components/upload-drag-area.component.md)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `@alfresco/adf-process-services`       | `[FormComponent](../process-services/components/form.component.md)`, `[StartFormComponent](../core/components/start-form.component.md)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `@alfresco/adf-process-services-cloud` | `BaseCloudService`, `FormCloudService`, `FormDefinitionSelectorCloudService`, `ProcessListCloudService`, `ProcessTaskListCloudService`, `ProcessCloudService`, `StartProcessCloudService`, `NotificationCloudService`, `UserPreferenceCloudService`, `StartTaskCloudService`, `TaskCloudService`, `TaskFilterCloudService`, `ServiceTaskListCloudService`, `TaskListCloudService`                                                                                                                                                                                                                                                                                                                                                  |


If you extend one of these classes, drop the old positional arguments from your `super(...)` call.

Before:

```ts
export class MyUpload extends UploadButtonComponent {
    constructor(uploadService, contentService, nodesApiService, translationService, logService, ngZone) {
        super(uploadService, contentService, nodesApiService, translationService, logService, ngZone);
    }
}
```

After:

```ts
export class MyUpload extends UploadButtonComponent {
    constructor() {
        super();
    }
}
```

If you were instantiating these classes manually in tests, note that `inject()` only works
inside an Angular injection context. Use `TestBed` and retrieve the instance from the injector
instead of calling `new`.

**Note:** `BaseCloudService` now injects `[LogService](../core/services/log.service.md)` itself,
so `this.logService` is available to every cloud-service subclass. Subclasses that previously
declared their own `logService` no longer need to.

### SharedLinksApiService.createSharedLinks

A new middle parameter was added to `[createSharedLinks](../core/services/shared-links-api.service.md)`
so that expiry settings can be applied to the shared link itself.

Before:

```ts
createSharedLinks(nodeId: string, options: any = {}): Observable<SharedLinkEntry>
```

After:

```ts
createSharedLinks(nodeId: string, sharedLinkWithExpirySettings?: SharedLinkBodyCreate, options: any = {}): Observable<SharedLinkEntry>
```

If you call this method with positional arguments, update the call:

```ts
// Before
this.sharedLinksApiService.createSharedLinks(nodeId, options);

// After
this.sharedLinksApiService.createSharedLinks(nodeId, undefined, options);
```



### Share dialog: expiry is now date-only

The share-link expiry control in `[ShareDialogComponent](../../lib/content-services/src/lib/content-node-share/content-node-share.dialog.ts)`
changed from a date-**time** picker to a **date-only** picker, and the date library moved from
`moment` to `date-fns`.

- The `sharedLinkDateTimePickerType` app-config key is **no longer read**. Setting it has no effect; the picker is date-only.
- Methods that previously accepted/returned `moment.Moment` now use the native `Date` type (for example `onTimeChanged(date: Date)`). Update any override accordingly.
- The template handler `onDatetimepickerClosed` was renamed to `onDatePickerClosed`, and the `#dateTimePickerInput` template reference to `#datePickerInput` — this affects you only if you override the dialog template.



### Route-aware filter selection

`[ProcessFiltersComponent](../process-services/components/process-filters.component.md)` and
`[TaskFiltersComponent](../process-services/components/task-filters.component.md)` (in `@alfresco/adf-process-services`)
now inject `Router` (plus `Location` / `ActivatedRoute` respectively) to highlight the active
filter based on the current route. If you instantiate these components in a test, provide routing
(for example, import `RouterTestingModule`).

## Removed items


| Item                                                   | Package              | Notes                                                                                                                                                                             |
| ------------------------------------------------------ | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NotificationIconPipe` (`notificationIcon`)            | `@alfresco/adf-core` | Internal, non-exported pipe. Icon resolution now happens in the notification factory. Only affects unsupported use of the deep `notifications/pipes/notification-icon.pipe` path. |
| `mockAuthConfigImplicitFlow`, `mockAuthConfigCodeFlow` | `@alfresco/adf-core` | Test mocks removed. Inline your own equivalents if your tests imported them.                                                                                                      |
| `sharedLinkDateTimePickerType` (app-config key)        | `app.config.json`    | No longer read — the share-link expiry picker is date-only.                                                                                                                       |




## Renamed items



### CSS class renames

If you target these selectors from your own stylesheets, update them:


| Component                                                                                          | Before                                 | After                                                               |
| -------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| [About server settings](../core/components/about.component.md)                                     | `.adf-github-link-container`           | `.adf-about-server-settings` (+ `.adf-about-server-settings__card`) |
| [Edit task filter](../process-services-cloud/components/edit-task-filter-cloud.component.md)       | `.adf-edit-task-filter-description`    | `.adf-edit-task-filter-header__description`                         |
| [Edit process filter](../process-services-cloud/components/edit-process-filter-cloud.component.md) | `.adf-edit-process-filter-description` | `.adf-edit-process-filter-header__description`                      |




### Encapsulation changes

`AboutServerSettingsComponent` and `PackageListComponent` **no longer use** `ViewEncapsulation.None`.
Global CSS overrides that previously "bled into" these components will no longer apply — theme them
through the new [CSS custom properties](#theme-changes) instead.

### SCSS reference variables

If you import ADF's `[_reference-variables.scss](../../lib/core/src/lib/styles/_reference-variables.scss)`
directly, note that several `$adf-ref-*` primitives were consolidated/renamed. The public `--adf-*`
CSS custom property names are unchanged — prefer overriding those instead.


| Before                                                           | After                           |
| ---------------------------------------------------------------- | ------------------------------- |
| `$adf-ref-edit-task-and-service-filter-header-title-color`       | `$adf-ref-title-color`          |
| `$adf-ref-edit-task-and-service-filter-header-description-color` | `$adf-ref-description-color`    |
| `$adf-ref-edit-task-and-service-filter-header-height`            | `$adf-ref-height-48`            |
| `$adf-ref-card-border-radius`                                    | `$adf-ref-card-border-radius-0` |




## Third-party libraries


| Name               | Version   | Notes                                                                                                                                                                                                                                                           |
| ------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `material-icons`   | `^1.13.8` | The bundled Material Icons font and its `material-icons.css` were removed from the build in favour of the published `[material-icons](https://www.npmjs.com/package/material-icons)` package. If your app relied on ADF bundling the font, provide it yourself. |
| `date-fns`         | `^2.30.0` | New dependency (replaces `moment` in the share dialog).                                                                                                                                                                                                         |




## New components and features


| Name                                                                                                                     | Package                          | Description                                           |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------------- | ----------------------------------------------------- |
| `[SearchLogicalFilterComponent](../content-services/components/search-logical-filter.component.md)`                      | `@alfresco/adf-content-services` | `logical-filter` search widget (AND / OR / AND-NOT).  |
| `[SearchChipInputComponent](../content-services/components/search-chip-input.component.md)`                              | `@alfresco/adf-content-services` | Reusable chip text-entry field.                       |
| `[SearchFilterAutocompleteChipsComponent](../content-services/components/search-filter-autocomplete-chips.component.md)` | `@alfresco/adf-content-services` | `autocomplete-chips` search widget (Tags / Location). |
| `[SearchChipAutocompleteInputComponent](../content-services/components/search-chip-autocomplete-input.component.md)`     | `@alfresco/adf-content-services` | Chip input with `mat-autocomplete`.                   |
| `[IsIncludedPipe](../content-services/pipes/is-included.pipe.md)` (`adfIsIncluded`)                                      | `@alfresco/adf-content-services` | Returns whether a value is contained in an array.     |




### Logical search filter

A new search widget, `logical-filter`, lets users build AND / OR / AND-NOT queries from three
phrase inputs. Enable it by referencing the `logical-filter` widget type in your search configuration:

```json
{
    "search": {
        "categories": [
            {
                "id": "logic",
                "name": "Query",
                "enabled": true,
                "component": {
                    "selector": "logical-filter",
                    "settings": { "field": "cm:name,cm:title" }
                }
            }
        ]
    }
}
```



### Advanced search: autocomplete chips

A new search widget, `autocomplete-chips`, provides chip-based multi-select with autocomplete for
filters such as Tags and Location. For `field: 'TAG'` it loads options through the tag service;
otherwise it uses the `options` from the widget settings. `[SearchWidgetSettings](../../lib/content-services/src/lib/search/models/search-widget-settings.interface.ts)`
gains a new optional property `allowOnlyPredefinedValues?: boolean`.

```json
{
    "id": "tags",
    "name": "Tags",
    "enabled": true,
    "component": {
        "selector": "autocomplete-chips",
        "settings": { "field": "TAG", "allowOnlyPredefinedValues": true }
    }
}
```



### Header customization

`[HeaderLayoutComponent](../core/components/header.component.md)` gained two new inputs:


| Input        | Type      | Default  | Description                              |
| ------------ | --------- | -------- | ---------------------------------------- |
| `showLogo`   | `boolean` | `true`   | Whether the logo is displayed.           |
| `toggleIcon` | `string`  | `'menu'` | Icon used for the sidenav toggle button. |




### Icon font set

`[IconComponent](../core/components/icon.component.md)` gained a new `fontSet` input, letting you
render an icon from a custom Material icon font set:

```html
<adf-icon value="my_icon" fontSet="my-font-set"></adf-icon>
```



### OAuth2 configuration handling

`[AppConfigService](../core/services/app-config.service.md)` now exposes a normalized `oauth2` getter.

Before:

```ts
const oauth = this.appConfigService.get(AppConfigValues.OAUTHCONFIG, {});
```

After:

```ts
const oauth = this.appConfigService.oauth2; // returns an OauthConfigModel, defaulting to {}
```

- The `implicitFlow`, `silentLogin` and `codeFlow` flags now accept the string values `'true'` / `'false'` in `app.config.json` in addition to real booleans, and are coerced to booleans by the getter. The `oauth2.silentLogin` schema type was widened to `["boolean", "string"]`.
- `[OauthConfigModel](../../lib/core/src/lib/auth/models/oauth-config.model.ts)` gains an optional `redirectSilentIframeUri?: string` field.



## Behavioural changes


| Area                                                                                                                  | Change                                                                                                                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Search facets                                                                                                         | Facet chips with no results are rendered disabled and show a `remove` icon instead of the dropdown arrow.                                                                                                                    |
| Search facet/filter chips                                                                                             | The dropdown arrow flips between `keyboard_arrow_down` / `keyboard_arrow_up` with the menu state, the toggled-chip border uses the primary color, and the filter "cancel" action was relabeled from **Remove** to **Clear**. |
| [People (cloud)](../process-services-cloud/components/people-cloud.component.md)                                      | No longer triggers an identity search for an empty value; at least one character is required.                                                                                                                                |
| Process / task filters                                                                                                | A filter is highlighted as active only when the current route matches the filter context and it is the current filter.                                                                                                       |
| [Card view text item](../../lib/core/src/lib/card-view/components/card-view-textitem/card-view-textitem.component.ts) | On an invalid edit, `CardViewUpdateService.update` is now also emitted (with the edited value) after clearing previous errors.                                                                                               |
| [App config](../core/services/app-config.service.md)                                                                  | When `app.config.json` fails schema validation, `AppConfigService` now logs `console.error('app.config.json contains validation errors')` and continues with the existing config.                                            |
| Shared link expiry (security)                                                                                         | Setting an expiry now recreates the shared link with an `expiresAt` value so the backend enforces expiry on the link itself; turning the expiry off recreates a non-expiring link.                                           |
| Accessibility                                                                                                         | The filter-menu close control is now a real `button`, Shift+Tab is trapped inside filter menu cards, and the autocomplete input is associated with its listbox via `aria-controls`.                                          |




## Theme changes

Several components now expose their styles through `--adf-*` CSS custom properties, so you can theme
them without overriding internal selectors. Defaults preserve the previous appearance. Override a
property in your global stylesheet, for example:

```scss
:root {
    --adf-card-view-background: #fafafa;
    --adf-card-view-border-radius: 8px;
}
```

The notable additions in this release:


| Component                                                                                              | CSS custom properties                                                                                                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Card view](../core/components/card-view.component.md)                                                 | `--adf-card-view-background` (default `white`), `--adf-card-view-border` (`unset`), `--adf-card-view-border-color` (`unset`), `--adf-card-view-border-radius` (`0`)                                                                                                                                        |
| [About panel](../core/components/about.component.md)                                                   | `--adf-about-panel-header-height` (`48px`), `--adf-about-panel-header-title-color`                                                                                                                                                                                                                         |
| About server settings                                                                                  | `--adf-about-server-settings-background`, `--adf-about-server-settings-color`, `--adf-about-server-settings-border-radius`, `--adf-about-server-settings-padding`                                                                                                                                          |
| Package list table                                                                                     | `--adf-package-list-table-background`, plus `--adf-package-list-table-header-*` and `--adf-package-list-table-row-*` (borders, min-height, cell colors)                                                                                                                                                    |
| [Edit task / service filter](../process-services-cloud/components/edit-task-filter-cloud.component.md) | `--adf-edit-task-and-service-filter-header-title-color`, `--adf-edit-task-and-service-filter-header-description-color`, `--adf-edit-task-and-service-filter-header-height`, `--adf-edit-task-and-service-filter-content-text-label-color`, `--adf-edit-task-and-service-filter-content-select-label-color` |
| [Edit process filter](../process-services-cloud/components/edit-process-filter-cloud.component.md)     | `--adf-edit-process-filter-header-height`, `--adf-edit-process-filter-header-title-color`, `--adf-edit-process-filter-header-description-color`, `--adf-edit-process-filter-content-text-label-color`, `--adf-edit-process-filter-content-select-label-color`                                              |

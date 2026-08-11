---
Title: Upgrading from ADF v8.0 to v8.1.1
---

# Upgrading from ADF v8.0 to v8.1.1

This guide provides instructions on how to upgrade your v8.0.0 ADF projects to v8.1.1 (covering the 8.1.0 and
8.1.1 releases).

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. The steps
below may involve code changes — commit or back up your work first.

## Contents

- [Library updates](#library-updates)
- [Breaking changes](#breaking-changes)
  - [Removed components, modules and exports](#removed-components-modules-and-exports)
  - [Viewer title API](#viewer-title-api)
  - [Node comments avatar service](#node-comments-avatar-service)
  - [Translation key namespacing](#translation-key-namespacing)
- [Deprecations](#deprecations)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "8.1.1",
        "@alfresco/adf-content-services": "8.1.1",
        "@alfresco/adf-process-services": "8.1.1",
        "@alfresco/adf-process-services-cloud": "8.1.1",
        "@alfresco/adf-insights": "8.1.1",
        "@alfresco/adf-extensions": "8.1.1",
        "@alfresco/js-api": ">=9.1.1"
    }
}
```

Angular, Material, TypeScript, zone.js and Nx are unchanged from 8.0.0 (Angular 19.2). Clean `node_modules` and
`package-lock.json`, then `npm install`.

## Breaking changes

### Removed components, modules and exports

The following public items were removed. Migrate away from them:

| Removed                                                                      | Kind                                                | Package                                | Migration                                                                                                                                |
| ---------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `RichTextEditorComponent`                                                    | Component (+ its module and all `@editorjs/*` deps) | `@alfresco/adf-process-services-cloud` | The rich-text **editor** moved to the HxP monorepo and no longer ships in ADF. (The read-only `DisplayRichTextWidgetComponent` remains.) |
| `AppConfigModule`                                                            | NgModule                                            | `@alfresco/adf-core`                   | Use `provideAppConfig()`.                                                                                                                |
| `AuthRoutingModule`, `loginFactory`                                          | Module / factory                                    | `@alfresco/adf-core`                   | Use `provideCoreAuth()`; routes are exposed as the `AUTH_ROUTES` constant.                                                               |
| `BaseAuthenticationService.isOauthConfiguration()`                           | Method                                              | `@alfresco/adf-core`                   | Removed (dead code).                                                                                                                     |
| `DebugAppConfigService`                                                      | Service                                             | `@alfresco/adf-core`                   | Removed.                                                                                                                                 |
| `DocumentActionModel`, `FolderActionModel`                                   | Classes                                             | `@alfresco/adf-content-services`       | Removed from `document-list` models.                                                                                                     |
| `EXTENSION_DIRECTIVES` (from `extensions.module`), `setupExtensions` factory | Const / factory                                     | `@alfresco/adf-extensions`             | Use `provideAppExtensions()`.                                                                                                            |
| `ScreenRenderingService` (old deep path `lib/services/`)                     | Service (relocated)                                 | `@alfresco/adf-process-services-cloud` | Moved under `screen/services`; still exported from the package root. Use `provideScreen()` to register custom screens.                   |

### Viewer title API

`ViewerComponent` gained an `@Input() title` (with a `displayTitle` field and a two-line title/filename toolbar
block), and its truncation helper was **renamed**:

- `getDisplayFileName()` was **removed** — use `getDisplayTruncatedValue(value: string)` instead.

### Node comments avatar service

`NodeCommentsService` now resolves comment avatars via the People API:

- `getUserImage(avatarId)` → **`getUserImage(userId: string)`** — the parameter is now a **user id** (it calls
  `PeopleApi.getAvatarImageUrl(userId)`), not a content/avatar node id. Update callers accordingly.
- The service constructor no longer injects `ContentService` (affects manual instantiation only).

### Translation key namespacing

The search-text input's translation keys were corrected to the `CORE.` namespace. If you provide **custom
translations** for these keys, move them under `CORE.SEARCH.*`:

| Before                        | After                              |
| ----------------------------- | ---------------------------------- |
| `SEARCH.BUTTON.TOOLTIP`       | `CORE.SEARCH.BUTTON.TOOLTIP`       |
| `SEARCH.BUTTON.ARIA-LABEL`    | `CORE.SEARCH.BUTTON.ARIA-LABEL`    |
| `SEARCH.INPUT.ARIA-LABEL`     | `CORE.SEARCH.INPUT.ARIA-LABEL`     |
| `SEARCH.FILTER.BUTTONS.CLOSE` | `CORE.SEARCH.FILTER.BUTTONS.CLOSE` |

## Deprecations

These still work but should be migrated to the new standalone provider APIs:

- `AuthModule` / `AuthModule.forRoot()` → **`provideCoreAuth(config?)`**.
- `CoreModule` → compose `provideI18N(...)`, `provideAppConfig()`, `provideCoreAuth(...)`. Note `CoreModule.forRoot()`
  no longer wires up the auth interceptor, the snackbar default options, or the decimal form-field render
  middleware — add them via the providers if you relied on them.
- `ExtensionsModule` / `ExtensionsModule.forChild()` → **`provideAppExtensions()`**.
- Auth methods `isEcmLoggedIn()` / `isBpmLoggedIn()` → `isLoggedIn()` (use `isECMProvider()` / `isBPMProvider()`
  for the auth type); `getEcmUsername()` / `getBpmUsername()` → the new unified `getUsername()`.
- `ProcessModule` / `ProcessModule.forRoot()` (`@alfresco/adf-process-services`) is now `@deprecated` → import the
  standalone components directly / use the provider API.
- `FormBaseComponent` static outcome constants (`@alfresco/adf-core`) are now `@deprecated`: `SAVE_OUTCOME_ID`,
  `COMPLETE_OUTCOME_ID`, `START_PROCESS_OUTCOME_ID` → `FormModel.SAVE_OUTCOME` / `COMPLETE_OUTCOME` /
  `START_PROCESS_OUTCOME`; `COMPLETE_OUTCOME_NAME` → `FormOutcomeModel.COMPLETE_ACTION`.

## New components and features

- **Standalone provider APIs** (the recommended way to bootstrap ADF in a standalone app):
  - `provideCoreAuth(config?)` (core) — replaces `AuthModule.forRoot()`; provides HTTP client, OAuth client,
    `AUTH_ROUTES`, auth services and interceptors.
  - `provideExtensions({ authGuards?, evaluators?, components? })` (extensions) — register extension entities;
    `provideAppExtensions()` — app extension bootstrap (replaces `ExtensionsModule`).
  - `provideLandingPage(component)` + `LANDING_PAGE_TOKEN` (core).
  - `provideScreen(key, component)` + `APP_CUSTOM_SCREEN_TOKEN` and `CustomScreen` (process-services-cloud) —
    declaratively register custom task screens (replaces subclassing `ScreenRenderingService`).
- **Form button customization** — `FormCloudComponent` / `TaskFormCloudComponent` / `UserTaskCloudComponent`
  gained `@Input() customSaveButtonText`, `customCompleteButtonText`, `customCancelButtonText`, `@Input() showSaveButton`
  and an `@Output() formLoaded`. Several `FormModel` / `FormOutcomeModel` static constants became `static readonly`.
- **Root-level form sections** — `FormModel` and the form renderer now support a `section` as a root field type
  (rendered via `<adf-form-section>` inside `.adf-container-widget`), with responsive column layout.
- **`QueryParams.excludedCategory?`** added (start-process cloud service).
- New CSS hook classes: `adf-form-renderer` (renderer root), `adf-error-messages-container-visible` /
  `-hidden` (error slots now reserve space), and `adf-viewer__title-*`.

## Behavioural changes

| Area                  | Change                                                                                                                                                                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Forms — dropdown      | A form-rule-driven value change now syncs the reactive dropdown control (previously not reflected).                                                                                                                                       |
| Forms — masked text   | `InputMaskDirective` now marks the control as `touched` on blur, so touched-gated validation/`ng-touched` styling fires as expected.                                                                                                      |
| Forms — start process | Malformed (non-JSON) backend error messages no longer crash `StartProcessCloudComponent`; the backend `response.body.message` is shown directly. The generic fallback i18n key changed from `...ERROR.START` to `...ERROR.START_PROCESS`. |
| Card view             | `card-view-textitem` now highlights red on validation error (sets/clears a `customError` state, `subscriptSizing="dynamic"`, always-float label); `card-view-dateitem` floats its label when the property has a default value.            |
| Search                | Checkboxes in the search check-list facet render to the left of the label (Material default position).                                                                                                                                    |
| Data table            | Removed a duplicated horizontal scrollbar (the datatable root no longer carries `adf-full-width`).                                                                                                                                        |
| Chips                 | `DynamicChipListComponent` chip visibility/"view more" overflow calculation fixed.                                                                                                                                                        |
| Comments              | Avatars in `adf-node-comments` now resolve via the People API avatar endpoint.                                                                                                                                                            |


---
Title: Upgrading from ADF v7.0 to v8.0
---

# Upgrading from ADF v7.0 to v8.0

This guide provides instructions on how to upgrade your v7.0.0 ADF projects to v8.0.0.

**v8.0.0 is a major release.** It moves ADF from Angular **17 to 19** (via internal 18 → 19 steps), upgrades
**`@ngx-translate/core` to v16** and **`@alfresco/js-api` to v9**, upgrades **pdf.js from 3.x to 5.x**, and
performs a large **theming clean-up** (the prebuilt themes and the ADF colour/variable SCSS partials are removed).
Budget time to migrate your Angular version, your theme, your i18n bootstrap, and your PDF viewer worker asset.

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. Because this is
a major version with many breaking changes, build, run and re-test your application after upgrading.

## Contents

- [Library updates](#library-updates)
- [Major platform changes](#major-platform-changes)
- [Breaking changes](#breaking-changes)
  - [Angular 19 and standalone](#angular-19-and-standalone)
  - [Internationalisation (i18n)](#internationalisation-i18n)
  - [Theming clean-up](#theming-clean-up)
  - [PDF viewer (pdf.js 5)](#pdf-viewer-pdfjs-5)
  - [Viewer components](#viewer-components)
  - [API signature and model changes](#api-signature-and-model-changes)
  - [Constructor / DI changes](#constructor--di-changes)
  - [Removed roles and DOM hooks](#removed-roles-and-dom-hooks)
- [Deprecations](#deprecations)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "8.0.0",
        "@alfresco/adf-content-services": "8.0.0",
        "@alfresco/adf-process-services": "8.0.0",
        "@alfresco/adf-process-services-cloud": "8.0.0",
        "@alfresco/adf-insights": "8.0.0",
        "@alfresco/adf-extensions": "8.0.0",
        "@alfresco/js-api": ">=9.0.0",
        "@ngx-translate/core": ">=16.0.0"
    }
}
```

Clean your old distribution and dependencies by deleting `node_modules` and `package-lock.json`, then reinstall:

```sh
npm install
```

## Major platform changes

| Area                                | 7.0.0      | 8.0.0             |
| ----------------------------------- | ---------- | ----------------- |
| Angular / Material / CDK            | 17.1       | **19.2**          |
| TypeScript                          | 5.3        | **5.8.2**         |
| zone.js                             | 0.14.8     | **0.15.0**        |
| Nx                                  | 20.0       | **20.8**          |
| `@ngx-translate/core`               | 14/15      | **>= 16.0.0**     |
| `apollo-angular` / `@apollo/client` | 6.0 / 3.11 | **10.0.3 / 3.13** |
| `pdfjs-dist`                        | 3.3        | **5.1.91**        |
| `@alfresco/js-api`                  | >= 8.0.0   | **>= 9.0.0**      |

Angular Material remains on the **M2 (Material 2) theming APIs** in 8.0.0 — the Material Design 3 migration was
deferred. Move your own application to Angular 19 / TypeScript 5.8 / zone.js 0.15 / Nx 20.8 in lockstep, and
upgrade `apollo-angular` (a major bump) if you use GraphQL.

The declared `engines.node` floor is unchanged (`>=18.0.0`), but the version the libraries are **built and tested
on** moved from Node 20 to **Node 22** (`.nvmrc` `20.18.1` → `22.14.0`) — align your build/CI Node version.

## Breaking changes

### Angular 19 and standalone

- Migrate your application to Angular 19. Standalone is the default in Angular 19, so the redundant
  `standalone: true` flags were dropped from ADF components. Any app NgModule that still **declares** ADF
  components must import them as standalone instead.

### Internationalisation (i18n)

`@ngx-translate/core` v16 changed how translation is wired, and `CoreModule` was modernised:

- **`CoreModule` no longer re-exports `TranslateModule`.** Components that used the `translate` pipe via a
  transitive `TranslateModule` must now import ngx-translate's standalone `TranslatePipe` (or provide translation
  themselves).
- **`CoreModule.forRoot()` no longer auto-provides `MomentDateAdapter`, `TranslateStore`, or `TranslateService`**
  (translation now uses `provideTranslateService`), and no longer re-exports `HttpClientModule` / the XSRF module
  (HTTP is wired via `provideHttpClient(...)`). Provide these yourself if you depended on them transitively.
- Prefer the new standalone providers (see [New components and features](#new-components-and-features)):
  `provideI18N(...)`, `provideAppConfig()`, `provideShellRoutes(...)` (`ShellModule` is deprecated),
  `provideHttpClient()`.

### Theming clean-up

The ADF theming layer was significantly reduced (`AAE-34390`/`AAE-34439`/`AAE-34458`). This is the biggest
source of build/visual breakage for apps with custom themes:

- **Prebuilt themes were removed** — the `lib/core/src/lib/styles/prebuilt/*` themes (`adf-blue-orange`,
  `adf-indigo-pink`, etc.) no longer ship. Replace any `@import '@alfresco/adf-core/prebuilt-themes/...'` with a
  custom theme (`mat.define-palette` + `mat.define-light-theme` + `@include alfresco-material-theme($theme)`) or
  an Angular Material prebuilt theme.
- **The colour / variable SCSS partials were deleted**: `_colors.scss` (palettes `$alfresco-ecm-blue`,
  `$alfresco-accent-orange`, `$alfresco-warn`, the `$black-*/-white-*-opacity` helpers, …), `_reference-variables.scss`
  (all `$adf-ref-*`), and `_components-variables.scss` (the `adf-components-variables($theme)` mixin). Redefine any
  of these you referenced in your own theme.
- **Many `--adf-*` component CSS custom properties were removed** (card-view, info-drawer tabs, people/group-cloud,
  header icon-button, edit-task/process-filter, package-list, about-*, identity-user-info, etc.) — these are no
  longer overridable via CSS variables. A small set of metadata/error/secondary-button/chip/sidenav custom
  properties is retained.
- **Removed mixins:** `adf-components-variables($theme)` and `adf-snackbar-theme`. The snackbar classes
  `.adf-error-snackbar` / `.adf-warning-snackbar` / `.adf-info-snackbar` are no longer coloured by ADF — style them
  in your app.
- **Default font changed** from `Muli` to `Roboto`.
- Form widgets no longer render a custom `.adf-asterisk` span for required fields (the native Material required
  marker is used); a new `.adf-form-field-input` class was added, with placeholder-conditional `floatLabel`.
- Docs removed: `basic-theming.md`, `typography.md`, and the "using a prebuilt theme" section of `theming.md`.

### PDF viewer (pdf.js 5)

`pdfjs-dist` was upgraded from 3.x to **5.1.91**, which changes how the worker is loaded:

- The worker asset was renamed from `pdf.worker.min.js` to **`pdf.worker.min.mjs`**. Update your build's asset copy
  (`node_modules/pdfjs-dist/build/pdf.worker.min.mjs`). The component now fetches the worker and loads it via a
  Blob `workerPort` (to tolerate servers that return the wrong MIME type for `.mjs`).
- New overridable injection tokens `PDFJS_MODULE` and `PDFJS_VIEWER_MODULE`.
- pdf.js scale values are now strings (`isSameScale(oldScale: string, newScale: string)`), and the viewer container
  now also carries the native `pdfViewer` class.

### Viewer components

- **`ViewerRenderComponent` `@Input() isLoading` was removed** — loading state is now managed internally and cleared
  via child-renderer completion outputs / a new public `markAsLoaded()`. Remove any `[isLoading]` binding. Custom
  viewer/preview-extension components should emit a `contentLoaded` output (new on `TxtViewerComponent` and
  `PreviewExtensionComponent`; `imageLoaded`/`canPlay`/`pagesLoaded` on the built-in renderers) to clear the spinner.
- **`AlfrescoViewerComponent`** — `readOnly` is now a public `@Input()` (previously an internal permission-derived
  field; the permission result moved to an internal `canEditNode`). New `@Input() showToolbarDividers` (also on core
  `ViewerComponent`, which gained an `adf-viewer-inline` host class when not in overlay mode).

### API signature and model changes

- **`TagService.createTags(tags)`** now returns `Observable<TagEntry | TagPaging>` (was `Observable<TagEntry[]>`).
  Read results via `result.list.entries[i].entry.tag`; import `TagPaging` from `@alfresco/js-api`. The `refresh`
  output now emits the paging object.
- **`AspectListService` was reworked** — `getAspects()`, `getStandardAspects()` and `getCustomAspects()` were
  removed/repurposed. `getAspects(whiteList, opts?)` now takes a whitelist and returns `AspectPaging` (not
  `AspectEntry[]`); new `getAllAspects(...)` returns a new `CustomAspectPaging`. New exported `StandardAspectsWhere`
  / `CustomAspectsWhere`.
- **Knowledge Retrieval / Search-AI models changed** (`@alfresco/js-api`): `AiAnswer.questionId` → `question`,
  `AiAnswer.references` → `objectReferences` (new `AiAnswerObjectReference`), new `AiAnswer.complete`;
  `AiAnswerReference.referenceText` was replaced by `rank` / `rankScore`.
- **`FormBaseComponent.hasVisibleOutcomes` getter was removed** — outcome visibility now lives in a new exported
  pure helper `isOutcomeButtonVisible(...)` (from the new `form/buttons-visibility` public export).
- **`UserTaskCloudComponent.taskCompleted`** now emits `boolean` (the "open next task" flag) instead of the task id
  `string`; `TaskScreenCloudComponent.taskCompleted` / `UserTaskCustomUi.taskCompleted` were retyped.
- `WidgetComponent.isRequired()` return type narrowed from `any` to `boolean` (returns `false`, not `null`, when not required).
- **APS (classic) task-filter methods renamed**: `TaskFilterService.getInvolvedTasksFilterInstance` →
  `getOverdueTasksFilterInstance`, `getQueuedTasksFilterInstance` → `getUnassignedTasksFilterInstance`; the default
  filters changed from "Involved/Queued" to "Overdue/Unassigned" (existing user filters are auto-migrated on load).
- Dropdown form fields: `FormFieldModel.value` may now be the full option object `{ id, name }` rather than a string id.

### Constructor / DI changes

Only relevant if you manually instantiate or subclass these:

- `NodeFavoriteDirective` / `LibraryFavoriteDirective` constructors gained `NotificationService`.
- `AlfrescoApiLoaderService` constructor gained a `SecurityOptionsLoaderService` dependency.

### Removed roles and DOM hooks

Update e2e/CSS selectors:

- The datatable row checkbox no longer has `role="checkbox"` (use `data-adf-datatable-row-checkbox` / `[attr.aria-checked]`).
- The add-user/group search results no longer have `role="listbox"`.
- The viewer file-name spans `.adf-viewer__display-name-without-extension` / `-extension` were replaced by a single
  span; a new public `ViewerComponent.displayName` (middle-ellipsised at 50 chars) is available.

## Deprecations

These still work in 8.0.0 but are slated for removal — migrate when you upgrade:

- **`ShellModule`** → use **`provideShell(opts?)`** (`@alfresco/adf-core/shell`), which takes
  `{ routes, appService?, authGuard?, navBar? }` and wires the whole shell (see
  [New components and features](#new-components-and-features)).
- **`FormBaseModule`** (`@alfresco/adf-core`) → import the standalone form components directly.
- **`CoreTestingModule`** (`@alfresco/adf-core`) → use the standalone components in your test beds.
- **`ProcessServicesCloudModule`** (`@alfresco/adf-process-services-cloud`) → import the standalone components
  directly, or replicate the module with providers:
  ```ts
  providers: [
      provideTranslations('adf-process-services-cloud', 'assets/adf-process-services-cloud'),
      provideCloudPreferences(),
      provideCloudFormRenderer(),
      { provide: TASK_LIST_CLOUD_TOKEN, useClass: TaskListCloudService }
  ]
  ```
- **Dialog / snackbar NgModules** are now `@deprecated` — import the standalone component directly instead of the
  module: `ConfirmDialogModule`, `EditJsonDialogModule`, `UnsavedChangesDialogModule`, `SnackbarContentModule`
  (`@alfresco/adf-core`) and `DownloadZipDialogModule` (`@alfresco/adf-content-services`).

(The theming layer / prebuilt themes are covered under [Theming clean-up](#theming-clean-up).)

## New components and features

- **`provideI18N(config?)`** (core) — standalone i18n bootstrap: `provideI18N({ defaultLanguage: 'en', assets: [['app', '/assets/i18n']] })`. Wraps `provideTranslateService` + `provideTranslations` (both still available).
- **`provideShell(opts?)`** (`@alfresco/adf-core/shell`) — the recommended replacement for the deprecated
  `ShellModule`; it takes `{ routes, appService?, authGuard?, navBar? }` and wires the whole shell (calling the
  narrower **`provideShellRoutes(routes)`** helper internally). Plus **`provideAppConfig()`**,
  **`provideCloudPreferences()`** and **`provideCloudFormRenderer()`** — standalone provider helpers.
- **`auth.withCredentials`** — a new `app.config.json` key (`AppConfigValues.AUTH_WITH_CREDENTIALS`) that controls the
  HTTP `withCredentials` flag, so it can be disabled for identity providers that reject credentials. A new
  `SecurityOptionsLoaderService` (content-services) applies it early during bootstrap.
- **New outputs / methods:** `CommentsComponent` / `NodeCommentsComponent` `@Output() commentAdded`;
  `ProcessContentService.getContentRenditionTypePreview(contentId)`; `StorageService.getItems()`;
  `TaskFilterService.updateTaskFilter(...)`.
- **Records management:** new `FilePlansApi.getFilePlanRoles(...)` plus `FilePlanRole*` models (js-api), used to verify legal-hold capabilities and hide the RM library join button when unauthorised.
- **Process / forms:** an "Open next task" checkbox for screen-based tasks (`UserTaskCloudComponent` /
  `TaskScreenCloudComponent` gained `@Input() showNextTaskCheckbox`, `isNextTaskCheckboxChecked` and
  `@Output() nextTaskCheckboxCheckedChanged`); `ProcessDefinitionCloud.constantValues` (new `ConstantValues` type);
  `rootProcessInstanceId` propagated to dynamic task screens; the Data Table widget now renders empty tables and a
  preview placeholder instead of erroring; `FormCloudComponent.showCompleteButton` input.
- **Categories dialog** now validates prohibited symbols (`: " \ | < > / ? *`) and trailing dots.
- Favorite directives now show snackbar notifications; the `<html lang>` attribute now updates on language change.

## Behavioural changes

| Area             | Change                                                                                                                                                                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document list    | Navigating to a new folder now resets the active `filterValue`; custom column visibility/order/width persist across refresh.                                                                                                                                                          |
| Forms            | Hidden required dropdowns are no longer invalid; clearing a numeric field stores `null` (not `''`); required dropdowns show a single asterisk; async form enrichment now populates date fields and hides the spinner correctly; `onProcessFinish` fires reliably from `onFormLoaded`. |
| Content metadata | Content in non-edited panels stays visible while another panel is edited (new `isPanelEditing(panelTitle)` / `editedPanelTitle`).                                                                                                                                                     |
| Aspect list      | All aspects are fetched (paged) when the first call doesn't return them all.                                                                                                                                                                                                          |
| Viewer           | Loading state is driven by renderer completion; PDF documents scale correctly; the image viewer is no longer cropped; the file name is truncated with a tooltip.                                                                                                                      |
| Accessibility    | Loading bars/spinners gained aria labels; nested interactive controls were removed from the datatable; form tab navigation uses a focus trap.                                                                                                                                         |

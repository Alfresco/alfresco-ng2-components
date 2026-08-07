---
Title: Upgrading from ADF v6.6.0 to v6.7.1
---

# Upgrading from ADF v6.6.0 to v6.7.1

This guide provides instructions on how to upgrade your v6.6.0 ADF projects to v6.7.1 (covering the
6.7.0 and 6.7.1 releases).

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup.

Do not skip this task if you want your application to be updated to the most recent version of ADF.
Upgrades of multiple versions of ADF cannot be done in one step only, but should follow the chain of sequential updates.

After the upgrade, check the other sections below to see if there are any changes affecting your project.

## Contents

- [Library updates](#library-updates)
- [Breaking changes](#breaking-changes)
  - [Angular Material CSS classes](#angular-material-css-classes)
  - [Tags and categories config keys renamed](#tags-and-categories-config-keys-renamed)
  - [Content metadata property panel API](#content-metadata-property-panel-api)
  - [Card view methods are now getters](#card-view-methods-are-now-getters)
  - [REGEX card-view validator inverted](#regex-card-view-validator-inverted)
  - [Version list infinite scroll](#version-list-infinite-scroll)
  - [Authentication changes](#authentication-changes)
  - [Data table sorting and resizing](#data-table-sorting-and-resizing)
  - [Viewer extension projection](#viewer-extension-projection)
  - [Task list service](#task-list-service)
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
        "@alfresco/adf-core": "6.7.1",
        "@alfresco/adf-content-services": "6.7.1",
        "@alfresco/adf-process-services": "6.7.1",
        "@alfresco/adf-process-services-cloud": "6.7.1",
        "@alfresco/adf-insights": "6.7.1",
        "@alfresco/adf-extensions": "6.7.1",
        "@alfresco/js-api": ">=7.5.0"
    }
}
```

Clean your old distribution and dependencies by deleting `node_modules` and `package-lock.json`, then reinstall:

```sh
npm install
```

## Breaking changes

### Angular Material CSS classes

A large refactor (~130 files) removed all references to **Angular Material internal CSS classes** (`.mat-*`,
`.cdk-*`) from ADF component styles, in preparation for the Material MDC migration. ADF SCSS now styles its own
`adf-*` host classes instead. A stylelint rule was added to forbid `mat-`/`material-`/`cdk-` selector prefixes.

**Consumer impact:** because ADF components use `ViewEncapsulation.None`, their old `.mat-*` overrides leaked
globally. If your app relied on those leaked overrides, or targeted `.mat-*` inside ADF components, restyle
against the new `adf-*` host classes. Concrete removals to be aware of:

- `CategoriesManagementComponent.addCategoryToAssign()` signature changed from `(change: MatSelectionListChange)`
  to `(category: Category)` — the only hard TypeScript break in this commit.
- `content-user-info` dropped its environment `mat-tab-group` (`#tab-group-env`, `.adf-userinfo-tab`, `.adf-hide-tab`).
- `content-node-selector` removed its "headless tabs" mode (`.adf-content-node-selector-headless-tabs`).
- `sites-dropdown.component.scss` was deleted.

### Tags and categories config keys renamed

The `app.config.json` keys that enable/disable the tags and categories features (introduced in 6.6.0) were
**renamed**:

| Before (6.6.0) | After (6.7.x) |
| -------------- | ------------- |
| `plugins.tags` | `plugins.tagsEnabled` |
| `plugins.categories` | `plugins.categoriesEnabled` |

Update your `app.config.json`, or the flags silently fall back to their `true` default. The methods
`TagService.areTagsEnabled()` and `CategoryService.areCategoriesEnabled()` are unchanged.

### Content metadata property panel API

`ContentMetadataComponent` was refactored so only one panel edits at a time, replacing the per-panel
(General Info / Tags / Categories / group) state introduced in 6.6.0. Many public members were **removed**:

- Removed methods include `canExpandTheCard`, `onToggleGeneralInfoEdit`, `onToggleTagsEdit`,
  `onToggleCategoriesEdit`, `onToggleGroupEdit`, `onSaveGeneralInfoChanges`, `onSaveTagsChanges`,
  `onSaveCategoriesChanges`, `onSaveGroupChanges`, `isEditingPanel`, and the `onCancel*Edit` methods.
- Removed fields/getters include `isGeneralPanelExpanded`, `isTagPanelExpanded`, `isCategoriesPanelExpanded`,
  `currentGroup`, `isEditingModeGeneralInfo/Tags/Categories`, `canEditGeneralInfo`, `isEditingGeneralInfo`,
  `canEditTags`, `isEditingTags`, `canEditCategories`, `isEditingCategories`, `hasGroupToggleEdit`,
  `isGroupToggleEditing`, `tagNameControlVisible`, `categoryControlVisible`.
- They are replaced by a unified API: fields `editing`, `editedPanelTitle`, `currentPanel`, an exposed
  `DefaultPanels` enum, and methods `isPanelEditing()`, `saveChanges()`, `toggleGroupEditing()`,
  `cancelGroupEditing()`, `expandPanel()`, `closePanel()`, `resetEditing()`.
- A new `ContentMetadataPanel { panelTitle: string; expanded?: boolean }` interface was added, and
  `ContentMetadataCustomPanel` now extends it.
- **`CardViewGroup.editable` became a required property** (was optional) — constructing `CardViewGroup` literals now requires `editable`.

The `@Input`/`@Output`/selector of `ContentMetadataComponent` are unchanged.

### Card view methods are now getters

To remove redundant function calls from templates, several card-view members changed from **methods to getters**.
Drop the parentheses in any custom code/templates calling them:

- `CardViewArrayItemComponent`: `showClickableIcon`, `displayCount`, `isClickable`.
- `CardViewDateItemComponent`: `showProperty`, `showClearAction`.
- `CardViewMapItemComponent`: `showProperty`, `isClickable`.

### REGEX card-view validator inverted

`CardViewItemMatchValidator` (the `REGEX` card-view constraint) gained a `requiresMatch?` parameter, and its
default semantics **inverted**: with `requiresMatch` falsy, a value that **matches** the pattern is now treated
as **invalid** (used to express forbidden-character patterns for e.g. folder names). Existing REGEX constraints
that expected "match means valid" must now set `requiresMatch: true`. The validator's `flags` are now forwarded
from config as well.

### Version list infinite scroll

`VersionListComponent` now loads versions lazily in batches via CDK virtual scroll:

- **The public `versions: VersionEntry[]` property was removed.** Use `latestVersion: VersionEntry` (or the new
  `versionsDataSource`) instead — e.g. `versionList.versions[0].entry` becomes `versionList.latestVersion?.entry`.
- A new abstract `InfiniteScrollDatasource<T>` and `VersionListDataSource` are exported from
  `@alfresco/adf-content-services`; `VersionManagerModule` now imports `@angular/cdk/scrolling`.

### Authentication changes

- **Code-flow infinite loop fix** — the OIDC login callback is now driven by `OidcAuthGuard` (root-provided) on
  the `view/authentication-confirmation` route rather than by `AuthenticationConfirmationComponent`. As a result:
  - `AuthService.loginCallback()` signature changed to `loginCallback(loginOptions?: LoginOptions)`.
  - `OidcAuthGuard` constructor gained `Router`; its `canActivate`/`canActivateChild` no longer take route/state args.
  - `AuthModuleConfig` gained `preventClearHashAfterLogin?: boolean` (defaults to `true`).
- **`requireAlfTicket` auto-wiring moved to content-services** — the automatic ECM ticket fetch after OAuth login
  was moved out of `@alfresco/adf-core` into a new `ContentAuthLoaderService` `APP_INITIALIZER` in
  `@alfresco/adf-content-services`. `BasicAlfrescoAuthService.requireAlfTicket()` still exists in core, but apps
  that import **only** `@alfresco/adf-core` (not `ContentModule`) no longer get the automatic fetch — import
  `ContentModule.forRoot()` or call `requireAlfTicket()` yourself on `authService.onLogin`.
- **`nonceStateSeparator`** is now set to `'~'` in the OIDC `AuthConfig` (fixes login with IdPs sensitive to the state/nonce separator).

### Data table sorting and resizing

- **Sorting default changed** — `ObjectDataTableAdapter.sort()` and `DataSorting` now use `String.localeCompare`
  with `Intl.CollatorOptions` and **`{ numeric: true }` by default** (both gained an optional `options?: Intl.CollatorOptions`
  parameter). Numeric and date columns may sort differently than in 6.6.0.
- **Columns are resizable by default** — `DataColumn` / `DataColumnComponent` gained a `resizable` flag that
  **defaults to `true`** (`DocumentListPresetRef.resizable?` too). Set `resizable="false"` per column to opt out.
- `DataTableComponent.isResizing` is now a read-only getter (was a mutable field).

### Viewer extension projection

Custom viewer extension templates are now projected explicitly instead of via the old `externalExtensions` push:

- `ViewerComponent` / `AlfrescoViewerComponent` accept the extensions through a `#viewerExtensions` template ref
  (`@ContentChild`) / `@Input() viewerExtensions: TemplateRef<any>`.
- `ViewerExtensionDirective` now populates `extensionsSupportedByTemplates` rather than `externalExtensions`.
- `ViewerRenderComponent` constructor gained an `Injector` parameter (affects manual instantiation).

### Task list service

`TaskListService` (`@alfresco/adf-process-services`):

- The public method `findAllTasksWithoutState()` was **removed**.
- `findAllTaskByState()` was **renamed to `findAllTasksByState()`** (note the extra "s").

The `all` state is now handled by `findTasksByState` (it applies to both open and completed tasks).

### Other breaking changes

- `FormCloudComponent` constructor gained a `DisplayModeService` dependency (see [Full-screen task forms](#new-components-and-features)); `FormRepresentationModel.displayMode` was added.
- `FormFieldModel`'s `value` setter no longer calls `updateForm()` when the value is unchanged.
- `WidgetVisibilityModel.leftType` / `rightType` return type widened to `string | null`.

## New components and features

- **Decimal form widget** — a new `DecimalWidgetComponent` (selector `adf-decimal`) renders `bigdecimal`
  fields (new `FormFieldTypes.DECIMAL = 'bigdecimal'`), backed by a `DecimalFieldValidator` and a new
  `FormFieldModel.precision` property. Registered automatically by the form rendering service.
- **Full-screen user task forms** — `FormCloudComponent` and `TaskFormCloudComponent` gained
  `@Input() displayModeConfigurations` and `@Output() displayModeOn` / `displayModeOff`, backed by a new
  `DisplayModeService` and `FormCloudDisplayMode { inline, fullScreen }` — forms can switch between inline and full-screen.
- **Dynamic chip list** — a new standalone `DynamicChipListComponent` (`adf-dynamic-chip-list`, with a `Chip`
  interface) is exported from `@alfresco/adf-core`; `TagNodeListComponent` now delegates its chip rendering to it.
- **Unsaved-changes dialog / guard** — new `UnsavedChangesDialogComponent` and `UnsavedChangesGuard`
  (`CanDeactivate`) exported from `@alfresco/adf-core`.
- **Group service** — `GroupService` gained `getGroup()` and `updateGroup()` (the js-api `Group`/`GroupBodyUpdate`
  models gained an optional `description`).
- **Resizable columns by default** and **per-column `resizable`** config (see [Data table sorting and resizing](#data-table-sorting-and-resizing)).
- **Storage prefix factory** — a new `STORAGE_PREFIX_FACTORY_SERVICE` injection token and `StoragePrefixFactory`
  let apps supply a dynamic `StorageService` prefix (the `application.storagePrefix` app-config value still takes precedence).
- **Header design tokens** — new themeable `--adf-header-icon-button-*` CSS custom properties (see [Theme changes](#theme-changes)).

## Behavioural changes

| Area | Change |
| ---- | ------ |
| Card view dates | `date`-type card-view values are now displayed timezone-agnostically (stored at UTC midnight), fixing off-by-one-day display; new `DateFnsUtils.forceLocal` / `forceUtc` helpers. Custom `d:date` aspect strings no longer crash the app. |
| Card view text item | Non-editable text items render as `readonly` (not `disabled`) with a corrected clickable area; `update()` is a no-op when not editable. |
| Aspect list | The aspect dialog no longer overwrites node aspects it doesn't display; hidden aspects are preserved and included in `valueChanged`. |
| Document list | Size / Modified-by columns re-render correctly after editing properties; nodes are deleted sequentially; declared records hide the "Edit Offline" / "Upload New Version" actions. |
| Search | The search filter panel no longer shows duplicated Clear/Apply buttons for the date-time widget; tab content re-displays correctly after switching tabs. |
| Tags | Creating a tag validates against illegal characters; a to-be-created tag can be removed without clearing the "already exists" error. |
| Forms | Required people/groups widgets keep the submit button disabled while empty; integer "greater than" visibility conditions work. |

## Theme changes

`HeaderLayoutComponent` gained themeable CSS custom properties for its icon buttons:

- `--adf-header-icon-button-default-color`
- `--adf-header-icon-button-default-border-radius`
- `--adf-header-icon-button-hover-color`
- `--adf-header-icon-button-pressed-color`
- `--adf-header-icon-button-disabled-color`

More broadly, the Material-CSS-class removal (see [Angular Material CSS classes](#angular-material-css-classes))
means ADF no longer ships overrides of Material internals — theme ADF components through their `adf-*` classes
and documented CSS custom properties.

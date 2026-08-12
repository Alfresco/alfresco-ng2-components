---
Title: Upgrading from ADF v6.3 to v6.4
---

# Upgrading from ADF v6.3 to v6.4

This guide provides instructions on how to upgrade your v6.3.0 ADF projects to v6.4.0.

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup.

Do not skip this task if you want your application to be updated to the most recent version of ADF.
Upgrades of multiple versions of ADF cannot be done in one step only, but should follow the chain of sequential updates.

After the upgrade, check the other sections below to see if there are any changes affecting your project.

## Contents

- [Library updates](#library-updates)
- [Breaking changes](#breaking-changes)
  - [Date handling (moment → date-fns)](#date-handling-moment--date-fns)
  - [DataColumnType moved and new column types](#datacolumntype-moved-and-new-column-types)
  - [Document list column configuration](#document-list-column-configuration)
  - [Card view components](#card-view-components)
  - [Typography from theme](#typography-from-theme)
  - [Error-handling clean-up](#error-handling-clean-up)
  - [SCSS include path](#scss-include-path)
  - [Other breaking changes](#other-breaking-changes)
- [Deprecated items](#deprecated-items)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)
- [Theme changes](#theme-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "6.4.0",
        "@alfresco/adf-content-services": "6.4.0",
        "@alfresco/adf-process-services": "6.4.0",
        "@alfresco/adf-process-services-cloud": "6.4.0",
        "@alfresco/adf-insights": "6.4.0",
        "@alfresco/adf-extensions": "6.4.0",
        "@alfresco/js-api": ">=7.1.0"
    }
}
```

**Dependency changes to note:**

- ADF no longer depends on `moment`, `@angular/material-moment-adapter`, or `@mat-datetimepicker/moment`.
  If your application still uses `moment` directly (or the deprecated ADF moment pipes/adapter), add
  `moment` to your own `package.json`.
- ADF uses `@angular/material-date-fns-adapter` and `date-fns` for date handling — make sure they resolve.

Clean your old distribution and dependencies by deleting `node_modules` and `package-lock.json`, then reinstall:

```sh
npm install
```

## Breaking changes

### Date handling (moment → date-fns)

ADF now uses `date-fns` for all date parsing/formatting and provides its own Material date adapters.

**Removed dependencies** — `moment`, `@angular/material-moment-adapter`, and `@mat-datetimepicker/moment`
are removed from the ADF libraries' peer dependencies. Remove any direct imports of
`@angular/material-moment-adapter` / `@mat-datetimepicker/moment` from your app.

**New API (from `@alfresco/adf-core`):**

| Symbol                  | Purpose                                                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AdfDateFnsAdapter`     | `DateAdapter<Date>` implementation (replaces `MomentDateAdapter`). Auto-switches locale from `UserPreferencesService`; has a settable `displayFormat`. |
| `AdfDateTimeFnsAdapter` | `DatetimeAdapter<Date>` implementation for date-time pickers.                                                                                          |
| `ADF_DATE_FORMATS`      | `MatDateFormats` value to provide via `MAT_DATE_FORMATS`.                                                                                              |
| `ADF_DATETIME_FORMATS`  | `MatDatetimeFormats` value to provide via `MAT_DATETIME_FORMATS`.                                                                                      |
| `DateFnsUtils`          | Static date helpers (`formatDate`, `parseDate`, `convertMomentToDateFnsFormat`, …).                                                                    |

Replace the moment adapter wiring in your component providers:

```ts
// Before
providers: [
    { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter }
]

// After
providers: [
    { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
    { provide: DateAdapter, useClass: AdfDateFnsAdapter }
    // for date-time pickers, also:
    // { provide: MAT_DATETIME_FORMATS, useValue: ADF_DATETIME_FORMATS },
    // { provide: DatetimeAdapter, useClass: AdfDateTimeFnsAdapter }
]
```

**Removed / deprecated exports:**

- `CLOUD_FORM_DATE_FORMATS` was **removed** from `@alfresco/adf-process-services-cloud` — use `ADF_DATE_FORMATS` from `@alfresco/adf-core`.
- `MomentDateAdapter` and `MOMENT_DATE_FORMATS` are **deprecated** (still exported). `MomentDateAdapter` no longer imports moment directly — it relies on a globally-available `moment`.

**Date format tokens change** — format strings moved from moment tokens to date-fns tokens, e.g.
`DD-MM-YYYY` → `dd-MM-yyyy`, `YYYY` → `yyyy`. Update custom date formats in your `app.config.json` and
component inputs. (Moment-style tokens passed to `AdfDateFnsAdapter.displayFormat` are auto-converted,
but prefer native date-fns tokens.) The default cloud form date format is now `dd-MM-yyyy`.

**Type changes** — date values that were typed `moment.Moment` are now native `Date` (for example
`DateWidgetComponent.minDate` / `maxDate` / `startAt`, and its `onDateChange` event). Update any code
that constructed or consumed these as moment objects; use `dateAdapter.parse/format` or `DateFnsUtils`
instead of `moment()`.

### DataColumnType moved and new column types

The column type definitions moved packages:

- `DataColumnType` and `DataColumnTypes` are **no longer exported from `@alfresco/adf-core`** — they are
  now exported from **`@alfresco/adf-extensions`**. Update your imports:

  ```ts
  // Before
  import { DataColumnType } from '@alfresco/adf-core';
  // After
  import { DataColumnType } from '@alfresco/adf-extensions';
  ```

- The allowed column `type` values grew from `text | image | date | json | icon | fileSize | location`
  to also include **`boolean`**, **`amount`**, and **`number`**. `DataColumnComponent.type` is now typed
  as the `DataColumnType` union (previously a loose `string`).

**Data-table form widget no longer forces columns to text** — the cloud/process Data Table form widget
(`WidgetDataTableAdapter`) previously overwrote every column's `type` with `'text'`. That behaviour was
removed, so the `type` declared in a widget's `schemaDefinition` is now honoured. If a schema declared a
non-text `type` but relied on it rendering as plain text, set `type: 'text'` explicitly to preserve the
old appearance. This change has no compile-time signal.

### Document list column configuration

[`DocumentListComponent`](../content-services/components/document-list.component.md) now extends
`DataTableSchema` and supports a user-facing column selector:

- New `@Input() columnsPresetKey?: string` — key of a columns preset defined in `extension.json`.
- New `@Input() maxColumnsVisible?: number` — caps the number of simultaneously visible columns.
- `DocumentListPresetRef` (in `@alfresco/adf-extensions`) gained an optional `isHidden?: boolean`.

Because the component was refactored to extend `DataTableSchema`, several **private** members were
removed (`layoutPresets`, `hasCustomLayout`, `getLayoutPreset()`, `setTableSchema()`,
`setupDefaultColumns()`, `loadLayoutPresets()`). Standard `<adf-document-list>` usage is unaffected, but
consumers who subclassed the component or relied on those internals must adapt.

### Card view components

- **Selector rename** — `CardViewKeyValuePairsItemComponent` selector changed from
  `adf-card-view-keyvaluepairsitem` to **`adf-card-view-key-value-pairs-item`**. Update any template using the old selector.
- **Encapsulation** — `CardViewSelectItemComponent` now uses `ViewEncapsulation.None`, so its styles are
  global. New host classes were added to several items (`.adf-card-view-selectitem`,
  `.adf-card-view-textitem`, `.adf-card-view-key-value-pairs-item`, `.adf-card-view-dateitem`) — review
  any consumer CSS that targets these components.
- **`CardViewDateItemComponent`** — removed the public `dateFormat` property and the `AppConfigService`
  constructor dependency (constructor arity change). Non-editable dates are now parsed with the native
  `Date` rather than an app-config format.
- **`ContentMetadataComponent.canExpandTheCard`** — signature changed from `(group: CardViewGroup)` to
  `(groupTitle: string)`.

### Typography from theme

The error and user-info components now take typography from the Material theme instead of hard-coded
CSS. This removes some CSS classes that consumers may have targeted:

- `ErrorContentComponent` now injects `BreakpointObserver` (constructor arity change) and applies
  `mat-*` typography classes; the hard-coded font-size rules and `@media` block were removed.
- The user-info components ([`content-user-info`](../content-services/components/content-user-info.component.md),
  `identity-user-info`, `process-user-info`) replaced `.adf-userinfo-title` with `.mat-title`, removed
  `.adf-userinfo__detail-profile`, and changed the full-name element from `<span>` to `<h2>`. Element IDs
  (`ecm-username`, `identity-username`, etc.) are unchanged.

### Error-handling clean-up

Around twenty services had their internal `handleError` / `catchError` wrappers removed
(`AuditService`, `SitesService`, `DownloadZipService`, `CustomResourcesService`, `DocumentListService`,
`NodeCommentsService`, `RatingService`, `SearchService`, `IdentityUserService`, `IdentityGroupService`,
`AppsProcessService`, `TaskFilterService`, and others). Consequences:

- Subscribers now receive the **raw API error** rather than a normalised `'Server error'` string, and
  errors are **no longer logged** via `LogService`. Ensure your own `error` callbacks handle the raw error.
- `RenditionService` and `WebscriptComponent` now reject/throw with a real `Error` object instead of
  `undefined`.
- `LogService` was removed from many of these services' constructors (only relevant if you instantiate
  them manually).

Several public return types were also tightened, e.g.: `AuditService.getAuditApp()` →
`Observable<AuditApp>`; `CustomResourcesService.getRecentFiles()` → `ResultSetPaging`, `loadFavorites()`
→ `FavoritePaging`, `loadSites()` → `SitePaging`; `TaskListService.getTotalTasks()` →
`Observable<TaskListModel>`; and `ProcessFilterService` filter methods now return
`UserProcessInstanceFilterRepresentation`. `ActivitiAlfrescoContentService.toJson()` / `toJsonArray()`
were removed. Update any code relying on the previous types.

### SCSS include path

Component SCSS partials now share responsive breakpoints via `@import 'styles/flex';` (the `layout-bp`
mixin). If your build imports ADF component SCSS partials directly, add ADF core's styles folder to your
Sass include paths (`node_modules/@alfresco/adf-core/...` — the repo uses `../core/src/lib`), otherwise
`@import 'styles/flex'` will fail to resolve. Breakpoint thresholds are unchanged, so there is no
responsive behaviour change.

### Other breaking changes

- **Constructor arity changes** (only affect manual instantiation): `LibraryDialogComponent`
  (+`NotificationService`), `ErrorContentComponent` (+`BreakpointObserver`), `CardViewDateItemComponent`
  (removed `AppConfigService`).
- **CSS class rename** — the advanced date facet container class changed from
  `adf-search-date-range-horizontal-container` to `adf-search-date-range-container-row`.
- **Load More** — `InfinitePaginationComponent` now emits `RequestPaginationModel.merge = true` on "Load
  More" (was `false`). Handlers that branch on `merge` will behave differently.
- **Dependency** — the CLI/root `request` dependency was replaced by `node-fetch` (`^2.7.0`); `request`
  and `@types/request` were removed.

## Deprecated items

| Item                                                                           | Package              | Note                                                                                                  |
| ------------------------------------------------------------------------------ | -------------------- | ----------------------------------------------------------------------------------------------------- |
| `MomentDateAdapter`                                                            | `@alfresco/adf-core` | "this class is deprecated and should not be used." Use `AdfDateFnsAdapter` / `AdfDateTimeFnsAdapter`. |
| `MOMENT_DATE_FORMATS`                                                          | `@alfresco/adf-core` | Superseded by `ADF_DATE_FORMATS`.                                                                     |
| `MomentDatePipe` (`adfMomentDate`), `MomentDateTimePipe` (`adfMomentDateTime`) | `@alfresco/adf-core` | Not migrated; still require a globally-available `moment` at runtime.                                 |

## New components and features

### Data table column types

New column types with dedicated cell renderers in `@alfresco/adf-core`:

| Type      | Cell component         | Config                                                                                                               |
| --------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `boolean` | `BooleanCellComponent` | Also adds the `BooleanPipe` (`adfBoolean`).                                                                          |
| `amount`  | `AmountCellComponent`  | New `DataColumn.currencyConfig?: CurrencyConfig` (`{ code?; display?; digitsInfo?; locale? }`).                      |
| `number`  | `NumberCellComponent`  | New `DataColumn.decimalConfig?: DecimalConfig` (`{ digitsInfo?; locale? }`). `CurrencyConfig extends DecimalConfig`. |

Data columns also gained an optional `@Input() order?: number` (`DataColumnComponent`) / `order?` field
(`DataColumn`); custom schema columns are sorted by it.

### Configurable document list columns

A column selector (`adf-datatable-column-selector`) can now show/hide document-list columns, driven by
the new `columnsPresetKey` / `maxColumnsVisible` inputs above. `ColumnsSelectorComponent` gained
`@Input() columnsSorting` (default `true`) and `@Input() maxColumnsVisible?`.

### Content metadata custom panels

[`ContentMetadataComponent`](../../lib/content-services/src/lib/content-metadata/components/content-metadata/content-metadata.component.ts) and
[`ContentMetadataCardComponent`](../content-services/components/content-metadata-card.component.md) gained `@Input() customPanels: ContentMetadataCustomPanel[]`, rendering
registered extension components as extra metadata panels:

```ts
interface ContentMetadataCustomPanel {
    panelTitle: string;
    component: string; // registered extension component id
}
```

A custom panel whose `panelTitle` matches the `displayAspect` input is rendered initially expanded.

### Other additions

- `ProcessContentService.getProcessesAndTasksOnContent(sourceId, source, size?, page?)` — lists processes
  and tasks associated with a document.
- New date-fns helpers `AdfDateFnsAdapter`, `AdfDateTimeFnsAdapter`, `DateFnsUtils`, `ADF_DATE_FORMATS`,
  `ADF_DATETIME_FORMATS` (see [Date handling](#date-handling-moment--date-fns)).

## Behavioural changes

| Area          | Change                                                                                                                                 |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Data table    | Cloud/process Data Table form widget honours declared column `type` (no longer forced to text).                                        |
| Permissions   | `NodePermissionService.getNodeRoles` returns the node's settable permissions directly for nodes not under a Site (no search API call). |
| Groups        | The user-name column falls back to the group `id` when `displayName` is missing.                                                       |
| Rendition     | `RenditionService` rendition polling now retries correctly until the rendition is `CREATED`.                                           |
| Viewer        | `PdfViewerComponent` handles horizontally overflowing pages (toolbar shifts, container height `100vh` → `100%`).                       |
| Pagination    | "Load More" no longer resets scroll to the top and suppresses the loading spinner while merging.                                       |
| i18n          | The process/task list "Name" column header is now "Task Name".                                                                         |
| Accessibility | Date-facet number input and tag chip list gained aria labels/roles.                                                                    |

## Theme changes

Error and user-info typography now derive from the Material theme rather than hard-coded font sizes; see
[Typography from theme](#typography-from-theme). Consumers should theme these via Material typography
rather than by overriding the removed font-size CSS.

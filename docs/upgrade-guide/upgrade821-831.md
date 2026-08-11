---
Title: Upgrading from ADF v8.2.1 to v8.3.1
---

# Upgrading from ADF v8.2.1 to v8.3.1

This guide provides instructions on how to upgrade your v8.2.1 ADF projects to v8.3.1.

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. The steps
below may involve code changes — commit or back up your work first.

## Contents

- [Library updates](#library-updates)
- [Breaking changes](#breaking-changes)
  - [Removed components, tokens and pipes](#removed-components-tokens-and-pipes)
  - [Enums converted to const-objects](#enums-converted-to-const-objects)
  - [TypeScript target ES2022](#typescript-target-es2022)
  - [Form widget base class](#form-widget-base-class)
  - [Search and filter API](#search-and-filter-api)
  - [Process/task filter changes](#processtask-filter-changes)
  - [Context menu typing](#context-menu-typing)
  - [PDF viewer](#pdf-viewer)
  - [Other API changes](#other-api-changes)
  - [Accessibility-driven DOM changes](#accessibility-driven-dom-changes)
- [Deprecations](#deprecations)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "8.3.1",
        "@alfresco/adf-content-services": "8.3.1",
        "@alfresco/adf-process-services": "8.3.1",
        "@alfresco/adf-process-services-cloud": "8.3.1",
        "@alfresco/adf-insights": "8.3.1",
        "@alfresco/adf-extensions": "8.3.1",
        "@alfresco/js-api": ">=9.3.1"
    }
}
```

Angular/Material stay on 19.2 (patch bump to 19.2.19). `@ngx-translate/core` remains on **v16** (a v17 upgrade was
attempted and reverted). The declared `engines.node` floor is unchanged (`>=18.0.0`), but the version the libraries
are **built and tested on** moved from Node 22 to **Node 24** (`.nvmrc` `22.14.0` → `24.14.0`) — align your
build/CI Node version. Clean `node_modules` and `package-lock.json`, then `npm install`.

## Breaking changes

### Removed components, tokens and pipes

| Removed                                                                            | Kind               | Package                                | Migration                                                                                                                                                        |
| ---------------------------------------------------------------------------------- | ------------------ | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NodeNameTooltipPipe` (`adfNodeNameTooltip`), `ContentPipeModule`, `CONTENT_PIPES` | Pipe / module      | `@alfresco/adf-content-services`       | Use the new `node-tooltip.utils.ts` helpers.                                                                                                                     |
| `ADF_DOCUMENT_PARENT_COMPONENT`                                                    | Injection token    | `@alfresco/adf-content-services`       | `FilterHeaderComponent` now takes `@Input() pagination`/`sorting` and emits `searchResultsReady`/`filtersCleared` instead of injecting the parent document list. |
| `LANDING_PAGE_TOKEN`, `provideLandingPage()`                                       | Token / provider   | `@alfresco/adf-core`                   | Removed (they were added in 8.1.1 and unused).                                                                                                                   |
| `ButtonComponent` (`adf-button`), `ButtonVariant`, `ButtonColor`                   | Component / types  | `@alfresco/adf-core`                   | Use Angular Material buttons directly.                                                                                                                           |
| `ProgressComponent` (`adf-progress`)                                               | Component          | `@alfresco/adf-core`                   | Use Material `mat-progress-bar` / `mat-progress-spinner`.                                                                                                        |
| `ProcessAuditDirective` (`button[adf-process-audit]`)                              | Directive          | `@alfresco/adf-process-services`       | Removed (unused).                                                                                                                                                |
| `CheckAllowableOperationDirective` (`[adf-check-allowable-operation]`)             | Directive          | `@alfresco/adf-content-services`       | Removed (unused).                                                                                                                                                |
| `ProcessListCloudComponent.excludeByProcessCategoryName`                           | `@Input`           | `@alfresco/adf-process-services-cloud` | **Added in 8.2.1 and removed again in 8.3.1** — remove the binding.                                                                                              |
| `SortingPickerComponent` (`adf-sorting-picker`)                                    | Component          | `@alfresco/adf-core`                   | Removed.                                                                                                                                                         |
| `SearchSortingPickerComponent` (`adf-search-sorting-picker`)                       | Component          | `@alfresco/adf-content-services`       | Removed.                                                                                                                                                         |
| `BreadcrumbModule`                                                                 | Module             | `@alfresco/adf-content-services`       | Removed — the breadcrumb components are standalone; import them directly.                                                                                        |
| `ToggleIconDirective` (`[adf-toggle-icon]`), `FileUploadErrorPipe`                 | Directive / pipe   | `@alfresco/adf-content-services`       | Removed.                                                                                                                                                         |
| `MultiValuePipe`                                                                   | Pipe               | `@alfresco/adf-core`                   | Made internal (no longer exported).                                                                                                                              |
| `BlankPageComponent`, `BlankPageModule`                                            | Component / module | `@alfresco/adf-core`                   | Removed.                                                                                                                                                         |
| `displayLabelForChips` `@Input` (+ `showLabelForChips` getter)                     | Inputs             | `@alfresco/adf-core`                   | Removed from `CardViewComponent`, `CardViewTextItemComponent`, `CardViewItemDispatcherComponent`.                                                                |
| `DecimalNumberModel` (class), `BpmProductVersionModel` (class)                     | Models             | `@alfresco/adf-core`                   | Converted to interfaces (no longer instantiable via `new`); `BpmProductVersionModel` now lives in `@alfresco/js-api`.                                            |

Note: the `IconModule` still exists but was **repurposed** — it no longer exports `IconComponent` (it now bundles
the new `IconDirective` + `MatIconModule`), and it is no longer marked `@deprecated`. Separately, **`IconComponent`
(`adf-icon`) itself is now `@deprecated`** ("Use material icon with `aria-hidden="true"` instead") — migrate to
`<mat-icon adf-icon>` or the new `IconDirective`.

### Enums converted to const-objects

37 exported `enum`s were converted to a `const` object plus a same-named union `type`
(e.g. `export const DateCloudFilterType = {...} as const; export type DateCloudFilterType = (typeof DateCloudFilterType)[keyof typeof DateCloudFilterType]`).
The identifiers are **preserved**, so value access (`Status.RUNNING`) and type annotations (`x: Status`) still
compile. However, code relying on `enum`-only semantics — numeric reverse-mapping, `enum` declaration merging, or
places that structurally require a TS `enum` — will need adjustment. Affected enums include `AppConfigValues`,
`FormFieldType`, `WidgetTypeEnum`, `Status`, `DateCloudFilterType`, `TaskStatusFilter`, `FormCloudDisplayMode`,
`NOTIFICATION_TYPE`, `FileUploadStatus`, `NodeAction`, `CloseButtonPosition`, and ~26 others across the libraries.

### TypeScript target ES2022

All library `tsconfig`s now target/`lib` **ES2022** (was ES2018/ES2020). Ensure your build/runtime toolchain
supports ES2022 (Angular 16+ toolchains do). Downstream bundlers should not unexpectedly down-level the output.

### Form widget base class

The base `WidgetComponent`'s `formService` changed from a **public optional constructor parameter** to a
**`protected` injected field** (`protected formService = inject(FormService)`). Custom widgets that called
`super(formService)` or accessed `.formService` publicly must migrate to `inject(FormService)` and drop the
`super(...)` argument.

### Search and filter API

- **`SearchConfiguration` and `SearchForm` now require an `id: string`.** Add an `id` to each entry in your
  `search.config` / custom search configuration and form objects.
- **`BaseQueryBuilderService.updateSelectedConfiguration(index: number)` → `updateSelectedConfiguration(id: string)`** —
  configurations are now selected/persisted by stable `id` (round-tripped through the `selectedConfigurationId`
  query param) instead of array index. This fixes saved searches restoring the wrong set.
- **Search-header filters are now keyed by the category `id`** (not `columnKey`). `ADF_DOCUMENT_PARENT_COMPONENT`
  was removed (see the table above); `FilterHeaderComponent` gained `@Input() pagination`/`sorting` and
  `@Output() searchResultsReady`/`filtersCleared`.
- `SearchCheckListComponent.startValue` was widened from `string` to `string | string[]`.

### Process/task filter changes

- **`ProcessFiltersCloudComponent` and `TaskFiltersCloudComponent` no longer use `ViewEncapsulation.None`** — their
  styles are now encapsulated, so global CSS overriding their internals may no longer apply. They also render filters
  as router links now.
- The **task-filter query param was renamed from `filter` to `filterId`** — bookmarked/deep-link URLs using
  `?filter=` on the task list will no longer activate the filter.
- `ServiceTaskIntegrationContextCloudModel` no longer extends `ServiceTaskQueryCloudRequestModel` (it is now a
  standalone interface); its `errorDate` type changed from `Date` to `string`.

### Context menu typing

The context-menu overlay is now strongly typed: a new exported `ContextMenuItem` interface, and
`ContextMenuOverlayConfig.data` / the `CONTEXT_MENU_DATA` token changed from `any` to `ContextMenuItem[]`. Consumers
passing arbitrary objects as context-menu data may hit TypeScript errors and must conform to `ContextMenuItem`
(which includes a `subject.next` callback). Runtime behaviour is unchanged.

### PDF viewer

- Consumers importing pdf.js alongside ADF should use `import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.mjs'`
  (the settled import path); `PDFDateString` is imported from the same path.
- `PdfThumbComponent.page` and `PdfViewerThumbnailsComponent.pdfViewer` `@Input` types were widened to `any` (for
  compatibility with the packaged `.min.mjs` build) — the `PdfThumbnailPage` / `PDFViewer` types are no longer referenced there.
- **JP2 (JPEG 2000) PDFs** now require the pdf.js **WASM assets served from `./wasm/`** — add the `wasm/` folder to
  your app's asset copy (analogous to the existing `cmaps/`).

### Other API changes

- `StartProcessInstanceComponent` (classic process-services) renamed its public `moveNodeFromCStoPS()` method to
  `populateFormData()` and the `movedNodeToPS` field to `populatedFormData`.
- `NumberCellComponent.numberValue` / `AmountCellComponent.amountValue` are now `Signal<number | null>` — they render
  blank for non-numeric/empty/boolean values instead of passing the raw value through.
- The card-view text item's value `data-automation-id` changed from `card-textitem-value-<key>` to
  `card-textitem-field-<key>` (update e2e selectors).
- The `IconComponent.isCustom` getter was renamed to `isSvg` (internal; component also gained `isSvg`/`fontSet` inputs
  and content-projection).

### Accessibility-driven DOM changes

A large a11y batch added aria/roles/keyboard support. The ones that may break tests/styles:

- **Datatable column sorting target moved** — the sort `role="button"` / `tabindex` / keyboard handlers moved from the
  outer `.adf-datatable-cell-header` to the inner `.adf-datatable-cell-header-content`. Update e2e that clicks the
  outer header cell to sort.
- **Datatable cell tab stops** — cells are now tab-focusable only when `col.focus` is set (`[attr.tabindex]="col.focus ? 0 : null"`).
- The card-view text item's clickable value changed from a `<div role="button" tabindex="0">` to a native `<button>`;
  its empty-value `<span class="adf-textitem-default-value">` and that CSS class were removed.
- Several containers changed from `<div>`/`<span>` to `<fieldset>` for grouping (search check-list `.checklist` →
  `<fieldset class="adf-search-checklist">`; search date-range rows → `<fieldset>`).
- New ACC error locators: `data-automation-id="categories-error-message"` and `"tags-error-message"`.
- Permission manager: the `adf-authorityId-column` class was removed from the name columns; role column
  `adf-expand-cell-4` → `adf-expand-cell-3`.

## Deprecations

These still work in v8.3.1 but are newly `@deprecated` and slated for removal — migrate when you upgrade:

- **`DiscoveryApiService.getBpmProductInfo()`** (`@alfresco/adf-content-services`) — `@deprecated since 8.3.0`.
- **`ProcessService.fetchProcessAuditPdfById()` / `fetchProcessAuditJsonById()`** (`@alfresco/adf-process-services`)
  — marked "no longer used"; stop calling them.
- **`PROCESS_LIST_DIRECTIVES`** const (`@alfresco/adf-process-services`) — import the individual directives/components
  directly instead of the barrel.

## New components and features

- **`adf-icon` directive + icon remapping** — a new `IconDirective` (`mat-icon[adf-icon]`, `@Input('adf-icon') name`)
  and an `ICON_ALIAS_MAP_TOKEN` (+ `IconAliasMap` type, `DEFAULT_ICON_VALUE`) let apps remap icon names to SVG icons.
  `IconComponent` also gained content projection (`<adf-icon>home</adf-icon>`, slot wins over `value`).
- **Signals on `UserPreferencesService`** — new `localeSignal`/`paginationSizeSignal`/`supportedPageSizesSignal`
  signals and `locale$`/`paginationSize$`/`supportedPageSizes$` observables (additive; `.select()` still works).
- **Search** — new `BaseQueryBuilderService` streams `queryFragmentsUpdate` and `userFacetBucketsUpdate` plus a
  `resetUserFacetBucket()` method; `SearchHeaderQueryBuilderService.getOperatorForFilterId(id)`;
  `DocumentListComponent.@Input() isDataProvidedExternally`; `CustomResourcesService.loadFolderByNodeId(..., filters?)`;
  Escape closes the cloud dropdown.
- **Process filters** — new `@Input()`s `includeSubprocesses`, `includeUnlinkedProcesses`, `includeLinkedProcesses`
  (all `boolean | null`) and a `processRelatedTo` signal input on `ProcessListCloudComponent`, plus matching
  `ProcessFilterCloudModel` / request-model fields; `ConstantValues.triggerableByService`.
- **Forms** — evaluate `${field.x}` / `${variable.x}` expressions in display-text/rich-text widgets (new
  `FormExpressionService`, `BaseDisplayTextWidgetComponent`, `ADF_DISPLAY_TEXT_SETTINGS` token; opt-in, and HTML is
  escaped in rich text); custom regex validation messages (`FormFieldModel.customValidationMessage` /
  `enableCustomValidationMessage`, `ADF_CUSTOM_MESSAGE` token); skip validation for fields inside a hidden
  group/section (`FormModel.enableParentVisibilityCheck` + `FormCloudComponent.@Input() enableParentVisibilityCheck`,
  and `FormFieldModel.isFieldOrParentHidden()`); `provideI18N({ translations })` to register translations from code.
- **Extensibility** — the cloud filter services (`ProcessFilterCloudService`, `TaskFilterCloudService`,
  `ServiceTaskFilterCloudService`) exposed key members as `protected` for subclassing.
- **JS-API** — `NodesApiService.listParents(nodeId, opts?)`; `AiAnswerObjectReference.nodeId?`.
- **Viewer** — keyboard control of the image crop tool (arrows move; Shift/Alt + arrow resize; arrow navigation
  suppressed while cropping); PDF text/note annotations now render with hover/focus tooltips. New exported PDF
  types: `PageChangingEvent`, `PdfThumbnailPage`, `PdfAnnotationData`, `PdfAnnotationWithTitle`.
- **Custom field-status template** — new `FieldStatusTemplateDirective` (`[adf-field-status-template]`) and
  `FIELD_STATUS_TEMPLATE` token, so the text widget can render custom field-status content.
- **`ProcessListCloudComponent.@Input() enableAppChange`** — reloads preferences/process list when `appName` changes (opt-in).
- **New models/exports** — `NodeTooltipUtils` (replaces the removed tooltip pipe); `ProcessPayloadCloudData` interface;
  `RelatedProcessInstance` interface + `ProcessInstanceCloud.linkedProcesses`/`subprocesses`/`linkedProcessInstanceId`/`linkedProcessInstanceType`;
  `ServiceTaskListCloudService.getServiceTaskIntegrationContexts(...)` (+ `IntegrationContext` and related interfaces);
  `RepeatableSectionModel` is now exported from the form widgets core barrel.

## Behavioural changes

| Area                | Change                                                                                                                                                                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Forms — outcomes    | Name-based outcomes with a `null` id now complete the task (reverses the 8.2.1 requirement that an outcome needed both `name` and `id`).                                                                                      |
| Forms — dropdown    | Required REST/variable-backed dropdowns with no real selection now correctly show the required error.                                                                                                                         |
| Forms — attach file | Clicking the attach-file label no longer fires the select dialog twice.                                                                                                                                                       |
| Card view           | Double-click-to-copy now works on disabled/read-only text items; deleting a category in content metadata refreshes correctly.                                                                                                 |
| Data table          | Non-array rows/columns no longer crash the table (guarded); number/amount cells render blank for invalid values; sorting by a distinct `sortingKey` now persists in localStorage.                                             |
| Viewer              | APS-hosted file previews use the `preview` rendition; PDFs with JPEG-2000 images display (with WASM assets deployed).                                                                                                         |
| Process list (APS)  | Process-instance pagination fixed (the conflicting `start: 0` param was removed).                                                                                                                                             |
| Saved searches      | The selected configuration is tracked by stable `id`, so loading a saved search restores the intended set.                                                                                                                    |
| Forms — visibility  | Visibility/rule conditions now work for fields inside repeatable sections; async-form auto-populated date values are formatted before parsing (fixes reuse across tasks).                                                     |
| Data table row      | `DataTableRowComponent` (`adf-datatable-row`) `@Input() disabled` default changed `false` → `true` — direct consumers of the row component (outside `adf-datatable`, which always binds it) now get rows disabled by default. |

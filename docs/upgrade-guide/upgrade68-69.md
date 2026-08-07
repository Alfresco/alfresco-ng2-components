---
Title: Upgrading from ADF v6.8 to v6.9
---

# Upgrading from ADF v6.8 to v6.9

This guide provides instructions on how to upgrade your v6.8.0 ADF projects to v6.9.0.

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup.

Do not skip this task if you want your application to be updated to the most recent version of ADF.
Upgrades of multiple versions of ADF cannot be done in one step only, but should follow the chain of sequential updates.

After the upgrade, check the other sections below to see if there are any changes affecting your project.

## Contents

- [Library updates](#library-updates)
- [Breaking changes](#breaking-changes)
  - [Removed components and directives](#removed-components-and-directives)
  - [DataTable and DocumentList API cleanup](#datatable-and-documentlist-api-cleanup)
  - [DataTable multiselect checkbox id](#datatable-multiselect-checkbox-id)
  - [Removed / deprecated modules (standalone migration)](#removed--deprecated-modules-standalone-migration)
  - [Data table form widget: JSON paths](#data-table-form-widget-json-paths)
  - [Constructor and DI changes](#constructor-and-di-changes)
  - [Other breaking changes](#other-breaking-changes)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)
- [Notable internal changes](#notable-internal-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "6.9.0",
        "@alfresco/adf-content-services": "6.9.0",
        "@alfresco/adf-process-services": "6.9.0",
        "@alfresco/adf-process-services-cloud": "6.9.0",
        "@alfresco/adf-insights": "6.9.0",
        "@alfresco/adf-extensions": "6.9.0",
        "@alfresco/js-api": ">=7.5.0"
    }
}
```

Clean your old distribution and dependencies by deleting `node_modules` and `package-lock.json`, then reinstall:

```sh
npm install
```

## Breaking changes

### Removed components and directives

The following long-deprecated items were **removed**. There is no drop-in replacement — remove any usage:

| Removed | Kind | Selector | Package |
| ------- | ---- | -------- | ------- |
| `LikeComponent` | Component | `adf-like` | adf-content-services |
| `RatingComponent` | Component | `adf-rating` | adf-content-services |
| `RatingService`, `RatingServiceInterface`, `SocialModule` | Service / Interface / Module | — | adf-content-services |
| `WebscriptComponent` | Component | `adf-webscript-get` | adf-content-services |
| `WebScriptModule` | Module | — | adf-content-services |
| `FolderCreateDirective` | Directive | `[adf-create-folder]` | adf-content-services |
| `FolderEditDirective` | Directive | `[adf-edit-folder]` | adf-content-services |
| `FolderDirectiveModule` | Module | — | adf-content-services |
| `CardViewContentProxyDirective` | Directive | `[adf-card-view-content-proxy]` | adf-core |
| `ProcessNamePipe` | Pipe | — | adf-process-services |
| `ProcessServicesPipeModule` | Module | — | adf-process-services |
| `SecurityControlsServiceModule` | Module (empty) | — | adf-content-services |

The folder directives were moved into the demo-shell only — if you used `[adf-create-folder]` /
`[adf-edit-folder]`, port an equivalent into your own app.

### DataTable and DocumentList API cleanup

Deprecated API was removed from `DataTableComponent` (`adf-datatable`) and `DocumentListComponent`
(`adf-document-list`). The **"gallery" display mode no longer exists** — both always render as a list.

- **Removed** `@Input() display` from both components, and the exported `DisplayMode` enum
  (`{ List, Gallery }`). Remove any `[display]="'gallery'"` / `[display]="'list'"` bindings.
- **Removed** `DataTableComponent` public methods `iconAltTextKey()`, `hasSelectionMode()`, `getSortingKey()`,
  and the `fakeRows` property.
- **Removed** the `NavigableComponentInterface` interface; `DocumentListComponent` no longer implements it.

### DataTable multiselect checkbox id

The per-row selection checkbox in `adf-datatable` now uses an **index-suffixed id** instead of a static one,
fixing an accessibility regression that also caused clicking a row's checkbox to select the wrong row:

```html
<!-- before -->  <mat-checkbox id="select-file" ...>
<!-- after -->   <mat-checkbox [id]="'select-file-' + idx" ...>   <!-- select-file-0, select-file-1, ... -->
```

Any test/CSS selector targeting `#select-file` (or `[for="select-file"]`) must migrate to the indexed form
(`#select-file-0`, …).

### Removed / deprecated modules (standalone migration)

Many components, pipes and directives were converted to **standalone**. In most cases the owning NgModule is
retained (now marked `@deprecated`) with unchanged exports, so importing consumers are unaffected — but you
should migrate to importing the standalone symbol directly. Deprecated-but-retained modules include:
`AppConfigModule`, `DirectiveModule`, `PipeModule` (core); `IconModule`, `TemplateModule`, `AppsListModule`
(process); `ContentPipeModule` (content).

Real breaks in this effort:

- **`TemplateModule` (core) no longer re-exports `MatButtonModule`.** If you relied on `TemplateModule`
  transitively providing `mat-button`, import `MatButtonModule` yourself.
- `ProcessNamePipe` and `ProcessServicesPipeModule` were **deleted** (see the table above).
- New exported convenience symbols: `CORE_PIPES` (core), `CONTENT_PIPES` (content), and `TooltipCardComponent`
  is now publicly exported.
- **`LogService` (`@alfresco/adf-core`) is now `@deprecated`** — the class still works but is slated for removal.
  This is the counterpart to the constructor cleanup below (several services stopped injecting it this release);
  migrate off `LogService` in your own code.

### Data table form widget: JSON paths

The cloud form **Data Table widget** now resolves data via JSON paths, which changes how column configuration
is interpreted:

- `WidgetDataTableAdapter` no longer **extends** `ObjectDataTableAdapter` — it now **implements**
  `DataTableAdapter` (composition), and its constructor arguments `(data, schema)` are now **required**. Code
  depending on it being an `ObjectDataTableAdapter` instance must adapt.
- A column's **`key` is now interpreted as a JSON path** into each data item. Keys containing `.` or `[...]`
  are parsed as paths rather than literal property names. New supported syntaxes: bracket notation for keys
  with special characters (`data['non.standard key']`), nested objects inside arrays, and single array-index
  access (`orders[2].customer.name`; a single trailing `[n]` per segment — `[0][1]` is not supported).
- For process/task list **variable columns**, the variable map is now keyed by column **`id`** (previously by
  `title`). Ensure each variable column has a correct, unique `id`.

### Constructor and DI changes

`LogService` (and some other dependencies) were removed from several constructors — this only affects code that
manually instantiates these classes or subclasses them and calls `super(...)`:

- `BaseAuthenticationService` — constructor is now `protected` and no longer takes `LogService`; subclasses
  `BasicAlfrescoAuthService` and `OidcAuthenticationService` drop it from `super(...)` too.
- `IdentityRoleService`, `ClipboardService`, `DropdownSitesComponent`, `AlfrescoViewerComponent`,
  `UploadButtonComponent` — no longer inject `LogService`.
- `AspectListService` — `LogService` was replaced by `AppConfigService` in the constructor.
- `ContentNodeSelectorPanelComponent` — no longer injects `AppConfigService`; its `queryBuilderService` is
  private. The `adf-content-node-selector.sorting` app-config key is no longer read (default sort is
  `['createdAt', 'desc']`).
- `FormCloudComponent` — constructor gained a `FormCloudSpinnerService` dependency.
- `DisplayRichTextWidgetComponent` — constructor gained a `DomSanitizer` dependency.

### Other breaking changes

- **`ContentNodeShareModule.forRoot()` / `.forChild()` were removed** — import `ContentNodeShareModule` directly.
- `TaskDetailsComponent` (`adf-task-details`) removed the `@Input() debugMode` and the public methods
  `isShowAttachForm()` and `isTaskActive()`; `TaskHeaderComponent` removed the public `inEdit` field.
- `FormRendererComponent` no longer implements `OnChanges` (its rules manager now initialises once in `ngOnInit`).

## New components and features

- **Form spinner event** — a new `FormSpinnerEvent` / `FormSpinnerEventPayload` (`@alfresco/adf-core`) and a
  `FormService.toggleFormSpinner` subject let application code show/hide an overlay spinner over a cloud form:

  ```ts
  this.formService.toggleFormSpinner.next(new FormSpinnerEvent(type, { showSpinner: true, message }));
  ```

- **Widget error output** — the base `WidgetComponent` gained an `@Output() widgetError`, inherited by all form widgets.
- **Aspect list counter** — `AspectListComponent` gained an `@Output() updateCounter: EventEmitter<number>`, emitted whenever the number of selected aspects changes.
- **Start process cancel button** — `StartProcessCloudComponent` gained an `@Input() showCancelButton` (default `true`).
- **Accessibility** — a repo-wide accessibility lint pass added keyboard handlers (`tabindex`, `role`,
  `keyup.enter`), `aria-*` attributes, and `for`/`id` label associations across many components.
- **Data table JSON paths** — see [Data table form widget: JSON paths](#data-table-form-widget-json-paths).

## Behavioural changes

| Area | Change |
| ---- | ------ |
| DataTable | Multiselect row selection via checkbox now selects the correct row; column resizing works with multiselect enabled; small-window/mobile layouts no longer leave empty space. |
| Forms | Cloud form variables resolve static values from the component `data` input in start-event forms; the date widget handles negative range values; the rich-text display widget no longer emits a stray comma (content is now sanitised). |
| Folder dialog | The Create/Update button disables on first click to prevent duplicate folder-creation requests. |
| Version list | Layout fixes ensure action buttons (restore/download) remain visible and are not clipped off-screen. |
| Aspects dialog | The selected-aspects counter now updates correctly on select/deselect/reset/clear, and dialog buttons stay visible. |

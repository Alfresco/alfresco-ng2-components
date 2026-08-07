---
Title: Upgrading from ADF v6.7.1 to v6.8.0
---

# Upgrading from ADF v6.7.1 to v6.8.0

This guide provides instructions on how to upgrade your v6.7.1 ADF projects to v6.8.0.

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup.

Do not skip this task if you want your application to be updated to the most recent version of ADF.
Upgrades of multiple versions of ADF cannot be done in one step only, but should follow the chain of sequential updates.

After the upgrade, check the other sections below to see if there are any changes affecting your project.

## Contents

- [Library updates](#library-updates)
- [Breaking changes](#breaking-changes)
  - [Removed global helper classes and !important](#removed-global-helper-classes-and-important)
  - [Standalone component conversions](#standalone-component-conversions)
  - [Search provider changes](#search-provider-changes)
  - [Form rendering and widget changes](#form-rendering-and-widget-changes)
  - [Data table column sizing](#data-table-column-sizing)
  - [Viewer changes](#viewer-changes)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "6.8.0",
        "@alfresco/adf-content-services": "6.8.0",
        "@alfresco/adf-process-services": "6.8.0",
        "@alfresco/adf-process-services-cloud": "6.8.0",
        "@alfresco/adf-insights": "6.8.0",
        "@alfresco/adf-extensions": "6.8.0",
        "@alfresco/js-api": ">=7.5.0"
    }
}
```

Clean your old distribution and dependencies by deleting `node_modules` and `package-lock.json`, then reinstall:

```sh
npm install
```

## Breaking changes

### Removed global helper classes and !important

A `declaration-no-important` stylelint rule was introduced and `!important` was removed from ADF component
styles across ~74 files. As part of this:

- The SCSS partial `_default-class.scss` was **deleted**, removing the global helper classes
  **`.adf-hide-small`** and **`.adf-hide-xsmall`**. If your app used these ADF-provided classes to hide
  elements at small/extra-small breakpoints, define your own equivalents.
- No ADF component CSS class was renamed, but consumer CSS that previously depended on ADF rules winning
  via `!important` may now behave differently due to specificity — review your overrides.

### Standalone component conversions

Several component sets were converted to `standalone: true` and now import the specific Angular Material
modules they need instead of the monolithic `MaterialModule`: **About**, **Toolbar**, **Context Menu**, and
**Pagination**.

For normal consumers this is **non-breaking** — the corresponding NgModules (`AboutModule`, `ToolbarModule`,
`ContextMenuModule`, `PaginationModule`) are retained with unchanged exports, and import paths are unchanged.
The one thing to fix: if your own NgModule **declared** any of these ADF components (which was never
correct), you must now **import** them instead, since a standalone component cannot be declared.

Notes:

- `ContextMenuListComponent` is now publicly exported (and exported by `ContextMenuModule`) — additive.
- `AboutRepositoryInfoComponent` now uses `ViewEncapsulation.None`, so its styles are no longer encapsulated.

### Search provider changes

- `ContentNodeSelectorPanelComponent.queryBuilderService` changed from **public to private**, and the panel
  no longer provides `SearchQueryBuilderService` under the `SEARCH_QUERY_SERVICE_TOKEN` (it provides the class
  directly). Code reading `panel.queryBuilderService`, or injecting `SEARCH_QUERY_SERVICE_TOKEN` from the
  panel's injector scope, must inject `SearchQueryBuilderService` directly.
- `SearchQueryBuilderService`'s constructor gained a third, `@Optional()` parameter for the new
  `ADF_SEARCH_CONFIGURATION` token (see [New components and features](#new-components-and-features)) — DI usage
  is unaffected; only manual instantiation with a third positional argument is impacted.

### Form rendering and widget changes

- **`FormRendererComponent`** constructor gained a `FORM_FIELD_MODEL_RENDER_MIDDLEWARE` dependency (used by the
  new decimal-precision middleware). Relevant only if you instantiate it manually.
- **`DecimalWidgetComponent`** lost its public `displayValue` property and no longer implements `OnInit` — the
  precision rounding moved to a render middleware.
- **`FormFieldModel.validate()`** now also validates read-only fields whose type is "validatable" (currently the
  new display-external-property type), via a new `isFieldValidatable()`. Read-only fields of other types still skip validation.
- `FormCloudComponent.parseForm(json?)` signature changed — the argument is optional and the return type is now
  `FormModel | null` (returns `null` for empty form JSON). Adjust strict-typed callers.

### Data table column sizing

Column widths were reworked to be responsive again (they broke with the 6.7.x "resizable by default" change):

- The column style binding uses the `flex` shorthand; the datatable exposes `getFlexValue(col): string`
  returning `'0 1 <width>px'`. A new `.adf-datatable-cell-data` CSS class is applied to header and body cells,
  and the **last column** is intentionally left flexible (no fixed flex, no resize handle) so it absorbs remaining width.
- The header drag-icon placeholder element was removed — any test/selector using the automation id
  `adf-datatable-cell-header-drag-icon-placeholder-<key>` must be updated.

### Viewer changes

- `ViewerRenderComponent.cacheTypeForContent` default changed from `''` to `'no-cache'`.
- `AlfrescoViewerComponent` now refreshes the preview based on the node's **version** property rather than the
  file name; the image viewer's cropper now replaces on `urlFile` change (was `fileName`). Consumers relying on
  a name-only refresh should be aware of this.

## New components and features

- **Injectable search configuration** — a new `ADF_SEARCH_CONFIGURATION` injection token
  (`@alfresco/adf-content-services`) lets you provide a `SearchConfiguration` at runtime that takes priority
  over the `search` node of `app.config.json`:

  ```ts
  providers: [
      { provide: ADF_SEARCH_CONFIGURATION, useValue: { /* SearchConfiguration */ } }
  ]
  ```

- **Simple search input** — a new standalone `SearchInputComponent` (selector `adf-search-input`) formats user
  input into an AFTS query and emits it via `@Output() changed`. Inputs: `value`, `label`, `placeholder`,
  `fields` (default `['cm:name']`). It formats only; it does not run the search.
- **Category selector dialog** — a new `CategorySelectorDialogComponent` (`adf-category-selector-dialog`) with a
  `CategorySelectorDialogOptions { select: Subject<Category[]>; multiSelect?: boolean }`, opened via
  `MatDialog.open(...)`. `CategoriesManagementComponent` gained an `@Input() multiSelect` (default `true`).
- **Search exports and projection** — many previously-internal search symbols are now exported (e.g.
  `SearchFacetChipComponent`, `SearchWidgetChipComponent`, `SearchFilterTabDirective`, `FileSizeOperator`,
  `DateRangeType`, `SearchDateRange`, and more), and `SearchFilterChipsComponent` now supports content
  projection via `<ng-content>`.
- **Display external property widget** — a new cloud form widget `DisplayExternalPropertyWidgetComponent`
  (selector `adf-cloud-display-external-property`, new `FormFieldTypes.DISPLAY_EXTERNAL_PROPERTY = 'display-external-property'`), auto-registered by `CloudFormRenderingService`. `FormFieldModel` gained an
  optional `externalProperty?: string`.
- **Form field render middleware** — a new `FORM_FIELD_MODEL_RENDER_MIDDLEWARE` token and
  `FormFieldModelRenderMiddleware` interface let you transform fields at render time; `DecimalRenderMiddlewareService`
  uses it to round incoming `bigdecimal` values to the field's `precision`.
- **Constant field types** — `FormFieldTypes.CONSTANT_VALUE_TYPES` / `isConstantValueType()`; fields of these
  types keep their design-time value and are not overridden by process/form variables.
- **Form preview state** — `FormService.getPreviewState()` (returns `false` by default); in preview mode the
  attach-file widget now shows a warning instead of opening the file dialog.
- **OIDC-compliant logout** — new optional `oauth2` keys in `app.config.json`: `logoutUrl`,
  `logoutParameters` (e.g. `["client_id", "returnTo", "response_type"]`), and `audience` (forwarded as a custom
  query param, for Auth0-style providers). Absolute (`http`-prefixed) `redirectUri` values are now honored
  verbatim. New Docker env vars include `APP_CONFIG_OAUTH2_LOGOUT_URL`, `APP_CONFIG_OAUTH2_LOGOUT_PARAMETERS`,
  `APP_CONFIG_OAUTH2_AUDIENCE`, `APP_CONFIG_OAUTH2_CLIENT_SECRET`, `APP_CONFIG_OAUTH2_SCOPE`.
- **Custom-UI auth flow type** — the process-services-cloud `Descriptor` model gained an optional
  `customUIAuthFlowType?: DescriptorCustomUIAuthFlowType` (`CODE` | `IMPLICIT`).
- **Image zoom on wheel** — the image viewer now zooms with the mouse wheel.

## Behavioural changes

| Area             | Change                                                                                                                                                                                                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Forms — dates    | Date widgets display the same day regardless of timezone (`DateFnsUtils.forceLocal`/`forceUtc` reimplemented). The datetime picker now opens on Enter rather than on focus. A non-required datetime field with a `null` value no longer triggers spurious Min/Max validation. |
| Forms — decimal  | Incoming `bigdecimal` values are rounded to the field's configured `precision` at render time.                                                                                                                                                                                |
| Content metadata | The "no items" message shows only for editable groups when not editing; property-panel tabs no longer change background color on focus.                                                                                                                                       |
| Viewer           | The viewer reliably reloads after a version restore and the toolbar no longer disappears.                                                                                                                                                                                     |
| Version list     | Long version comments are truncated with an ellipsis and shown in full via a hover tooltip.                                                                                                                                                                                   |
| Tooltip card     | The `adf-tooltip-card` directive no longer throws when its overlay reference is undefined.                                                                                                                                                                                    |

---
Title: Upgrading from ADF v8.3.1 to v8.4.1
---

# Upgrading from ADF v8.3.1 to v8.4.1

This guide provides instructions on how to upgrade your v8.3.1 ADF projects to v8.4.1 (covering the 8.4.0 and
8.4.1 releases).

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. The steps
below may involve code changes — commit or back up your work first.

## Contents

- [Library updates](#library-updates)
- [Breaking changes](#breaking-changes)
  - [ngx-translate v17](#ngx-translate-v17)
  - [Tree actions template removed](#tree-actions-template-removed)
  - [Data table adapter focus API removed](#data-table-adapter-focus-api-removed)
  - [Form layout column-width methods](#form-layout-column-width-methods)
  - [Required-field validation is stricter](#required-field-validation-is-stricter)
  - [Rebranding (default logos)](#rebranding-default-logos)
  - [Other API changes](#other-api-changes)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "8.4.1",
        "@alfresco/adf-content-services": "8.4.1",
        "@alfresco/adf-process-services": "8.4.1",
        "@alfresco/adf-process-services-cloud": "8.4.1",
        "@alfresco/adf-insights": "8.4.1",
        "@alfresco/adf-extensions": "8.4.1",
        "@alfresco/js-api": ">=9.4.1",
        "@ngx-translate/core": ">=17.0.0"
    }
}
```

Angular/Material stay on 19.2 (patch bump to 19.2.20). Clean `node_modules` and `package-lock.json`, then `npm install`.

## Breaking changes

### ngx-translate v17

`@ngx-translate/core` was upgraded to **v17** (peer `>= 17.0.0`; this re-lands the upgrade that was reverted in
8.3.1). If you configure translation yourself, apply the v17 API migration:

```ts
// Before (v16)
provideTranslateService({
    loader: { provide: TranslateLoader, useClass: TranslateLoaderService, deps: [HttpClient] },
    defaultLanguage: 'en'
})

// After (v17)
provideTranslateService({
    loader: provideTranslateLoader(TranslateLoaderService),
    fallbackLang: 'en'
})
```

- `defaultLanguage` → **`fallbackLang`**; `TranslateService.setDefaultLang()` → **`setFallbackLang()`**.
- Use the new **`provideTranslateLoader(...)`** helper for the loader (the manual `{ provide, useClass, deps }`
  object is gone; `HttpClient` no longer needs wiring here).
- `translate.getTranslation(lang)` → `translate.currentLoader.getTranslation(lang)`.
- Push translations with `translate.setTranslation(lang, obj, true)` instead of emitting on `onTranslationChange`.
- Custom `TranslateLoader` implementations must satisfy the v17 interface (`getTranslation` returning
  `Observable<TranslationObject>`); new `Language` / `TranslationObject` types come from `@ngx-translate/core`.

`provideI18N(...)` still works (it now uses `provideTranslateLoader` / `fallbackLang` internally).

### Tree actions template removed

`TreeComponent` (`adf-tree`) renders its per-row actions menu internally now. The
**`@Input() nodeActionsMenuTemplate` was removed** — supply actions via the existing `contextMenuOptions` input
(`{ title, model: { icon }, subject }`) and handle `contextMenuOptionSelected` instead of projecting a template.

### Data table adapter focus API removed

`ShareDataTableAdapter.allowFocusOnRows` and `setAllowFocusOnTableRows()`, and the matching optional members on the
`DataTableAdapter` interface, were **removed** (they were added in 8.3.1). Custom adapter implementations or callers
referencing them must drop them.

### Form layout column-width methods

Form column-width computation was extracted to a shared helper. Two template-invoked component method signatures changed:

- `FormRendererComponent.getColumnWidth(container)` → `getColumnWidth(container, columns, columnIndex)`.
- `FormSectionComponent.getSectionColumnWidth(numberOfColumns, columnFields)` →
  `getSectionColumnWidth(numberOfColumns, columns, columnIndex)`.

Only matters if you subclass these or call the methods directly. The change fixes field `colspan` being ignored.

### Required-field validation is stricter

Required-field validation was tightened, which may newly block form submission that previously succeeded:

- A required field containing **only whitespace** now fails validation.
- A required **read-only** field with no value now fails validation (the internal
  `FormFieldModel.isFieldValidatable()` gate was removed, so validators run for read-only fields too — except when
  the field or its parent group/section is hidden).

The result: Start-process / Complete / Save buttons are correctly disabled in these cases (and Save/Complete are
re-enabled if the user declines the completion confirmation dialog).

### Rebranding (default logos)

The default Alfresco brand assets were replaced (this touches the libraries, not just the demo shell):

- `HeaderLayoutComponent` default logo: `./assets/images/logo.png` → `./assets/images/logo.svg` (`logo.png` deleted).
- `LoginComponent` `@Input() logoImageUrl` default: `./assets/images/alfresco-logo.svg` → `./assets/images/updated-alfresco-logo.svg`.
- New themeable `--theme-login-button-bg-color` CSS variable on the login button.

If you referenced the old default asset paths/filenames directly, update them.

### Other API changes

- `card-view-textitem` — the `[disabled]` bindings on the read-only/non-editable text input, textarea and chip
  inputs were **re-added** (reverting an 8.3.x removal), so those controls are natively `disabled` again when
  `isReadonlyProperty || !editable` (affects focusability/styling and tests asserting on `disabled`).
- `LogicalSearchCondition` (search) changed from an `interface` to a `type` alias — only affects code that
  `implements` it or relies on declaration merging.

## New components and features

- **`LazyApi` decorator** (`@alfresco/js-api`) — a property decorator for lazily-created, cached js-api client
  instances. Adopted internally across ~45 services (public property names unchanged); available for consumer use.
- **Expanded `adf-icon`** — the `IconDirective` now also resolves an icon when `name` is an alias **value** already
  present in the alias map (not only an alias key).
- **Start-process custom screens** — `StartProcessScreenCloudComponent` gained `appName` and
  `resolvedValues: TaskVariableCloud[]` signal inputs (plus `processDefinitionId`), propagated reactively to the
  dynamic screen; the `StartProcessScreenCloud` interface gained matching optional members, and
  `BaseScreenCloudComponent.setInputsForDynamicComponent()` is now a concrete no-op (no longer abstract).
- **`FormModel.showAllValidationErrors`** — a new boolean that forces all widgets into a touched state so every
  pending validation error renders; this is what the form-rule `Validate form` action now toggles.
- **Date/datetime typed input** — users can now **type** into date and datetime fields (not picker-only); typed
  input is preserved and an invalid value shows a `FORM.FIELD.VALIDATOR.INVALID_DATE_FORMAT` message
  ("Invalid date format, use the format: {{ format }}").
- **`ApplicationInstanceModel.deploymentCompletion?: number`** — new optional model field.
- **Permission list** — `PermissionDisplayModel.authorityDisplayName?` was added; the user-name column now shows a
  human-readable authority display name when the backend provides one.
- New CSS hook class `adf-dropdown-widget-container` on the cloud dropdown widget wrapper.

## Behavioural changes

| Area | Change |
| ---- | ------ |
| Forms — rich text | `${field.x}` / `${variable.x}` expressions are now evaluated inside rich-text-display **list** items (HTML-escaped). |
| Forms — visibility | Visibility conditions now re-run when a dependent field's value is changed by a form rule (not only by direct edit). |
| Forms — errors | Form error styling/colour was unified (uses the Material system error token; existing `adf-error*` classes unchanged); minor field-spacing fixes. |
| Search | The tag autocomplete facet now searches tags server-side per keystroke (via `TagService.searchTags`, sorted, capped at 15) instead of preloading all tags. |
| Dates | `TimeAgoPipe` now formats dates older than 7 days using the locale-aware `'short'` format (its `DEFAULT_DATE_TIME_FORMAT` default changed from `dd/MM/yyyy HH:mm` to `'short'`) — set `dateValues.defaultDateTimeFormat` in app config to keep the old fixed format. |
| Viewer | Previewing preview renditions for document versions now works (a rendition-id/mime-type mix-up was fixed). |
| Accessibility | Repository-info titles are now `<h2>` headings (new `adf-about-repository-info-header-*` automation ids); the filter-by-size popup uses `<fieldset>`/`<legend>` (dropped `role="menuitem"`/`role="button"`); unnecessary Tab stops were removed from the results table; new `ADF-DATATABLE.ACCESSIBILITY.*` keys added. |

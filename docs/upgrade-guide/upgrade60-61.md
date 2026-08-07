---
Title: Upgrading from ADF v6.0 to v6.1
---

# Upgrading from ADF v6.0 to v6.1

This guide provides instructions on how to upgrade your v6.0.0 ADF projects to v6.1.0.

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup.

Do not skip this task if you want your application to be updated to the most recent version of ADF.
Upgrades of multiple versions of ADF cannot be done in one step only, but should follow the chain of sequential updates.

After the upgrade, check the other sections below to see if there are any changes affecting your project.

## Contents

- [Library updates](#library-updates)
- [Breaking changes](#breaking-changes)
  - [Angular Flex-Layout removed](#angular-flex-layout-removed)
  - [`@mat-datetimepicker` peer dependency major bump](#mat-datetimepicker-peer-dependency-major-bump)
  - [`@alfresco/js-api` and ADF peers use a caret range](#alfrescojs-api-and-adf-peers-use-a-caret-range)
- [Third-party libraries](#third-party-libraries)
- [New components and features](#new-components-and-features)
  - [Display Rich Text form widget (cloud)](#display-rich-text-form-widget-cloud)
  - [Configurable header text color](#configurable-header-text-color)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "6.1.0",
        "@alfresco/adf-content-services": "6.1.0",
        "@alfresco/adf-process-services": "6.1.0",
        "@alfresco/adf-process-services-cloud": "6.1.0",
        "@alfresco/adf-insights": "6.1.0",
        "@alfresco/adf-extensions": "6.1.0",
        "@alfresco/js-api": ">=6.1.0"
    }
}
```

Clean your old distribution and dependencies by deleting `node_modules` and `package-lock.json`.

Reinstall your dependencies

```sh
npm install
```

**Note:** the ADF libraries now depend on `@alfresco/js-api` (and on each other) through a `^6.1.0` caret range,
where `6.0.0` used an exact pin. Make sure your application resolves a JS-API build of `6.1.0` or later.

**Tooling note:** the repository's pinned Node version (`.nvmrc`) moved from **14** to **18**, so the libraries are
now built and tested on Node 18. Align your build/CI Node version accordingly.

## Breaking changes

The ADF project follows the [semver](https://semver.org/) conventions. `6.1.0` is a minor release, so there are
no removed or renamed public exports; the items below are dependency-level changes that can still affect your build.

### Angular Flex-Layout removed

`@angular/flex-layout` (`^14.0.0-beta.40`) has been **removed** as a dependency from every ADF library
(`@alfresco/adf-core`, `@alfresco/adf-content-services`, `@alfresco/adf-process-services`,
`@alfresco/adf-process-services-cloud` and `@alfresco/adf-insights`). All internal usage of `fxLayout`,
`fxFlex`, `fxHide` and `FlexLayoutModule` was removed from the component templates and modules.

ADF no longer re-exports `FlexLayoutModule`, and it was never part of the public API barrels, so this does not
break any ADF import. However, if your own application relied on ADF transitively installing
`@angular/flex-layout` and you use flex-layout directives in your **own** templates, add the dependency to your
application directly:

```sh
npm install @angular/flex-layout@^14.0.0-beta.40
```

### `@mat-datetimepicker` peer dependency major bump

`@alfresco/adf-core` bumped its `@mat-datetimepicker` peer dependencies by a major version:

| Peer dependency              | Before    | After     |
| ---------------------------- | --------- | --------- |
| `@mat-datetimepicker/core`   | `^9.0.68` | `^10.1.1` |
| `@mat-datetimepicker/moment` | `^9.0.68` | `^10.1.1` |

If your application pins these packages, update them to the `^10.1.1` range so your installed version matches
the one ADF is built against.

### `@alfresco/js-api` and ADF peers use a caret range

The peer dependencies inside the ADF libraries changed from exact pins (`6.0.0`) to caret ranges (`^6.1.0`). This
applies to `@alfresco/js-api` and to the inter-library ADF peers (for example `@alfresco/adf-core` and
`@alfresco/adf-extensions`). Ensure your lockfile resolves compatible `6.x` builds; a stale exact pin of
`@alfresco/js-api@6.0.0` should be updated to `>=6.1.0`.

## Third-party libraries

| Name                         | Version   | Notes                                                                                                        |
| ---------------------------- | --------- | ------------------------------------------------------------------------------------------------------------ |
| `@angular/flex-layout`       | removed   | No longer a dependency of any ADF library (see [Angular Flex-Layout removed](#angular-flex-layout-removed)). |
| `@mat-datetimepicker/core`   | `^10.1.1` | Major bump from `^9.0.68` (peer of `@alfresco/adf-core`).                                                    |
| `@mat-datetimepicker/moment` | `^10.1.1` | Major bump from `^9.0.68` (peer of `@alfresco/adf-core`).                                                    |

## New components and features

### Display Rich Text form widget (cloud)

A new form widget, `DisplayRichTextWidgetComponent` (selector `display-rich-text`), is now declared and exported
by `FormCloudModule` in `@alfresco/adf-process-services-cloud`. Previously the widget class existed but was not
wired into the module, so it could not be used. It renders read-only rich-text content within a cloud form.

### Configurable header text color

`[HeaderLayoutComponent](../core/components/header.component.md)` (selector `adf-layout-header`) now reads a new
`headerTextColor` key from `app.config.json` and, when present, applies it to the
`--theme-header-text-color` CSS custom property (which defaults to the primary palette's contrast color).

```json
{
    "headerTextColor": "#ffffff"
}
```

## Behavioural changes

| Area                                                                     | Change                                                                                                                                                                            |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Tree component](../content-services/components/tree.component.md)       | Pagination is now emitted only when the top-level entries change, and an expand/collapse regression was fixed.                                                                    |
| Form save button (cloud)                                                 | On clicking the system **save** outcome the save button is now disabled, and it is re-enabled when a form field value changes.                                                    |
| Task / process lists (cloud)                                             | Changing only column visibility no longer triggers a reload of the task or process list.                                                                                          |
| Task lists (cloud)                                                       | The loading spinner no longer disappears before the list has finished loading.                                                                                                    |
| Task details (cloud)                                                     | The loading spinner alignment after opening task details was corrected.                                                                                                           |
| [Tags creator](../content-services/components/tags-creator.component.md) | The "required field" message is no longer shown after discarding changes; the first tag position and an extra scrollbar (shown while the spinner is visible) were also corrected. |
| [Image viewer](../core/components/viewer.component.md)                   | Navigation between images was fixed, and image display in full-screen mode was corrected.                                                                                         |
| User roles fetch                                                         | `UserAccessService` now appends an `appkey` query parameter (read from the `application.key` app-config value) when fetching identity roles, if that value is configured.         |
| Search facets                                                            | Facet, filter and widget chips had markup/icon adjustments in the facets section.                                                                                                 |
| [Card view select item](../core/components/card-view.component.md)       | The select input's position in the edit template was changed.                                                                                                                     |
| Start process / task outcomes                                            | Outcome button positioning in the start-process form and the attach-file button style were corrected.                                                                             |
| Group cloud                                                              | The identity group validation error message was replaced with a shorter version.                                                                                                  |
| Theme                                                                    | A task-filter color was changed to use the accent-contrast color.                                                                                                                 |

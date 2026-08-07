## Title: Upgrading from ADF v6.2 to v6.3

# Upgrading from ADF v6.2 to v6.3

This guide provides instructions on how to upgrade your v6.2.0 ADF projects to v6.3.0.

---

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup.

Do not skip this task if you want your application to be updated to the most recent version of ADF.
Upgrades of multiple versions of ADF cannot be done in one step only, but should follow the chain of sequential updates.

After the upgrade, check the other sections below to see if there are any changes affecting your project.

## Contents

- [Library updates](#library-updates)
- [Breaking changes](#breaking-changes)
  - [JS-API v7 and type migrations](#js-api-v7-and-type-migrations)
  - [Third-party libraries](#third-party-libraries)
  - [HTTP client and auth](#http-client-and-auth)
  - [Breadcrumbs moved to a secondary entry point](#breadcrumbs-moved-to-a-secondary-entry-point)
  - [Search API changes](#search-api-changes)
  - [Comments component](#comments-component)
  - [Removed and hidden items](#removed-and-hidden-items)
  - [CSRF default changed](#csrf-default-changed)
  - [Role-based authorization](#role-based-authorization)
  - [Other breaking changes](#other-breaking-changes)
- [Deprecated items](#deprecated-items)
- [New components and features](#new-components-and-features)
  - [Advanced search](#advanced-search)
  - [Core breadcrumbs](#core-breadcrumbs)
  - [Data Table form widget](#data-table-form-widget)
  - [Content metadata](#content-metadata)
  - [Other additions](#other-additions)
- [Behavioural changes](#behavioural-changes)
- [Theme changes](#theme-changes)



## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "6.3.0",
        "@alfresco/adf-content-services": "6.3.0",
        "@alfresco/adf-process-services": "6.3.0",
        "@alfresco/adf-process-services-cloud": "6.3.0",
        "@alfresco/adf-insights": "6.3.0",
        "@alfresco/adf-extensions": "6.3.0",
        "@alfresco/js-api": ">=7.0.0"
    }
}
```

**Important:** ADF 6.3.0 requires `@alfresco/js-api` **v7 or later** (`>=7.0.0`). This is the biggest
single change to take into account — see [JS-API v7 and type migrations](#js-api-v7-and-type-migrations).

The advanced date-range search and several date pickers now use `date-fns`. Make sure the new
peer dependency `@angular/material-date-fns-adapter` is installed.

Clean your old distribution and dependencies by deleting `node_modules` and `package-lock.json`, then reinstall:

```sh
npm install
```



## Breaking changes



### JS-API v7 and type migrations

ADF now consumes the strongly-typed models from `@alfresco/js-api` v7 directly instead of its own
handwritten wrappers. Update your type references accordingly.


| Before (ADF wrapper / old type) | After (`@alfresco/js-api` type) |
| ------------------------------- | ------------------------------- |
| `MinimalNode`                   | `Node`                          |
| `MinimalNodeEntryEntity`        | `Node`                          |
| `AssocChildBody`                | `ChildAssociationBody`          |
| `QueryBody`                     | `SearchRequest`                 |
| `SiteBody`                      | `SiteBodyCreate`                |
| `FavoriteBody`                  | `FavoriteBodyCreate`            |


The wrapper model file `document-library.model.ts` was **removed** from `@alfresco/adf-content-services`.
The following exports are no longer available from ADF — import the equivalents from `@alfresco/js-api`:
`NodePaging`, `NodePagingList`, `NodeMinimalEntry`, `NodeMinimal`, `Pagination`, `UserInfo`,
`ContentInfo`, `PathInfoEntity` (→ `PathInfo`), `PathElementEntity` (→ `PathElement`), `NodeProperties`.

Public service signatures changed as a result — for example:

```ts
// NodesApiService — before
getNode(nodeId: string, options?: any): Observable<MinimalNode>
// after
getNode(nodeId: string, options?: any): Observable<Node>
```

- `[ContentService](../core/services/content.service.md)`: `folderCreate` / `folderEdit` are now `Subject<Node>`.
- `[SearchService](../core/services/search.service.md)`: `searchByQueryBody(queryBody: SearchRequest)`.
- `BaseQueryBuilderService` (base of `[SearchQueryBuilderService](../content-services/services/search-query-builder.service.md)`): `updated` is now `Subject<SearchRequest>`; `update`, `execute`, `search`, `buildQuery` all use `SearchRequest`.
- `SearchConfigurationInterface.generateQueryBody(...)` now returns `SearchRequest`. Note `SearchRequest` is a **class** (`new SearchRequest({...})`), whereas `QueryBody` was a plain interface — object literals still assign structurally.
- `User` from `@alfresco/js-api` is now a **class** rather than a type alias.



### Third-party libraries

To support Angular 14+, several dependencies were upgraded (major bumps with their own breaking changes):


| Package                              | Before    | After                                        |
| ------------------------------------ | --------- | -------------------------------------------- |
| `@alfresco/js-api`                   | `>=6.2.0` | `>=7.0.0`                                    |
| `chart.js`                           | `2.9.4`   | `^4.3.0`                                     |
| `ng2-charts`                         | `2.4.2`   | `^4.1.1`                                     |
| `ngx-monaco-editor`                  | `8.1.1`   | replaced by `ngx-monaco-editor-v2` `^14.0.4` |
| `@angular/material-date-fns-adapter` | —         | new dependency                               |


If you use the Insights charts, migrate to the `ng2-charts` v4 / `chart.js` v4 API (tree-shakeable
registration, new chart config). If you use the Monaco editor, switch the import from
`ngx-monaco-editor` to `ngx-monaco-editor-v2`.

### HTTP client and auth

- The Alfresco API HTTP client was replaced by an Angular `HttpClient`-based `AdfHttpClient`
(the old `alfresco-api.http-client` identifier is gone). Update any references to `AdfHttpClient`.
- HTTP-client and auth configuration moved out of `CoreModule` into `AuthModule`. Make sure your
application imports `AuthModule` so the API client and auth config are provided.
- Read the username/token from `[AuthenticationService](../core/services/authentication.service.md)`
rather than from `AlfrescoApi`'s `oauth2Auth`.
- **`NullInjectorError: No provider for RedirectAuthService!`** — because auth moved into `AuthModule`, importing
`CoreModule` alone no longer provides the OIDC `RedirectAuthService`. Import `AuthModule.forRoot()` in your root
module (use `AuthModule.forRoot({ useHash: true })` for hash-based routing) to resolve the error.



### Breadcrumbs moved to a secondary entry point

The new breadcrumb components ship from a dedicated secondary entry point rather than the root barrel:

```ts
// Components
import { BreadcrumbComponent, BreadcrumbItemComponent } from '@alfresco/adf-core/breadcrumbs';
```

```scss
// Theme
@use '@alfresco/adf-core/breadcrumbs' as breadcrumbs;
```

They are **not** exported from the root `@alfresco/adf-core`, and their theme is no longer part of the
core styles index — add the imports above where needed.

### Search API changes

- `SearchChipInputComponent` **was removed.** Remove any imports/usages (the logical filter no longer uses it).
- `disableUpdateOnSubmit` was removed from search widget settings — delete it from your `search.config`.
- `[SearchLogicalFilterComponent](../content-services/components/search-logical-filter.component.md)` changed its value model. The per-field condition type went from `string[]` to a single space-separated `string`, and a new `MATCH_EXACT = 'matchExact'` field was added:
  ```ts
  // LogicalSearchCondition — before: { matchAll: string[]; matchAny: string[]; exclude: string[] }
  // after:                            { matchAll: string; matchAny: string; matchExact: string; exclude: string }
  ```
- `SearchChipAutocompleteInputComponent` and `SearchFilterAutocompleteChipsComponent` now use an
`AutocompleteOption` object model instead of plain strings. If you configured these with `string[]`
options, migrate to `AutocompleteOption[]` (`{ value: string; id?: string; fullPath?: string }`),
and note the new optional `SearchWidgetSettings.autocompleteOptions` field.



### Comments component

The comments components (`[adf-comments](../core/components/comments.component.md)` and
`adf-comment-list`) were cleaned up, with several consumer-facing consequences:

- **The** `interfaces` **barrel was removed.** Import `CommentsService` / the comments token from their
specific files (or the top-level `public-api`) instead of `.../comments/interfaces`.
- **Comment text is no longer sanitised as HTML** — the message is rendered as plain text
(`white-space: pre-line`), not via `[innerHTML]`. Any HTML in a comment now shows as literal text.
- **Comment data must be** `CommentModel` **instances.** Display logic moved into new `CommentModel`
getters (`hasAvatarPicture`, `userDisplayName`, `userInitials`); plain object literals cast as
`CommentModel` will no longer render correctly. Build them with `new CommentModel({...})`.
- `CommentListComponent` removed the public members `selectedComment`, `currentLocale`, and the
methods `getUserShortName()` and `isPictureDefined()`; selection side-effects and the
`.adf-is-selected` styling were dropped (the component just emits `clickRow`).
- Several template element IDs (`adf-comment-{id}`, `comment-user-*`, `comment-message-*`, …) were
removed — update any CSS/E2E selectors that relied on them.



### Removed and hidden items


| Item                                                           | Package                                                | Notes                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SearchChipInputComponent`                                     | `@alfresco/adf-content-services`                       | Removed (see [Search API changes](#search-api-changes)).                                                                                                                                                                                                        |
| `document-library.model` exports                               | `@alfresco/adf-content-services`                       | Removed; use `@alfresco/js-api` types.                                                                                                                                                                                                                          |
| `AlfrescoApiCompatibility` usage                               | `@alfresco/adf-process-services`                       | `ExternalAlfrescoApiService` now extends `[AlfrescoApiService](../core/services/alfresco-api.service.md)` and uses `AlfrescoApi` (v7). Migrate any code typed against `AlfrescoApiCompatibility`.                                                               |
| Several `DocumentListComponent` / `DataTableComponent` methods | `@alfresco/adf-content-services`, `@alfresco/adf-core` | Made `private` (`updateCustomSourceData`, `setupDefaultColumns`, `preserveExistingSelection`, `isSingleSelectionMode`, `isMultipleSelectionMode`, `hasPreselectedNodes`, `hasPreselectedRows`, `hasCustomLayout`). `resetNewFolderPagination()` remains public. |
| `CallApiParams` (interface)                                    | `@alfresco/adf-process-services-cloud`                 | Removed from the `BaseCloudService` public surface — it now uses `RequestOptions` from `@alfresco/js-api`. Only affects code that imported `CallApiParams` directly.                                                                                            |




### CSRF default changed

The default for the `disableCSRF` app-config key changed to `true`. When the key is **absent**
from `app.config.json`, CSRF handling is now disabled by default. If your backend requires the ADF
CSRF token, set it explicitly:

```json
{
    "disableCSRF": false
}
```



### Role-based authorization

Roles are now resolved from the JWT access token instead of the remote `identity-adapter-service`
roles endpoint (a new `hxp_authorization` claim is supported alongside `realm_access`). As a result:

- `UserAccessService.fetchUserAccess()` is now **synchronous** (returns `void`, was `Promise`).
- `UserAccessService.resetAccess()` was **removed**, and its constructor no longer injects `OAuth2Service`.
- `AuthGuardSsoRoleService.canActivate()` is now **synchronous** (returns `boolean`, was `Promise<boolean>`).



### Other breaking changes

- **Bearer-excluded URL matching** is now anchored to the host + first path segment
(`^https?://[^/]+/<pattern>`) instead of matching anywhere in the URL. Review any custom
`bearerExcludedUrls` patterns that relied on substring matching.
- **DataTable multiselect checkbox** wrapper changed from a `<div>` to a `<label>` (same classes),
and row padding moved onto the first/last cells. Update CSS/E2E selectors targeting
`div.adf-datatable-checkbox` or the old `.adf-datatable-row` padding.
- The header user-info container's default right margin changed from `16px` to `8px`.
- Date pickers/filters that used `moment.Moment` values now use native `Date`
(see [Behavioural changes](#behavioural-changes)).



## Deprecated items

The following components are deprecated (still functional, but slated for removal). Their exact
`@deprecated` notes:


| Component                                                                     | Selector            | Note                                                                                                         |
| ----------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------ |
| `[WebscriptComponent](../content-services/components/webscript.component.md)` | `adf-webscript-get` | "Webscript component has never been turned into a product and has no UI/UX and no use cases in ACA/ADW/ACC." |
| `[LikeComponent](../content-services/components/like.component.md)`           | `adf-like`          | "Like component is not used in ACA/ADW/ACC, can be removed."                                                 |
| `[RatingComponent](../content-services/components/rating.component.md)`       | `adf-rating`        | "Rating component is not used in ACA/ADW/ACC, can be removed."                                               |




The NgModules that bundle those components are also now `@deprecated` (`@alfresco/adf-content-services`):
**`SocialModule`** (bundles the Like/Rating components) and **`WebScriptModule`** (bundles the Webscript
component). Stop importing them.

## New components and features



### Advanced search

Several new advanced-search building blocks were added in `@alfresco/adf-content-services`, along with
two new widget selector types (`date-range-advanced`, `properties`):


| Component                                                                                                                                                                                       | Selector                                               | Description                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------- |
| `[SearchDateRangeAdvancedComponent](../../lib/content-services/src/lib/search/components/search-date-range-advanced-tabbed/search-date-range-advanced/search-date-range-advanced.component.ts)` | `adf-search-date-range-advanced`                       | Date-range form with "Any / In the last / Between" modes (date-fns based).  |
| `SearchDateRangeAdvancedTabbedComponent`                                                                                                                                                        | `adf-search-date-range-advanced-tabbed`                | Search widget (`date-range-advanced`) wrapping the date-range form in tabs. |
| `[SearchFilterTabbedComponent](../../lib/content-services/src/lib/search/components/search-filter-tabbed/search-filter-tabbed.component.ts)` (+ `SearchFilterTabDirective`)                     | `adf-search-filter-tabbed` / `[adf-search-filter-tab]` | Tabbed layout for grouping filter content.                                  |
| `SearchFacetChipTabbedComponent`                                                                                                                                                                | `adf-search-facet-chip-tabbed`                         | Facet chip grouping two facet fields (e.g. creator + modifier) into tabs.   |
| `SearchPropertiesComponent`                                                                                                                                                                     | `adf-search-properties`                                | Search widget (`properties`) to filter by file size and file type.          |


`BaseQueryBuilderService` is now a public export. See the search configuration docs for how to wire
the new widget selectors into your `search.config`.

### Core breadcrumbs

A new breadcrumb component set is available from the `@alfresco/adf-core/breadcrumbs` secondary entry
point (see [Breadcrumbs moved to a secondary entry point](#breadcrumbs-moved-to-a-secondary-entry-point)).


| Component                 | Selector              | Description                                                                                                                                        |
| ------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BreadcrumbComponent`     | `adf-breadcrumb`      | Standalone breadcrumb with `@Input() compact` and `@Output() compactChange`; collapses to first + last item with an overflow menu in compact mode. |
| `BreadcrumbItemComponent` | `adf-breadcrumb-item` | Content-projected breadcrumb item.                                                                                                                 |




### Data Table form widget

A new **Data Table** cloud form widget renders tabular data inside a form, backed by process/form
variables or a direct JSON value.

- New `FormFieldTypes.DATA_TABLE = 'data-table'` and `FormFieldModel.schemaDefinition: DataColumn[]` in `@alfresco/adf-core`.
- New `DataTableWidgetComponent` (selector `data-table`) and `WidgetDataTableAdapter` in `@alfresco/adf-process-services-cloud`, auto-registered by `CloudFormRenderingService`.
- The `VariableConfig` interface is now exported from `@alfresco/adf-core` (`{ variableName; optionsPath?; optionsId?; optionsLabel? }`), and form-field `optionType` gained a `'variable'` value so dropdowns can resolve their options from a process/form variable.



### Content metadata

`[ContentMetadataCardComponent](../content-services/components/content-metadata-card.component.md)` gained new configuration:


| Member                       | Type                    | Default | Description                                                                       |
| ---------------------------- | ----------------------- | ------- | --------------------------------------------------------------------------------- |
| `@Input() editable`          | `boolean`               | `false` | Toggles editable state of the content metadata (supports two-way `[(editable)]`). |
| `@Output() editableChange`   | `EventEmitter<boolean>` | —       | Emitted when the editable state changes.                                          |
| `@Input() displayTags`       | `boolean`               | `true`  | Show tags in the card.                                                            |
| `@Input() displayCategories` | `boolean`               | `true`  | Show categories in the card.                                                      |




### Other additions

- **CardView chip labels** — `[CardViewComponent](../core/components/card-view.component.md)`,
`CardViewItemDispatcherComponent` and `CardViewTextItemComponent` gained
`@Input() displayLabelForChips: boolean = false` to render a header label above multivalued chip properties.
- **About panel automation id** — `AboutPanelDirective` gained `@Input() automationId: string`, rendered as `data-automation-id`.
- `provideTranslations(id, path)` — a convenience provider factory exported from `@alfresco/adf-core`, replacing the verbose `TRANSLATION_PROVIDER` literal (the old form still works).
- `ALFRESCO_API_FACTORY` — a new injection token (with `AlfrescoApiFactory` interface) lets applications supply a custom `AlfrescoApi` implementation, e.g. to invalidate the session on HTTP 401.
- New additive `adfDateTime` pipe (`DateTimePipe`) in `@alfresco/adf-core`.



## Behavioural changes


| Area          | Change                                                                                                                                                                                                                                                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date handling | Several pipes/components migrated from `moment` to `date-fns`: `TimeAgoPipe`, process-name pipes, `LockService`, `DateRangeFilterComponent`/service, `StartTaskCloudComponent`, `TaskListComponent`. Date-picker/filter values are now native `Date` objects instead of `moment.Moment`. (moment is still a dependency for other code.) |
| DataTable     | Whole checkbox cell is clickable; in single-selection mode clicking a selected row now **unselects** it and emits `row-unselect`; actions menus open on `Enter`; sorting matches on `sortingKey`; the header row is retained when a filter is active with no results.                                                                   |
| Version list  | The restore action is disabled for the latest version of a file.                                                                                                                                                                                                                                                                        |
| People        | `PeopleContentService.getPerson(id)` no longer overwrites the cached current user (that side-effect moved to `getCurrentUserInfo()`).                                                                                                                                                                                                   |
| Viewers       | Viewer form widgets accept a single file object (not just arrays) and no longer show a file after it was removed.                                                                                                                                                                                                                       |
| Notifications | The "mark all as read" control is now an icon button (`done_all`).                                                                                                                                                                                                                                                                      |
| Security      | Input sanitisation hardened: search highlight uses safer tag stripping, comment text is HTML-escaped, the login component guards against prototype pollution (`__proto__`/`constructor`/`prototype`), and user initials are built via the DOM to escape user names.                                                                     |




## Theme changes

The Identity User Info avatar styles are now themeable via CSS custom properties:


| Property                                 | Default                                |
| ---------------------------------------- | -------------------------------------- |
| `--adf-identity-user-info-background`    | `var(--adf-theme-primary-300)`         |
| `--adf-identity-user-info-height`        | `40px`                                 |
| `--adf-identity-user-info-width`         | `40px`                                 |
| `--adf-identity-user-info-line-height`   | `40px`                                 |
| `--adf-identity-user-info-font-size`     | `var(--theme-adf-picture-1-font-size)` |
| `--adf-user-info-container-margin-right` | `8px`                                  |

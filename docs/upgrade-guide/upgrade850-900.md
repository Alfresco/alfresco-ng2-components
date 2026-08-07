---
Title: Upgrading from ADF v8.5 to v9.0
---

# Upgrading from ADF v8.5 to v9.0

This guide provides instructions on how to upgrade your v8.5.0 ADF projects to v9.0.0.

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. Because this
release bumps the Angular major, budget time to run the Angular 20 `ng update` migrations on your own app,
rebuild, and re-test. Expect to install with `--legacy-peer-deps` (see below).

## Contents

- [Library updates](#library-updates)
- [Breaking changes](#breaking-changes)
  - [Angular 20 / TypeScript 5.9](#angular-20--typescript-59)
  - [Knowledge Discovery removed](#knowledge-discovery-removed)
  - [`MaterialModule` removed](#materialmodule-removed)
  - [Search query-builder refactor](#search-query-builder-refactor)
  - [Extension auth guards are now typed](#extension-auth-guards-are-now-typed)
  - [Process instance model — subprocess/linked-process fields](#process-instance-model--subprocesslinked-process-fields)
  - [Task cloud — Runtime Bundle task fetch](#task-cloud--runtime-bundle-task-fetch)
  - [Multiline text widget base class](#multiline-text-widget-base-class)
  - [Text field default max length](#text-field-default-max-length)
  - [Tree and chip DOM / accessibility changes](#tree-and-chip-dom--accessibility-changes)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "9.0.0",
        "@alfresco/adf-content-services": "9.0.0",
        "@alfresco/adf-process-services": "9.0.0",
        "@alfresco/adf-process-services-cloud": "9.0.0",
        "@alfresco/adf-insights": "9.0.0",
        "@alfresco/adf-extensions": "9.0.0",
        "@alfresco/js-api": ">=10.0.0",
        "@ngx-translate/core": ">=17.0.0"
    }
}
```

Bump your Angular platform to **20.x** in lockstep (`@angular/core`/`@angular/material`/`@angular/cdk` `20.x`,
`typescript` `5.9`). Clean `node_modules` and `package-lock.json`, then `npm install`.

## Breaking changes

### Angular 20 / TypeScript 5.9

ADF 9.0.0 is built against **Angular 20** and **must be consumed by an Angular 20 app** — there is no cross-version
support with Angular 19.

| Package | v8.5.0 | v9.0.0 |
| ------- | ------ | ------ |
| `@angular/core`, `@angular/common`, … | 19.2.x | **20.3.x** |
| `@angular/material`, `@angular/cdk` | 19.2.x | **20.2.x** |
| `@angular/material-date-fns-adapter` | 19.2.x | **20.2.x** |
| `typescript` | 5.8.3 | **5.9.3** |
| `ng-packagr` | 19.2.x | **20.3.x** |
| `@angular-eslint/*` | 19.3.0 | **20.7.0** |
| `@typescript-eslint/*` | 6.x | **8.x** |
| `zone.js` | 0.15.0 | 0.15.0 (unchanged) |
| `rxjs` | 7.8.2 | 7.8.2 (unchanged) |
| `nx` | 22.x | 22.x (unchanged) |

- **Run the Angular 20 update on your own app** (`ng update @angular/core@20 @angular/cdk@20 @angular/material@20`)
  and move to **TypeScript 5.9**. Follow the official
  [Angular update guide](https://angular.dev/update-guide).
- **Expect `npm install --legacy-peer-deps`.** A transitive dependency (`@mat-datetimepicker/core`) still declares
  an Angular-19 CDK peer range while ADF ships CDK 20, so npm reports a peer conflict without the flag.
- **ESLint:** `@typescript-eslint/brace-style` was removed in `@typescript-eslint` v8 — drop it from any shared
  config that inherited it from ADF. Angular 20 also newly recommends `@angular-eslint/prefer-inject`
  (constructor injection → `inject()`); this surfaces as warnings only.
- **CDK `PortalInjector` removed** — Angular CDK 20 removed `PortalInjector`. ADF replaced its internal usage with
  `Injector.create()`; if your own code imported `PortalInjector` from `@angular/cdk/portal`, make the same swap.

### Knowledge Discovery removed

The **Knowledge Discovery / Search-AI / Knowledge Retrieval** feature (the HxI-connector agent-based AI query
feature originally added in 7.0.0) was **removed entirely** from both `@alfresco/adf-content-services` and
`@alfresco/js-api`. There is **no replacement** — remove all usages.

Removed from **`@alfresco/adf-content-services`** (the `agent`, `search-ai` and `prediction` barrels were deleted):

| Removed | Kind |
| ------- | ---- |
| `AgentService` | Service |
| `SearchAiService` | Service |
| `SearchAiInputState` | Interface |
| `PredictionService` | Service |

Removed from **`@alfresco/js-api`**:

- **content-rest-api:** `AgentsApi`, `SearchAiApi`; models `Agent`, `AgentEntry`, `AgentPaging`, `AgentPagingList`,
  `AiAnswer`, `AiAnswerEntry`, `AiAnswerReference`, `AiAnswerObjectReference`, `KnowledgeRetrievalConfig`,
  `KnowledgeRetrievalConfigEntry`, `QuestionModel`, `QuestionRequest`, `RestrictionQuery`.
- **hxi-connector-api (entire secondary API removed):** `PredictionsApi`, `Prediction`, `PredictionEntry`,
  `PredictionPaging`, `PredictionPagingList`, and the `UpdateType` / `ReviewStatus` types.
- **`AlfrescoApi.hxiConnectorClient`** — the client property (and its config/auth wiring) was removed from
  `AlfrescoApi` / `AlfrescoApiType`.

### `MaterialModule` removed

The deprecated **`MaterialModule`** re-export barrel was removed from **both `@alfresco/adf-core` and
`@alfresco/adf-content-services`**, and is no longer re-exported by `CoreModule` / `ContentModule`.

Import the specific `@angular/material/*` modules you actually use directly from Angular Material:

```ts
// Before
import { MaterialModule } from '@alfresco/adf-core'; // (or from @alfresco/adf-content-services)

// After — import only what you use, from Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// …etc
```

Apps that were transitively relying on Material modules via ADF's module exports must now import each Material
module explicitly.

### Search query-builder refactor

`BaseQueryBuilderService` (the base of `SearchQueryBuilderService` and `SearchHeaderQueryBuilderService`) was
refactored to parse the user query on demand and to support two query modes. This removes the old
"emit `updated` → subscriber calls `execute()`" indirection:

- **The `updated` `Subject<SearchRequest>` was removed.** Code subscribing to `queryBuilder.updated` must instead
  react to `queryBuilder.execute()` results (`executed` / the returned `SearchRequest`).
- **The `update(queryBody?)` method was removed.** Call **`execute()`** directly.

```ts
// Before
this.queryBuilder.updated.subscribe((query) => { /* … */ });
this.queryBuilder.update();

// After
this.queryBuilder.execute(); // executes and emits results directly
```

- **The `userQuery` setter no longer trims and parenthesizes.** Previously `userQuery = 'foo'` stored `'(foo)'`;
  now it stores the raw value `'foo'` and derives the compiled query via the new read-only **`parsedQuery`**
  getter. Read `parsedQuery` where you previously read the wrapped `userQuery`.
- **New `searchMode: 'regular' | 'formula'`** (default `'regular'`). In `regular` mode a user term is expanded
  across the configured fields (`search.app:fields`, default `["cm:name"]`); in `formula` mode the raw input is
  used verbatim as an AFTS expression.
- **New read-only `wildcardsEnabled`** — driven by the new `search-wildcards-enabled` app-config flag (default
  `true`). When `false`, terms match exactly (no trailing `*`) and the search-text widget's
  `searchPrefix`/`searchSuffix` are not applied.
- `updateSelectedConfiguration(id)` gained two optional params — `updateSelectedConfiguration(id, resetFilters = true, shouldExecute = true)` — non-breaking for existing single-argument callers.
- `SearchTextComponent.enableChangeUpdate` now defaults to **`false`** (was `true`).

`execute(updateQueryParams = true, queryBody?)` keeps the same signature as in 8.5.0.

### Extension auth guards are now typed

`ExtensionService.authGuards` and the `setAuthGuards()` / `getAuthGuards()` signatures were narrowed from
`Record<string, unknown>` / `Array<unknown>` to **`Record<string, CanActivateFn>`** / **`Array<CanActivateFn>`**
(`@angular/router`) in `@alfresco/adf-extensions`. Code that registered auth guards with a looser type now gets a
compile error — register `CanActivateFn` guards.

### Process instance model — subprocess/linked-process fields

`ProcessInstanceCloud` replaced its two related-instance **arrays** with **counts**:

| Before (8.5.0) | After (9.0.0) |
| -------------- | ------------- |
| `linkedProcesses?: RelatedProcessInstance[]` | `linkedProcessesCount?: number` |
| `subprocesses?: RelatedProcessInstance[]` | `subprocessesCount?: number` |

Code reading `processInstance.linkedProcesses` / `processInstance.subprocesses` must switch to the count fields
(the full related-instance collections are no longer carried on the model).

### Task cloud — Runtime Bundle task fetch

`TaskCloudService.getTaskById` dropped its third `service` argument:

- **Before:** `getTaskById(appName, taskId, service: 'query' | 'rb' = 'query')`
- **After:** `getTaskById(appName, taskId)`

Endpoint selection is now controlled by the new **`ADF_TASK_RUNTIME_BUNDLE_FALLBACK_ENABLED`** injection token
(`InjectionToken<Observable<boolean> | boolean>`, from `@alfresco/adf-process-services-cloud`). When it resolves
truthy, `getTaskById` / `FormCloudService.getTask` read active tasks from the always-current **Runtime Bundle**
endpoint and transparently **fall back to the Query Service on HTTP 404** (e.g. completed/archived tasks).
Default (token absent) is unchanged — Query Service only. Any caller passing `'rb'`/`'query'` must drop the
argument and provide the token instead. The feature also adds two public exports: the
`TaskDetailsCloudModelRuntimeBundle` interface and the `resolveTaskRuntimeBundleFallback$(token)` helper.

### Multiline text widget base class

`MultilineTextWidgetComponentComponent` now **extends `WidgetComponent`** (previously `FormattableTextWidgetComponent`),
`implements OnInit`, and renders validation errors via Material `mat-error` (an `errorStateMatcher` +
`translateParameters`) instead of the shared `ErrorWidgetComponent`. Custom widgets that subclassed it and relied
on `FormattableTextWidgetComponent` members must adapt. Many other widgets were migrated to the same `mat-error`
rendering in the same change — the core `AmountWidgetComponent`, `DecimalWidgetComponent`, `NumberWidgetComponent`;
the cloud `dropdown`/`date`/`date-time`/`display-external-property` widgets; the process-services (non-cloud)
`dropdown`/`typeahead`/`functional-group`/`people` widgets; `TagActionsComponent`; and the `StartTaskComponent`
date field. **Custom CSS targeting the old `ErrorWidgetComponent` markup for any of these widgets may need updating.**

### Text field default max length

The `TEXT` field now enforces a **default maximum length of 1024 characters** when the field defines no explicit
`maxLength`, and oversized paste is blocked:

- New exported constant **`DEFAULT_TEXT_MAX_LENGTH = 1024`** (`@alfresco/adf-core`).
- `FORM_FIELD_VALIDATORS` now applies `MaxLengthFieldValidator` to `TEXT` with a `1024` fallback (and a separate
  uncapped validator for `MULTILINE_TEXT`); `MaxLengthFieldValidator`'s constructor gained a 3rd
  `fallbackMaxLength?` param.
- Pasting text that would exceed the resolved max length is now prevented, the field is marked touched, and a
  `FORM.FIELD.VALIDATOR.NO_LONGER_THAN` error shows.

TEXT fields that previously relied on unlimited length now cap at 1024 unless the field itself defines a
`maxLength`.

### Tree and chip DOM / accessibility changes

Keyboard-accessibility rework changed the DOM of a few components (no `@Input`/`@Output` were removed, but markup,
CSS selectors and automation ids changed — update tests/CSS that target the old markup):

- **`TreeComponent` (`adf-tree`)** — the expand/collapse **chevron button was removed from the tab order**
  (`tabindex="-1"`, `aria-hidden="true"`) and the label `span` is no longer interactive (lost `role="button"` /
  `tabindex="0"`). Keyboard users now operate the **row**: **Enter** expands/collapses, **Space** selects/toggles.
  Rows gained `aria-label`/`aria-selected`; selection is announced via `LiveAnnouncer`
  (new `ADF-TREE.ARIA.SELECTED` / `DESELECTED` keys).
- **`DynamicChipListComponent`** — the chip delete affordance changed from a `<mat-icon matChipRemove>` to a real
  `<button class="adf-dynamic-chip-list-delete-btn" data-automation-id="adf-dynamic-chip-list-delete-btn-<id>">`.
  The old `.adf-dynamic-chip-list-delete-icon` element / `adf-dynamic-chip-list-delete-{name}` id are gone
  (`@Output() removedChip` is unchanged; it now emits from the button click). A new public
  `focusDeleteButton(index)` method was added, and a new `DYNAMIC_CHIP_LIST.DELETE` i18n key.

## New components and features

- **Session timeout** (opt-in, `@alfresco/adf-core`) — a new subsystem that tracks user idle activity, shows a
  countdown "Are you still working?" dialog, and logs out on timeout, synchronised across browser tabs via
  `BroadcastChannel`. Enable it with the new **`provideSessionTimeout(options?)`** provider and/or a
  `sessionTimeout` block in `app.config.json`:
  ```json
  { "sessionTimeout": { "enabled": true, "idleTimeoutMs": 1800000, "dialogTimeoutMs": 60000 } }
  ```
  New exports include `SessionTimeoutService`, `SessionTimeoutDialogComponent` (`adf-session-timeout-dialog`),
  `IdleActivityTracker`, `SessionTimeoutSyncChannel`, the `SESSION_TIMEOUT_OPTIONS` token, the
  `SESSION_TIMEOUT_CONFIG_KEY` / `DEFAULT_SESSION_TIMEOUT_OPTIONS` constants, and the `SessionTimeoutOptions`
  interface. Defaults: 30-minute idle timeout, 60-second warning dialog. New `SESSION_TIMEOUT.*` i18n keys.
- **Clock-drift-tolerant token expiry** (opt-in) — a new `oauth2.timeSync` app-config flag makes OAuth token
  expiry checks use a **server-time-corrected clock** (to avoid false logouts on VMs/Citrix with drifted clocks).
  Backed by a reworked `TimeSyncService` (`getCorrectedNow()`) and a new exported `TimeSyncDateTimeProvider`;
  `OauthConfigModel` gained optional `timeSync?: boolean` and `showDebugInformation?: boolean` fields, and a new
  top-level **`serverTimeUrl`** app-config key (`AppConfigValues.SERVER_TIME_URL`) points at the endpoint used to
  read server time. Off by default — behaviour is unchanged unless `oauth2.timeSync` is enabled.
- **Type-aware form field value adapter** — a new root-provided **`FormFieldValueAdapterService`**
  (`register`/`hasAdapter`/`adapt`, with the exported `FormFieldValueAdapter` type) in `@alfresco/adf-core`, the
  inbound counterpart to 8.5.0's `FormFieldValueFormatterService`. Both are gated by the existing
  `ADF_TYPED_VALUE_FORMATTING_ENABLED` token. A companion `ReactivePreselectionService` now backs the cloud
  People/Group widgets' preselection.
- **Repeatable-section row-count event** — a new **`'onRowCountChanged'`** form-rules event is emitted (via
  `FormService.formRulesEvent`) when a repeatable section adds/removes a row, driven by the new
  `FormModel.onRepeatableSectionRowCountChanged(sectionField)`. The `FormValidationService` interface gained an
  optional `formRulesEvent?: Subject<FormRulesEvent>`.
- **Dropdown/radio labels in display-text expressions** — when typed-value formatting is enabled, `${field.x}`
  expressions now resolve dropdown/radio values to their option **label** instead of the raw id. New
  `FormFieldTypes.DISPLAY_TEXT_TYPES` / `FormFieldTypes.isDisplayTextType()` helpers.
- **Multiline text auto-grow** — the multiline text widget grows unbounded by default; setting the field param
  `autoGrow: false` caps its height (scrollable). Driven by `field.params.autoGrow` (no new `@Input`).
- **Silent document-list reload** — `DocumentListService.reloadSilently()` / `reloadSilently$` reload the list
  **without** resetting the current selection (used to keep the context menu open during bulk upload).
- **`UrlService` blob helpers** — new public `createObjectUrl(blob)` and `trustUrl(url)` methods (the existing
  `createTrustedUrl(blob)` is now composed from them).
- **`CustomResourcesService.getRecentFiles`** gained an optional 4th `includeFields: string[] = []` param
  (forwarded from `loadFolderByNodeId` for `-recent-`), so extra fields (e.g. `isFavorite`) can be requested.
- **Version list** now shows the version's **modified-by user** (`modifiedByUser.displayName`) and the
  **modified date and time** (`date: 'medium'`).

## Behavioural changes

| Area | Change |
| ---- | ------ |
| Auth — OIDC | `OidcAuthenticationService.reset()` now calls `oauthService.logOut(true)` (terminates the OAuth session) instead of reloading the IDP configuration — supports the session-timeout logout redirect. |
| Search — node selector | `ContentNodeSelectorPanelComponent` no longer leaves stale `ANCESTOR:` filters when switching sites/clearing the search; filtering now correctly scopes to the chosen site. |
| Forms — people widget | `PeopleWidgetComponent` (process-services) now debounces its user search by 300 ms instead of querying on every keystroke. |
| Forms — spinner | The Automate-form spinner overlay is now fully disposed on host destroy, so it no longer persists outside the form. |
| Forms — task fetch | Task claim/unclaim status is evaluated against the always-current Runtime Bundle when the RB-fallback token is enabled (fixes stale block-task claim status). |
| Uploads | `FetchHttpClient` now converts a Node `ReadStream`/`Buffer` to a `Blob` (with filename) before appending to `FormData`, fixing broken multipart uploads under the fetch client. |
| Uploads | The form multi-file attachment viewer now updates when a different file is selected; the "upload new version" button re-enables after use; bulk upload no longer collapses the context menu. |
| Viewer | Firefox-headless race fixed — PDF blob/MIME state is assigned atomically and MIME types are normalised (charset params stripped). |
| Accessibility — tags | Tag delete controls are now real keyboard-operable buttons; focus is restored sensibly after a tag is removed, and blank/whitespace tags are rejected. |

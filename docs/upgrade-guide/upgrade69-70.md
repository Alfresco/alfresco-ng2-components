---
Title: Upgrading from ADF v6.9 to v7.0
---

# Upgrading from ADF v6.9 to v7.0

This guide provides instructions on how to upgrade your v6.9.0 ADF projects to v7.0.0.

**v7.0.0 is a major release.** It moves ADF across three Angular major versions (**14 → 17**) — including the
Angular Material **MDC migration** — upgrades **rxjs 6 → 7**, requires **`@alfresco/js-api` v8**, switches the
test runner to **Jest**, and completes a large **standalone-component migration**. Expect real work: audit your
Material CSS overrides, update import paths for moved/removed symbols, and align your own Angular/tooling versions.

Because 7.0.0 was released through a chain of alpha builds, this guide is organised into a
[shared overview](#major-platform-changes) followed by a [per-release section](#changes-by-release) for each
intermediate tag (`7.0.0-alpha.2`, `-alpha.3`, `-alpha.4`, `-alpha.6`, `-alpha.7`, and the final `7.0.0`).
Apply them in order.

> **Note on alpha.5:** there is no `7.0.0-alpha.5` tag. Its changes were released as part of `7.0.0-alpha.6`
> and are documented under that heading.

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. Since this
is a major version with many breaking changes, budget time to build, run, and re-test your application after upgrading.

## Contents

- [Library updates](#library-updates)
- [Major platform changes](#major-platform-changes)
- [Changes by release](#changes-by-release)
  - [7.0.0-alpha.2](#700-alpha2)
  - [7.0.0-alpha.3](#700-alpha3)
  - [7.0.0-alpha.4](#700-alpha4)
  - [7.0.0-alpha.6](#700-alpha6)
  - [7.0.0-alpha.7](#700-alpha7)
  - [7.0.0 (final)](#700-final)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "7.0.0",
        "@alfresco/adf-content-services": "7.0.0",
        "@alfresco/adf-process-services": "7.0.0",
        "@alfresco/adf-process-services-cloud": "7.0.0",
        "@alfresco/adf-insights": "7.0.0",
        "@alfresco/adf-extensions": "7.0.0",
        "@alfresco/js-api": ">=8.0.0"
    }
}
```

Clean your old distribution and dependencies by deleting `node_modules` and `package-lock.json`, then reinstall:

```sh
npm install
```

## Major platform changes

These changes accumulate across the alpha chain but affect every consumer of 7.0.0:

| Area                     | 6.9.0         | 7.0.0            |
| ------------------------ | ------------- | ---------------- |
| Angular                  | 14.1.3        | **17.1.3**       |
| Angular Material / CDK   | 14.1.2        | **17.1.2** (MDC) |
| rxjs                     | 6.6.6         | **7.8.1**        |
| zone.js                  | 0.11.4        | **0.14.8**       |
| TypeScript               | 4.7.4         | **5.3.3**        |
| Nx                       | `@nrwl/*` 14  | **`@nx/*` 20**   |
| `angular-oauth2-oidc`    | 13            | **17**           |
| `@alfresco/js-api`       | 7.5           | **>= 8.0.0**     |
| Test runner              | Karma/Jasmine | **Jest**         |
| Node.js (`engines.node`) | >= 6.0.0      | **>= 18.0.0**    |

Key consumer implications:

- **Angular Material MDC migration** — Angular Material's components were rewritten onto MDC, changing their
  internal DOM and CSS class names (`.mat-*` → `.mat-mdc-*`). If your application styles Material internals
  (directly or by overriding ADF component styles), you must re-audit those styles. This is the single biggest
  source of visual breakage.
- **Accessibility / DOM & roles** — beyond the MDC class changes, ADF's accessibility pass altered DOM and ARIA in
  several components: Material tooltips became the native `[title]` attribute, search facet chips moved from
  `mat-chip-option` to `mat-chip`, `role` attributes changed on the DataTable and Columns Selector, and the Aspect
  List HTML structure changed. Re-check any tests or CSS keyed off these roles/structure.
- **Node 18** — the repository's `engines.node` was raised from `>= 6.0.0` to `>= 18.0.0`; move your build/CI to Node 18+.
- **rxjs 7** — adopt rxjs 7 (`firstValueFrom`/`lastValueFrom` instead of `toPromise`, stricter operator typings).
- **js-api v8** — ADF requires `@alfresco/js-api` `>= 8.0.0`.
- **Jest** — ADF's own tests moved from Karma/Jasmine to Jest. If your test setup extends ADF testing utilities,
  migrate to Jest.
- **Standalone components** — most ADF components, directives and pipes are now `standalone`. Many NgModules were
  removed or deprecated; import the standalone symbols (or the exported `*_DIRECTIVES` const arrays) directly.
- **Date handling** — date pipes/adapters are date-fns based; the legacy moment-based pipes are removed (see 7.0.0 final).
- **`ng update`** — where migrations are provided, run `ng update @alfresco/adf-core@7.0.0` to apply automated fixes.

## Changes by release

### 7.0.0-alpha.2

The Angular **14 → 15** step and the **Material MDC migration**.

**Platform / dependencies**

- Angular and Material `14 → 15.2`; the MDC migration rewrites hundreds of component stylesheets.
- rxjs `6.6 → 7.8`; TypeScript `4.7 → 4.9`; Nx (still `@nrwl`) `14 → 15`; `@alfresco/js-api` → `8.0.0-alpha`.
- Date handling moves to a **date-fns adapter**: new `AdfDateFnsAdapter`, `AdfDateTimeFnsAdapter`, and
  `ADF_DATE_FORMATS` (wired to `DateAdapter` / `MAT_DATE_FORMATS`).

**Breaking removals / renames / moves**

- `ButtonsMenuComponent` **moved** from `@alfresco/adf-core` to `@alfresco/adf-insights`.
- `AuthModule` is **no longer exported from the `@alfresco/adf-core` root** — import it from the auth entry point.
- Removed pipes: `BooleanPipe`, `IsIncludedPipe`, `TabLabelsPipe` (core). Removed `AuditService`.
- Removed About items: `AboutGithubLinkComponent`, `AboutPlatformVersionComponent`, and `AaeInfoService`;
  `AboutModule` is deprecated in favour of an exported `ABOUT_DIRECTIVES` array.
- Removed public directives `PeopleSearchActionLabelDirective` and `PeopleSearchTitleDirective` (process-services);
  removed the insights analytics `WidgetComponent` export; removed `SortingPickerModule`; the extensions
  `AppExtensionServiceMock` is no longer exported.
- Removed the standalone date/datetime **form-field validators** from `FORM_FIELD_VALIDATORS` and the public
  exports (`DateFieldValidator`, `DateTimeFieldValidator`, and the `Boundary`/`Min`/`Max` date & datetime
  variants) — date/datetime validation moved into Angular reactive-form validators.
- The `content-user-info` and `process-user-info` components, and `CoreAutomationService`, were **moved to the
  demo shell** (no longer part of the libraries).
- The shared `MaterialModule` is deprecated/removed from several libraries; stop depending on it and import the
  specific Angular Material modules you need.
- `process-services` public API restructured — `people-process.service`, `apps-process.service`,
  `task-comments.service` now live under `lib/services`. **Note:** `BpmUserModel`, `UserProcessModel`,
  `ProcessInstance`, `ProcessInstanceVariable`, `FilterRepresentationModel`, `FilterParamsModel` and
  `AppDefinitionRepresentationModel` were **not removed** — they are retained as `@deprecated` type aliases to the
  equivalent `@alfresco/js-api` types (via `lib/compat/types`). Migrate to the js-api types. However,
  `TaskDetailsModel` and `StartTaskModel` **were removed outright** (their model file was deleted and no
  `@deprecated` alias is provided) — switch to the equivalent `@alfresco/js-api` task types (e.g. `TaskRepresentation`).
  Likewise removed outright with no alias: `ProcessListModel`, `TaskListModel`, `FilterProcessRepresentationModel`,
  `ProcessFilterParamRepresentationModel`, `ProcessFilterRequestRepresentation` and `TaskQueryRequestRepresentationModel`
  — move to the equivalent `@alfresco/js-api` types.
- **Removed process-services directives:** `TaskAuditDirective` and `NoTaskDetailsTemplateDirective`
  (`@alfresco/adf-process-services`, previously exported from `task-list`) were removed — drop the usages.
- Card-view validator filenames were corrected (`*.valiator.ts` → `*.validator.ts`) — this breaks deep-path
  imports of those files (the barrel export is unaffected).

**Standalone / module changes**

- Wide standalone migration across core, content-services, extensions, insights and process-services; many
  NgModules (card-view, content-type, node-comments, site-dropdown, form, apps-list, attachment, task-list,
  dynamic-table, sorting-picker, dynamic-chip-list, and more) were deleted. Several modules were replaced by
  exported directive arrays: `ANALYTICS_PROCESS_DIRECTIVES` (insights), `ABOUT_DIRECTIVES`, `FORM_DIRECTIVES`,
  `APPS_LIST_DIRECTIVES`, `ATTACHMENT_DIRECTIVES` (process-services), `EXTENSION_DIRECTIVES` (extensions).
  `ExtensionsModule` is deprecated (its `forChild()` remains as a deprecated shim).
- Some standalone components also moved to nested folders, breaking deep-path imports (e.g. `StartFormComponent`
  → `.../form/start-form/start-form.component`; the attachment components).
- "Break dependency on Material Module" work means Layout/DataTable/Form components self-import only the Material
  pieces they use.

**New features**

- New standalone core UI components: `AvatarComponent`, `ButtonComponent`, `ProgressComponent`, and a new
  `header` entry point (`HeaderComponent`, `NavbarComponent`, `NavbarItemComponent`). New `AlfrescoIconComponent`
  (`adf-alfresco-icon`) in content-services.
- New generic `DialogComponent` (core `dialogs`) that can return data on confirmation; new `ConfirmDialogModule`;
  new `DIALOG_COMPONENT_DATA` injection token + `DialogData.componentData` so embedded dialog components can receive injected data.
- New card-view `long` type (`CardViewLongItemModel`, `CardViewItemLongValidator`, `CardViewItemPositiveLongValidator`).
- New exported form helpers: `FieldOptionType`, `FieldSelectionType`, `FieldAlignmentType`,
  `FormFieldTypes.REACTIVE_TYPES` + `isReactiveType()`, `FormFieldModel.markAsValid()`, `DEFAULT_DATE_FORMAT`,
  `FormOutcomeModel.skipValidation`, and `FormRendererComponent` `@Input() readOnly`.
- New `@Input()`s: `ViewerComponent`/`ViewerRenderComponent`/`PreviewExtensionComponent` `nodeId` (custom viewer
  extensions receive the node id); `PeopleCloudComponent` `hideInputOnSingleSelection`, `formFieldAppearance`,
  `formFieldSubscriptSizing`, `showErrors`; `SearchWidgetContainerComponent` `useHeaderQueryBuilder` (constructor
  also drops `SearchQueryBuilderService` and adds `Injector`).
- DataTable `@Input() displayCheckboxesOnHover` (default `false`); `DocumentListService.reload()` / `reload$`.
- New content-services feature areas: **Legal Hold**, **Predictions API**, and a **feature-flags** library. New Form Header widget and viewer file-rotation support.
- Insights packaging: `chart.js`, `ng2-charts`, `raphael`, `@alfresco/adf-core` and `@ngx-translate/core` moved
  from `peerDependencies` to `dependencies`.

**Behavioural**

- `matTooltip` was replaced by the native `[title]` attribute across ~96 templates (accessibility) — tooltip
  timing/position inputs no longer apply where replaced.
- **DATE and DATETIME widgets migrated to Angular reactive forms.** Dropdown/radio REST options are now fetched
  only when `optionType === 'rest'` (previously any `restUrl` triggered a fetch), and read-only dropdown/radio
  widgets no longer call REST APIs or show validation errors.
- Date/time widgets became timezone-aware; a `token_received` event is emitted on login; `PdfViewerComponent`
  disables pdf.js `isEvalSupported` (security); the tree-view component was marked for deprecation.

### 7.0.0-alpha.3

Auth and js-api relocation.

**Platform / dependencies**

- `angular-oauth2-oidc` `13 → 15`; `axios` pinned as a direct dependency; peer ranges opened to js-api `8.0.0-alpha`.

**Breaking removals / renames / moves**

- **`AlfrescoApiService` (and `AlfrescoApiServiceMock`) moved from `@alfresco/adf-core` to
  `@alfresco/adf-content-services`.** Update your imports. An `ng update` migration
  (`updateAlfrescoApiImports`, run via `ng update @alfresco/adf-core@7.0.0`) rewrites these automatically. The
  related `AlfrescoApiLoaderService`, `AlfrescoApiNoAuthService` and the `createAlfrescoApiInstance` factory are
  now exported from content-services, and the API-initialising `APP_INITIALIZER` moved from `CoreModule` to
  `ContentModule` — make sure your app imports `ContentModule`.
- `ExtensionService.setAuthGuards()` / `getAuthGuards()` signatures changed to `Record<string, unknown>` /
  `Array<unknown>` (aligns with the functional guards).
- **Auth route guards are now functional `CanActivateFn` values**, not injectable classes: `AuthGuard`,
  `AuthGuardBpm`, `AuthGuardEcm`, `AuthGuardSsoRoleService`, `OidcAuthGuard`. The base class **`AuthGuardBase`
  was deleted**, and a new `SHELL_AUTH_TOKEN` injection token was added. Route configs and any subclasses must migrate.
- Removed: `DirectionalityConfigService` (folded into `UserPreferencesService`); pipes `MimeTypeIconPipe`,
  `LocalizedRolePipe`, `FilterOutEveryObjectByPropPipe`; the `setupTestBed` test helper.

**Standalone / testing ergonomics**

- New `NoopAuthModule` and `NoopTranslateModule` (core testing) to simplify consumer test beds.

**New features**

- **Knowledge Retrieval / Search-AI**: new `AgentService` and `SearchAiService` (content-services).
- New `@Output() updatedFilter` (`EventEmitter<string>`) on process/task filter cloud components (a distinct
  emitter on each); new `@Output() rowsSelected` on `ProcessListComponent`; form/widget styling support (new
  `predefined-theme` export, `PredefinedThemeModel`); new OAuth config keys `clockSkewInSec` and `sessionChecksEnabled`.
- `StartProcessCloudService.getStartEventConstants(appName, processDefinitionId)` — start/cancel buttons can now be
  customised from process-definition constants; `StartProcessCloudComponent` `@Output() error` type changed to `EventEmitter<any>`.
- `RichTextEditorComponent` gained `@Input() placeholder` and `@Input() autoFocus`.
- `DROPDOWN` was added to `FormFieldTypes.REACTIVE_TYPES` (dropdowns now bind/validate via reactive forms;
  `DropdownCloudWidgetComponent` is now standalone). `ProcessCommentsComponent` was simplified (its `@Output() error` was removed).

### 7.0.0-alpha.4

The Angular **15 → 16** step.

**Platform / dependencies**

- Angular and Material `15 → 16.2`; `zone.js → 0.13`; **Nx package scope renamed `@nrwl/* → @nx/*` (16)**;
  `angular-oauth2-oidc 15 → 16`; chart.js 4; ng-packagr 16.

**Breaking removals / renames**

- Removed `FilterStringPipe` (core). Columns-selector now filters in the component.
- `DisplayModeService` methods widened from the `FormCloudDisplayMode` enum to `string` (to allow a `standalone`
  display mode and custom modes) — relax enum-typed callers to `string`.
- **Process/task filter counters changed shape** — the public `counters$: { [key]: Observable<number> }` on
  `ProcessFiltersCloudComponent` / `BaseTaskFiltersCloudComponent` was **removed** and replaced by a synchronous
  `counters: { [key]: number }` (plus a new `initFilterCounters()` method). Templates using `counters$ | async` must migrate.
- The abstract `AuthService` gained abstract members `onLogout$: Observable<void>` and
  `isDiscoveryDocumentLoaded$: Observable<boolean>` — custom `AuthService` implementations must implement them.
  `OidcAuthenticationService` gained public `shouldPerformSsoLogin$`.

**New tokens / API**

- New `TASK_SEARCH_API_METHOD_TOKEN` (`'GET' | 'POST'`) enabling the new POST task-search endpoint (Activiti ≥ 8.7).
  In `'POST'` mode `TaskListCloudComponent` honours new `string[]` inputs `names`, `processDefinitionNames`,
  `statuses`, `assignees`, `priorities`, `completedByUsers`; new exports `TaskListRequestModel`,
  `TaskFilterCloudAdapter`, `ProcessTaskListCloudService`, and `TaskListRequestTaskVariableFilter`.
- New `JWT_STORAGE_SERVICE` token so consumers can supply custom OAuth storage to `JwtHelperService`.

**New features**

- **Saved Search** (ADW): new `SavedSearchesService` and `SavedSearch` interface (content-services `common`).
- `VersionListComponent` / `VersionManagerComponent` gained `@Input() allowVersionDelete`, `allowViewVersions`
  and `showActions` (all default `true`); `NewVersionUploaderDialogData` gained the matching optional fields; the
  version list now uses a virtual-scroll viewport.
- New `refreshFilter(filterKey)` on process/task filter components; new `FormService.onFormVariableChanged`;
  `StartProcessCloudComponent` gained `@Input() displayModeConfigurations`.

**Behavioural**

- Auth infinite-loop / clock-skew rework: new internal `RetryLoginService`, `TimeSyncService`, and a
  `TokenInterceptor` (HTTP interceptor) — the user is now logged out after 3 failed login attempts. Re-test SSO flows.

### 7.0.0-alpha.6

(There was no `alpha.5` tag; those changes are included here.) **No framework version bumps in this window** —
the changes are API/feature-level.

**Breaking removals / renames**

- Removed `ProcessTaskListCloudService` from the process-list public API entry point.
- Renamed exported const `RUNNING_STATUS → DEPLOYED_STATUS`; `AppListCloudComponent` now queries `DEPLOYED` apps.
  The related method `getRunningApplications()` was renamed to `getDeployedApplications()` on
  `EditProcessFilterCloudComponent` and `BaseEditTaskFilterCloudComponent`.
- `TaskListRequestModel.variableKeys` (and `ProcessListRequestModel.variableKeys`) renamed to `processVariableKeys`;
  `TaskListRequestModel` gained an optional `processInstanceId`.
- `ContainerModel` methods became getters: `isGroup()` → getter `isTypeFieldGroup`; `isCollapsible()`/
  `isCollapsedByDefault()` → getters (drop the `()`); new getter `hideHeader`.
- **Constructor changes** (affect manual instantiation/subclassing): `PermissionListComponent` now requires
  `ContentService` (and exposes a new `updatePermissionsAllowed` getter); `SidenavLayoutComponent` now requires
  `ChangeDetectorRef`; `TaskHeaderComponent` gained `CardViewUpdateService`.
- The Saved Searches storage file changed from `saved-searches.json` to `config.json` (existing saved searches
  won't be found until re-saved).

**New features**

- New **process search API**: `ProcessListRequestModel`, `ProcessFilterCloudAdapter`, `ProcessListCloudService.fetchProcessList()`,
  and a `PROCESS_SEARCH_API_METHOD_TOKEN` (`'GET' | 'POST'`); `getProcessByRequest()` is now `@deprecated`.
  New `ProcessListCloudComponent` inputs `names`, `initiators`, `appVersions`, `statuses` (POST mode).
- DataTable: `DataRow.isSelectable?`, and drag-to-reorder rows via `@Input() enableDragRows` / `@Output() dragDropped`.
- CardView autocomplete support (`CardViewSelectItemModel.autocompleteBased`).
- `TaskHeaderComponent` gained `@Input() readOnly` and `@Input() resetChanges` (a `Subject<void>`); the Assignee
  field became an inline-editable autocomplete (re-assignable when assigned to the current user).

**Behavioural**

- `DataTableSchema.isColumnSchemaCreated$` now backed by a `BehaviorSubject` (emits an initial `false`, both
  branches emit `true`) — relevant if you subclass `DataTableSchema`.
- Large internal migration to Angular's `takeUntilDestroyed` (128 files) — relevant if you subclass these components.
- Kerberos no longer adds a basic-auth header; CSRF header now respects the `disableCsrf` flag.

### 7.0.0-alpha.7

Standalone migration of `process-services-cloud`, plus new libraries.

**Platform / dependencies**

- `angular-oauth2-oidc 16 → 17`; new `graphql-ws` dependency. Angular remains 16.2 in this window.
- `@alfresco/adf-core` peer dependencies were **pinned to exact Angular 16.2.9** — align your peers accordingly.

**Breaking removals / renames / moves**

- **The `@alfresco/adf-testing` library (`lib/testing`) was removed entirely.** Remove any imports from it.
- `TaskFormCloudComponent` moved to a nested path (`./components/task-form-cloud/task-form-cloud.component`) —
  deep imports break; the package entry-point export is preserved.
- Tag creator components were consolidated (a transforming pipe and styles removed).
- **Removed pipes/directives** (`process-services-cloud`): `ProcessNameCloudPipe` (together with its
  `ProcessServicesCloudPipeModule`), `InitialGroupNamePipe`, and `CancelProcessDirective` (from
  `ProcessDirectiveModule`) were removed — verified gone at 7.0.0. Drop the usages or switch to the standalone
  equivalents.
- **Start-Task-Cloud removed:** `StartTaskCloudComponent`, `StartTaskCloudService` and `StartTaskCloudModule`
  (`@alfresco/adf-process-services-cloud`) were removed entirely (present at `alpha.6`, gone at `alpha.7`).
- **Identity DI-override tokens removed:** `IDENTITY_USER_SERVICE_TOKEN` and `IDENTITY_GROUP_SERVICE_TOKEN` were
  removed; the `IdentityUserServiceInterface` / `IdentityGroupServiceInterface` types moved to
  `@alfresco/adf-core` (`auth/interfaces`). Re-point any custom identity-service provider.
- **Deprecated:** `TaskListCloudService.getTaskByRequest()` (and the `TaskListCloudServiceInterface` member) is now
  `@deprecated` — use `fetchTaskList()` (mirrors the `getProcessByRequest()` deprecation in alpha.6).

**Standalone / module changes**

- Broad standalone migration of `process-services-cloud`: many NgModules were removed or reduced
  (`ProcessDirectiveModule`, `TaskDirectiveModule`, `StartTaskCloudModule`, `StartProcessCloudModule`,
  `ProcessCommonModule`, the cloud `material.module`, and others). Import the standalone components/directives directly.

**New features**

- **Screens**: new `ScreenRenderingService` and `UserTaskCloudComponent` (process-services-cloud).
- New `WebSocketService` (Apollo/graphql-ws); `NotificationCloudService` refactored onto it.
- `truncate` pipe now exported from core; new `Truncate` display option for text `DataColumn`; new optional
  `DataColumn.subtitle`; new `@Input() showProvidedActions` (default `false`) on `DataTableComponent`,
  `ProcessListCloudComponent` and `BaseTaskListCloudComponent`.
- People widget multi-select (`field.params.multiple`); `adfLocalizedDate` pipe gains a `timezone` argument;
  `ObjectDataTableAdapter` server/client `SortingMode`.
- New exported `ReactiveFormWidget` interface (`{ updateReactiveFormControl(); formService }`); `FormRulesManager.onDestroy$` opened to `protected`.
- `NodesApiService` gained `initiateFolderSizeCalculation(nodeId)` and `getFolderSizeInfo(nodeId, jobId)` (backing the folder size-details dialog).
- New model fields: `ApplicationInstanceModel.canAccessAudit`; `ServiceTaskQueryCloudRequestModel` gained
  completed/started date-range fields; new `ScreenCloudComponent` + `UserTaskCustomUi` interface.
- `AppsProcessCloudService.getDeployedApplicationsByStatus` signature changed (`role?: string` → `roles?: string | string[]`).

**Behavioural**

- **Required inputs are now enforced across ~55 components** (~66 inputs) in core, content-services,
  process-services and process-services-cloud — `@Input()` became `@Input({ required: true })`. Affected
  components include `NameColumnComponent`, `TreeViewComponent`, `VersionComparisonComponent`,
  `VersionUploadComponent`, `CommentListComponent`, `NodeCommentsComponent`, `TaskHeaderComponent`,
  `BreadcrumbComponent`, `CategoriesManagementComponent`, `ContentMetadataComponent`/`ContentMetadataCardComponent`,
  `ContentNodeSelectorPanelComponent`, the library/permission/tag/search-facet/card-view/datatable components,
  and many more. Any template that omits one of these inputs now fails to compile — audit your templates.
- `onLogout` is emitted when redirected to the login page; `ProcessFilterOperators` adds `'ne'`.

### 7.0.0 (final)

The Angular **16 → 17** step and the Jest migration.

**Platform / dependencies**

- Angular and Material `16 → 17.1`; TypeScript `5.3`; zone.js `0.14`; Nx `20`; `apollo-angular 6`.
- **Test runner migrated from Karma/Jasmine to Jest.**
- Rich-text editor dependencies bumped (several `@editorjs/*` majors); font-size dependency swapped to `@valano/change-font-size`.

**Breaking removals / renames**

- **`MomentDatePipe` and `MomentDateTimePipe` were removed** — migrate to the date-fns based date pipe/adapter.
- `FullNamePipe.transform` gained an optional `emailDisplayed?: boolean` argument (backward compatible; appends `<email>` when true).
- `FormModel` constructor gained a 7th optional `injectedFieldValidators?` argument, and its `fieldValidators`
  default is now populated via injected validators.

**New features**

- New injection tokens for pluggable form validators: `FORM_SERVICE_FIELD_VALIDATORS_TOKEN` and
  `FORM_CLOUD_SERVICE_FIELD_VALIDATORS_TOKEN` — provide `FormFieldValidator[]` app-wide.
- New `SAVED_SEARCHES_SERVICE_PREFERENCES` token + `SavedSearchesPreferencesApiService`; **Saved Searches now
  persist via the Preferences API**.
- Screens: new `lib/screen` public API (`UserTaskCustomUi` model) with full-screen support.
- Form sections rendered at runtime (`FormSectionComponent`); new public `UnitTestingUtils` test helper.
- New public export `DEFAULT_LANGUAGE_LIST` (`core/common`); `DocumentListComponent` `@Input() displayDragAndDropHint`
  (default `true`); `FormBaseComponent` getter `hasVisibleOutcomes`.
- `CardViewBaseItemModel` gained `isValidValue?` (and now skips unsupported constraint types with a `console.warn`
  instead of throwing); `ContentMetadataComponent` gained `invalidProperties` and disables the save button while any property is invalid.
- `RequiredFieldValidator` now also supports the `ALFRESCO_FILE_VIEWER` and `PROPERTIES_VIEWER` widget types.

**Behavioural**

- **Service-tasks API data shape changed** — `ServiceTaskListCloudComponent` now unwraps `entries.map(t => t.entry)`;
  consumers reading raw service-task rows must unwrap `.entry`.
- Submit/start button state is now computed from validators across cloud form/task/start-process components.
- `CommentsComponent` moved to a reactive `commentControl` and disables the add button for whitespace-only comments.
- The required-field asterisk is now toggled via CSS `visibility` (not `*ngIf`) across ~27 widget templates —
  a DOM change if you key off the asterisk element's presence.
- Re-verify custom Material MDC themes and rich-text-editor integrations against Angular 17.

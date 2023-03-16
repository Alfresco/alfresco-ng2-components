---
Title: Upgrading from ADF v5.0 to v6.0
---

# Upgrading from ADF v5.0 to v6.0

This guide explains how to upgrade your ADF v5.0 project to work with v6.0.

Do not skip this task, if you want your application to be updated to a most recent version of ADF. Upgrades of multiple versions of ADF cannot be done in one step only, but should follow the chain of sequential updates. 

**Note:** the steps described below might involve making significant changes
to your code. If you are working with a versioning system then you should
commit any changes you are currently working on. If you aren't using versioning
then be sure to make a backup copy of your project before going ahead with the
upgrade.

Since 6.0 is a major version release, there are [breaking changes](#breaking-changes)
you need to take into account as well as the usual library updates. After updating
the libraries, check the other sections to see if any of the changes affect your
project.

## Contents

-   [Library updates](#library-updates)
-   [Breaking changes](#breaking-changes)
-   [Library to update](#library-to-update)
-   [Deprecated items](#deprecated-items)
    -   [DataColumnModule](#datacolumnmodule)
    -   [PaginationModel](#paginationmodel)
-   [Relocated classes](#relocated-classes)
    -   [Update Data-table a data change](#update-data-table-a-data-change)
    -   [NodeNameTooltipPipe](#nodenametooltippipe)
    -   [nodeUpdated Subject](#nodeupdated-subject)
    -   [Comments component](#comments-component)
    -   [ViewerComponent](#viewercomponent)
    -   [UserInfoComponent](#userinfocomponent)
-   [Renamed items](#renamed-items)
    -   [New Classes or Services](#new-classes-or-services)
    -   [Properties and methods](#properties-and-methods)
    -   [Component selectors](#component-selectors)
-   [Theme changes](#theme-changes)

## Library updates

1.  Update the `package.json` file with the latest library versions:

    ```json
    "dependencies": {
        ...
        "@alfresco/adf-core": "6.0.0",
        "@alfresco/adf-content-services": "6.0.0",
        "@alfresco/adf-process-services-cloud": "6.0.0",
        "@alfresco/adf-insights": "6.0.0",
        "@alfresco/js-api": "6.0.0",
        ...
    ```

2.  Clean your old distribution and dependencies by deleting `node_modules` and `package-lock.json`.

3.  Reinstall your dependencies
    ```sh
    npm install
    ```

## Breaking changes

The ADF project follows the [semver](https://semver.org/) conventions and so we
only make breaking changes (ie, not backward-compatible) in _major_ versions.
ADF 6.0 is the first major version since general availability so a number of
deprecated items have been removed and also some existing items have been
renamed. The sections below explain how to adapt your project to the changes
in 6.0. See also our
For more information about the changes and links to the associated
pull requests.

[TODO ADD HERE the PRs ][`checkallowableoperationdirective`](../content-services/directives/check-allowable-operation.directive.md): Moved from ADF Core to ADF content services
[`LibraryFavoriteDirective`](../../lib/content-services/src/lib/directives/library-favorite.directive.ts): Moved from ADF Core to ADF content services
[`LibraryMembershipDirective`](../../lib/content-services/src/lib/directives/library-membership.directive.ts): Moved from ADF Core to ADF content services
[`NodeDeleteDirective`](../content-services/directives/node-delete.directive.md): Moved from ADF Core to ADF content services
[`NodeFavoriteDirective`](../content-services/directives/node-favorite.directive.md): Moved from ADF Core to ADF content services
[`NodeRestoreDirective`](../content-services/directives/node-restore.directive.md): Moved from ADF Core to ADF content services
[TODO ADD HERE the PRs ] 

Each section needs to contains:
Title
Description
How to fix it:

## Library to update

| Name | Version |
| ---- | ------- |
| `pdfjs-dist` | `3.3.122` |

## Deprecated items

| Class | Before | Description |
| ----- | ------ | ----------- |
| [`LoginDialogService`](../core/services/login-dialog.service.md) | `@alfresco/adf-core` |  |
| [`DeletedNodesApiService`](../core/services/deleted-nodes-api.service.md) | `@alfresco/adf-core` |  |
| [`BpmUserService`](../core/services/bpm-user.service.md) | `@alfresco/adf-core` | you can use instead the [`PeopleProcessService`](../core/services/people-process.service.md) |
| [`UserContentAccessService`](../../lib/core/src/lib/services/user-content-access.service.ts) | `@alfresco/adf-core` | you can use instead the [`PeopleContentService`](../core/services/people-content.service.md) |
| [`EcmUserService`](../core/services/ecm-user.service.md) | `@alfresco/adf-core` | you can use instead the [`PeopleContentService`](../core/services/people-content.service.md) |

### DataColumnModule

[`DataColumnModule`](../../lib/core/src/lib/datatable/data-column/data-column.module.ts)  has been deprecated and moved in [`DataTableModule`](../../lib/core/src/lib/datatable/datatable.module.ts) 

v6.0.0 and before:

    @NgModule({
        imports: [
        ```
        DataColumnModule,
        DataTableModule
        ```    
    ])

v6.0.0 and after:

    @NgModule({
        imports: [
        ```
        DataTableModule,
        ```    
    ])

### PaginationModel

`Pagination` model from `@alfresco/js-api` has been now deprecated in favour of internal implementated model [`PaginationModel`](../../lib/core/src/lib/models/pagination.model.ts) evrywhere

## Relocated classes

| Class | Before | After |
| ----- | ------ | ----- |
| [`VersionCompatibilityService`](../../lib/content-services/src/lib/version-compatibility/version-compatibility.service.ts) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`VersionCompatibilityDirective`](../content-services/directives/version-compatibility.directive.md) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`SitesService`](../content-services/services/sites.service.md) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`SearchService`](../core/services/search.service.md) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`AppsProcessService`](../core/services/apps-process.service.md) | `@alfresco/adf-core` | `@alfresco/adf-process-services` |
| [`CheckAllowableOperationDirective`](../content-services/directives/check-allowable-operation.directive.md) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`LibraryFavoriteDirective`](../../lib/content-services/src/lib/directives/library-favorite.directive.ts) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`LibraryMembershipDirective`](../../lib/content-services/src/lib/directives/library-membership.directive.ts) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`NodeDeleteDirective`](../content-services/directives/node-delete.directive.md) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`NodeFavoriteDirective`](../content-services/directives/node-favorite.directive.md) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`NodeRestoreDirective`](../content-services/directives/node-restore.directive.md) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`NodeDownloadDirective`](../core/directives/node-download.directive.md) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`AppsProcessService`] | `@alfresco/adf-core` | `@alfresco/adf-process-services` |
| [`SharedLinksApiService`](../core/services/shared-links-api.service.md) | `@alfresco/adf-core` | `@alfresco/adf-process-services` |
| [`LockService`](../../lib/content-services/src/lib/document-list/services/lock.service.ts) | `@alfresco/adf-core` | `@alfresco/adf-process-services` |
| [`FavoritesApiService`](../core/services/favorites-api.service.md) | `@alfresco/adf-core` | `@alfresco/adf-process-services` |
| [`SearchConfigurationInterface`](../core/interfaces/search-configuration.interface.md) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`NodeDownloadDirective`](../core/directives/node-download.directive.md) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`DownloadZipDialogComponent`](../../lib/content-services/src/lib/dialogs/download-zip/download-zip.dialog.ts) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`RenditionService`](../../lib/content-services/src/lib/common/services/rendition.service.ts) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`UploadService`](../core/services/upload.service.md) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`NodesApiService`](../core/services/nodes-api.service.md) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`ContentService`](../core/services/content.service.md) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`ContentService`](../core/services/content.service.md) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`PeopleContentService`](../core/services/people-content.service.md) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`PeopleProcessService`](../core/services/people-process.service.md) | `@alfresco/adf-core` | `@alfresco/adf-process-services` |
| [`PermissionsEnum`](../../lib/content-services/src/lib/common/models/permissions.enum.ts) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`AllowableOperationsEnum`](../../lib/content-services/src/lib/common/models/allowable-operations.enum.ts) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`FileModel`](../../lib/content-services/src/lib/common/models/file.model.ts) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| `FileUploadStatus` | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`FileUploadProgress`](../../lib/content-services/src/lib/common/models/file.model.ts) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`FileUploadOptions`](../../lib/content-services/src/lib/common/models/file.model.ts) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`FileUploadEvent`](../../lib/content-services/src/lib/common/events/file.event.ts) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`FileUploadCompleteEvent`](../../lib/content-services/src/lib/common/events/file.event.ts) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`FileUploadDeleteEvent`](../../lib/content-services/src/lib/common/events/file.event.ts) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`FileUploadErrorEvent`](../../lib/content-services/src/lib/common/events/file.event.ts) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`NodeMetadata`](../../lib/content-services/src/lib/common/models/node-metadata.model.ts) | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| [`RichTextEditorComponent`](../../lib/process-services-cloud/src/lib/rich-text-editor/rich-text-editor.component.ts) | `@alfresco/adf-core` | `@alfresco/adf-process-services-cloud` |

### Update Data-table a data change

v6.0.0 and after You will need to provide a [`DataTableService`](../../lib/core/src/lib/datatable/services/datatable.service.ts) to update a row of your table.
The model to update the DataTable require the ID of the row you want change and the new data Object of the row

```typescript
DataRowUpdateModel {
    obj: any;
    id: string;
}
```

For example if your table use entry nodes you can pass:

```typescript
this.dataTableService.rowUpdate.next({id: node.id, obj: {entry: node}});
```

As good practice is better to provide a [`DataTableService`](../../lib/core/src/lib/datatable/services/datatable.service.ts) in the component where you are going to deliver the new object

```typescript
@Component({
    selector: 'app-files-component',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        DataTableService
    ]
})
export class FilesComponent implements OnInit {

    constructor(private dataTableService: DataTableService,
                private nodeService: NodesApiService) {
    }
    
    ngOnInit() {
        this.nodeService.nodeUpdated.subscribe((node) => {
            this.dataTableService.rowUpdate.next({id: node.id, obj: {entry: node}});
        });
    }
```

### NodeNameTooltipPipe

[`NodeNameTooltipPipe`](../core/pipes/node-name-tooltip.pipe.md) has been moved in the `@alfresco/adf-content-services` in [`ContentPipeModule`](../../lib/content-services/src/lib/pipes/content-pipe.module.ts)

v6.0.0 and before:

    @NgModule({
        imports: [
        ````
        PipeModule
        ````    
         ]})

v6.0.0 and after:

    @NgModule({
        imports: [
        ````
        ContentPipeModule
        ````    
         ]})

### nodeUpdated Subject

The nodeUpdated [`Subject`](http://reactivex.io/documentation/subject.html) has been moved from [`AlfrescoApiService`](../core/services/alfresco-api.service.md) to [`NodesApiService`](../core/services/nodes-api.service.md)

v6.0.0 and before:

     this.alfrescoApiService.nodeUpdated.pipe .....

v6.0.0 and after:

     this.nodesApiService.nodeUpdated.pipe .....

### Comments component

`adf-comments` component is now a real presentational components. The `taskId` and `nodeId` has now renamed to `id`
The `adf-comments` has now two specialization in :

-   `adf-node-comments` [Node Comments Componen](../content-services/components/node-comments.component.md)
-   `adf-task-comments` [Task Comments Component](../process-services/components/task-comments.component.md)

### ViewerComponent

From v.6.0.0 and after [`ViewerComponent`](../core/components/viewer.component.md) no longer show content from ACS, so instead of taking `nodeId` as `@Input`, it takes `blobFile` and `urlFile`. For more details check the [`PR`](https://github.com/Alfresco/alfresco-ng2-components/pull/7992).
If you need to display content from ACS you can use instead the new [`AlfrescoViewerComponent`](../content-services/components/alfresco-viewer.component.md)

### UserInfoComponent

From v.6.0.0 and after [`UserInfoComponent`](../../lib/core/src/lib/userinfo/components/user-info.component.ts) is no longer active.

In its place there are now 3 presentational components:

-   [`IdentityUserInfoComponent`](../core/components/identity-user-info.component.md) present in core
-   [`ContentUserInfoComponent`](../content-services/components/content-user-info.component.md) present in content-services
-   [`ProcessUserInfoComponent`](../process-services/components/process-user-info.component.md) present in process-services

To build a similar logic to the one in [`UserInfoComponent`](../../lib/core/src/lib/userinfo/components/user-info.component.ts) check implementation on [`demo-shell`](../../demo-shell/src/app/components/app-layout/user-info/user-info.component.ts)

## Renamed items

### New Classes or Services

-   [`AlfrescoViewerComponent`](../content-services/components/alfresco-viewer.component.md)
-   [`ViewerRenderComponent`](../core/components/viewer-render.component.md) 

### Properties and methods

### Component selectors

## Theme changes

v6.0.0 has improved the way that typography is injected into the ADF theme. Now the typography of ADF is taken from the material theme following the material design specifications : 

before v6.0.0

    @include mat-core($typography);
    $primary: mat.define-palette($primary);
    $accent: mat.define-palette($accent);
    $warn: mat.define-palette($warn);
    $theme:   mat-light-theme($primary, $accent, $warn);

typography was already predefined inside ADF theme but this will prevent to inject different typography.

v6.0.0 and after 

    $typography: mat.define-typography-config(
       ...define your typography following material specifications
    );

    $primary: mat.define-palette($primary);
    $accent: mat.define-palette($accent);
    $warn: mat.define-palette($warn);
    $theme: mat.define-light-theme(
        (
            color: (
                primary: $primary,
                accent: $accent,
                warn: $warn
            ),
            typography: $typography
        )
    );

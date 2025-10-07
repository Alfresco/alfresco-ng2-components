---
Title: Upgrading from ADF v5.0 to v6.0
---

# Upgrading from ADF v5.0 to v6.0

This guide provides instructions on how to upgrade your v5.0.0 ADF projects to v6.0.0.

**Warning**: Be sure to follow the guide below to migrate your application to the new version.
You can't update Angular and ADF applications more than one major version at a time.

## Before you begin

Always perform upgrades on "clean" project state, backup your changes or make a project backup.

Since 6.0.0 is a major version release, there are [breaking changes](#breaking-changes)
you need to take into account as well as the usual library updates. 

After the upgrade, check other sections to see if there are any changes affecting your project.

## Contents

- [Library updates](#library-updates)
- [Breaking changes](#breaking-changes)
- [Library to update](#library-to-update)
- [Deprecated items](#deprecated-items)
  - [DataColumnModule](#datacolumnmodule)
  - [PaginationModel](#paginationmodel)
- [Relocated classes](#relocated-classes)
  - [Update Data-table a data change](#update-data-table-a-data-change)
  - [NodeNameTooltipPipe](#nodenametooltippipe)
  - [nodeUpdated Subject](#nodeupdated-subject)
  - [Comments component](#comments-component)
  - [ViewerComponent](#viewercomponent)
  - [UserInfoComponent](#userinfocomponent)
- [Renamed items](#renamed-items)
  - [New Classes or Services](#new-classes-or-services)
  - [Properties and methods](#properties-and-methods)
  - [Component selectors](#component-selectors)
- [Theme changes](#theme-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "6.0.0",
        "@alfresco/adf-content-services": "6.0.0",
        "@alfresco/adf-process-services-cloud": "6.0.0",
        "@alfresco/adf-insights": "6.0.0",
        "@alfresco/js-api": "6.0.0"
    }
}
```

Clean your old distribution and dependencies by deleting `node_modules` and `package-lock.json`.

Reinstall your dependencies

```sh
npm install
```

## Breaking changes

The ADF project follows the [semver](https://semver.org/) conventions,
breaking changes are introduced in _major_ versions.

ADF 6.0.0 is the first major version since general availability so a number of
deprecated items have been removed and also some existing items have been
renamed. The sections below explain how to adapt your project to the changes
coming with 6.0.0 release.

## Directives

| Name | Description |
| --- | --- |
| [`CheckAllowableOperationDirective`](../content-services/directives/check-allowable-operation.directive.md)| Moved from ADF Core to ADF content services |
| [`LibraryFavoriteDirective`](../../lib/content-services/src/lib/directives/library-favorite.directive.ts) | Moved from ADF Core to ADF content services |
| [`LibraryMembershipDirective`](../../lib/content-services/src/lib/directives/library-membership.directive.ts) | Moved from ADF Core to ADF content services |
| [`NodeDeleteDirective`](../content-services/directives/node-delete.directive.md) | Moved from ADF Core to ADF content services | 
| [`NodeFavoriteDirective`](../content-services/directives/node-favorite.directive.md) | Moved from ADF Core to ADF content services |
| [`NodeRestoreDirective`](../content-services/directives/node-restore.directive.md) | Moved from ADF Core to ADF content services |

## Third-party Libraries

| Name | Version |
| ---- | ------- |
| `pdfjs-dist` | `3.3.122` |

## Deprecated Items

| Class | Before | Description |
| ----- | ------ | ----------- |
| [`LoginDialogService`](../core/services/login-dialog.service.md) | `@alfresco/adf-core` |  |
| [`DeletedNodesApiService`](../core/services/deleted-nodes-api.service.md) | `@alfresco/adf-core` |  |
| [`BpmUserService`](../core/services/bpm-user.service.md) | `@alfresco/adf-core` | you can use instead the [`PeopleProcessService`](../core/services/people-process.service.md) |
| [`UserContentAccessService`](../../lib/core/src/lib/services/user-content-access.service.ts) | `@alfresco/adf-core` | you can use instead the [`PeopleContentService`](../core/services/people-content.service.md) |
| [`EcmUserService`](../core/services/ecm-user.service.md) | `@alfresco/adf-core` | you can use instead the [`PeopleContentService`](../core/services/people-content.service.md) |

### DataColumnModule

[`DataColumnModule`](../../lib/core/src/lib/datatable/data-column/data-column.module.ts)  has been deprecated and moved in [`DataTableModule`](../../lib/core/src/lib/datatable/datatable.module.ts) 

Before:

```ts
@NgModule({
    imports: [
        DataColumnModule,
        DataTableModule
    ]
})
export class MyModule {}
```

After:

```ts
@NgModule({
    imports: [
        DataTableModule,
    ]
})
export class MyModule {}
```

### PaginationModel

`Pagination` model from `@alfresco/js-api` has been now deprecated in favour of ADF model [`PaginationModel`](../../lib/core/src/lib/models/pagination.model.ts).

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

### DataTable changes

Starting with v6.0.0, you need to provide a [`DataTableService`](../../lib/core/src/lib/datatable/services/datatable.service.ts) to update a row of your table.
The model to update the DataTable require the `id` of the row that is being changed, and the new data Object of the row:

```typescript
interface DataRowUpdateModel {
    obj: any;
    id: string;
}
```

For example, if your table use entry nodes you can pass:

```typescript
this.dataTableService.rowUpdate.next({
    id: node.id, 
    obj: {
        entry: node
    }
});
```

As good practice, it is suggested to provide a [`DataTableService`](../../lib/core/src/lib/datatable/services/datatable.service.ts) at the component level:

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
            this.dataTableService.rowUpdate.next({
                id: node.id, 
                obj: {
                    entry: node
                }
            });
        });
    }
}
```

### NodeNameTooltipPipe

[`NodeNameTooltipPipe`](../core/pipes/node-name-tooltip.pipe.md) has been moved to the `@alfresco/adf-content-services` into the [`ContentPipeModule`](../../lib/content-services/src/lib/pipes/content-pipe.module.ts)

Before:

```ts
@NgModule({
    imports: [
        PipeModule
    ]
})
export class MyModule {}
```

After:

```ts
@NgModule({
    imports: [
        ContentPipeModule
    ]
})
export class MyModule {}
```

### nodeUpdated Subject

The `nodeUpdated` [`Subject`](http://reactivex.io/documentation/subject.html) has been moved from [`AlfrescoApiService`](../core/services/alfresco-api.service.md) to [`NodesApiService`](../core/services/nodes-api.service.md)

Before:

```ts
this.alfrescoApiService.nodeUpdated.pipe(...).subscribe(...);
```

After:

```ts
this.nodesApiService.nodeUpdated.pipe(...).subscribe(...);
```

### Comments component

`adf-comments` component is now a presentational components. The `taskId` and `nodeId` has been merged and moved to the `id` property.

The `adf-comments` has now two specialization in :

- `adf-node-comments` [Node Comments Component](../content-services/components/node-comments.component.md)
- `adf-task-comments` [Task Comments Component](../process-services/components/task-comments.component.md)

### ViewerComponent

The [`ViewerComponent`](../core/components/viewer.component.md) no longer shows content from ACS, so instead of taking `nodeId` as `@Input`, it takes `blobFile` and `urlFile`. 

For more details check the [`PR`](https://github.com/Alfresco/alfresco-ng2-components/pull/7992).
If you need to display content from ACS you can use instead the new [`AlfrescoViewerComponent`](../content-services/components/alfresco-viewer.component.md)

### UserInfoComponent

The [`UserInfoComponent`](../../lib/core/src/lib/userinfo/components/user-info.component.ts) is no longer active.

In its place there are now 3 presentational components:

- [`IdentityUserInfoComponent`](../core/components/identity-user-info.component.md) (Core)
- [`ContentUserInfoComponent`](../content-services/components/content-user-info.component.md) (Content Services)
- [`ProcessUserInfoComponent`](../process-services/components/process-user-info.component.md) (Process Services)

To build a similar logic to the one in [`UserInfoComponent`](../../lib/core/src/lib/userinfo/components/user-info.component.ts), check example implementation in [`demo-shell`](../../demo-shell/src/app/components/app-layout/user-info/user-info.component.ts).

## Renamed items

### New Classes or Services

- [`AlfrescoViewerComponent`](../content-services/components/alfresco-viewer.component.md)
- [`ViewerRenderComponent`](../core/components/viewer-render.component.md) 

## Theme changes

v6.0.0 has improved the way that typography is injected into the ADF theme. Now the typography of ADF is taken from the Material Theme following the Material design specifications. 

Before:

```scss
@include mat-core($typography);

$primary: mat.define-palette($primary);
$accent: mat.define-palette($accent);
$warn: mat.define-palette($warn);
$theme: mat-light-theme($primary, $accent, $warn);
```

The typography was already predefined inside ADF theme but this prevents customisations.

After:

```scss
$typography: mat.define-typography-config(
    // ...define your typography following material specifications
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
```

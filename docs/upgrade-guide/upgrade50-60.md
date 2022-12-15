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
-   [Deprecated items](#deprecated-items)
    -   [PaginationModel](#paginationmodel)
-   [Relocated classes](#relocated-classes)
    -   [NodeNameTooltipPipe](#nodenametooltippipe)
    -   [nodeUpdated Subject](#nodeupdated-subject)
-   [Renamed items](#renamed-items)
    -   [New Classes or Services](#new-classes-or-services)
    -   [Properties and methods](#properties-and-methods)
    -   [Component selectors](#component-selectors)

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

[TODO ADD HERE the PRs ] 
[`CheckAllowableOperationDirective`](../content-services/directives/check-allowable-operation.directive.md): Moved from ADF Core to ADF content services
[LibraryFavoriteDirective](../../lib/content-services/src/lib/directives/library-favorite.directive.ts): Moved from ADF Core to ADF content services
[LibraryMembershipDirective](../../lib/content-services/src/lib/directives/library-membership.directive.ts): Moved from ADF Core to ADF content services
[NodeDeleteDirective](../content-services/directives/node-delete.directive.md): Moved from ADF Core to ADF content services
[NodeFavoriteDirective](../content-services/directives/node-favorite.directive.md): Moved from ADF Core to ADF content services
[NodeRestoreDirective](../content-services/directives/node-restore.directive.md): Moved from ADF Core to ADF content services
[TODO ADD HERE the PRs ] 

Each section needs to contains:
Title
Description
How to fix it:

## Deprecated items


### DataColumnModule

```DataColumnModule```  has been deprecated and moved in ```DataTableModule``` 

v6.0.0 and before:
```
@NgModule({
    imports: [
    ```
    DataColumnModule,
    DataTableModule
    ```    
])
```

v6.0.0 and after:
```
@NgModule({
    imports: [
    ```
    DataTableModule,
    ```    
])
```

### PaginationModel

`Pagination` model from `@alfresco/js-api` has been now deprecated in favour of internal implementated model [`PaginationModel`](../../lib/core/src/lib/models/pagination.model.ts) evrywhere

## Relocated classes

| Class | Before | After |
| --- | -- | --- |
| `VersionCompatibilityService` | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| `VersionCompatibilityDirective` | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| `SitesService` | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| `SearchService` | `@alfresco/adf-core` | `@alfresco/adf-content-services` |
| `AppsProcessService` | `@alfresco/adf-core` | `@alfresco/adf-process-services` |

Following classes have been relocated:

The following directives have been moved from the Core library to the Content Services
library. You should modify your code to import these classes from
`@alfresco/adf-content-services`.

-   [`CheckAllowableOperationDirective`](../content-services/directives/check-allowable-operation.directive.md)
-   [`LibraryFavoriteDirective`](../../lib/content-services/src/lib/directives/library-favorite.directive.ts)
-   [`LibraryMembershipDirective`](../../lib/content-services/src/lib/directives/library-membership.directive.ts)
-   [`NodeDeleteDirective`](../content-services/directives/node-delete.directive.md)
-   [`NodeFavoriteDirective`](../content-services/directives/node-favorite.directive.md)
-   [`NodeRestoreDirective`](../content-services/directives/node-restore.directive.md)

### NodeNameTooltipPipe

[NodeNameTooltipPipe](../core/pipes/node-name-tooltip.pipe.md) has been moved in the `@alfresco/adf-content-services` in `ContentPipeModule`

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

The nodeUpdated [Subject](http://reactivex.io/documentation/subject.html) has been moved from [AlfrescoApiService](../core/services/alfresco-api.service.md) to [NodesApiService](../core/services/nodes-api.service.md)

v6.0.0 and before:

     this.alfrescoApiService.nodeUpdated.pipe .....

v6.0.0 and after:

     this.nodesApiService.nodeUpdated.pipe .....

## Renamed items

### New Classes or Services

### Properties and methods

-   `<adf-comments>`: The `taskId` input has now been renamed as `id`

### Component selectors

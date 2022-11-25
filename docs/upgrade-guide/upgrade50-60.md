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
    -   [Viewer Component](#viewer-component)
-   [See also](#see-also)
-   [Relocated classes](#relocated-classes)
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

## Deprecated items

### PaginationModel
``Pagination`` model from ```@alfresco/js-api``` has been now deprecated in favour of internal implementated model ```PaginationModel``` evrywhere

## Relocated classes

Following classes have been relocated:
- `VersionCompatibilityService` and `VersionCompatibilityDirective` relocated from `@alfresco/adf-core` to `@alfresco/adf-content-services`
The following directives have been moved from the Core library to the Content Services
library. You should modify your code to import these classes from
`@alfresco/adf-content-services`.

-   [`CheckAllowableOperationDirective`](lib/content-services/src/lib/directives/check-allowable-operation.directive.ts)
-   [`LibraryFavoriteDirective`](lib/content-services/src/lib/directives/library-favorite.directive.ts)
-   [`LibraryMembershipDirective`](lib/content-services/src/lib/directives/library-membership.directive.ts)
-   [`NodeDeleteDirective`](lib/content-services/src/lib/directives/node-delete.directive.ts)
-   [`NodeFavoriteDirective`](lib/content-services/src/lib/directives/node-favorite.directive.ts)
-   [`NodeRestoreDirective`](lib/content-services/src/lib/directives/node-restore.directive.ts)


### NodeNameTooltipPipe

NodeNameTooltipPipe has been moved in the ```@alfresco/adf-content-services``` in ```ContentPipeModule```

v6.0.0 and before:

```
@NgModule({
    imports: [
    ````
    PipeModule
    ````    
     ]})
```

v6.0.0 and after:

```
@NgModule({
    imports: [
    ````
    ContentPipeModule
    ````    
     ]})
```

## Renamed items
### Viewer Component

The generic `adf-viewer` has been deprecated in favour of a new design where the viewer has been split in two parts:

v6.0.0 and before:

    <adf-viewer 
        [showViewer]="true" 
        [overlayMode]="true" 
        [nodeId]="'d367023a-7ebe-4f3a-a7d0-4f27c43f1045'">
    </adf-viewer>

v6.0.0 and after:

    <adf-alfresco-viewer
    [showViewer]="true"
    [overlayMode]="true"
    [nodeId]="'d367023a-7ebe-4f3a-a7d0-4f27c43f1045'">
    </adf-alfresco-viewer>

The adf-viewer is now split in Render and Viewer. This will allow us to reuse the render technology behind the viewer in more context and will allow also other developers to use this component as base of more custom viewers.

The `adf-alfresco-viewer` use now inside the `adf-viewer-render`. The `adf-viewer-render` is agnostic and only accept as input URL of a file or a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob).

v6.0.0 and after:

    <adf-viewer-render 
        [overlayMode]="true" 
        [blobFile]="myBlobVar">
    </adf-viewer-render>
    <adf-viewer-render 
        [overlayMode]="true" 
        [urlFile]="'filename.pdf'">
    </adf-viewer-render>

## See also

-   [Alfresco Viewer component](../content-services/components/alfresco-viewer.component.md)
-   [Viewer Render component](../content-services/components/alfresco-viewer.component.md)

## Relocated classes

## Renamed items

### New Classes or Services

### Properties and methods
- `<adf-comments>`: The `taskId` input has now been renamed as `id`

### Component selectors

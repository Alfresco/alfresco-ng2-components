---
Title: Upgrading from ADF v2.6 to v3.0
---

# Upgrading from ADF v2.6 to v3.0

This guide explains how to upgrade your ADF v2.6 project to work with v3.0.

Do not skip this task, if you want your application to be updated to a most recent version of ADF. Upgrades of multiple versions of ADF cannot be done in one step only, but should follow the chain of sequential updates. 

**Note:** the steps described below might involve making significant changes
to your code. If you are working with a versioning system then you should
commit any changes you are currently working on. If you aren't using versioning
then be sure to make a backup copy of your project before going ahead with the
upgrade.

Since 3.0 is a major version release, there are [breaking changes](#breaking-changes)
you need to take into account as well as the usual library updates. After updating
the libraries, check the other sections to see if any of the changes affect your
project.

## Contents

-   [Library updates](#library-updates)
    -   [Automatic update using the Yeoman Generator](#automatic-update-using-the-yeoman-generator)
    -   [Manual update](#manual-update)
-   [Breaking changes](#breaking-changes)
-   [JS-API changes](#js-api-changes)
-   [Permissions vs Allowable Operations](#permissions-vs-allowable-operations)
-   [Deprecated items](#deprecated-items)
-   [Relocated classes](#relocated-classes)
-   [Renamed items](#renamed-items)
    -   [Classes](#classes)
    -   [Properties and methods](#properties-and-methods)
    -   [Component selectors](#component-selectors)
-   [CSS classes with "adf-" prefix added](#css-classes-with-adf--prefix-added)
    -   [Content services CSS classes](#content-services-css-classes)
    -   [Core CSS classes](#core-css-classes)
    -   [Insights CSS classes](#insights-css-classes)
    -   [Process services cloud CSS classes](#process-services-cloud-css-classes)
    -   [Process services CSS classes](#process-services-css-classes)

## Library updates

### Automatic update using the Yeoman Generator

If your application has few changes from the original app created by the
[Yeoman generator](https://github.com/Alfresco/generator-ng2-alfresco-app)
then you may be able to update your project with the following steps:

1.  Update the Yeoman generator to the latest version (3.0.0). Note that
    you might need to run these commands with `sudo` on Linux or MacOS:

    ```sh
    npm uninstall -g generator-alfresco-adf-app
    npm install -g generator-alfresco-adf-app
    ```

2.  Run the new yeoman app generator:

    ```sh
    yo alfresco-adf-app
    ```

3.  Clean your old distribution and dependencies by deleting the `node_modules` folder
    and the `package-lock.json` file.

4.  Install the dependencies:
    ```sh
    npm install
    ```

At this point, the generator might have overwritten some of your code where it differs from
the original generated app. Be sure to check for any differences from your project code 
(using a versioning system might make this easier) and if there are any differences,
retrofit your changes. When you have done this, you should be able to start the application
as usual:

```sh
npm run start
```

After starting the app, if everything is working fine, that's all and you don't need to do anything else. However, if things don't work as they should then recover the original version of the project and try the manual approach.

### Manual update

1.  Update the `package.json` file with the latest library versions:

    ```json
    "dependencies": {
        ...
        "@alfresco/adf-core": "3.0.0",
        "@alfresco/adf-content-services": "3.0.0",
        "@alfresco/adf-process-services-cloud": "3.0.0",
        "@alfresco/adf-insights": "3.0.0",
        "@alfresco/js-api": "3.0.0",
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
ADF 3.0 is the first major version since general availability so a number of
deprecated items have been removed and also some existing items have been
renamed. The sections below explain how to adapt your project to the changes
in 3.0. See also our
[breaking changes](../breaking-changes/breaking-change-2.6.0-3.0.0.md)
document for more information about the changes and links to the associated
pull requests.

-   [JS-API changes](#js-api-changes)
-   [Permissions vs Allowable Operations](#permissions-vs-allowable-operations)
-   [Deprecated items](#deprecated-items)
-   [Relocated classes](#relocated-classes)
-   [Renamed items](#renamed-items)
-   [CSS classes with "adf-" prefix added](#css-classes-with-adf--prefix-added)

## JS-API changes

The name package of the JS-API has been modified to use the `@alfresco` namespace and so
you should change all `alfresco-js-api` imports to `@alfresco/js-api`.
See the
[JS-API documentation](https://github.com/Alfresco/alfresco-js-api)
for more details on how to use the new v3.0.0
[Legacy Endpoint porting](https://github.com/Alfresco/alfresco-js-api#legacy-endpoint-porting-ver-2xx).

Also, the JS-API `callApi` method signature has been modified. The `authNames`
parameter has been removed because the type of authentication is configured
when the JS-API is constructed. You should remove references to `authNames`
from your code.

v2.6.1 and before:

```ts
callApi(
    path: string,
    httpMethod: string,
    pathParams?: any,
    queryParams?: any,
    headerParams?: any,
    formParams?: any,
    bodyParam?: any,
    authNames?: string[],
    contentTypes?: string[],
    accepts?: string[],
    returnType?: any,
    contextRoot?: string,
    responseType?: string
): Promise<any>;
```

After v3.0.0:

```ts
callApi(
    path: string,
    httpMethod: string,
    pathParams?: any,
    queryParams?: any,
    headerParams?: any,
    formParams?: any,
    bodyParam?: any,
    contentTypes?: string[],
    accepts?: string[],
    returnType?: any,
    contextRoot?: string,
    responseType?: string
): Promise<any>;
```

## Permissions vs Allowable Operations

The `hasPermission` method in the [`ContentService`](../core/services/content.service.md)
was found to be actually checking the `allowableOperation` value. To reflect this,
the method has been renamed as `hasAllowableOperations` and a new `hasPermission`
method has been added (this one checks the permissions correctly as expected).

If you were using the old `hasPermission` method successfully in v2.6 then you should
update your code to use `hasAllowableOperations`, which has the same behavior. If your
code was having problems with the earlier incorrect behavior of `hasPermission` then
you should find it now works correctly.

Related to this issue is the `hasPermission` method of the
[Document List Service](../content-services/services/document-list.service.md) which has been
made redundant by
[`ContentService`](../core/services/content.service.md)`.hasAllowableOperations` and has now been removed.

Also, the former [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) Permission Directive has now been renamed as the
[Check Allowable Operation directive](../core/directives/check-allowable-operation.directive.md)
to better reflect its true behavior. You should therefore replace existing references to
`adf-node-permission` with `adf-check-allowable-operation`.

## Deprecated items

The deprecated items listed below have been removed from ADF as of v3.0. You should
update your code to use the suggested fix for each item that affects your project.

-   The `adf-accordion` and `adf-accordion-group` components have been removed.
    Replace instances of these components with the Angular
    [`mat-accordion`](https://material.angular.io/components/expansion/overview#accordion)
    component. See the
    [`mat-expansion-panel`](https://material.angular.io/components/expansion/overview)
    doc page for an example of how to do this.

-   [Viewer component](../core/components/viewer.component.md): The `allowShare` input has been removed. Inject the
    [Share Directive](../content-services/directives/content-node-share.directive.md) in a
    [custom toolbar](../core/components/viewer.component.md#custom-toolbar) to recreate the behavior of the Share button.

-   [Viewer component](../core/components/viewer.component.md): The handling of the sidebar has been updated to allow left and right sidebars
    at the same time. The following properties have changed, so you should
    update your code to use the new properties:

    -   The `allowSidebar` input has now been split into `allowLeftSidebar` and `allowRightSidebar`.
    -   The `showSidebar` input has now been split into `showLeftSidebar` and `showRightSidebar`.
    -   The `sidebarTemplate` input has now been split into `sidebarLeftTemplate` and 
        `sidebarRightTemplate`.
    -   The `sidebarPosition` input has been removed (the other new inputs render it obsolete).

-   The `createFolder` event of the [`UploadBase`](../../lib/content-services/src/lib/upload/components/base-upload/upload-base.ts)
    class (emitted when a folder was created) has been removed. You should modify your code to use the `success` event instead.

-   [Login component](../core/components/login.component.md): Two inputs have been removed: `disableCsrf` and `providers`. Set the
    properties with the same names in `app.config.json` to get the same effect.

-   [File Draggable Directive](../content-services/directives/file-draggable.directive.md): The `file-draggable` event has been removed.
    Use `filesDropped` instead to get the same effect.

-   [Search control component](../content-services/components/search-control.component.md): The `QueryBody`, and
    `customQueryBody` inputs of the [`SearchControlComponent`](../content-services/components/search-control.component.md) have been removed. See the
    [Search configuration interface](../core/interfaces/search-configuration.interface.md)
    page to learn how to get the same functionality.

-   [Document list component](../content-services/components/document-list.component.md): Several inputs have been removed or replaced:

    -   The `skipCount` input has been removed. You can define
        the same value in pagination using the `pageSize` property.
    -   The `enableInfiniteScrolling` input has been removed. To choose the pagination strategy,      add either the
        [Infinite Pagination Component](../core/components/infinite-pagination.component.md) or the normal [Pagination Component](../core/components/pagination.component.md) and assign
        your document list as the `target`.
    -   The `folderNode` input has been removed. Use the `currentFolderId` and `node` inputs 
            instead.

-   The `SettingsService` class has been removed. Access the equivalent properties with the
    [App config service](../core/services/app-config.service.md)

-   [Form service](../core/services/form.service.md): the `addFieldsToAForm` method has been removed.

## Relocated classes

The following classes have been moved from their original libraries to the Core
library. You should modify your code to import these classes from
`@alfresco/adf-core`.

-   [`DownloadZipDialogComponent`](../../lib/content-services/src/lib/dialogs/download-zip/download-zip.dialog.ts) (formerly Content Services)
-   [`NodeDownloadDirective`](../core/directives/node-download.directive.md) (formerly Content Services)
-   [`CommentsModule`](../../lib/core/src/lib/comments/comments.module.ts) (formerly Process Services)
-   [`CommentListComponent`](../core/components/comment-list.component.md) (formerly Process Services)
-   [`CommentsComponent`](../core/components/comments.component.md)  (formerly Process Services)

Also, `CommentProcessModel` was moved from Process Services to Core and renamed as [`CommentModel`](../../lib/core/src/lib/models/comment.model.ts). You should update both the name of the class and the import line in your code.

## Renamed items

The items listed below have been renamed (the old names have been deprecated for
some time but have now been removed). If your code refers to the old names then
you should replace them with the new ones.

### Classes

`CommentProcessModel` was moved from Process Services to Core and renamed as [`CommentModel`](../../lib/core/src/lib/models/comment.model.ts)

### Properties and methods

-   `<adf-form>`: The `onError` event has now been renamed as `error`.
-   `<adf-viewer>`: The `fileNodeId` input that supplies the [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) Id of the file to 
    load has been renamed as `nodeId`.
-   `<adf-upload-drag-area>`:  The `parentId` input has been renamed as `rootFolderId`.

### Component selectors

-   `adf-filters` is now `adf-task-filters`.
-   `adf-node-permission` is now `adf-check-allowable-operation`.
-   `analytics-report-list` is now `adf-analytics-report-list`.
-   `analytics-report-parameters` is now `adf-analytics-report-parameters`.
-   `context-menu-holder` is now `adf-context-menu-holder`.
-   `diagram-alfresco-publish-task` is now `adf-diagram-publish-task`.
-   `diagram-sequence-flow` is now `adf-diagram-sequence-flow`.
-   `file-uploading-dialog` is now  `adf-file-uploading-dialog`.

## CSS classes with "adf-" prefix added

A new style linting rule requires all CSS classes defined by ADF to have the prefix
`adf-`. If you use modified versions of these classes then you will need to add the
`adf-` prefix to the appropriate class names for them to be recognised.

The names of the changed classes are listed below according to the file in which
they are defined. The new form of the name (ie, with the `adf-` prefix added) is
listed but there are a few exceptions where the names were also altered in other ways.
These changes are noted with an arrow "->".

-   [Content services CSS classes](#content-services-css-classes)
-   [Core CSS classes](#core-css-classes)
-   [Insights CSS classes](#insights-css-classes)
-   [Process services cloud CSS classes](#process-services-cloud-css-classes)
-   [Process services CSS classes](#process-services-css-classes)

### Content services CSS classes

#### [../../lib/content-services/breadcrumb/breadcrumb.component.scss](../../lib/content-services/breadcrumb/breadcrumb.component.scss)

-   `adf-isRoot`
-   `adf-focus`
-   `adf-active`

#### [../../lib/content-services/content-node-selector/content-node-selector-panel.component.scss](../../lib/content-services/content-node-selector/content-node-selector-panel.component.scss)

-   `adf-search-results-label`
-   `adf-dropdown-breadcrumb-item-chevron`

#### [../../lib/content-services/permission-manager/components/add-permission/add-permission-dialog.component.scss](../../lib/content-services/permission-manager/components/add-permission/add-permission-dialog.component.scss)

-   `adf-choose-action`

#### [../../lib/content-services/content-node-selector/content-node-selector.component.scss](../../lib/content-services/content-node-selector/content-node-selector.component.scss)

-   `adf-choose-action`

#### [../../lib/content-services/content-node-share/content-node-share.dialog.scss](../../lib/content-services/content-node-share/content-node-share.dialog.scss)

-   `adf-input-action`
-   `adf-full-width`

#### [../../lib/core/dialogs/download-zip.dialog.scss](lib/core/src/lib/dialogs/download-zip.dialog.scss)

-   `adf-spacer`

#### [../../lib/content-services/document-list/components/document-list.component.scss](../../lib/content-services/document-list/components/document-list.component.scss)

-   `adf-document-list_empty_template`
-   `adf-document-list__this-space-is-empty`
-   `adf-document-list__drag-drop`
-   `adf-document-list__any-files-here-to-add`
-   `adf-document-list__empty_doc_lib`
-   `adf-cell-container`
-   `adf-cell-value`

#### [../../lib/content-services/search/components/search-check-list/search-check-list.component.scss](../../lib/content-services/search/components/search-check-list/search-check-list.component.scss)

-   `adf-facet-filter`
-   `adf-facet-name`

#### [../../lib/content-services/search/components/search-control.component.scss](../../lib/content-services/search/components/search-control.component.scss)

-   `adf-highlight`

#### [../../lib/content-services/search/components/search-filter/search-filter.component.scss](../../lib/content-services/search/components/search-filter/search-filter.component.scss)

-   `adf-checklist`
-   `adf-facet-label`
-   `adf-facet-result-filter`
-   `adf-facet-buttons`

#### [../../lib/content-services/search/components/search-radio/search-radio.component.scss](../../lib/content-services/search/components/search-radio/search-radio.component.scss)

-   `adf-facet-filter`
-   `adf-filter-label`

#### [../../lib/content-services/site-dropdown/sites-dropdown.component.scss](../../lib/content-services/site-dropdown/sites-dropdown.component.scss)

-   `adf-full-width`

#### [../../lib/content-services/upload/components/file-uploading-dialog.component.scss](../../lib/content-services/upload/components/file-uploading-dialog.component.scss)

-   `adf-upload-dialog`
-   `adf-upload-dialog__content`

#### [../../lib/content-services/version-manager/version-manager.component.scss](../../lib/content-services/version-manager/version-manager.component.scss)

-   `adf-upload-new-version`

### Core CSS classes

#### [../../lib/core/about/about.component.scss](lib/core/src/lib/about/about.component.scss)

-   `adf-about-container`

#### [../../lib/core/buttons-menu/buttons-menu.component.scss](lib/core/src/lib/buttons-menu/buttons-menu.component.scss)

-   `adf-material-icons`

#### [../../lib/core/card-view/components/card-view-keyvaluepairsitem/card-view-keyvaluepairsitem.component.scss](lib/core/src/lib/card-view/components/card-view-keyvaluepairsitem/card-view-keyvaluepairsitem.theme.scss)

-   `adf-card-view`

#### [../../lib/core/comments/comment-list.component.scss](lib/core/src/lib/comments/comment-list.theme.scss)

-   `adf-is-selected`

#### [../../lib/core/datatable/components/datatable/datatable.component.scss](lib/core/src/lib/datatable/components/datatable/datatable.component.scss)

-   `adf-is-selected`
-   `alfresco-datatable__actions-cell` -> `adf-datatable__actions-cell`
-   `adf-image-table-cell`
-   `adf-cell-container`
-   `adf-no-select`
-   `adf-sortable`
-   `adf-cell-value`
-   `adf-full-width`
-   `adf-ellipsis-cell`
-   `adf-sr-only`
-   `adf-hidden`
-   `adf-desktop-only`

#### [../../lib/core/form/components/form.component.scss](lib/core/src/lib/form/components/form.component.scss)

-   `adf-debug-toggle-text`
-   `adf-invalid-color`

#### [../../lib/core/form/components/widgets/container/container.widget.scss](lib/core/src/lib/form/components/widgets/container/container.widget.scss)

-   `adf-hidden`
-   `adf-container-widget__header-text`
-   `adf-collapsible`
-   `adf-grid-list`
-   `adf-grid-list-item`

#### [../../lib/core/form/components/widgets/dynamic-table/dynamic-table.widget.scss](lib/process-services/src/lib/form/widgets/dynamic-table/dynamic-table.widget.scss)

-   `adf-is-selected`
-   `adf-no-select`
-   `adf-sortable`
-   `adf-full-width`

#### [../../lib/core/layout/components/layout-container/layout-container.component.scss](lib/core/src/lib/layout/components/layout-container/layout-container.component.scss)

-   `adf-sidenav--hidden`

#### [../../lib/core/layout/components/sidenav-layout/sidenav-layout.component.scss](lib/core/src/lib/layout/components/sidenav-layout/sidenav-layout.component.scss)

-   `adf-sidenav-layout`
-   `adf-layout__content`

#### [../../lib/core/login/components/login-dialog-panel.component.scss](lib/core/src/lib/login/components/login-dialog-panel.component.scss)

-   `adf-copyright`

#### [../../lib/core/login/components/login.component.scss](lib/core/src/lib/login/components/login.component.scss)

-   `adf-ie11FixerParent`
-   `adf-ie11FixerChild`
-   `adf-show`
-   `adf-hide`
-   `adf-icon-inline`
-   `adf-error-icon`
-   `adf-isChecking`
-   `adf-isWelcome`
-   `adf-welcome-icon`
-   `adf-login-checking-spinner`
-   `adf-is-active`
-   `adf-copyright`
-   `adf-login-rememberme` -> - `adf-login-remember-me`

#### [../../lib/core/settings/host-settings.component.scss](lib/core/src/lib/settings/host-settings.component.scss)

-   `adf-full-width`

#### [../../lib/core/viewer/components/imgViewer.component.scss](lib/core/src/lib/viewer/components/img-viewer.component.scss)

-   `adf-image-container`

#### [../../lib/core/viewer/components/pdfViewer-thumbnails.component.scss](lib/core/src/lib/viewer/components/pdf-viewer-thumbnails.component.scss)

-   `adf-pdf-thumbnails`

#### [../../lib/core/viewer/components/pdfViewer.component.scss](lib/core/src/lib/viewer/components/pdf-viewer.component.scss)

-   `adf-loader-container`
-   `adf-thumbnails-template`
-   `adf-loader-item`

#### [../../lib/core/viewer/components/pdfViewerHost.component.scss](lib/core/src/lib/viewer/components/pdf-viewer-host.component.scss)

-   `adf-highlight`
-   `adf-begin`
-   `adf-end`
-   `adf-middle`
-   `adf-selected`
-   `adf-endOfContent`
-   `adf-active`
-   `adf-annotationLayer`
-   `adf-linkAnnotation`
-   `adf-textAnnotation`
-   `adf-popupWrapper`
-   `adf-popup`
-   `adf-highlightAnnotation`
-   `adf-underlineAnnotation`
-   `adf-squigglyAnnotation`
-   `adf-strikeoutAnnotation`
-   `adf-fileAttachmentAnnotation`
-   `adf-pdfViewer`
-   `adf-page`
-   `adf-loadingIcon`
-   `adf-removePageBorders`
-   `adf-hidden`
-   `adf-viewer-pdf-viewer`

#### [../../lib/core/viewer/components/viewer.component.scss](lib/core/src/lib/viewer/components/viewer.component.scss)

-   `adf-full-screen`
-   `adf-info-drawer-content`

### Insights CSS classes

#### [../../lib/insights/analytics-process/components/analytics-generator.component.scss](../../lib/insights/analytics-process/components/analytics-generator.component.scss)

-   `adf-chart`
-   `adf-analytics-row__entry`
-   `adf-report-icons`
-   `adf-full-width`
-   `adf-partial-width`
-   `adf-clear-both`

#### [../../lib/insights/analytics-process/components/analytics-report-list.component.scss](../../lib/insights/analytics-process/components/analytics-report-list.component.scss)

-   `adf-activiti-filters__entry`
-   `adf-activiti-filters__entry-icon`
-   `adf-activiti-filters__label`
-   `adf-active`
-   `adf-application-title`

#### [../../lib/insights/analytics-process/components/analytics-report-parameters.component.scss](../../lib/insights/analytics-process/components/analytics-report-parameters.component.scss)

-   `adf-dropdown-widget`
-   `adf-dropdown-widget__select`
-   `adf-dropdown-widget__invalid`
-   `adf-dropdown-widget__label`
-   `adf-is-hide`
-   `adf-report-container-setting`
-   `adf-option_button_details`
-   `adf-export-message`
-   `adf-save-export-input`
-   `adf-delete-parameter`
-   `adf-hide`

#### [../../lib/insights/analytics-process/components/analytics.component.scss](../../lib/insights/analytics-process/components/analytics.component.scss)

-   `adf-chart`

#### [../../lib/insights/analytics-process/components/widgets/duration/duration.widget.scss](../../lib/insights/analytics-process/components/widgets/duration/duration.widget.scss)

-   `adf-dropdown-container`

#### [../../lib/insights/diagram/components/tooltip/diagram-tooltip.component.scss](../../lib/insights/diagram/components/tooltip/diagram-tooltip.component.scss)

-   `adf-is-active`

### Process services cloud CSS classes

#### [../../lib/process-services-cloud/src/lib/app/components/app-details-cloud.component.scss](../../lib/process-services-cloud/src/lib/app/components/app-details-cloud.component.scss)

-   `adf-line-clamp`

#### [../../lib/process-services-cloud/src/lib/process/process-filters/components/process-filters-cloud.component.scss](../../lib/process-services-cloud/src/lib/process/process-filters/components/process-filters-cloud.component.scss)

-   `adf-active`

#### [../../lib/process-services-cloud/src/lib/process/process-list/components/process-list-cloud.component.scss](../../lib/process-services-cloud/src/lib/process/process-list/components/process-list-cloud.component.scss)

-   `adf-no-content-message`

#### [../../lib/process-services-cloud/src/lib/task/task-filters/components/task-filters-cloud.component.scss](../../lib/process-services-cloud/src/lib/task/task-filters/components/task-filters-cloud.component.scss)

-   `adf-active`

### Process services CSS classes

#### [../../lib/process-services/app-list/apps-list.component.scss](../../lib/process-services/app-list/apps-list.component.scss)

-   `adf-line-clamp`

#### [../../lib/process-services/attachment/process-attachment-list.component.scss](../../lib/process-services/attachment/process-attachment-list.component.scss)

-   `adf-data-cell`

#### [../../lib/process-services/attachment/task-attachment-list.component.scss](../../lib/process-services/attachment/task-attachment-list.component.scss)

-   `adf-data-cell`

#### [../../lib/process-services/content-widget/attach-file-widget-dialog.component.scss](../../lib/process-services/content-widget/attach-file-widget-dialog.component.scss)

-   `adf-choose-action`

#### [../../lib/process-services/people/components/people-search-field/people-search-field.component.scss](../../lib/process-services/people/components/people-search-field/people-search-field.component.scss)

-   `adf-search-text-container`
-   `adf-search-list-container`
-   `adf-people-pic`
-   `adf-people-img`

#### [../../lib/process-services/people/components/people-search/people-search.component.scss](../../lib/process-services/people/components/people-search/people-search.component.scss)

-   `adf-activiti-label`
-   `adf-fix-element-user-list`
-   `adf-search-text-header`
-   `adf-search-list-action-container`

#### [../../lib/process-services/people/components/people/people.component.scss](../../lib/process-services/people/components/people/people.component.scss)

-   `adf-assignment-header`
-   `adf-assignment-count`
-   `adf-add-people`
-   `adf-assignment-top-container`
-   `adf-assignment-top-container-content`
-   `adf-assignment-container`
-   `adf-assignment-list-container`
-   `adf-cell-container`
-   `adf-people-email`
-   `adf-people-img`

#### [../../lib/process-services/process-comments/process-comments.component.scss](../../lib/process-services/process-comments/process-comments.component.scss)

-   `adf-activiti-label`
-   `adf-icon`
-   `adf-list-wrap`
-   `adf-hide-long-names`

#### [../../lib/process-services/process-list/components/process-filters.component.scss](../../lib/process-services/process-list/components/process-filters.component.scss)

-   `adf-active`

#### [../../lib/process-services/task-list/components/checklist.component.scss](../../lib/process-services/task-list/components/checklist.component.scss)

-   `adf-activiti-label`
-   `adf-checklist-menu-container`
-   `adf-checklist-none-message`
-   `activiti-label` -> `adfactiviti-label`

#### [../../lib/process-services/task-list/components/start-task.component.scss](../../lib/process-services/task-list/components/start-task.component.scss)

-   `adf-people-widget-content`

#### [../../lib/process-services/task-list/components/task-details.component.scss](../../lib/process-services/task-list/components/task-details.component.scss)

-   `adf-error-dialog`
-   `adf-activiti-task-details__header`
-   `adf-activiti-task-details__action-button`
-   `adf-assignment-container`
-   `adf-task-header`
-   `adf-assign-edit-view`
-   `adf-property`

#### [../../lib/process-services/task-list/components/task-filters.component.scss](../../lib/process-services/task-list/components/task-filters.component.scss)

-   `adf-active`

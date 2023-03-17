---
Title: Breaking changes, 2.6.0 -> 3.0.0
---

# Breaking changes, 2.6.0 -> 3.0.0

This document lists all the deprecated ADF v2.x components that were removed for v3.0.0:

-   [PR ADF-3354](https://github.com/Alfresco/alfresco-ng2-components/pull/3980):
    The `adf-accordion` component has been removed.

    ```html
    <adf-accordion>
        <adf-accordion-group>
        ...
    ```

    Use the Angular Material [Expansion Panel](https://material.angular.io/components/expansion/api)
    as an alternative.

-   [PR ADF-3746](https://github.com/Alfresco/alfresco-ng2-components/pull/3975): In order to 
    prevent our ADF style classes interfering with other projects, a new set of style lint rules has
    been added. These rules enforce the use of the **adf-** prefix in all our classes. Please refer
    to the PR to see the list of the all styles that were changed. If you have been rewriting any ADF
    classes without the **adf-** prefix, you will now need to update them. For example, `.card-view`
    is now `.adf-card-view`.

-   [PR ADF-1443](https://github.com/Alfresco/alfresco-ng2-components/pull/4028): [`DownloadZipDialogComponent`](../../lib/content-services/src/lib/dialogs/download-zip/download-zip.dialog.ts)
    and [`NodeDownloadDirective`](../core/directives/node-download.directive.md) have been moved from the Content Services module to the Core module.
    This modification has enabled us to remove some code duplication between the two modules.

-   [PR ADF-1873](https://github.com/Alfresco/alfresco-ng2-components/pull/4145):
    -   `adf-search-control`: The `QueryBody`, and
        `customQueryBody` inputs of the [`SearchControlComponent`](../content-services/components/search-control.component.md) have been removed in favor of the
        [custom search configuration interface](../core/interfaces/search-configuration.interface.md).
        The inputs were deprecated in v2.1.0.
    -   `<adf-viewer>`: The `fileNodeId` input that supplies the [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) Id of the file to 
        load has been renamed as `nodeId`.
    -   `<adf-viewer>`: The `allowShare` input has been removed. Inject the
        [Share Directive](../content-services/directives/content-node-share.directive.md) in a
        [custom toolbar](../core/components/viewer.component.md#custom-toolbar) to recreate the behavior of the
        Share button.
    -   `<adf-viewer>`: The `allowSidebar` input has now been split into `allowLeftSidebar` and `allowRightSidebar`.
    -   `<adf-viewer>`: The `showSidebar` input has now been split into `showLeftSidebar` and `showRightSidebar`.
    -   `<adf-viewer>`: The `sidebarTemplate` input has now been split into `sidebarLeftTemplate` and 
        `sidebarRightTemplate`.
    -   `<adf-viewer>`: The `sidebarPosition` input has been removed since it is not needed anymore
        (you can now have two sidebars on the left and right at the same time).
    -   `analytics-report-list` is now `adf-analytics-report-list`.
    -   `analytics-report-parameters` is now `adf-analytics-report-parameters`.
    -   `CommentProcessModel` was moved into the Core library with the name [`CommentModel`](../../lib/core/src/lib/models/comment.model.ts) in v2.3.0. Now you
        can only import it from [`CoreModule`](../../lib/core/src/lib/core.module.ts).
    -   [`CommentsModule`](../../lib/core/src/lib/comments/comments.module.ts), [`CommentListComponent`](../core/components/comment-list.component.md), and [`CommentsComponent`](../core/components/comments.component.md) are no longer exported from
        [`ProcessModule`](../../lib/process-services/src/lib/process.module.ts) but now from [`CoreModule`](../../lib/core/src/lib/core.module.ts). The old usage was deprecated in v2.3.0.
    -   `<adf-upload-drag-area>`:  The `parentId` input has been renamed as `rootFolderId`. The old
        name was deprecated in v2.4.0.
    -   The `createFolder` event of the [`UploadBase`](../../lib/content-services/src/lib/upload/components/base-upload/upload-base.ts) class (emitted when a folder was
        created) was deprecated in v2.4.0 and is no longer used by the framework
        Use the `success` event instead.
    -   `<adf-filters>` is now `<adf-task-filters>`. The old usage was deprecated in v2.4.0.
    -   `adf-restore`, which was deprecated in v2.4.0, has been removed because it was not
        working properly. A new feature to implement this functionality correctly has
        been created. See [ADF-3901](https://issues.alfresco.com/jira/browse/ADF-3901)
        for more information.
    -   `<adf-form>`: The `onError` event (emitted when any error occurs) was deprecated
        in v2.4.0. It has now been renamed as `error`.
    -   `context-menu-holder` is now `adf-context-menu-holder`.
    -   The `file-draggable` event (emitted when one or more files are dragged and dropped
        onto the draggable element) was deprecated in v2.4.0 and has now been removed.
        Use `filesDropped` instead to get the same effect.
    -   The [`DocumentListService`](../content-services/services/document-list.service.md)`.hasPermission` method was redundant and has now been removed.
        Use [`ContentService`](../core/services/content.service.md)`.hasAllowableOperations` instead.
    -   The `diagram-sequence-flow` tag has now been renamed as `adf-diagram-sequence-flow`.
        The old name was deprecated in v2.3.0.
    -   The `diagram-alfresco-publish-task` tag has now been renamed as
        `adf-diagram-publish-task`. The old name was deprecated in v2.3.0.
    -   `<adf-login>`: The `disableCsrf` input has been removed. Use the `disableCsrf`
        property in `app.config.json` instead.
    -   `<adf-login>`: The `providers` input has been removed. Use the `providers`
        property in `app.config.json` instead.
    -   `<adf-document-list>`: The `skipCount` input has been removed. You can define
        the same value in pagination using the `pageSize` property.
    -   `<adf-document-list>`: The `enableInfiniteScrolling` input has been removed since
        it is not used anymore. To choose the pagination strategy, add either the
        [Infinite Pagination Component](../core/components/infinite-pagination.component.md) or the normal [Pagination Component](../core/components/pagination.component.md) and assign
        your document list as the `target`.
    -   `<adf-document-list>`: The `folderNode` input has been removed. Use
        the `currentFolderId` and `node` inputs instead.
    -   `SettingsService` has been removed. This was deprecated in v1.7.0.
    -   [`FormService`](../core/services/form.service.md): the `addFieldsToAForm` method has been removed.
    -   `<file-uploading-dialog>` has been renamed to  `<adf-file-uploading-dialog>`.
-   [PR JS-API](https://github.com/Alfresco/alfresco-ng2-components/pull/4097):

    -   The name package of the JS-API has been modified to use the namespace and all
        **alfresco-js-api** imports need to be modified to **@alfresco/js-api**.
        See the official
        [JS-API documentation](https://github.com/Alfresco/alfresco-js-api)
        for more details on how to use the new v3.0.0
        [Legacy Endpoint porting](https://github.com/Alfresco/alfresco-js-api#legacy-endpoint-porting-ver-2xx).

    -   The JS-API `callApi` method signature has been modified. The `authNames`
        parameter has now been removed because the type of authentication is configured
        when the JS-API is constructed.

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

-   [PR ADF-4062](https://github.com/Alfresco/alfresco-ng2-components/pull/4294)
    -   `adf-node-permission` has been renamed `adf-check-allowable-operation`.
    -   [`ContentService`](../core/services/content.service.md)`.hasPermission` was actually checking the `allowableOperation` value
        and has been renamed as [`ContentService`](../core/services/content.service.md)`.hasAllowableOperations`.
    -   [`ContentService`](../core/services/content.service.md)`.hasPermissions` is a new method which actually _does_ check
        the permissions.

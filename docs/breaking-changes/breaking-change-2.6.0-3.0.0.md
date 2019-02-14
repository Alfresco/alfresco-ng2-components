This document will list all the ADF 2.X component deprecated that has been removed in the 3.0 version :


- [PR ADF-3354](https://github.com/Alfresco/alfresco-ng2-components/pull/3980) The adf-accordion component has been removed  ```html <adf-accordion> <adf-accordion-group> ```  use the angular Material expansion and refer to the [official material documentation](https://material.angular.io/components/expansion/api)

- [PR ADF-3746](https://github.com/Alfresco/alfresco-ng2-components/pull/3975) In order to not let our ADF style classes mix with other project a new style lint rules have been added. This rule enforce the use of the **adf-** prefix in all our classes. Please refer to the PR to see the list of the all style changed. If you where rewriting any ADF classes without the **adf-** prefix you will need to fix it. For example now ```css .card-view ``` is ```css .adf-card-view ```

- [PR ADF-1443](https://github.com/Alfresco/alfresco-ng2-components/pull/4028) ```js DownloadZipDialogComponent ``` and ```js NodeDownloadDirective ``` has been moved from the content service to the core module. This modify has allowed to remove some code duplication present in both modules

- [PR ADF-1873](https://github.com/Alfresco/alfresco-ng2-components/pull/4145)
    - ```html adf-search-control``` **SearchControlComponent** **QueryBody**, **customQueryBody** input parameter has been removed in favor of the [custom service search](https://github.com/Alfresco/alfresco-ng2-components/blob/ad5dcfe7c3449f74ac4097bbfc44f490b81f5ce1/docs/core/search-configuration.interface.md). deprecated in 2.1.0
    - ```html <adf-viewer>``` **fileNodeId** Node Id of the file to load has been renamed in  **nodeId**
    - ```html <adf-viewer>``` **allowShare** has been removed as parameter if you want archive this button. Inject the [Share Directive](https://github.com/Alfresco/alfresco-ng2-components/blob/9915935714d7e39acd67ce5121e01051162058d6/docs/content-services/content-node-share.directive.md) in the [custom toolbar](https://github.com/Alfresco/alfresco-ng2-components/blob/9915935714d7e39acd67ce5121e01051162058d6/docs/core/viewer.component.md#custom-toolbar)
    - ```html <adf-viewer>``` **allowSidebar** is now **allowLeftSidebar** and **allowRightSidebar**
    - ```html <adf-viewer>``` **showSidebar** is now **showLeftSidebar** and **showRightSidebar**
    - ```html <adf-viewer>``` **sidebarTemplate** is now **sidebarLeftTemplate** and **sidebarRightTemplate**
    - ```html <adf-viewer>``` **sidebarPosition** has been removed not needed anymore you can now have two sidebar left and right at the same time.
    - ```html analytics-report-list``` is now ```html adf-analytics-report-list```
    - ```html analytics-report-parameters``` is now ```html adf-analytics-report-parameters```
    - ```CommentProcessModel``` was moved in the core under the name of ```CommentModel``` in 2.3.0 now is only possible to import it from **coreModule**
    - ```CommentsModule CommentListComponent CommentsComponent ``` are not exported anymore from  **ProcessModule** but form **coreModule** (deprecated in 2.3.0 )
    - ```html <adf-upload-drag-arear>```  **parentId** has been renamed in ***rootFolderId** was already deprecated in 2.4.0 
    - UploadBase service createFolder event emitted when a folder was created deprecated in 2.4.0 is no longer used by the framework use the **success** event
    - ```html <adf-filters>``` is now ```html <adf-task-filters>``` deprecated in 2.4.0
    - ```html adf-restore``` deprecated in 2.4.0 has been removed because not properly working. A new feature to properly implement this functionality has been created [ADF-3901](https://issues.alfresco.com/jira/browse/ADF-3901)
    - ```html <adf-form>``` event **onError** Emitted when any error occurs deprecated in 2.4.0, has been renamed as **error**
    - ```html context-menu-holder ``` is now ```html adf-context-menu-holder ```
    - ```js file-draggable ```/Emitted when one or more files are dragged and dropped onto the draggable element. @deprecated in 2.4.0: use `filesDropped` instead */ @Output() filesEntityDropped: EventEmitter<any> = new EventEmitter();
    - ```js DocumentListService.hasPermission``` duplicated method has been removed use ```js ContentService.hasAllowableOperations```
    - ```html diagram-sequence-flow```  tag renamed in ```html 'adf-diagram-sequence-flow ``` @deprecated 2.3.0 
    - ```html diagram-alfresco-publish-task```  tag renamed in ```html 'adf-diagram-publish-task ``` @deprecated 2.3.0 
    - ```html <adf-login>``` disableCsrf input has been removed use the app.config.json disableCsrf property
    - ```html <adf-login>``` providers input has been removed use the app.config.json providers property
    - ```html <adf-document-list>``` skipCount has been removed define it in pagination using the pageSize
    - ```html <adf-document-list>``` enableInfiniteScrolling has been removed it wasn't used anymore to choose the right pagination strategy add the infinite pagination or the normal pagination add assign as target your document list.
    - ```html <adf-document-list>``` folderNode has been removed use **currentFolderId** and **node**
    - ```js SettingsService```  has been removed deprecated in 1.7.0
    - ```js FormService```  ```js addFieldsToAForm(formId: string, formModel: FormDefinitionModel) ``` has been removed
    - ```html <file-uploading-dialo>``` has been renamed to  ```html <adf-file-uploading-dialog> ```

   
- [PR JS-API](https://github.com/Alfresco/alfresco-ng2-components/pull/4097) 
    -The name package of the JS-API has been modified to use the namespace and all the **alfresco-js-api** import needs to be modified in **@alfresco/js-api**. Please give a look on the official [JS-API documentation](https://github.com/Alfresco/alfresco-js-api) for more details on how to use the new 3.0.0 version [Legacy Endpoint porting](https://github.com/Alfresco/alfresco-js-api#legacy-endpoint-porting-ver-2xx)

    - The js-api callApi method firm has been modified. **authNames** has been removed as parameter. The kind authentication is configured at contruction time of the JS-API.
       before 2.6.1:
        ```js callApi(path: string, httpMethod: string, pathParams?: any, queryParams?: any, headerParams?: any, formParams?: any, bodyParam?: any, authNames?: string[], contentTypes?: string[], accepts?: string[], returnType?: any, contextRoot?: string, responseType?: string): Promise<any>; ```
       after 3.0.0:
        ```js callApi(path: string, httpMethod: string, pathParams?: any, queryParams?: any, headerParams?: any, formParams?: any, bodyParam?: any, contentTypes?: string[], accepts?: string[], returnType?: any, contextRoot?: string, responseType?: string): Promise<any>; ```

 
- [PR ADF-4062](https://github.com/Alfresco/alfresco-ng2-components/pull/4294)
    - ```html adf-node-permission ``` has been renamed ```html adf-check-allowable-operation ```
    - ```js ContentService.hasPermission ``` was actually checking the allowableOperation and has been renamed in ```js ContentService.hasAllowableOperations ```
    - ```js ContentService.hasPermissions ``` new method has been created nad it actually checking the permissions

# Component Docs Index

Below is an index of the documentation for ADF. The [User Guide](#user-guide)
section discusses particular techniques in depth. The other sections are references for the ADF
libraries. Items marked with an asterisk (\*) do not currently have documentation - the link leads
to the appropriate source file.

## Contents

-   [User Guide](#user-guide)
-   [ADF Core](#adf-core)
-   [ADF Content Services](#adf-content-services)
-   [ADF Process Services](#adf-process-services)
-   [ADF Insights](#adf-insights)

## User guide

<!--guide start-->

-   [Form Extensibility and Customisation](extensibility.md)
-   [Angular Material Design](angular-material-design.md)
-   [Theming](theming.md)
-   [Typography](typography.md)
-   [Walkthrough - adding indicators to highlight information about a node](metadata-indicators.md)

<!--guide end-->

[(Back to Contents)](#contents)

## ADF Core

Contains a variety of components used throughout ADF.
See the library's
[README file](../lib/core/README.md)
for more information about installing and using the source code.

<!--core start-->

## Components

| Name                                                              | Description                                                                                                             | Source link                                                                 |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [Card view component](card-view.component.md)                     | Displays a configurable property list renderer.                                                                         | [Source](../lib/core/card-view/card-view.component.ts)                      |
| [Accordion group component](accordion-group.component.md)         | Adds a collapsible panel to an [accordion menu](accordion.component.md).                                                | [Source](../lib/core/collapsable/accordion-group.component.ts)              |
| [Accordion component](accordion.component.md)                     | Creates a collapsible accordion menu.                                                                                   | [Source](../lib/core/collapsable/accordion.component.ts)                    |
| [Data column component](data-column.component.md)                 | Defines column properties for DataTable, Tasklist, Document List and other components.                                  | [Source](../lib/core/data-column/data-column.component.ts)                  |
| [Datatable component](datatable.component.md)                     | Displays data as a table with customizable columns and presentation.                                                    | [Source](../lib/core/datatable/components/datatable/datatable.component.ts) |
| [Form field component](form-field.component.md)                   | A form field in an APS form.                                                                                            | [Source](../lib/core/form/components/form-field/form-field.component.ts)    |
| [Form list component](form-list.component.md)                     | The component shows the activiti forms as a list.                                                                       | [Source](../lib/core/form/components/form-list.component.ts)                |
| [Form component](form.component.md)                               | The component shows a Form from Activiti (see it live: [Form Quickstart](https://embed.plnkr.co/YSLXTqb3DtMhVJSqXKkE/)) | [Source](../lib/core/form/components/form.component.ts)                     |
| [Start form component](start-form.component.md)                   | Displays the Start Form for a process.                                                                                  | [Source](../lib/core/form/components/start-form.component.ts)               |
| [Text mask component](text-mask.component.md)                     | Implements text field input masks.                                                                                      | [Source](../lib/core/form/components/widgets/text/text-mask.component.ts)   |
| [Info drawer layout component](info-drawer-layout.component.md)   | Displays a sidebar-style information panel.                                                                             | [Source](../lib/core/info-drawer/info-drawer-layout.component.ts)           |
| [Info drawer component](info-drawer.component.md)                 | Displays a sidebar-style information panel with tabs.                                                                   | [Source](../lib/core/info-drawer/info-drawer.component.ts)                  |
| [Language menu component](language-menu.component.md)             | Displays all the languages that are present in the "app.config.json" or the default one (EN).                           | [Source](../lib/core/language-menu/language-menu.component.ts)              |
| [Login component](login.component.md)                             | Authenticates to Alfresco Content Services and Alfresco Process Services.                                               | [Source](../lib/core/login/components/login.component.ts)                   |
| [Infinite pagination component](infinite-pagination.component.md) | Adds "infinite" pagination to the component it is used with.                                                            | [Source](../lib/core/pagination/infinite-pagination.component.ts)           |
| [Pagination component](pagination.component.md)                   | Adds pagination to the component it is used with.                                                                       | [Source](../lib/core/pagination/pagination.component.ts)                    |
| [Host settings component](host-settings.component.md)             | Validates the URLs for ACS and APS and saves them in the user's local storage                                           | [Source](../lib/core/settings/host-settings.component.ts)                   |
| [Toolbar divider component](toolbar-divider.component.md)         | Divides groups of elements in a Toolbar with a visual separator.                                                        | [Source](../lib/core/toolbar/toolbar-divider.component.ts)                  |
| [Toolbar title component](toolbar-title.component.md)             | Supplies custom HTML to be included in a Toolbar component title.                                                       | [Source](../lib/core/toolbar/toolbar-title.component.ts)                    |
| [Toolbar component](toolbar.component.md)                         | Simple container for headers, titles, actions and breadcrumbs.                                                          | [Source](../lib/core/toolbar/toolbar.component.ts)                          |
| [User info component](user-info.component.md)                     | Shows user information.                                                                                                 | [Source](../lib/core/userinfo/components/user-info.component.ts)            |
| [Viewer component](viewer.component.md)                           | See it live: [Viewer Quickstart](https://embed.plnkr.co/iTuG1lFIXfsP95l6bDW6/)                                          | [Source](../lib/core/viewer/components/viewer.component.ts)                 |

## Directives

| Name                                                      | Description                                                                                               | Source link                                                   |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [Context menu directive](context-menu.directive.md)       | See **Demo Shell** or **DocumentList** implementation for more details and use cases.                     | [Source](../lib/core/context-menu/context-menu.directive.ts)  |
| [Highlight directive](highlight.directive.md)             | Adds highlighting to selected sections of an HTML element's content.                                      | [Source](../lib/core/directives/highlight.directive.ts)       |
| [Logout directive](logout.directive.md)                   | Logs the user out when the decorated element is clicked.                                                  | [Source](../lib/core/directives/logout.directive.ts)          |
| [Node delete directive](node-delete.directive.md)         | Deletes multiple files and folders.                                                                       | [Source](../lib/core/directives/node-delete.directive.ts)     |
| [Node favorite directive](node-favorite.directive.md)     | Selectively toggles nodes as favorite                                                                     | [Source](../lib/core/directives/node-favorite.directive.ts)   |
| [Node permission directive](node-permission.directive.md) | Selectively disables an HTML element or Angular component                                                 | [Source](../lib/core/directives/node-permission.directive.ts) |
| [Node restore directive](node-restore.directive.md)       | Restores deleted nodes to their original location.                                                        | [Source](../lib/core/directives/node-restore.directive.ts)    |
| [Upload directive](upload.directive.md)                   | Allows your components or common HTML elements reacting on File drag and drop in order to upload content. | [Source](../lib/core/directives/upload.directive.ts)          |

## Models

| Name                                              | Description                                                                      | Source link                                                            |
| ------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [Form field model](form-field.model.md)           | Contains the value and metadata for a field of an [ADF Form](form.component.md). | [Source](../lib/core/form/components/widgets/core/form-field.model.ts) |
| [Comment process model](comment-process.model.md) | Represents a comment added to a Process Services task or process instance.       | [Source](../lib/core/models/comment-process.model.ts)                  |
| [Product version model](product-version.model.md) | Contains version and license information classes for Alfresco products.          | [Source](../lib/core/models/product-version.model.ts)                  |
| [User process model](user-process.model.md)       | Represents a Process Services user.                                              | [Source](../lib/core/models/user-process.model.ts)                     |
| [Bpm user model](bpm-user.model.md)               | Contains information about a Process Services user.                              | [Source](../lib/core/userinfo/models/bpm-user.model.ts)                |
| [Ecm user model](ecm-user.model.md)               | Contains information about a Content Services user.                              | [Source](../lib/core/userinfo/models/ecm-user.model.ts)                |

## Pipes

| Name                                                | Description                                                                               | Source link                                           |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [File size pipe](file-size.pipe.md)                 | Converts a number of bytes to the equivalent in KB, MB, etc.                              | [Source](../lib/core/pipes/file-size.pipe.ts)         |
| [Mime type icon pipe](mime-type-icon.pipe.md)       | Retrieves an icon to represent a MIME type.                                               | [Source](../lib/core/pipes/mime-type-icon.pipe.ts)    |
| [Node name tooltip pipe](node-name-tooltip.pipe.md) | Formats the tooltip of the underlying Node based on the following rules:                  | [Source](../lib/core/pipes/node-name-tooltip.pipe.ts) |
| [Text highlight pipe](text-highlight.pipe.md)       | Adds highlighting to words or sections of text that match a search string.                | [Source](../lib/core/pipes/text-highlight.pipe.ts)    |
| [Time ago pipe](time-ago.pipe.md)                   | Converts a recent past date into a number of days ago.                                    | [Source](../lib/core/pipes/time-ago.pipe.ts)          |
| [User initial pipe](user-initial.pipe.md)           | Takes the name fields of a UserProcessModel object and extracts and formats the initials. | [Source](../lib/core/pipes/user-initial.pipe.ts)      |

## Services

| Name                                                          | Description                                                                                                          | Source link                                                      |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [Activiti alfresco service](activiti-alfresco.service.md)     | Gets Alfresco Repository folder content based on a Repository account configured in Alfresco Process Services (APS). | [Source](../lib/core/form/services/activiti-alfresco.service.ts) |
| [Form rendering service](form-rendering.service.md)           | Maps an APS form field type string onto the corresponding form widget component type.                                | [Source](../lib/core/form/services/form-rendering.service.ts)    |
| [Form service](form.service.md)                               | Implements Process Services form methods                                                                             | [Source](../lib/core/form/services/form.service.ts)              |
| [Node service](node.service.md)                               | Gets Alfresco Repository node metadata and creates nodes with metadata.                                              | [Source](../lib/core/form/services/node.service.ts)              |
| [Process content service](process-content.service.md)         | Manipulates content related to a Process Instance or Task Instance in APS.                                           | [Source](../lib/core/form/services/process-content.service.ts)   |
| [Alfresco api service](alfresco-api.service.md)               | Provides access to initialized **AlfrescoJSApi** instance.                                                           | [Source](../lib/core/services/alfresco-api.service.ts)           |
| [Apps process service](apps-process.service.md)               | Gets details of the Process Services apps that are deployed for the user.                                            | [Source](../lib/core/services/apps-process.service.ts)           |
| [Auth guard bpm service](auth-guard-bpm.service.md)           | Adds authentication with Process Services to a route within the app.                                                 | [Source](../lib/core/services/auth-guard-bpm.service.ts)         |
| [Auth guard ecm service](auth-guard-ecm.service.md)           | Adds authentication with Content Services to a route within the app.                                                 | [Source](../lib/core/services/auth-guard-ecm.service.ts)         |
| [Auth guard service](auth-guard.service.md)                   | Adds authentication to a route within the app.                                                                       | [Source](../lib/core/services/auth-guard.service.ts)             |
| [Authentication service](authentication.service.md)           | Provides authentication for use with the Login component.                                                            | [Source](../lib/core/services/authentication.service.ts)         |
| [Card view update service](card-view-update.service.md)       | Reports edits and clicks within fields of a [Card View component](card-view.component.md).                           | [Source](../lib/core/services/card-view-update.service.ts)       |
| [Comment process service](comment-process.service.md)         | Adds and retrieves comments for task and process instances in Process Services.                                      | [Source](../lib/core/services/comment-process.service.ts)        |
| [Content service](content.service.md)                         | Accesses app-generated data objects via URLs and file downloads.                                                     | [Source](../lib/core/services/content.service.ts)                |
| [Cookie service](cookie.service.md)                           | Stores key-value data items as browser cookies.                                                                      | [Source](../lib/core/services/cookie.service.ts)                 |
| [Deleted nodes api service](deleted-nodes-api.service.md)     | Gets a list of Content Services nodes currently in the trash.                                                        | [Source](../lib/core/services/deleted-nodes-api.service.ts)      |
| [Discovery api service](discovery-api.service.md)             | Gets version and license information for Process Services and Content Services.                                      | [Source](../lib/core/services/discovery-api.service.ts)          |
| [Favorites api service](favorites-api.service.md)             | Gets a list of items a user has marked as their favorites.                                                           | [Source](../lib/core/services/favorites-api.service.ts)          |
| [Highlight transform service](highlight-transform.service.md) | Adds HTML to a string to highlight chosen sections.                                                                  | [Source](../lib/core/services/highlight-transform.service.ts)    |
| [Log service](log.service.md)                                 | Provide a log functionality for your ADF application.                                                                | [Source](../lib/core/services/log.service.ts)                    |
| [Nodes api service](nodes-api.service.md)                     | Accesses and manipulates ACS document nodes using their node IDs.                                                    | [Source](../lib/core/services/nodes-api.service.ts)              |
| [Notification service](notification.service.md)               | Shows a notification message with optional feedback.                                                                 | [Source](../lib/core/services/notification.service.ts)           |
| [Page title service](page-title.service.md)                   | Sets the page title.                                                                                                 | [Source](../lib/core/services/page-title.service.ts)             |
| [People content service](people-content.service.md)           | Gets information about a Content Services user.                                                                      | [Source](../lib/core/services/people-content.service.ts)         |
| [People process service](people-process.service.md)           | Gets information about Process Services users.                                                                       | [Source](../lib/core/services/people-process.service.ts)         |
| [Shared links api service](shared-links-api.service.md)       | Finds shared links to Content Services items.                                                                        | [Source](../lib/core/services/shared-links-api.service.ts)       |
| [Storage service](storage.service.md)                         | Stores items in the form of key-value pairs.                                                                         | [Source](../lib/core/services/storage.service.ts)                |
| [Thumbnail service](thumbnail.service.md)                     | Retrieves an SVG thumbnail image to represent a document type.                                                       | [Source](../lib/core/services/thumbnail.service.ts)              |
| [Translation service](translation.service.md)                 | Supports localisation.                                                                                               | [Source](../lib/core/services/translation.service.ts)            |
| [Upload service](upload.service.md)                           | Provides access to various APIs related to file upload features.                                                     | [Source](../lib/core/services/upload.service.ts)                 |
| [User preferences service](user-preferences.service.md)       | Stores preferences for components.                                                                                   | [Source](../lib/core/services/user-preferences.service.ts)       |
| [Bpm user service](bpm-user.service.md)                       | Gets information about the current Process Services user.                                                            | [Source](../lib/core/userinfo/services/bpm-user.service.ts)      |
| [Ecm user service](ecm-user.service.md)                       | Gets information about a Content Services user.                                                                      | [Source](../lib/core/userinfo/services/ecm-user.service.ts)      |
| _Renditions service_                                          | _Not currently documented_                                                                                           | [Source](../lib/core/services/renditions.service.ts)             |
| _Sites service_                                               | _Not currently documented_                                                                                           | [Source](../lib/core/services/sites.service.ts)                  |

## Widgets

| Name                                | Description                              | Source link                                                             |
| ----------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------- |
| [Content widget](content.widget.md) | The component shows the content preview. | [Source](../lib/core/form/components/widgets/content/content.widget.ts) |

<!--core end-->

### Other classes and interfaces

| Name | Description | Source link |
| -- | -- | -- |
| [Data Table Adapter interface](DataTableAdapter.md) | Defines how table data is supplied to [DataTable](datatable.component.md) and [Tasklist](task-list.component.md) components. | [Source](../core/datatable/data/datatable-adapter.ts) |
| [Form Field Validator interface](FormFieldValidator.md) | Defines how the input fields of [ADF Form](form.component.md) and [ADF Task Details](task-details.component.md) components are validated. | [Source](../core/form/components/widgets/core/form-field-validator.ts) |

[(Back to Contents)](#contents)

## ADF Content Services

Contains components related to Content Services.
See the library's
[README file](../lib/content-services/README.md)
for more information about installing and using the source code.

<!--content-services start-->

## Components

| Name                                                                  | Description                                                                                           | Source link                                                                                           |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [Breadcrumb component](breadcrumb.component.md)                       | Indicates the current position within a navigation hierarchy.                                         | [Source](../lib/content-services/breadcrumb/breadcrumb.component.ts)                                  |
| [Dropdown breadcrumb component](dropdown-breadcrumb.component.md)     | Indicates the current position within a navigation hierarchy using a dropdown menu.                   | [Source](../lib/content-services/breadcrumb/dropdown-breadcrumb.component.ts)                         |
| [Content node selector component](content-node-selector.component.md) | Allows a user to select items from a Content Services repository.                                     | [Source](../lib/content-services/content-node-selector/content-node-selector.component.ts)            |
| [Content action component](content-action.component.md)               | Adds options to a Document List actions menu for a particular content type.                           | [Source](../lib/content-services/document-list/components/content-action/content-action.component.ts) |
| [Document list component](document-list.component.md)                 | Displays the documents from a repository.                                                             | [Source](../lib/content-services/document-list/components/document-list.component.ts)                 |
| [Search control component](search-control.component.md)               | Displays a input text which shows find-as-you-type suggestions.                                       | [Source](../lib/content-services/search/components/search-control.component.ts)                       |
| [Search component](search.component.md)                               | You have to add a template that will be shown when the results are loaded.                            | [Source](../lib/content-services/search/components/search.component.ts)                               |
| [Sites dropdown component](sites-dropdown.component.md)               | Displays a dropdown menu to show and interact with the sites of the current user.                     | [Source](../lib/content-services/site-dropdown/sites-dropdown.component.ts)                           |
| [Like component](like.component.md)                                   | Allows a user to add "likes" to an item.                                                              | [Source](../lib/content-services/social/like.component.ts)                                            |
| [Rating component](rating.component.md)                               | Allows a user to add ratings to an item.                                                              | [Source](../lib/content-services/social/rating.component.ts)                                          |
| [Tag actions component](tag-actions.component.md)                     | Shows available actions for tags.                                                                     | [Source](../lib/content-services/tag/tag-actions.component.ts)                                        |
| [Tag list component](tag-list.component.md)                           | Shows tags for an item.                                                                               | [Source](../lib/content-services/tag/tag-list.component.ts)                                           |
| [Tag node list component](tag-node-list.component.md)                 | Shows tags for a node.                                                                                | [Source](../lib/content-services/tag/tag-node-list.component.ts)                                      |
| [File uploading dialog component](file-uploading-dialog.component.md) | Shows a dialog listing all the files uploaded with the Upload Button or Drag Area components.         | [Source](../lib/content-services/upload/components/file-uploading-dialog.component.ts)                |
| [Upload button component](upload-button.component.md)                 | Activates a file upload.                                                                              | [Source](../lib/content-services/upload/components/upload-button.component.ts)                        |
| [Upload drag area component](upload-drag-area.component.md)           | Adds a drag and drop area to upload files to Alfresco.                                                | [Source](../lib/content-services/upload/components/upload-drag-area.component.ts)                     |
| [Version list component](version-list.component.md)                   | Displays the version history of a node in a [Version Manager component](version-manager.component.md) | [Source](../lib/content-services/version-manager/version-list.component.ts)                           |
| [Version manager component](version-manager.component.md)             | Displays the version history of a node with the ability to upload a new version.                      | [Source](../lib/content-services/version-manager/version-manager.component.ts)                        |
| [Webscript component](webscript.component.md)                         | Another example:                                                                                      | [Source](../lib/content-services/webscript/webscript.component.ts)                                    |
| _Content metadata card component_                                     | _Not currently documented_                                                                            | [Source](../lib/content-services/content-metadata/content-metadata-card.component.ts)                 |
| _Content metadata component_                                          | _Not currently documented_                                                                            | [Source](../lib/content-services/content-metadata/content-metadata.component.ts)                      |
| _Content node selector panel component_                               | _Not currently documented_                                                                            | [Source](../lib/content-services/content-node-selector/content-node-selector-panel.component.ts)      |

## Directives

| Name                                                    | Description                                                    | Source link                                                                     |
| ------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [Folder create directive](folder-create.directive.md)   | Allows folders to be created.                                  | [Source](../lib/content-services/folder-directive/folder-create.directive.ts)   |
| [Folder edit directive](folder-edit.directive.md)       | Allows folders to be edited.                                   | [Source](../lib/content-services/folder-directive/folder-edit.directive.ts)     |
| [File draggable directive](file-draggable.directive.md) | Provide drag-and-drop features for an element such as a `div`. | [Source](../lib/content-services/upload/directives/file-draggable.directive.ts) |

## Models

| Name                                                  | Description                                                                                                           | Source link                                                                       |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [Document library model](document-library.model.md)   | Defines classes for use with the Content Services node API.                                                           | [Source](../lib/content-services/document-list/models/document-library.model.ts)  |
| [Permissions style model](permissions-style.model.md) | Sets custom CSS styles for rows of a [Document List](document-list.component.md) according to the item's permissions. | [Source](../lib/content-services/document-list/models/permissions-style.model.ts) |

## Services

| Name                                                    | Description                                                           | Source link                                                                            |
| ------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [Document actions service](document-actions.service.md) | Implements the document menu actions for the Document List component. | [Source](../lib/content-services/document-list/services/document-actions.service.ts)   |
| [Document list service](document-list.service.md)       | Implements node operations used by the Document List component.       | [Source](../lib/content-services/document-list/services/document-list.service.ts)      |
| [Folder actions service](folder-actions.service.md)     | Implements the folder menu actions for the Document List component.   | [Source](../lib/content-services/document-list/services/folder-actions.service.ts)     |
| [Rating service](rating.service.md)                     | Manages ratings for items in Content Services.                        | [Source](../lib/content-services/social/services/rating.service.ts)                    |
| [Tag service](tag.service.md)                           | Manages tags in Content Services.                                     | [Source](../lib/content-services/tag/services/tag.service.ts)                          |
| _Content metadata service_                              | _Not currently documented_                                            | [Source](../lib/content-services/content-metadata/content-metadata.service.ts)         |
| _Content node dialog service_                           | _Not currently documented_                                            | [Source](../lib/content-services/content-node-selector/content-node-dialog.service.ts) |

<!--content-services end-->

[(Back to Contents)](#contents)

## ADF Process Services

Contains components related to Process Services.
See the library's
[README file](../lib/process-services/README.md)
for more information about installing and using the source code.

<!--process-services start-->

## Components

| Name                                                                          | Description                                                                                                         | Source link                                                                                     |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [Apps list component](apps-list.component.md)                                 | Shows all available apps.                                                                                           | [Source](../lib/process-services/app-list/apps-list.component.ts)                               |
| [Create process attachment component](create-process-attachment.component.md) | Displays Upload Component (Drag and Click) to upload the attachment to a specified process instance                 | [Source](../lib/process-services/attachment/create-process-attachment.component.ts)             |
| [Create task attachment component](create-task-attachment.component.md)       | Displays Upload Component (Drag and Click) to upload the attachment to a specified task                             | [Source](../lib/process-services/attachment/create-task-attachment.component.ts)                |
| [Process attachment list component](process-attachment-list.component.md)     | Displays attached documents on a specified process instance                                                         | [Source](../lib/process-services/attachment/process-attachment-list.component.ts)               |
| [Task attachment list component](task-attachment-list.component.md)           | Displays attached documents on a specified task.                                                                    | [Source](../lib/process-services/attachment/task-attachment-list.component.ts)                  |
| [Comment list component](comment-list.component.md)                           | Shows a list of comments.                                                                                           | [Source](../lib/process-services/comments/comment-list.component.ts)                            |
| [Comments component](comments.component.md)                                   | Displays comments from users involved in a specified task and allows an involved user to add a comment to the task. | [Source](../lib/process-services/comments/comments.component.ts)                                |
| [Process comments component](process-comments.component.md)                   | Displays comments associated with a particular process instance and allows the user to add new comments             | [Source](../lib/process-services/comments/process-comments.component.ts)                        |
| [People list component](people-list.component.md)                             | Shows a list of users (people).                                                                                     | [Source](../lib/process-services/people/people-list.component.ts)                               |
| [People search component](people-search.component.md)                         | Searches users/people.                                                                                              | [Source](../lib/process-services/people/people-search.component.ts)                             |
| [People component](people.component.md)                                       | Displays involved users to a specified task                                                                         | [Source](../lib/process-services/people/people.component.ts)                                    |
| [Process filters component](process-filters.component.md)                     | Collection of criteria used to filter process instances, which may be customized by users.                          | [Source](../lib/process-services/process-list/components/process-filters.component.ts)          |
| [Process instance details component](process-instance-details.component.md)   | Displays detailed information on a specified process instance                                                       | [Source](../lib/process-services/process-list/components/process-instance-details.component.ts) |
| [Process instance header component](process-instance-header.component.md)     | Sub-component of the process details component, which renders some general information about the selected process.  | [Source](../lib/process-services/process-list/components/process-instance-header.component.ts)  |
| [Process instance tasks component](process-instance-tasks.component.md)       | Lists both the active and completed tasks associated with a particular process instance                             | [Source](../lib/process-services/process-list/components/process-instance-tasks.component.ts)   |
| [Process list component](process-list.component.md)                           | This component renders a list containing all the process instances matched by the parameters specified.             | [Source](../lib/process-services/process-list/components/process-list.component.ts)             |
| [Start process component](start-process.component.md)                         | Starts a process.                                                                                                   | [Source](../lib/process-services/process-list/components/start-process.component.ts)            |
| [Checklist component](checklist.component.md)                                 | Shows the checklist task functionality.                                                                             | [Source](../lib/process-services/task-list/components/checklist.component.ts)                   |
| [Start task component](start-task.component.md)                               | Creates/Starts new task for the specified app                                                                       | [Source](../lib/process-services/task-list/components/start-task.component.ts)                  |
| [Task details component](task-details.component.md)                           | Shows the details of the task id passed in input                                                                    | [Source](../lib/process-services/task-list/components/task-details.component.ts)                |
| [Task filters component](task-filters.component.md)                           | Shows all available filters.                                                                                        | [Source](../lib/process-services/task-list/components/task-filters.component.ts)                |
| [Task header component](task-header.component.md)                             | Shows all the information related to a task.                                                                        | [Source](../lib/process-services/task-list/components/task-header.component.ts)                 |
| [Task list component](task-list.component.md)                                 | Renders a list containing all the tasks matched by the parameters specified.                                        | [Source](../lib/process-services/task-list/components/task-list.component.ts)                   |

## Directives

| Name                                                  | Description                                                      | Source link                                                                          |
| ----------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [Process audit directive](process-audit.directive.md) | Fetches the Process Audit information in the pdf or json format. | [Source](../lib/process-services/process-list/components/process-audit.directive.ts) |
| [Task audit directive](task-audit.directive.md)       | Fetches the Task Audit information in the pdf or json format.    | [Source](../lib/process-services/task-list/components/task-audit.directive.ts)       |

## Models

| Name                            | Description                                              | Source link                                                        |
| ------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------ |
| [Filter model](filter.model.md) | Contains classes related to filters in Process Services. | [Source](../lib/process-services/task-list/models/filter.model.ts) |

## Services

| Name                                                | Description                                                                 | Source link                                                                       |
| --------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [Process filter service](process-filter.service.md) | Manage Process Filters, which are pre-configured Process Instance queries.  | [Source](../lib/process-services/process-list/services/process-filter.service.ts) |
| [Process service](process.service.md)               | Manage Process Instances, Process Variables, and Process Audit Log.         | [Source](../lib/process-services/process-list/services/process.service.ts)        |
| [Task filter service](task-filter.service.md)       | Manage Task Filters, which are pre-configured Task Instance queries.        | [Source](../lib/process-services/task-list/services/task-filter.service.ts)       |
| [Tasklist service](tasklist.service.md)             | Manage Task Instances.                                                      | [Source](../lib/process-services/task-list/services/tasklist.service.ts)          |
| _Task upload service_                               | _Not currently documented_                                                  | [Source](../lib/process-services/task-list/services/task-upload.service.ts)       |

<!--process-services end-->

[(Back to Contents)](#contents)

## ADF Insights

Contains components for Process Services analytics and diagrams.
See the library's
[README file](../lib/insights/README.md)
for more information about installing and using the source code.

<!--insights start-->

## Components

| Name                                                                  | Description                                              | Source link                                                                               |
| --------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [Widget component](widget.component.md)                               | Base class for standard and custom widget classes.       | [Source](../lib/insights/analytics-process/components/widgets/widget.component.ts)        |
| [Analytics generator component](analytics-generator.component.md)     | Generates and shows charts                               | [Source](../lib/insights/analytics-process/components/analytics-generator.component.ts)   |
| [Analytics report list component](analytics-report-list.component.md) | Shows a list of all available reports                    | [Source](../lib/insights/analytics-process/components/analytics-report-list.component.ts) |
| [Analytics component](analytics.component.md)                         | Shows the charts related to the reportId passed as input | [Source](../lib/insights/analytics-process/components/analytics.component.ts)             |
| [Diagram component](diagram.component.md)                             | This component shows the diagram of a process.           | [Source](../lib/insights/diagram/components/diagram.component.ts)                         |

<!--insights end-->

[(Back to Contents)](#contents)

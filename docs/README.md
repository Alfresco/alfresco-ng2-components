# Component Docs Index

Below is an index of the documentation for ADF. The [User Guide](#user-guide)
section discusses particular techniques in depth. The other sections are references for the ADF
libraries. Click the name of an item to see its documentation or click the source link to see
its main source file. Note that ADF is developed continuously, so the source files for some items may be listed here before their documentation is available.

See the [Version Index](versionIndex.md) for a list of components ordered by
the ADF version where they were introduced. You can see the full details of each release
in the [Release notes](release-notes/README.md) section.

Components are sometimes marked with an icon to show their status. No icon indicates
that the component is complete and suitable for normal use. The other status levels are:

-   **Deprecated** ![](docassets/images/DeprecatedIcon.png) - The component is still available
    but is now obsolete and will probably be removed in a future version of ADF.
-   **Experimental** ![](docassets/images/ExperimentalIcon.png) - The component is available for
    experimentation but not fully complete and tested for production code.
-   **Internal** ![](docassets/images/InternalIcon.png) - The component is available for
    internal test use but not meant to be used in production

There is also a set of ADF tutorials that describe how to accomplish tasks step-by-step.
See the [Tutorials index](tutorials/README.md) for the full list.

## Contents

-   [User Guide](#user-guide)
-   [ADF Core](#adf-core)
-   [ADF Content Services](#adf-content-services)
-   [ADF Process Services](#adf-process-services)
-   [ADF Insights](#adf-insights)

## User guide

<!--guide start-->

-   [Angular Material Design](user-guide/angular-material-design.md)
-   [Form Extensibility and Customisation](user-guide/extensibility.md)
-   [Internationalization in ADF](user-guide/internationalization.md)
-   [Theming](user-guide/theming.md)
-   [Transclusion](user-guide/transclusion.md)
-   [Typography](user-guide/typography.md)
-   [Walkthrough - adding indicators to highlight information about a node](user-guide/metadata-indicators.md)

<!--guide end-->

[(Back to Contents)](#contents)

## ADF Core

Contains a variety of components used throughout ADF.
See the library's
[README file](../lib/core/README.md)
for more information about installing and using the source code.

<!--core start-->

## Components

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [About component](core/about.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | This component allow you to have a general overview of the version of ADF installed and the status of the Content service and Process service. | [Source](../lib/core/about/about.component.ts) |
| [Buttons menu component](core/buttons-menu.component.md) | Displays buttons on a responsive menu.  | [Source](../lib/core/buttons-menu/buttons-menu.component.ts) |
| [Card view component](core/card-view.component.md) | Displays a configurable property list renderer. | [Source](../lib/core/card-view/components/card-view/card-view.component.ts) |
| [Accordion group component](core/accordion-group.component.md) | Adds a collapsible panel to an accordion menu. | [Source](../lib/core/collapsable/accordion-group.component.ts) |
| [Accordion component](core/accordion.component.md) | Creates a collapsible accordion menu. | [Source](../lib/core/collapsable/accordion.component.ts) |
| [Comment list component](core/comment-list.component.md) | Shows a list of comments. | [Source](../lib/core/comments/comment-list.component.ts) |
| [Comments component](core/comments.component.md) | Displays comments from users involved in a specified task or content and allows an involved user to add a comment to a task or a content. | [Source](../lib/core/comments/comments.component.ts) |
| [Data column component](core/data-column.component.md) | Defines column properties for DataTable, Tasklist, Document List and other components. | [Source](../lib/core/data-column/data-column.component.ts) |
| [Datatable component](core/datatable.component.md) | Displays data as a table with customizable columns and presentation. | [Source](../lib/core/datatable/components/datatable/datatable.component.ts) |
| [Empty list component](core/empty-list.component.md) | Displays a message indicating that a list is empty. | [Source](../lib/core/datatable/components/datatable/empty-list.component.ts) |
| [Form field component](core/form-field.component.md) | A form field in an APS form. | [Source](../lib/core/form/components/form-field/form-field.component.ts) |
| [Form list component](core/form-list.component.md) | Shows APS forms as a list. | [Source](../lib/core/form/components/form-list.component.ts) |
| [Form component](core/form.component.md) | Shows a Form from APS | [Source](../lib/core/form/components/form.component.ts) |
| [Start form component](core/start-form.component.md) | Displays the Start Form for a process. | [Source](../lib/core/form/components/start-form.component.ts) |
| [Text mask component](core/text-mask.component.md) | Implements text field input masks. | [Source](../lib/core/form/components/widgets/text/text-mask.component.ts) |
| [Info drawer layout component](core/info-drawer-layout.component.md) | Displays a sidebar-style information panel. | [Source](../lib/core/info-drawer/info-drawer-layout.component.ts) |
| [Info drawer component](core/info-drawer.component.md) | Displays a sidebar-style information panel with tabs. | [Source](../lib/core/info-drawer/info-drawer.component.ts) |
| [Language menu component](core/language-menu.component.md) | Displays all the languages that are present in the "app.config.json" or the default one (EN). | [Source](../lib/core/language-menu/language-menu.component.ts) |
| [Header component](core/header.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Reusable header for Alfresco applications. | [Source](../lib/core/layout/components/header/header.component.ts) |
| [Sidebar action menu component](core/sidebar-action-menu.component.md) | Displays a sidebar-action menu information panel. | [Source](../lib/core/layout/components/sidebar-action/sidebar-action-menu.component.ts) |
| [Sidenav layout component](core/sidenav-layout.component.md) | Displays the standard three-region ADF application layout. | [Source](../lib/core/layout/components/sidenav-layout/sidenav-layout.component.ts) |
| [Login component](core/login.component.md) | Authenticates to Alfresco Content Services and or Alfresco Process Services. | [Source](../lib/core/login/components/login.component.ts) |
| [Infinite pagination component](core/infinite-pagination.component.md) | Adds "infinite" pagination to the component it is used with. | [Source](../lib/core/pagination/infinite-pagination.component.ts) |
| [Pagination component](core/pagination.component.md) | Adds pagination to the component it is used with. | [Source](../lib/core/pagination/pagination.component.ts) |
| [Host settings component](core/host-settings.component.md) ![Internal](docassets/images/InternalIcon.png) | Validates the URLs for ACS and APS and saves them in the user's local storage | [Source](../lib/core/settings/host-settings.component.ts) |
| [Sorting picker component](core/sorting-picker.component.md) | Selects from a set of predefined sorting definitions and directions. | [Source](../lib/core/sorting-picker/sorting-picker.component.ts) |
| [Empty content component](core/empty-content.component.md) | Provides a generic "Empty Content" placeholder for components. | [Source](../lib/core/templates/empty-content/empty-content.component.ts) |
| [Error content component](core/error-content.component.md) | Displays info about a specific error. | [Source](../lib/core/templates/error-content/error-content.component.ts) |
| [Toolbar divider component](core/toolbar-divider.component.md) | Divides groups of elements in a Toolbar with a visual separator. | [Source](../lib/core/toolbar/toolbar-divider.component.ts) |
| [Toolbar title component](core/toolbar-title.component.md) | Supplies custom HTML to be included in a Toolbar component title. | [Source](../lib/core/toolbar/toolbar-title.component.ts) |
| [Toolbar component](core/toolbar.component.md) | Simple container for headers, titles, actions and breadcrumbs. | [Source](../lib/core/toolbar/toolbar.component.ts) |
| [User info component](core/user-info.component.md) | Shows user information. | [Source](../lib/core/userinfo/components/user-info.component.ts) |
| [Viewer component](core/viewer.component.md) | Displays content from an ACS repository. | [Source](../lib/core/viewer/components/viewer.component.ts) |

## Directives

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Context menu directive](core/context-menu.directive.md) | Adds a context menu to a component. | [Source](../lib/core/context-menu/context-menu.directive.ts) |
| [Highlight directive](core/highlight.directive.md) | Adds highlighting to selected sections of an HTML element's content. | [Source](../lib/core/directives/highlight.directive.ts) |
| [Logout directive](core/logout.directive.md) | Logs the user out when the decorated element is clicked. | [Source](../lib/core/directives/logout.directive.ts) |
| [Node delete directive](core/node-delete.directive.md) | Deletes multiple files and folders. | [Source](../lib/core/directives/node-delete.directive.ts) |
| [Node favorite directive](core/node-favorite.directive.md) | Selectively toggles nodes as favorites. | [Source](../lib/core/directives/node-favorite.directive.ts) |
| [Node permission directive](core/node-permission.directive.md) | Selectively disables an HTML element or Angular component | [Source](../lib/core/directives/node-permission.directive.ts) |
| [Node restore directive](core/node-restore.directive.md) | Restores deleted nodes to their original location. | [Source](../lib/core/directives/node-restore.directive.ts) |
| [Upload directive](core/upload.directive.md) | Uploads content in response to file drag and drop. | [Source](../lib/core/directives/upload.directive.ts) |

## Models

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Form field model](core/form-field.model.md) | Contains the value and metadata for a field of a Form component. | [Source](../lib/core/form/components/widgets/core/form-field.model.ts) |
| [Comment process model](core/comment-process.model.md) | Represents a comment added to a Process Services task or process instance. | [Source](../lib/core/models/comment-process.model.ts) |
| [Product version model](core/product-version.model.md) | Contains version and license information classes for Alfresco products. | [Source](../lib/core/models/product-version.model.ts) |
| [User process model](core/user-process.model.md) | Represents a Process Services user. | [Source](../lib/core/models/user-process.model.ts) |
| [Bpm user model](core/bpm-user.model.md) | Contains information about a Process Services user. | [Source](../lib/core/userinfo/models/bpm-user.model.ts) |
| [Ecm user model](core/ecm-user.model.md) | Contains information about a Content Services user. | [Source](../lib/core/userinfo/models/ecm-user.model.ts) |

## Pipes

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [File size pipe](core/file-size.pipe.md) | Converts a number of bytes to the equivalent in KB, MB, etc. | [Source](../lib/core/pipes/file-size.pipe.ts) |
| [Mime type icon pipe](core/mime-type-icon.pipe.md) | Retrieves an icon to represent a MIME type. | [Source](../lib/core/pipes/mime-type-icon.pipe.ts) |
| [Node name tooltip pipe](core/node-name-tooltip.pipe.md) | Formats the tooltip for a Node. | [Source](../lib/core/pipes/node-name-tooltip.pipe.ts) |
| [Text highlight pipe](core/text-highlight.pipe.md) | Adds highlighting to words or sections of text that match a search string. | [Source](../lib/core/pipes/text-highlight.pipe.ts) |
| [Time ago pipe](core/time-ago.pipe.md) | Converts a recent past date into a number of days ago. | [Source](../lib/core/pipes/time-ago.pipe.ts) |
| [User initial pipe](core/user-initial.pipe.md) | Takes the name fields of a UserProcessModel object and extracts and formats the initials. | [Source](../lib/core/pipes/user-initial.pipe.ts) |

## Services

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Card item types service](core/card-item-types.service.md) | Maps type names to field component types for the Card View component. | [Source](../lib/core/card-view/services/card-item-types.service.ts) |
| [Card view update service](core/card-view-update.service.md) | Reports edits and clicks within fields of a Card View component. | [Source](../lib/core/card-view/services/card-view-update.service.ts) |
| [Activiti alfresco service](core/activiti-alfresco.service.md) | Gets Alfresco Repository folder content based on a Repository account configured in Alfresco Process Services (APS). | [Source](../lib/core/form/services/activiti-alfresco.service.ts) |
| [Form rendering service](core/form-rendering.service.md) | Maps an APS form field type string onto the corresponding form widget component type. | [Source](../lib/core/form/services/form-rendering.service.ts) |
| [Form service](core/form.service.md) | Implements Process Services form methods | [Source](../lib/core/form/services/form.service.ts) |
| [Node service](core/node.service.md) | Gets Alfresco Repository node metadata and creates nodes with metadata.  | [Source](../lib/core/form/services/node.service.ts) |
| [Process content service](core/process-content.service.md) | Manipulates content related to a Process Instance or Task Instance in APS. | [Source](../lib/core/form/services/process-content.service.ts) |
| [Alfresco api service](core/alfresco-api.service.md) | Provides access to an initialized **AlfrescoJSApi** instance. | [Source](../lib/core/services/alfresco-api.service.ts) |
| [Apps process service](core/apps-process.service.md) | Gets details of the Process Services apps that are deployed for the user. | [Source](../lib/core/services/apps-process.service.ts) |
| [Auth guard bpm service](core/auth-guard-bpm.service.md) | Adds authentication with Process Services to a route within the app. | [Source](../lib/core/services/auth-guard-bpm.service.ts) |
| [Auth guard ecm service](core/auth-guard-ecm.service.md) | Adds authentication with Content Services to a route within the app. | [Source](../lib/core/services/auth-guard-ecm.service.ts) |
| [Auth guard service](core/auth-guard.service.md) | Adds authentication to a route within the app. | [Source](../lib/core/services/auth-guard.service.ts) |
| [Authentication service](core/authentication.service.md) | Provides authentication to ACS and APS. | [Source](../lib/core/services/authentication.service.ts) |
| [Comment content service](core/comment-content.service.md) | Adds and retrieves comments for nodes in Content Services. | [Source](../lib/core/services/comment-content.service.ts) |
| [Comment process service](core/comment-process.service.md) | Adds and retrieves comments for task and process instances in Process Services. | [Source](../lib/core/services/comment-process.service.ts) |
| [Content service](core/content.service.md) | Accesses app-generated data objects via URLs and file downloads. | [Source](../lib/core/services/content.service.ts) |
| [Cookie service](core/cookie.service.md) | Stores key-value data items as browser cookies. | [Source](../lib/core/services/cookie.service.ts) |
| [Deleted nodes api service](core/deleted-nodes-api.service.md) | Gets a list of Content Services nodes currently in the trash. | [Source](../lib/core/services/deleted-nodes-api.service.ts) |
| [Discovery api service](core/discovery-api.service.md) | Gets version and license information for Process Services and Content Services. | [Source](../lib/core/services/discovery-api.service.ts) |
| [Favorites api service](core/favorites-api.service.md) | Gets a list of items a user has marked as their favorites. | [Source](../lib/core/services/favorites-api.service.ts) |
| [Highlight transform service](core/highlight-transform.service.md) | Adds HTML to a string to highlight chosen sections. | [Source](../lib/core/services/highlight-transform.service.ts) |
| [Log service](core/log.service.md) | Provides log functionality. | [Source](../lib/core/services/log.service.ts) |
| [Nodes api service](core/nodes-api.service.md) | Accesses and manipulates ACS document nodes using their node IDs. | [Source](../lib/core/services/nodes-api.service.ts) |
| [Notification service](core/notification.service.md) | Shows a notification message with optional feedback. | [Source](../lib/core/services/notification.service.ts) |
| [Page title service](core/page-title.service.md) | Sets the page title. | [Source](../lib/core/services/page-title.service.ts) |
| [People content service](core/people-content.service.md) | Gets information about a Content Services user.   | [Source](../lib/core/services/people-content.service.ts) |
| [People process service](core/people-process.service.md) | Gets information about Process Services users. | [Source](../lib/core/services/people-process.service.ts) |
| [Renditions service](core/renditions.service.md) ![Deprecated](docassets/images/DeprecatedIcon.png) | Manages prearranged conversions of content to different formats. | [Source](../lib/core/services/renditions.service.ts) |
| [Search configuration service](core/search-configuration.service.md) | Provides fine control of parameters to a search. | [Source](../lib/core/services/search-configuration.service.ts) |
| [Shared links api service](core/shared-links-api.service.md) | Finds shared links to Content Services items. | [Source](../lib/core/services/shared-links-api.service.ts) |
| [Sites service](core/sites.service.md) | Accesses and manipulates sites from a Content Services repository. | [Source](../lib/core/services/sites.service.ts) |
| [Storage service](core/storage.service.md) | Stores items in the form of key-value pairs. | [Source](../lib/core/services/storage.service.ts) |
| [Thumbnail service](core/thumbnail.service.md) | Retrieves an SVG thumbnail image to represent a document type. | [Source](../lib/core/services/thumbnail.service.ts) |
| [Translation service](core/translation.service.md) | Supports localisation. | [Source](../lib/core/services/translation.service.ts) |
| [Upload service](core/upload.service.md) | Provides access to various APIs related to file upload features. | [Source](../lib/core/services/upload.service.ts) |
| [User preferences service](core/user-preferences.service.md) | Stores preferences for components. | [Source](../lib/core/services/user-preferences.service.ts) |
| [Bpm user service](core/bpm-user.service.md) | Gets information about the current Process Services user. | [Source](../lib/core/userinfo/services/bpm-user.service.ts) |
| [Ecm user service](core/ecm-user.service.md) | Gets information about a Content Services user. | [Source](../lib/core/userinfo/services/ecm-user.service.ts) |
| _View util service_ | _Not currently documented_ | [Source](../lib/core/viewer/services/view-util.service.ts) |

## Widgets

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Content widget](core/content.widget.md) | Shows the content preview. | [Source](../lib/core/form/components/widgets/content/content.widget.ts) |

<!--core end-->

## Other classes and interfaces

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Data Table Adapter interface](core/datatable-adapter.interface.md) | Defines how table data is supplied to DataTable and Tasklist components. | [Source](../lib/core/datatable/data/datatable-adapter.ts) |
| [Form Field Validator interface](core/form-field-validator.interface.md) | Defines how the input fields of [Form](../../lib/process-services/task-list/models/form.model.ts) and Task Details components are validated. | [Source](../lib/core/form/components/widgets/core/form-field-validator.ts) |
| [Search Configuration interface](core/search-configuration.interface.md) | Provides fine control of parameters to a search. | [Source](../lib/core/services/search-configuration.service.ts) |

[(Back to Contents)](#contents)

## ADF Content Services

Contains components related to Content Services.
See the library's
[README file](../lib/content-services/README.md)
for more information about installing and using the source code.

<!--content-services start-->

## Components

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Breadcrumb component](content-services/breadcrumb.component.md) | Indicates the current position within a navigation hierarchy. | [Source](../lib/content-services/breadcrumb/breadcrumb.component.ts) |
| [Dropdown breadcrumb component](content-services/dropdown-breadcrumb.component.md) | Indicates the current position within a navigation hierarchy using a dropdown menu. | [Source](../lib/content-services/breadcrumb/dropdown-breadcrumb.component.ts) |
| [Content metadata card component](content-services/content-metadata-card.component.md) | Displays and edits metadata related to a node. | [Source](../lib/content-services/content-metadata/components/content-metadata-card/content-metadata-card.component.ts) |
| [Content node selector panel component](content-services/content-node-selector-panel.component.md) | Opens a Content Node Selector in its own dialog window. | [Source](../lib/content-services/content-node-selector/content-node-selector-panel.component.ts) |
| [Content node selector component](content-services/content-node-selector.component.md) | Allows a user to select items from a Content Services repository. | [Source](../lib/content-services/content-node-selector/content-node-selector.component.ts) |
| [Content action component](content-services/content-action.component.md) | Adds options to a Document List actions menu for a particular content type. | [Source](../lib/content-services/document-list/components/content-action/content-action.component.ts) |
| [Document list component](content-services/document-list.component.md) | Displays the documents from a repository. | [Source](../lib/content-services/document-list/components/document-list.component.ts) |
| [Add permission dialog component](content-services/add-permission-dialog.component.md) | Displays a dialog to search for people or groups to add to the current node permissions. | [Source](../lib/content-services/permission-manager/components/add-permission/add-permission-dialog.component.ts) |
| [Add permission panel component](content-services/add-permission-panel.component.md) | Searches for people or groups to add to the current node permissions. | [Source](../lib/content-services/permission-manager/components/add-permission/add-permission-panel.component.ts) |
| [Add permission component](content-services/add-permission.component.md) | Searches for people or groups to add to the current node permissions. | [Source](../lib/content-services/permission-manager/components/add-permission/add-permission.component.ts) |
| [Permission list component](content-services/permission-list.component.md) | Shows node permissions as a table. | [Source](../lib/content-services/permission-manager/components/permission-list/permission-list.component.ts) |
| [Search check list component](content-services/search-check-list.component.md) | Implements a checklist widget for the Search Filter component. | [Source](../lib/content-services/search/components/search-check-list/search-check-list.component.ts) |
| [Search chip list component](content-services/search-chip-list.component.md) | Displays search criteria as a set of "chips". | [Source](../lib/content-services/search/components/search-chip-list/search-chip-list.component.ts) |
| [Search control component](content-services/search-control.component.md) | Displays a input text which shows find-as-you-type suggestions. | [Source](../lib/content-services/search/components/search-control.component.ts) |
| [Search date range component](content-services/search-date-range.component.md) | Implements a date range widget for the Search Filter component. | [Source](../lib/content-services/search/components/search-date-range/search-date-range.component.ts) |
| [Search filter component](content-services/search-filter.component.md) | Represents a main container component for custom search and faceted search settings. | [Source](../lib/content-services/search/components/search-filter/search-filter.component.ts) |
| [Search number range component](content-services/search-number-range.component.md) | Implements a number range widget for the Search Filter component. | [Source](../lib/content-services/search/components/search-number-range/search-number-range.component.ts) |
| [Search radio component](content-services/search-radio.component.md) | Implements a radio button list widget for the Search Filter component. | [Source](../lib/content-services/search/components/search-radio/search-radio.component.ts) |
| [Search slider component](content-services/search-slider.component.md) | Implements a numeric slider widget for the Search Filter component. | [Source](../lib/content-services/search/components/search-slider/search-slider.component.ts) |
| [Search sorting picker component](content-services/search-sorting-picker.component.md) | Provides an ability to select one of the predefined sorting definitions for search results: | [Source](../lib/content-services/search/components/search-sorting-picker/search-sorting-picker.component.ts) |
| [Search text component](content-services/search-text.component.md) | Implements a text input widget for the Search Filter component. | [Source](../lib/content-services/search/components/search-text/search-text.component.ts) |
| [Search component](content-services/search.component.md) | Searches items for supplied search terms.  | [Source](../lib/content-services/search/components/search.component.ts) |
| [Sites dropdown component](content-services/sites-dropdown.component.md) | Displays a dropdown menu to show and interact with the sites of the current user. | [Source](../lib/content-services/site-dropdown/sites-dropdown.component.ts) |
| [Like component](content-services/like.component.md) | Allows a user to add "likes" to an item. | [Source](../lib/content-services/social/like.component.ts) |
| [Rating component](content-services/rating.component.md) | Allows a user to add ratings to an item. | [Source](../lib/content-services/social/rating.component.ts) |
| [Tag actions component](content-services/tag-actions.component.md) | Shows available actions for tags. | [Source](../lib/content-services/tag/tag-actions.component.ts) |
| [Tag list component](content-services/tag-list.component.md) | Shows tags for an item. | [Source](../lib/content-services/tag/tag-list.component.ts) |
| [Tag node list component](content-services/tag-node-list.component.md) | Shows tags for a node. | [Source](../lib/content-services/tag/tag-node-list.component.ts) |
| [File uploading dialog component](content-services/file-uploading-dialog.component.md) | Shows a dialog listing all the files uploaded with the Upload Button or Drag Area components. | [Source](../lib/content-services/upload/components/file-uploading-dialog.component.ts) |
| [Upload button component](content-services/upload-button.component.md) | Activates a file upload. | [Source](../lib/content-services/upload/components/upload-button.component.ts) |
| [Upload drag area component](content-services/upload-drag-area.component.md) | Adds a drag and drop area to upload files to ACS. | [Source](../lib/content-services/upload/components/upload-drag-area.component.ts) |
| [Upload version button component](content-services/upload-version-button.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Activates a file version upload. | [Source](../lib/content-services/upload/components/upload-version-button.component.ts) |
| [Version list component](content-services/version-list.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Displays the version history of a node in a Version Manager component. | [Source](../lib/content-services/version-manager/version-list.component.ts) |
| [Version manager component](content-services/version-manager.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Displays the version history of a node with the ability to upload a new version. | [Source](../lib/content-services/version-manager/version-manager.component.ts) |
| [Webscript component](content-services/webscript.component.md) | Provides access to Webscript features. | [Source](../lib/content-services/webscript/webscript.component.ts) |

## Directives

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Node download directive](content-services/node-download.directive.md) | Allows folders and/or files to be downloaded, with multiple nodes packed as a '.ZIP' archive. | [Source](../lib/content-services/directives/node-download.directive.ts) |
| [Node lock directive](content-services/node-lock.directive.md) | Locks a node. | [Source](../lib/content-services/directives/node-lock.directive.ts) |
| [Node share directive](content-services/node-share.directive.md) | Creates and manages public shared links for files. | [Source](../lib/content-services/directives/node-share.directive.ts) |
| [Folder create directive](content-services/folder-create.directive.md) | Creates folders. | [Source](../lib/content-services/folder-directive/folder-create.directive.ts) |
| [Folder edit directive](content-services/folder-edit.directive.md) | Allows folders to be edited. | [Source](../lib/content-services/folder-directive/folder-edit.directive.ts) |
| [Inherited button directive](content-services/inherited-button.directive.md) | Update the current node by adding/removing the inherited permissions. | [Source](../lib/content-services/permission-manager/components/inherited-button.directive.ts) |
| [File draggable directive](content-services/file-draggable.directive.md) | Provides drag-and-drop features for an element such as a `div`. | [Source](../lib/content-services/upload/directives/file-draggable.directive.ts) |

## Models

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Document library model](content-services/document-library.model.md) | Defines classes for use with the Content Services node API. | [Source](../lib/content-services/document-list/models/document-library.model.ts) |
| [Permissions style model](content-services/permissions-style.model.md) | Sets custom CSS styles for rows of a Document List according to the item's permissions. | [Source](../lib/content-services/document-list/models/permissions-style.model.ts) |

## Services

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Content node dialog service](content-services/content-node-dialog.service.md) | Displays and manages dialogs for selecting content to open, copy or upload. | [Source](../lib/content-services/content-node-selector/content-node-dialog.service.ts) |
| [Custom resources service](content-services/custom-resources.service.md) | Manages Document List information that is specific to a user. | [Source](../lib/content-services/document-list/services/custom-resources.service.ts) |
| [Document actions service](content-services/document-actions.service.md) | Implements the document menu actions for the Document List component. | [Source](../lib/content-services/document-list/services/document-actions.service.ts) |
| [Document list service](content-services/document-list.service.md) | Implements node operations used by the Document List component. | [Source](../lib/content-services/document-list/services/document-list.service.ts) |
| [Folder actions service](content-services/folder-actions.service.md) | Implements the folder menu actions for the Document List component. | [Source](../lib/content-services/document-list/services/folder-actions.service.ts) |
| [Node permission dialog service](content-services/node-permission-dialog.service.md) | Displays dialogs to let the user set node permissions. | [Source](../lib/content-services/permission-manager/services/node-permission-dialog.service.ts) |
| [Node permission service](content-services/node-permission.service.md) | Manages role permissions for content nodes. | [Source](../lib/content-services/permission-manager/services/node-permission.service.ts) |
| [Search filter service](content-services/search-filter.service.md) | Registers widgets for use with the Search Filter component. | [Source](../lib/content-services/search/components/search-filter/search-filter.service.ts) |
| [Search query builder service](content-services/search-query-builder.service.md) | Stores information from all the custom search and faceted search widgets, compiles and runs the final search query. | [Source](../lib/content-services/search/search-query-builder.service.ts) |
| [Rating service](content-services/rating.service.md) | Manages ratings for items in Content Services. | [Source](../lib/content-services/social/services/rating.service.ts) |
| [Tag service](content-services/tag.service.md) | Manages tags in Content Services. | [Source](../lib/content-services/tag/services/tag.service.ts) |

<!--content-services end-->

## Other classes and interfaces

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Search Widget interface](content-services/search-widget.interface.md) | Specifies required properties for [Search filter component](../content-services/search-filter.component.md) widgets. | [Source](../lib/content-services/search/search-widget.interface.ts) |

[(Back to Contents)](#contents)

## ADF Process Services

Contains components related to Process Services.
See the library's
[README file](../lib/process-services/README.md)
for more information about installing and using the source code.

<!--process-services start-->

## Components

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Apps list component](process-services/apps-list.component.md) | Shows all available apps. | [Source](../lib/process-services/app-list/apps-list.component.ts) |
| [Create process attachment component](process-services/create-process-attachment.component.md) | Displays Upload Component (Drag and Click) to upload the attachment to a specified process instance | [Source](../lib/process-services/attachment/create-process-attachment.component.ts) |
| [Create task attachment component](process-services/create-task-attachment.component.md) | Displays Upload Component (Drag and Click) to upload the attachment to a specified task | [Source](../lib/process-services/attachment/create-task-attachment.component.ts) |
| [Process attachment list component](process-services/process-attachment-list.component.md) | Displays attached documents on a specified process instance | [Source](../lib/process-services/attachment/process-attachment-list.component.ts) |
| [Task attachment list component](process-services/task-attachment-list.component.md) | Displays attached documents on a specified task. | [Source](../lib/process-services/attachment/task-attachment-list.component.ts) |
| [People component](process-services/people.component.md) | Displays users involved with a specified task | [Source](../lib/process-services/people/components/people/people.component.ts) |
| [People list component](process-services/people-list.component.md) | Shows a list of users (people). | [Source](../lib/process-services/people/components/people-list/people-list.component.ts) |
| [People search component](process-services/people-search.component.md) | Searches users/people. | [Source](../lib/process-services/people/components/people-search/people-search.component.ts) |
| [Process comments component](process-services/process-comments.component.md) | Displays comments associated with a particular process instance and allows the user to add new comments. | [Source](../lib/process-services/process-comments/process-comments.component.ts) |
| [Process filters component](process-services/process-filters.component.md) | Collection of criteria used to filter process instances, which may be customized by users. | [Source](../lib/process-services/process-list/components/process-filters.component.ts) |
| [Process instance details component](process-services/process-instance-details.component.md) | Displays detailed information on a specified process instance | [Source](../lib/process-services/process-list/components/process-instance-details.component.ts) |
| [Process instance header component](process-services/process-instance-header.component.md) | Sub-component of the process details component, which renders some general information about the selected process. | [Source](../lib/process-services/process-list/components/process-instance-header.component.ts) |
| [Process instance tasks component](process-services/process-instance-tasks.component.md) | Lists both the active and completed tasks associated with a particular process instance | [Source](../lib/process-services/process-list/components/process-instance-tasks.component.ts) |
| [Process list component](process-services/process-list.component.md) | Renders a list containing all the process instances matched by the parameters specified. | [Source](../lib/process-services/process-list/components/process-list.component.ts) |
| [Start process component](process-services/start-process.component.md) | Starts a process. | [Source](../lib/process-services/process-list/components/start-process.component.ts) |
| [Attach form component](process-services/attach-form.component.md) | This component can be used when there is no form attached to a task and we want to add one. | [Source](../lib/process-services/task-list/components/attach-form.component.ts) |
| [Checklist component](process-services/checklist.component.md) | Shows the checklist task functionality. | [Source](../lib/process-services/task-list/components/checklist.component.ts) |
| [Start task component](process-services/start-task.component.md) | Creates/Starts new task for the specified app | [Source](../lib/process-services/task-list/components/start-task.component.ts) |
| [Task details component](process-services/task-details.component.md) | Shows the details of the task ID passed in as input. | [Source](../lib/process-services/task-list/components/task-details.component.ts) |
| [Task filters component](process-services/task-filters.component.md) | Shows all available filters. | [Source](../lib/process-services/task-list/components/task-filters.component.ts) |
| [Task header component](process-services/task-header.component.md) | Shows all the information related to a task. | [Source](../lib/process-services/task-list/components/task-header.component.ts) |
| [Task list component](process-services/task-list.component.md) | Renders a list containing all the tasks matched by the parameters specified. | [Source](../lib/process-services/task-list/components/task-list.component.ts) |
| [Task standalone component](process-services/task-standalone.component.md) | This component can be used when the task doesn't belong to any processes. | [Source](../lib/process-services/task-list/components/task-standalone.component.ts) |

## Directives

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Process audit directive](process-services/process-audit.directive.md) | Fetches the Process Audit information the PDF or JSON format. | [Source](../lib/process-services/process-list/components/process-audit.directive.ts) |
| [Task audit directive](process-services/task-audit.directive.md) | Fetches the Task Audit information in PDF or JSON format. | [Source](../lib/process-services/task-list/components/task-audit.directive.ts) |

## Models

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Filter model](process-services/filter.model.md) | Contains classes related to filters in Process Services. | [Source](../lib/process-services/task-list/models/filter.model.ts) |
| [Task details model](process-services/task-details.model.md) | Information about a task. | [Source](../lib/process-services/task-list/models/task-details.model.ts) |

## Services

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Process filter service](process-services/process-filter.service.md) | Manage Process Filters, which are pre-configured Process Instance queries.  | [Source](../lib/process-services/process-list/services/process-filter.service.ts) |
| [Process service](process-services/process.service.md) | Manages Process Instances, Process Variables, and Process Audit Log.  | [Source](../lib/process-services/process-list/services/process.service.ts) |
| [Task filter service](process-services/task-filter.service.md) | Manage Task Filters, which are pre-configured Task Instance queries.  | [Source](../lib/process-services/task-list/services/task-filter.service.ts) |
| [Tasklist service](process-services/tasklist.service.md) | Manages Task Instances. | [Source](../lib/process-services/task-list/services/tasklist.service.ts) |

<!--process-services end-->

[(Back to Contents)](#contents)

## ADF Insights

Contains components for Process Services analytics and diagrams.
See the library's
[README file](../lib/insights/README.md)
for more information about installing and using the source code.

<!--insights start-->

## Components

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Widget component](insights/widget.component.md) | Base class for standard and custom widget classes. | [Source](../lib/insights/analytics-process/components/widgets/widget.component.ts) |
| [Analytics generator component](insights/analytics-generator.component.md) | Generates and shows charts | [Source](../lib/insights/analytics-process/components/analytics-generator.component.ts) |
| [Analytics report list component](insights/analytics-report-list.component.md) | Shows a list of all available reports | [Source](../lib/insights/analytics-process/components/analytics-report-list.component.ts) |
| [Analytics component](insights/analytics.component.md) | Shows the charts related to the reportId passed as input | [Source](../lib/insights/analytics-process/components/analytics.component.ts) |
| [Diagram component](insights/diagram.component.md) | Displays process diagrams. | [Source](../lib/insights/diagram/components/diagram.component.ts) |

<!--insights end-->

[(Back to Contents)](#contents)

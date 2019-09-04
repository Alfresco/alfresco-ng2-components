---
Title: Component docs
Github only: true
---

# Component Docs Index

Below is an index of the documentation for ADF. The [User Guide](#user-guide)
section discusses particular techniques in depth. The other sections are references for the ADF
libraries. Click the name of an item to see its documentation or click the source link to see
its main source file. Note that ADF is developed continuously, so the source files for some items may be listed here before their documentation is available.

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

A few other pages of information are also available:

-   The [Version Index](versionIndex.md) has a list of components ordered by
    the ADF version where they were introduced.
-   The [Release notes](release-notes/README.md) section has details of all
    the features introduced and bugs fixed with each release.
-   The [Version compatibility](compatibility.md) page shows which versions
    of Alfresco's backend servies (ACS and APS) are compatible with each released
    version of ADF.
-   The [Roadmap](roadmap.md)
    contains a preview of features we hope to release in future versions of ADF.
-   The [License info](license-info/README.md) section lists the third-party libraries used by ADF along with links to their Open Source licenses.
-   The [Vulnerability](vulnerability/README.md) section lists the third-party
    libraries known vulnerability.
    libraries used by ADF along with links to their Open Source licenses.
-   The [Breaking changes](breaking-changes/breaking-change-2.6.0-3.0.0.md) section lists
    all breaking changes between major versions, such as removal of deprecated items.
-   The [Upgrade guide](upgrade-guide/README.md) explains how to upgrade your project from an earlier version of ADF to the current version.

## Contents

-   [User Guide](#user-guide)
-   [Core API](#core-api)
-   [Content Services API](#content-services-api)
-   [Process Services API](#process-services-api)
-   [Process Services Cloud API](#process-services-cloud-api)
-   [Extensions API](#extensions-api)
-   [Insights API](#insights-api)

## User guide

<!--guide start-->

-   [Angular Material Design](user-guide/angular-material-design.md)
-   [Form Extensibility and Customisation](user-guide/extensibility.md)
-   [Internationalization in ADF](user-guide/internationalization.md)
-   [Localization in ADF](user-guide/localization.md)
-   [Theming](user-guide/theming.md)
-   [Transclusion](user-guide/transclusion.md)
-   [Typography](user-guide/typography.md)
-   [Walkthrough - adding indicators to highlight information about a node](user-guide/metadata-indicators.md)

<!--guide end-->

[(Back to Contents)](#contents)

## Core API

Contains a variety of components used throughout ADF.
See the library's
[README file](../lib/core/README.md)
for more information about installing and using the source code.

<!--core start-->

### Components

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [About Component](core/components/about.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Shows a general version and status overview of the installed ADF library. | [Source](../lib/core/about/about.component.ts) |
| [Buttons Menu Component](core/components/buttons-menu.component.md) | Displays buttons on a responsive menu. | [Source](../lib/core/buttons-menu/buttons-menu.component.ts) |
| [Card View component](core/components/card-view.component.md) | Displays a configurable property list renderer. | [Source](../lib/core/card-view/components/card-view/card-view.component.ts) |
| [Comment list component](core/components/comment-list.component.md) | Shows a list of comments. | [Source](../lib/core/comments/comment-list.component.ts) |
| [Comments Component](core/components/comments.component.md) | Displays comments from users involved in a specified task or content and allows an involved user to add a comment to a task or a content. | [Source](../lib/core/comments/comments.component.ts) |
| [Data Column Component](core/components/data-column.component.md) | Defines column properties for DataTable, Tasklist, Document List and other components. | [Source](../lib/core/data-column/data-column.component.ts) |
| [DataTable component](core/components/datatable.component.md) | Displays data as a table with customizable columns and presentation. | [Source](../lib/core/datatable/components/datatable/datatable.component.ts) |
| [Empty Content Component](core/components/empty-content.component.md) | Provides a generic "Empty Content" placeholder for components. | [Source](../lib/core/templates/empty-content/empty-content.component.ts) |
| [Empty list component](core/components/empty-list.component.md) | Displays a message indicating that a list is empty. | [Source](../lib/core/datatable/components/datatable/empty-list.component.ts) |
| [Error Content Component](core/components/error-content.component.md) | Displays info about a specific error. | [Source](../lib/core/templates/error-content/error-content.component.ts) |
| [Form field component](core/components/form-field.component.md) | Represents a UI field in a form. | [Source](../lib/core/form/components/form-field/form-field.component.ts) |
| [Form List Component](core/components/form-list.component.md) | Shows forms as a list. | [Source](../lib/core/form/components/form-list.component.ts) |
| [Header component](core/components/header.component.md) | Reusable header for Alfresco applications. | [Source](../lib/core/layout/components/header/header.component.ts) |
| [Host settings component](core/components/host-settings.component.md) ![Internal](docassets/images/InternalIcon.png) | Validates the URLs for ACS and APS and saves them in the user's local storage | [Source](../lib/core/settings/host-settings.component.ts) |
| [Icon Component](core/components/icon.component.md) | Provides a universal way of rendering registered and named icons. | [Source](../lib/core/icon/icon.component.ts) |
| [Infinite Pagination component](core/components/infinite-pagination.component.md) | Adds "infinite" pagination to the component it is used with. | [Source](../lib/core/pagination/infinite-pagination.component.ts) |
| [Info drawer layout component](core/components/info-drawer-layout.component.md) | Displays a sidebar-style information panel. | [Source](../lib/core/info-drawer/info-drawer-layout.component.ts) |
| [Info Drawer Tab component](core/components/info-drawer-tab.component.md) | Renders tabs in a Info drawer component. | [Source](../lib/core/info-drawer/info-drawer.component.ts) |
| [Info Drawer component](core/components/info-drawer.component.md) | Displays a sidebar-style information panel with tabs. | [Source](../lib/core/info-drawer/info-drawer.component.ts) |
| [Json Cell component](core/components/json-cell.component.md) | Shows a JSON-formatted value inside a datatable component. | [Source](../lib/core/datatable/components/datatable/json-cell.component.ts) |
| [Language Menu component](core/components/language-menu.component.md) | Displays all the languages that are present in "app.config.json" and the default (EN). | [Source](../lib/core/language-menu/language-menu.component.ts) |
| [Login Dialog Panel component](core/components/login-dialog-panel.component.md) | Shows and manages a login dialog. | [Source](../lib/core/login/components/login-dialog-panel.component.ts) |
| [Login Dialog component](core/components/login-dialog.component.md) | Allows a user to perform a login via a dialog. | [Source](../lib/core/login/components/login-dialog.component.ts) |
| [Login component](core/components/login.component.md) | Authenticates to Alfresco Content Services and Alfresco Process Services. | [Source](../lib/core/login/components/login.component.ts) |
| [Notification History component](core/components/notification-history.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | This component is in the current status just an experimental component. |  |
| The main purpose of the Notification history component is list all the notification received in the current session. They will disappear from the list after the refresh. | [Source](../lib/core/notification-history/notification-history.component.ts) |  |
| [Pagination Component](core/components/pagination.component.md) | Adds pagination to the component it is used with. | [Source](../lib/core/pagination/pagination.component.ts) |
| [Sidebar action menu component](core/components/sidebar-action-menu.component.md) | Displays a sidebar-action menu information panel. | [Source](../lib/core/layout/components/sidebar-action/sidebar-action-menu.component.ts) |
| [Sidenav Layout component](core/components/sidenav-layout.component.md) | Displays the standard three-region ADF application layout. | [Source](../lib/core/layout/components/sidenav-layout/sidenav-layout.component.ts) |
| [Sorting Picker Component](core/components/sorting-picker.component.md) | Selects from a set of predefined sorting definitions and directions. | [Source](../lib/core/sorting-picker/sorting-picker.component.ts) |
| [Start Form component](core/components/start-form.component.md) | Displays the Start Form for a process. | [Source](../lib/process-services/form/start-form.component.ts) |
| [Text Mask directive](core/components/text-mask.component.md) | Implements text field input masks. | [Source](../lib/core/form/components/widgets/text/text-mask.component.ts) |
| [Toolbar Divider Component](core/components/toolbar-divider.component.md) | Divides groups of elements in a Toolbar with a visual separator. | [Source](../lib/core/toolbar/toolbar-divider.component.ts) |
| [Toolbar Title Component](core/components/toolbar-title.component.md) | Supplies custom HTML to be included in a Toolbar component title. | [Source](../lib/core/toolbar/toolbar-title.component.ts) |
| [Toolbar Component](core/components/toolbar.component.md) | Simple container for headers, titles, actions and breadcrumbs. | [Source](../lib/core/toolbar/toolbar.component.ts) |
| [User Info component](core/components/user-info.component.md) | Shows user information. | [Source](../lib/core/userinfo/components/user-info.component.ts) |
| [Viewer component](core/components/viewer.component.md) | Displays content from an ACS repository. | [Source](../lib/core/viewer/components/viewer.component.ts) |

### Directives

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Check Allowable Operation directive](core/directives/check-allowable-operation.directive.md) | Selectively disables an HTML element or Angular component. | [Source](../lib/core/directives/check-allowable-operation.directive.ts) |
| [Clipboard directive](core/directives/clipboard.directive.md) | Copies text to the clipboard. | [Source](../lib/core/clipboard/clipboard.directive.ts) |
| [Context Menu directive](core/directives/context-menu.directive.md) | Adds a context menu to a component. | [Source](../lib/core/context-menu/context-menu.directive.ts) |
| [Highlight directive](core/directives/highlight.directive.md) | Adds highlighting to selected sections of an HTML element's content. | [Source](../lib/core/directives/highlight.directive.ts) |
| [Logout directive](core/directives/logout.directive.md) | Logs the user out when the decorated element is clicked. | [Source](../lib/core/directives/logout.directive.ts) |
| [Node Delete directive](core/directives/node-delete.directive.md) | Deletes multiple files and folders. | [Source](../lib/core/directives/node-delete.directive.ts) |
| [Node Download directive](core/directives/node-download.directive.md) | Allows folders and/or files to be downloaded, with multiple nodes packed as a '.ZIP' archive. | [Source](../lib/core/directives/node-download.directive.ts) |
| [Node Favorite directive](core/directives/node-favorite.directive.md) | Selectively toggles nodes as favorites. | [Source](../lib/core/directives/node-favorite.directive.ts) |
| [Node Restore directive](core/directives/node-restore.directive.md) | Restores deleted nodes to their original location. | [Source](../lib/core/directives/node-restore.directive.ts) |
| [Upload Directive](core/directives/upload.directive.md) | Uploads content in response to file drag and drop. | [Source](../lib/core/directives/upload.directive.ts) |

### Interfaces

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Card View Item interface](core/interfaces/card-view-item.interface.md) | Defines the implementation of an item in a Card View component. | [Source](../lib/core/card-view/interfaces/card-view-item.interface.ts) |
| [DataTableAdapter interface](core/interfaces/datatable-adapter.interface.md) | Defines how table data is supplied to DataTable and Tasklist components. | [Source](../lib/core/datatable/data/datatable-adapter.ts) |
| [FormFieldValidator interface](core/interfaces/form-field-validator.interface.md) | Defines how the input fields of Form and Task Details components are validated. | [Source](../lib/core/form/components/widgets/core/form-field-validator.ts) |
| [Search Configuration interface](core/interfaces/search-configuration.interface.md) | Provides fine control of parameters to a search. | [Source](../lib/core/interface/search-configuration.interface.ts) |

### Models

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Bpm User model](core/models/bpm-user.model.md) | Contains information about a Process Services user. | [Source](../lib/core/userinfo/models/bpm-user.model.ts) |
| [Ecm User model](core/models/ecm-user.model.md) | Contains information about a Content Services user. | [Source](../lib/core/userinfo/models/ecm-user.model.ts) |
| [Form Field model](core/models/form-field.model.md) | Contains the value and metadata for a field of a Form component. | [Source](../lib/core/form/components/widgets/core/form-field.model.ts) |
| [Product Version model](core/models/product-version.model.md) | Contains version and license information classes for Alfresco products. | [Source](../lib/core/models/product-version.model.ts) |
| [User Process model](core/models/user-process.model.md) | Represents a Process Services user. | [Source](../lib/core/models/user-process.model.ts) |

### Pipes

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [App Config Pipe](core/pipes/app-config.pipe.md) | Retrieves values from the application configuration file directly. | [Source](../lib/core/app-config/app-config.pipe.ts) |
| [Decimal Number Pipe](core/pipes/decimal-number.pipe.md) | Transforms a number to have a certain amount of digits in its integer part and also in its decimal part. | [Source](../lib/core/pipes/decimal-number.pipe.ts) |
| [File Size pipe](core/pipes/file-size.pipe.md) | Converts a number of bytes to the equivalent in KB, MB, etc. | [Source](../lib/core/pipes/file-size.pipe.ts) |
| [Format Space pipe](core/pipes/format-space.pipe.md) | Replaces all the white space in a string with a supplied character. | [Source](../lib/core/pipes/format-space.pipe.ts) |
| [Full name pipe](core/pipes/full-name.pipe.md) | Joins the first and last name properties from a UserProcessModel object into a single string. | [Source](../lib/core/pipes/full-name.pipe.ts) |
| [Localized Date pipe](core/pipes/localized-date.pipe.md) | Converts a date to a given format and locale. | [Source](../lib/core/pipes/localized-date.pipe.ts) |
| [Mime Type Icon pipe](core/pipes/mime-type-icon.pipe.md) | Retrieves an icon to represent a MIME type. | [Source](../lib/core/pipes/mime-type-icon.pipe.ts) |
| [Multi Value Pipe](core/pipes/multi-value.pipe.md) | Takes an array of strings and turns it into one string where items are separated by a separator. The default separator applied to the list is the comma ,  however, you can set your own separator in the params of the pipe. | [Source](../lib/core/pipes/multi-value.pipe.ts) |
| [Node Name Tooltip pipe](core/pipes/node-name-tooltip.pipe.md) | Formats the tooltip for a Node. | [Source](../lib/core/pipes/node-name-tooltip.pipe.ts) |
| [Text Highlight pipe](core/pipes/text-highlight.pipe.md) | Adds highlighting to words or sections of text that match a search string. | [Source](../lib/core/pipes/text-highlight.pipe.ts) |
| [Time Ago pipe](core/pipes/time-ago.pipe.md) | Converts a recent past date into a number of days ago. | [Source](../lib/core/pipes/time-ago.pipe.ts) |
| [User Initial pipe](core/pipes/user-initial.pipe.md) | Takes the name fields of a UserProcessModel object and extracts and formats the initials. | [Source](../lib/core/pipes/user-initial.pipe.ts) |

### Services

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [APS Alfresco Content Service](core/services/activiti-alfresco.service.md) | Gets Alfresco Repository folder content based on a Repository account configured in Alfresco Process Services (APS). | [Source](../lib/core/form/services/activiti-alfresco.service.ts) |
| [Alfresco Api Service](core/services/alfresco-api.service.md) | Provides access to an initialized AlfrescoJSApi instance. | [Source](../lib/core/services/alfresco-api.service.ts) |
| [App Config service](core/services/app-config.service.md) | Supports app configuration settings, stored server side. | [Source](../lib/core/app-config/app-config.service.ts) |
| [Apps Process service](core/services/apps-process.service.md) | Gets details of the Process Services apps that are deployed for the user. | [Source](../lib/core/services/apps-process.service.ts) |
| [Auth Guard Bpm service](core/services/auth-guard-bpm.service.md) | Adds authentication with Process Services to a route within the app. | [Source](../lib/core/services/auth-guard-bpm.service.ts) |
| [Auth Guard Ecm service](core/services/auth-guard-ecm.service.md) | Adds authentication with Content Services to a route within the app. | [Source](../lib/core/services/auth-guard-ecm.service.ts) |
| [Auth Guard SSO Role service](core/services/auth-guard-sso-role.service.md) | Checks the user roles of a user. | [Source](../lib/core/services/auth-guard-sso-role.service.ts) |
| [Auth Guard service](core/services/auth-guard.service.md) | Adds authentication to a route within the app. | [Source](../lib/core/services/auth-guard.service.ts) |
| [Authentication Service](core/services/authentication.service.md) | Provides authentication to ACS and APS. | [Source](../lib/core/services/authentication.service.ts) |
| [Bpm User service](core/services/bpm-user.service.md) | Gets information about the current Process Services user. | [Source](../lib/core/userinfo/services/bpm-user.service.ts) |
| [Card Item Type service](core/services/card-item-types.service.md) | Maps type names to field component types for the Card View component. | [Source](../lib/core/card-view/services/card-item-types.service.ts) |
| [Card View Update service](core/services/card-view-update.service.md) | Reports edits and clicks within fields of a Card View component. | [Source](../lib/core/card-view/services/card-view-update.service.ts) |
| [Clipboard service](core/services/clipboard.service.md) | Copies text to the clipboard. | [Source](../lib/core/clipboard/clipboard.service.ts) |
| [Comment Content service](core/services/comment-content.service.md) | Adds and retrieves comments for nodes in Content Services. | [Source](../lib/core/services/comment-content.service.ts) |
| [Comment Process service](core/services/comment-process.service.md) | Adds and retrieves comments for task and process instances in Process Services. | [Source](../lib/core/services/comment-process.service.ts) |
| [Content service](core/services/content.service.md) | Accesses app-generated data objects via URLs and file downloads. | [Source](../lib/core/services/content.service.ts) |
| [Cookie service](core/services/cookie.service.md) | Stores key-value data items as browser cookies. | [Source](../lib/core/services/cookie.service.ts) |
| [Deleted Nodes Api service](core/services/deleted-nodes-api.service.md) | Gets a list of Content Services nodes currently in the trash. | [Source](../lib/core/services/deleted-nodes-api.service.ts) |
| [Discovery Api service](core/services/discovery-api.service.md) | Gets version and license information for Process Services and Content Services. | [Source](../lib/core/services/discovery-api.service.ts) |
| [Download zip service](core/services/download-zip.service.md) | Creates and manages downloads. | [Source](../lib/core/services/download-zip.service.ts) |
| [Ecm User service](core/services/ecm-user.service.md) | Gets information about a Content Services user. | [Source](../lib/core/userinfo/services/ecm-user.service.ts) |
| [Favorites Api service](core/services/favorites-api.service.md) | Gets a list of items a user has marked as their favorites. | [Source](../lib/core/services/favorites-api.service.ts) |
| [Form Rendering service](core/services/form-rendering.service.md) | Maps a form field type string onto the corresponding form widget component type. | [Source](../lib/core/form/services/form-rendering.service.ts) |
| [Form service](core/services/form.service.md) | Implements Process Services form methods | [Source](../lib/core/form/services/form.service.ts) |
| [Highlight Transform service](core/services/highlight-transform.service.md) | Adds HTML to a string to highlight chosen sections. | [Source](../lib/core/services/highlight-transform.service.ts) |
| [Identity user service](core/services/identity-user.service.md) | Gets OAuth2 personal details and roles for users and performs CRUD operations on identity users. | [Source](../lib/core/userinfo/services/identity-user.service.ts) |
| [JWT helper service](core/services/jwt-helper.service.md) | Decodes a JSON Web Token (JWT) to a JavaScript object. | [Source](../lib/core/services/jwt-helper.service.ts) |
| [Log Service](core/services/log.service.md) | Provides log functionality. | [Source](../lib/core/services/log.service.ts) |
| [Login Dialog service](core/services/login-dialog.service.md) | Manages login dialogs. | [Source](../lib/core/services/login-dialog.service.ts) |
| [Node Service](core/services/node.service.md) | Gets Alfresco Repository node metadata and creates nodes with metadata. | [Source](../lib/core/form/services/node.service.ts) |
| [Nodes Api service](core/services/nodes-api.service.md) | Accesses and manipulates ACS document nodes using their node IDs. | [Source](../lib/core/services/nodes-api.service.ts) |
| [Notification Service](core/services/notification.service.md) | Shows a notification message with optional feedback. | [Source](../lib/core/services/notification.service.ts) |
| [Page Title service](core/services/page-title.service.md) | Sets the page title. | [Source](../lib/core/services/page-title.service.ts) |
| [People Content service](core/services/people-content.service.md) | Gets information about a Content Services user. | [Source](../lib/core/services/people-content.service.ts) |
| [People Process service](core/services/people-process.service.md) | Gets information about Process Services users. | [Source](../lib/core/services/people-process.service.ts) |
| [Process Content Service](core/services/process-content.service.md) | Manipulates content related to a Process Instance or Task Instance in APS. | [Source](../lib/core/form/services/process-content.service.ts) |
| [Renditions service](core/services/renditions.service.md) | Manages prearranged conversions of content to different formats. | [Source](../lib/core/services/renditions.service.ts) |
| [Search Configuration service](core/services/search-configuration.service.md) | Provides fine control of parameters to a search. | [Source](../lib/core/services/search-configuration.service.ts) |
| [Search service](core/services/search.service.md) | Accesses the Content Services Search API. | [Source](../lib/core/services/search.service.ts) |
| [Shared Links Api service](core/services/shared-links-api.service.md) | Finds shared links to Content Services items. | [Source](../lib/core/services/shared-links-api.service.ts) |
| [Sites service](core/services/sites.service.md) | Accesses and manipulates sites from a Content Services repository. | [Source](../lib/core/services/sites.service.ts) |
| [Storage service](core/services/storage.service.md) | Stores items in the form of key-value pairs. | [Source](../lib/core/services/storage.service.ts) |
| [Thumbnail service](core/services/thumbnail.service.md) | Retrieves an SVG thumbnail image to represent a document type. | [Source](../lib/core/services/thumbnail.service.ts) |
| [Translation service](core/services/translation.service.md) | Supports localisation. | [Source](../lib/core/services/translation.service.ts) |
| [Upload Service](core/services/upload.service.md) | Provides access to various APIs related to file upload features. | [Source](../lib/core/services/upload.service.ts) |
| [User Preferences Service](core/services/user-preferences.service.md) | Stores preferences for the app and for individual components. | [Source](../lib/core/services/user-preferences.service.ts) |

### Widgets

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [APS Content Component](core/widgets/content.widget.md) | Shows the content preview. | [Source](../lib/core/form/components/widgets/content/content.widget.ts) |

<!--core end-->

[(Back to Contents)](#contents)

## Content Services API

Contains components related to Content Services.
See the library's
[README file](../lib/content-services/README.md)
for more information about installing and using the source code.

<!--content-services start-->

### Components

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Add Permission Dialog Component](content-services/components/add-permission-dialog.component.md) | Displays a dialog to search for people or groups to add to the current node permissions. | [Source](../lib/content-services/permission-manager/components/add-permission/add-permission-dialog.component.ts) |
| [Add Permission Panel Component](content-services/components/add-permission-panel.component.md) | Searches for people or groups to add to the current node permissions. | [Source](../lib/content-services/permission-manager/components/add-permission/add-permission-panel.component.ts) |
| [Add Permission Component](content-services/components/add-permission.component.md) | Searches for people or groups to add to the current node permissions. | [Source](../lib/content-services/permission-manager/components/add-permission/add-permission.component.ts) |
| [Breadcrumb Component](content-services/components/breadcrumb.component.md) | Indicates the current position within a navigation hierarchy. | [Source](../lib/content-services/breadcrumb/breadcrumb.component.ts) |
| [Content Action component](content-services/components/content-action.component.md) | Adds options to a Document List actions menu for a particular content type. | [Source](../lib/content-services/document-list/components/content-action/content-action.component.ts) |
| [Content Metadata Card component](content-services/components/content-metadata-card.component.md) | Displays and edits metadata related to a node. | [Source](../lib/content-services/content-metadata/components/content-metadata-card/content-metadata-card.component.ts) |
| [Content Node Selector Panel component](content-services/components/content-node-selector-panel.component.md) | Opens a Content Node Selector  in its own dialog window. | [Source](../lib/content-services/content-node-selector/content-node-selector-panel.component.ts) |
| [Content Node Selector component](content-services/components/content-node-selector.component.md) | Allows a user to select items from a Content Services repository. | [Source](../lib/content-services/content-node-selector/content-node-selector.component.ts) |
| [Document List component](content-services/components/document-list.component.md) | Displays the documents from a repository. | [Source](../lib/content-services/document-list/components/document-list.component.ts) |
| [Dropdown Breadcrumb Component](content-services/components/dropdown-breadcrumb.component.md) | Indicates the current position within a navigation hierarchy using a dropdown menu. | [Source](../lib/content-services/breadcrumb/dropdown-breadcrumb.component.ts) |
| [File Uploading Dialog Component](content-services/components/file-uploading-dialog.component.md) | Shows a dialog listing all the files uploaded with the Upload Button or Drag Area components. | [Source](../lib/content-services/upload/components/file-uploading-dialog.component.ts) |
| [Like component](content-services/components/like.component.md) | Allows a user to add "likes" to an item. | [Source](../lib/content-services/social/like.component.ts) |
| [Permission List Component](content-services/components/permission-list.component.md) | Shows node permissions as a table. | [Source](../lib/content-services/permission-manager/components/permission-list/permission-list.component.ts) |
| [Rating component](content-services/components/rating.component.md) | Allows a user to add and remove rating to an item. | [Source](../lib/content-services/social/rating.component.ts) |
| [Search check list component](content-services/components/search-check-list.component.md) | Implements a checklist widget for the Search Filter component. | [Source](../lib/content-services/search/components/search-check-list/search-check-list.component.ts) |
| [Search Chip List Component](content-services/components/search-chip-list.component.md) | Displays search criteria as a set of "chips". | [Source](../lib/content-services/search/components/search-chip-list/search-chip-list.component.ts) |
| [Search control component](content-services/components/search-control.component.md) | Displays a input text that shows find-as-you-type suggestions. | [Source](../lib/content-services/search/components/search-control.component.ts) |
| [Search date range component](content-services/components/search-date-range.component.md) | Implements a date range widget for the Search Filter component. | [Source](../lib/content-services/search/components/search-date-range/search-date-range.component.ts) |
| [Search Filter component](content-services/components/search-filter.component.md) | Represents a main container component for custom search and faceted search settings. | [Source](../lib/content-services/search/components/search-filter/search-filter.component.ts) |
| [Search number range component](content-services/components/search-number-range.component.md) | Implements a number range widget for the Search Filter component. | [Source](../lib/content-services/search/components/search-number-range/search-number-range.component.ts) |
| [Search radio component](content-services/components/search-radio.component.md) | Implements a radio button list widget for the Search Filter component. | [Source](../lib/content-services/search/components/search-radio/search-radio.component.ts) |
| [Search slider component](content-services/components/search-slider.component.md) | Implements a numeric slider widget for the Search Filter component. | [Source](../lib/content-services/search/components/search-slider/search-slider.component.ts) |
| [Search Sorting Picker Component](content-services/components/search-sorting-picker.component.md) | Provides an ability to select one of the predefined sorting definitions for search results: | [Source](../lib/content-services/search/components/search-sorting-picker/search-sorting-picker.component.ts) |
| [Search text component](content-services/components/search-text.component.md) | Implements a text input widget for the Search Filter component. | [Source](../lib/content-services/search/components/search-text/search-text.component.ts) |
| [Search component](content-services/components/search.component.md) | Searches items for supplied search terms. | [Source](../lib/content-services/search/components/search.component.ts) |
| [Sites Dropdown component](content-services/components/sites-dropdown.component.md) | Displays a dropdown menu to show and interact with the sites of the current user. | [Source](../lib/content-services/site-dropdown/sites-dropdown.component.ts) |
| [Tag Node Actions List component](content-services/components/tag-actions.component.md) | Shows available actions for tags. | [Source](../lib/content-services/tag/tag-actions.component.ts) |
| [Tag List component](content-services/components/tag-list.component.md) | Shows tags for an item. | [Source](../lib/content-services/tag/tag-list.component.ts) |
| [Tag Node List component](content-services/components/tag-node-list.component.md) | Shows tags for a node. | [Source](../lib/content-services/tag/tag-node-list.component.ts) |
| [Tree View component](content-services/components/tree-view.component.md) | Shows the folder and subfolders of a node as a tree view. | [Source](../lib/content-services/tree-view/components/tree-view.component.ts) |
| [Upload Button Component](content-services/components/upload-button.component.md) | Activates a file upload. | [Source](../lib/content-services/upload/components/upload-button.component.ts) |
| [Upload Drag Area Component](content-services/components/upload-drag-area.component.md) | Adds a drag and drop area to upload files to ACS. | [Source](../lib/content-services/upload/components/upload-drag-area.component.ts) |
| [Upload Version Button Component (Workaround)](content-services/components/upload-version-button.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Activates a file version upload. | [Source](../lib/content-services/upload/components/upload-version-button.component.ts) |
| [Version List component](content-services/components/version-list.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Displays the version history of a node in a Version Manager component. | [Source](../lib/content-services/version-manager/version-list.component.ts) |
| [Version Manager Component](content-services/components/version-manager.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Displays the version history of a node with the ability to upload a new version. | [Source](../lib/content-services/version-manager/version-manager.component.ts) |
| [Webscript component](content-services/components/webscript.component.md) | Provides access to Webscript features. | [Source](../lib/content-services/webscript/webscript.component.ts) |

### Directives

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Node Public File Share Directive](content-services/directives/content-node-share.directive.md) | Creates and manages public shared links for files. | [Source](../lib/content-services/content-node-share/content-node-share.directive.ts) |
| [File Draggable directive](content-services/directives/file-draggable.directive.md) | Provides drag-and-drop features for an element such as a div. | [Source](../lib/content-services/upload/directives/file-draggable.directive.ts) |
| [Folder Create directive](content-services/directives/folder-create.directive.md) | Creates folders. | [Source](../lib/content-services/folder-directive/folder-create.directive.ts) |
| [Folder Edit directive](content-services/directives/folder-edit.directive.md) | Allows folders to be edited. | [Source](../lib/content-services/folder-directive/folder-edit.directive.ts) |
| [Inherit Permission directive](content-services/directives/inherited-button.directive.md) | Update the current node by adding/removing the inherited permissions. | [Source](../lib/content-services/permission-manager/components/inherited-button.directive.ts) |
| [Node Lock directive](content-services/directives/node-lock.directive.md) | Locks or unlocks a node. | [Source](../lib/content-services/directives/node-lock.directive.ts) |
| [Toggle Icon directive](content-services/directives/toggle-icon.directive.md) | Toggle icon on mouse and keyboard event. | [Source](../lib/content-services/upload/directives/toggle-icon.directive.ts) |

### Dialogs

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Confirm dialog component](content-services/dialogs/confirm.dialog.md) | Requests a yes/no choice from the user. | [Source](../lib/content-services/dialogs/confirm.dialog.ts) |
| [Library dialog component](content-services/dialogs/library.dialog.md) | Creates a new Content Services document library/site. | [Source](../lib/content-services/dialogs/library/library.dialog.ts) |

### Interfaces

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Search widget interface](content-services/interfaces/search-widget.interface.md) | Specifies required properties for Search filter component widgets. | [Source](../lib/content-services/search/search-widget.interface.ts) |

### Models

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Image Resolver Model](content-services/models/image-resolver.model.md) | Defines the Image Resolver function used by the Document List Component. | [Source](../lib/content-services/document-list/data/image-resolver.model.ts) |
| [Permission Style model](content-services/models/permissions-style.model.md) | Sets custom CSS styles for rows of a Document List according to the item's permissions. | [Source](../lib/content-services/document-list/models/permissions-style.model.ts) |
| [Row Filter Model](content-services/models/row-filter.model.md) | Defines the Row Filter function used by the Document List Component. | [Source](../lib/content-services/document-list/data/row-filter.model.ts) |

### Pipes

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [File upload error pipe](content-services/pipes/file-upload-error.pipe.md) | Converts an upload error code to an error message. | [Source](../lib/content-services/upload/pipes/file-upload-error.pipe.ts) |

### Services

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Content Node Dialog service](content-services/services/content-node-dialog.service.md) | Displays and manages dialogs for selecting content to open, copy or upload. | [Source](../lib/content-services/content-node-selector/content-node-dialog.service.ts) |
| [Custom Resources service](content-services/services/custom-resources.service.md) | Manages Document List information that is specific to a user. | [Source](../lib/content-services/document-list/services/custom-resources.service.ts) |
| [Document Actions service](content-services/services/document-actions.service.md) | Implements the document menu actions for the Document List component. | [Source](../lib/content-services/document-list/services/document-actions.service.ts) |
| [Document List service](content-services/services/document-list.service.md) | Implements node operations used by the Document List component. | [Source](../lib/content-services/document-list/services/document-list.service.ts) |
| [Folder Actions service](content-services/services/folder-actions.service.md) | Implements the folder menu actions for the Document List component. | [Source](../lib/content-services/document-list/services/folder-actions.service.ts) |
| [Node permission dialog service](content-services/services/node-permission-dialog.service.md) | Displays dialogs to let the user set node permissions. | [Source](../lib/content-services/permission-manager/services/node-permission-dialog.service.ts) |
| [Node Permission service](content-services/services/node-permission.service.md) | Manages role permissions for content nodes. | [Source](../lib/content-services/permission-manager/services/node-permission.service.ts) |
| [Rating service](content-services/services/rating.service.md) | Manages ratings for items in Content Services. | [Source](../lib/content-services/social/services/rating.service.ts) |
| [Search filter service](content-services/services/search-filter.service.md) | Registers widgets for use with the Search Filter component. | [Source](../lib/content-services/search/components/search-filter/search-filter.service.ts) |
| [Search Query Builder service](content-services/services/search-query-builder.service.md) | Stores information from all the custom search and faceted search widgets, compiles and runs the final search query. | [Source](../lib/content-services/search/search-query-builder.service.ts) |
| [Tag service](content-services/services/tag.service.md) | Manages tags in Content Services. | [Source](../lib/content-services/tag/services/tag.service.ts) |

<!--content-services end-->

[(Back to Contents)](#contents)

## Process Services API

Contains components related to Process Services.
See the library's
[README file](../lib/process-services/README.md)
for more information about installing and using the source code.

<!--process-services start-->

### Components

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Apps List Component](process-services/components/apps-list.component.md) | Shows all available apps. | [Source](../lib/process-services/app-list/apps-list.component.ts) |
| [Attach Form component](process-services/components/attach-form.component.md) | This component can be used when there is no form attached to a task and you want to add one. | [Source](../lib/process-services/task-list/components/attach-form.component.ts) |
| [Checklist Component](process-services/components/checklist.component.md) | Shows the checklist task functionality. | [Source](../lib/process-services/task-list/components/checklist.component.ts) |
| [Create Process Attachment component](process-services/components/create-process-attachment.component.md) | Displays an Upload Component (Drag and Click) to upload the attachment to a specified process instance. | [Source](../lib/process-services/attachment/create-process-attachment.component.ts) |
| [Create Task Attachment Component](process-services/components/create-task-attachment.component.md) | Displays an Upload Component (Drag and Click) to upload the attachment to a specified task. | [Source](../lib/process-services/attachment/create-task-attachment.component.ts) |
| [Form component](process-services/components/form.component.md) | Shows a Form from APS | [Source](../lib/process-services/form/form.component.ts) |
| [People list component](process-services/components/people-list.component.md) | Shows a list of users (people). | [Source](../lib/process-services/people/components/people-list/people-list.component.ts) |
| [People Search component](process-services/components/people-search.component.md) | Searches users/people. | [Source](../lib/process-services/people/components/people-search/people-search.component.ts) |
| [People Component](process-services/components/people.component.md) | Displays users involved with a specified task | [Source](../lib/process-services/people/components/people/people.component.ts) |
| [Process Attachment List component](process-services/components/process-attachment-list.component.md) | Displays documents attached to a specified process instance. | [Source](../lib/process-services/attachment/process-attachment-list.component.ts) |
| [Process Instance Comments component](process-services/components/process-comments.component.md) | Displays comments associated with a particular process instance and allows the user to add new comments. | [Source](../lib/process-services/process-comments/process-comments.component.ts) |
| [Process Filters Component](process-services/components/process-filters.component.md) | Collection of criteria used to filter process instances, which may be customized by users. | [Source](../lib/process-services/process-list/components/process-filters.component.ts) |
| [Process Details component](process-services/components/process-instance-details.component.md) | Displays detailed information about a specified process instance | [Source](../lib/process-services/process-list/components/process-instance-details.component.ts) |
| [Process Instance Details Header component](process-services/components/process-instance-header.component.md) | Sub-component of the process details component, which renders some general information about the selected process. | [Source](../lib/process-services/process-list/components/process-instance-header.component.ts) |
| [Process Instance Tasks component](process-services/components/process-instance-tasks.component.md) | Lists both the active and completed tasks associated with a particular process instance | [Source](../lib/process-services/process-list/components/process-instance-tasks.component.ts) |
| [Process Instance List](process-services/components/process-list.component.md) | Renders a list containing all the process instances matched by the parameters specified. | [Source](../lib/process-services/process-list/components/process-list.component.ts) |
| [Select App Component](process-services/components/select-apps-dialog.component.md) | Shows all available apps and returns the selected app. | [Source](../lib/process-services/app-list/select-apps-dialog-component.ts) |
| [Start Process component](process-services/components/start-process.component.md) | Starts a process. | [Source](../lib/process-services/process-list/components/start-process.component.ts) |
| [Start Task Component](process-services/components/start-task.component.md) | Creates/Starts a new task for the specified app. | [Source](../lib/process-services/task-list/components/start-task.component.ts) |
| [Task Attachment List Component](process-services/components/task-attachment-list.component.md) | Displays documents attached to a specified task. | [Source](../lib/process-services/attachment/task-attachment-list.component.ts) |
| [Task Details component](process-services/components/task-details.component.md) | Shows the details of the task ID passed in as input. | [Source](../lib/process-services/task-list/components/task-details.component.ts) |
| [Task Filters component](process-services/components/task-filters.component.md) | Shows all available filters. | [Source](../lib/process-services/task-list/components/task-filters.component.ts) |
| [Task Header component](process-services/components/task-header.component.md) | Shows all the information related to a task. | [Source](../lib/process-services/task-list/components/task-header.component.ts) |
| [Task List component](process-services/components/task-list.component.md) | Renders a list containing all the tasks matched by the parameters specified. | [Source](../lib/process-services/task-list/components/task-list.component.ts) |
| [Task Standalone component](process-services/components/task-standalone.component.md) | This component can be used when the task doesn't belong to any processes. | [Source](../lib/process-services/task-list/components/task-standalone.component.ts) |

### Directives

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Process Audit Directive](process-services/directives/process-audit.directive.md) | Fetches the Process Audit information in PDF or JSON format. | [Source](../lib/process-services/process-list/components/process-audit.directive.ts) |
| [Task Audit Directive](process-services/directives/task-audit.directive.md) | Fetches the Task Audit information in PDF or JSON format. | [Source](../lib/process-services/task-list/components/task-audit.directive.ts) |

### Services

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Process Filter Service](process-services/services/process-filter.service.md) | Manage Process Filters, which are pre-configured Process Instance queries. | [Source](../lib/process-services/process-list/services/process-filter.service.ts) |
| [Process Service](process-services/services/process.service.md) | Manages process instances, process variables, and process audit Log. | [Source](../lib/process-services/process-list/services/process.service.ts) |
| [Task Filter Service](process-services/services/task-filter.service.md) | Manage Task Filters, which are pre-configured Task Instance queries. | [Source](../lib/process-services/task-list/services/task-filter.service.ts) |
| [Tasklist Service](process-services/services/tasklist.service.md) | Manages Task Instances. | [Source](../lib/process-services/task-list/services/tasklist.service.ts) |

<!--process-services end-->

[(Back to Contents)](#contents)

## Process Services Cloud API

Contains components related to Process Services Cloud.
See the library's
[README file](../lib/process-services-cloud/README.md)
for more information about installing and using the source code.

<!--process-services-cloud start-->

### Components

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [App List Cloud Component](process-services-cloud/components/app-list-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Shows all deployed cloud application instances. | [Source](../lib/process-services-cloud/src/lib/app/components/app-list-cloud.component.ts) |
| [Edit Process Filter Cloud component](process-services-cloud/components/edit-process-filter-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Shows/edits process filter details. | [Source](../lib/process-services-cloud/src/lib/process/process-filters/components/edit-process-filter-cloud.component.ts) |
| [Edit Task Filter Cloud component](process-services-cloud/components/edit-task-filter-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Edits task filter details. | [Source](../lib/process-services-cloud/src/lib/task/task-filters/components/edit-task-filter-cloud.component.ts) |
| [Form cloud custom outcomes component](process-services-cloud/components/form-cloud-custom-outcome.component.md) | Supplies custom outcome buttons to be included in Form cloud component. | [Source](../lib/process-services-cloud/src/lib/form/components/form-cloud-custom-outcomes.component.ts) |
| [Form cloud component](process-services-cloud/components/form-cloud.component.md) | Shows a form from Process Services. | [Source](../lib/process-services-cloud/src/lib/form/components/form-cloud.component.ts) |
| [Form Definition Selector Cloud](process-services-cloud/components/form-definition-selector-cloud.component.md) | Allows one form to be selected from a dropdown list. For forms to be displayed in this component they will need to be compatible with standAlone tasks. | [Source](../lib/process-services-cloud/src/lib/form/components/form-definition-selector-cloud.component.ts) |
| [Group Cloud component](process-services-cloud/components/group-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Searches Groups. | [Source](../lib/process-services-cloud/src/lib/group/components/group-cloud.component.ts) |
| [People Cloud Component](process-services-cloud/components/people-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Allows one or more users to be selected (with auto-suggestion) based on the input parameters. | [Source](../lib/process-services-cloud/src/lib/task/start-task/components/people-cloud/people-cloud.component.ts) |
| [Process Filters Cloud Component](process-services-cloud/components/process-filters-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Lists all available process filters and allows to select a filter. | [Source](../lib/process-services-cloud/src/lib/process/process-filters/components/process-filters-cloud.component.ts) |
| [Process Header Cloud Component](process-services-cloud/components/process-header-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Shows all the information related to a process instance. | [Source](../lib/process-services-cloud/src/lib/process/process-header/components/process-header-cloud.component.ts) |
| [Process Instance List Cloud component](process-services-cloud/components/process-list-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Renders a list containing all the process instances matched by the parameters specified. | [Source](../lib/process-services-cloud/src/lib/process/process-list/components/process-list-cloud.component.ts) |
| [Start Process Cloud Component](process-services-cloud/components/start-process-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Starts a process. | [Source](../lib/process-services-cloud/src/lib/process/start-process/components/start-process-cloud.component.ts) |
| [Start Task Cloud Component](process-services-cloud/components/start-task-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Creates/starts a new task for the specified app. | [Source](../lib/process-services-cloud/src/lib/task/start-task/components/start-task-cloud.component.ts) |
| [Task Filters Cloud component](process-services-cloud/components/task-filters-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Shows all available filters. | [Source](../lib/process-services-cloud/src/lib/task/task-filters/components/task-filters-cloud.component.ts) |
| [Form cloud component](process-services-cloud/components/task-form-cloud.component.md) | Shows a form for a task. | [Source](../lib/process-services-cloud/src/lib/task/task-form/components/task-form-cloud.component.ts) |
| [Task Header Cloud Component](process-services-cloud/components/task-header-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Shows all the information related to a task. | [Source](../lib/process-services-cloud/src/lib/task/task-header/components/task-header-cloud.component.ts) |
| [Task List Cloud component](process-services-cloud/components/task-list-cloud.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Renders a list containing all the tasks matched by the parameters specified. | [Source](../lib/process-services-cloud/src/lib/task/task-list/components/task-list-cloud.component.ts) |

### Directives

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Claim Task Directive](process-services-cloud/directives/claim-task.directive.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Claims a task | [Source](../lib/process-services-cloud/src/lib/task/directives/claim-task.directive.ts) |
| [Complete Task Directive](process-services-cloud/directives/complete-task.directive.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Completes a task. | [Source](../lib/process-services-cloud/src/lib/task/directives/complete-task.directive.ts) |
| [Unclaim Task Directive](process-services-cloud/directives/unclaim-task.directive.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Unclaims a task | [Source](../lib/process-services-cloud/src/lib/task/directives/unclaim-task.directive.ts) |

### Pipes

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Group initial pipe](process-services-cloud/pipes/group-initial.pipe.md) | Extracts the initial character from a group name. | [Source](../lib/process-services-cloud/src/lib/group/pipe/group-initial.pipe.ts) |

### Services

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Apps Process Cloud Service](process-services-cloud/services/apps-process-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Gets details of deployed apps for the current user. | [Source](../lib/process-services-cloud/src/lib/app/services/apps-process-cloud.service.ts) |
| [Form cloud service](process-services-cloud/services/form-cloud.service.md) | Implements Process Services form methods | [Source](../lib/process-services-cloud/src/lib/form/services/form-cloud.service.ts) |
| [Group Cloud Service](process-services-cloud/services/group-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Searches and gets information for groups. | [Source](../lib/process-services-cloud/src/lib/group/services/group-cloud.service.ts) |
| [Process Filter Cloud Service](process-services-cloud/services/process-filter-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Manage Process Filters, which are pre-configured Process Instance queries. | [Source](../lib/process-services-cloud/src/lib/process/process-filters/services/process-filter-cloud.service.ts) |
| [Process Header Cloud Service](process-services-cloud/services/process-header-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Manages cloud process instances. | [Source](../lib/process-services-cloud/src/lib/process/process-header/services/process-header-cloud.service.ts) |
| [Process List Cloud Service](process-services-cloud/services/process-list-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Searches processes. | [Source](../lib/process-services-cloud/src/lib/process/process-list/services/process-list-cloud.service.ts) |
| [Start Process Cloud Service](process-services-cloud/services/start-process-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Gets process definitions and starts processes. | [Source](../lib/process-services-cloud/src/lib/process/start-process/services/start-process-cloud.service.ts) |
| [Start Task Cloud Service](process-services-cloud/services/start-task-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Starts standalone tasks. | [Source](../lib/process-services-cloud/src/lib/task/services/start-task-cloud.service.ts) |
| [Task Cloud Service](process-services-cloud/services/task-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Manages task cloud. | [Source](../lib/process-services-cloud/src/lib/task/services/task-cloud.service.ts) |
| [Task Filter Cloud Service](process-services-cloud/services/task-filter-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Manages task filters. | [Source](../lib/process-services-cloud/src/lib/task/task-filters/services/task-filter-cloud.service.ts) |
| [Task List Cloud Service](process-services-cloud/services/task-list-cloud.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Searches tasks. | [Source](../lib/process-services-cloud/src/lib/task/task-list/services/task-list-cloud.service.ts) |

<!--process-services-cloud end-->

[(Back to Contents)](#contents)

## Extensions API

Contains components related to the Extensions functionality.
See the library's
[README file](../lib/extensions/README.md)
for more information about installing and using the source code.

<!--extensions start-->

### Components

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Dynamic Component](extensions/components/dynamic.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Displays dynamically-loaded extension components. | [Source](../lib/extensions/src/lib/components/dynamic-component/dynamic.component.ts) |
| [Preview Extension Component](extensions/components/preview-extension.component.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Supports dynamically-loaded viewer preview extensions. | [Source](../lib/extensions/src/lib/components/viewer/preview-extension.component.ts) |

### Services

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Extension Service](extensions/services/extension.service.md) ![Experimental](docassets/images/ExperimentalIcon.png) | Manages and runs basic extension functionality. | [Source](../lib/extensions/src/lib/services/extension.service.ts) |

<!--extensions end-->

[(Back to Contents)](#contents)

## Insights API

Contains components for Process Services analytics and diagrams.
See the library's
[README file](../lib/insights/README.md)
for more information about installing and using the source code.

<!--insights start-->

### Components

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Analytics Generator Component](insights/components/analytics-generator.component.md) | Generates and shows charts | [Source](../lib/insights/analytics-process/components/analytics-generator.component.ts) |
| [APS Analytics List Component](insights/components/analytics-report-list.component.md) | Shows a list of all available reports | [Source](../lib/insights/analytics-process/components/analytics-report-list.component.ts) |
| [APS Analytics Component](insights/components/analytics.component.md) | Shows the charts related to the reportId passed as input | [Source](../lib/insights/analytics-process/components/analytics.component.ts) |
| [Diagram Component](insights/components/diagram.component.md) | Displays process diagrams. | [Source](../lib/insights/diagram/components/diagram.component.ts) |
| [Widget component](insights/components/widget.component.md) | Base class for standard and custom widget classes. | [Source](../lib/insights/analytics-process/components/widgets/widget.component.ts) |

<!--insights end-->

[(Back to Contents)](#contents)

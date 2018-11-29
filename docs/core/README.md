---
Title: Core API
Github only: true
---

# Core API

Contains a variety of components used throughout ADF.
See the library's
[README file](../../lib/core/README.md)
for more information about installing and using the source code.

<!--core start-->

## Components

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [About component](about.component.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Shows a general version and status overview of the installed ADF library. | [Source](../../lib/core/about/about.component.ts) |
| [Buttons menu component](buttons-menu.component.md) | Displays buttons on a responsive menu.  | [Source](../../lib/core/buttons-menu/buttons-menu.component.ts) |
| [Card view component](card-view.component.md) | Displays a configurable property list renderer. | [Source](../../lib/core/card-view/components/card-view/card-view.component.ts) |
| [Comment list component](comment-list.component.md) | Shows a list of comments. | [Source](../../lib/core/comments/comment-list.component.ts) |
| [Comments component](comments.component.md) | Displays comments from users involved in a specified task or content and allows an involved user to add a comment to a task or a content. | [Source](../../lib/core/comments/comments.component.ts) |
| [Data column component](data-column.component.md) | Defines column properties for DataTable, Tasklist, Document List and other components. | [Source](../../lib/core/data-column/data-column.component.ts) |
| [Datatable component](datatable.component.md) | Displays data as a table with customizable columns and presentation. | [Source](../../lib/core/datatable/components/datatable/datatable.component.ts) |
| [Empty list component](empty-list.component.md) | Displays a message indicating that a list is empty. | [Source](../../lib/core/datatable/components/datatable/empty-list.component.ts) |
| [Form field component](form-field.component.md) | Represents a UI field in a form. | [Source](../../lib/core/form/components/form-field/form-field.component.ts) |
| [Form list component](form-list.component.md) | Shows forms as a list. | [Source](../../lib/core/form/components/form-list.component.ts) |
| [Form component](form.component.md) | Shows a Form from APS | [Source](../../lib/core/form/components/form.component.ts) |
| [Start form component](start-form.component.md) | Displays the Start Form for a process. | [Source](../../lib/core/form/components/start-form.component.ts) |
| [Text mask component](text-mask.component.md) | Implements text field input masks. | [Source](../../lib/core/form/components/widgets/text/text-mask.component.ts) |
| [Info drawer layout component](info-drawer-layout.component.md) | Displays a sidebar-style information panel. | [Source](../../lib/core/info-drawer/info-drawer-layout.component.ts) |
| [Info drawer component](info-drawer.component.md) | Displays a sidebar-style information panel with tabs. | [Source](../../lib/core/info-drawer/info-drawer.component.ts) |
| [Language menu component](language-menu.component.md) | Displays all the languages that are present in "app.config.json" and the default (EN). | [Source](../../lib/core/language-menu/language-menu.component.ts) |
| [Header component](header.component.md) | Reusable header for Alfresco applications. | [Source](../../lib/core/layout/components/header/header.component.ts) |
| [Sidebar action menu component](sidebar-action-menu.component.md) | Displays a sidebar-action menu information panel. | [Source](../../lib/core/layout/components/sidebar-action/sidebar-action-menu.component.ts) |
| [Sidenav layout component](sidenav-layout.component.md) | Displays the standard three-region ADF application layout. | [Source](../../lib/core/layout/components/sidenav-layout/sidenav-layout.component.ts) |
| [Login dialog panel component](login-dialog-panel.component.md) | Shows and manages a login dialog. | [Source](../../lib/core/login/components/login-dialog-panel.component.ts) |
| [Login dialog component](login-dialog.component.md) | Allows a user to perform a login via a dialog. | [Source](../../lib/core/login/components/login-dialog.component.ts) |
| [Login component](login.component.md) | Authenticates to Alfresco Content Services and Alfresco Process Services. | [Source](../../lib/core/login/components/login.component.ts) |
| [Infinite pagination component](infinite-pagination.component.md) | Adds "infinite" pagination to the component it is used with. | [Source](../../lib/core/pagination/infinite-pagination.component.ts) |
| [Pagination component](pagination.component.md) | Adds pagination to the component it is used with. | [Source](../../lib/core/pagination/pagination.component.ts) |
| [Host settings component](host-settings.component.md) ![Internal](../docassets/images/InternalIcon.png) | Validates the URLs for ACS and APS and saves them in the user's local storage | [Source](../../lib/core/settings/host-settings.component.ts) |
| [Sorting picker component](sorting-picker.component.md) | Selects from a set of predefined sorting definitions and directions. | [Source](../../lib/core/sorting-picker/sorting-picker.component.ts) |
| [Empty content component](empty-content.component.md) | Provides a generic "Empty Content" placeholder for components. | [Source](../../lib/core/templates/empty-content/empty-content.component.ts) |
| [Error content component](error-content.component.md) | Displays info about a specific error. | [Source](../../lib/core/templates/error-content/error-content.component.ts) |
| [Toolbar divider component](toolbar-divider.component.md) | Divides groups of elements in a Toolbar with a visual separator. | [Source](../../lib/core/toolbar/toolbar-divider.component.ts) |
| [Toolbar title component](toolbar-title.component.md) | Supplies custom HTML to be included in a Toolbar component title. | [Source](../../lib/core/toolbar/toolbar-title.component.ts) |
| [Toolbar component](toolbar.component.md) | Simple container for headers, titles, actions and breadcrumbs. | [Source](../../lib/core/toolbar/toolbar.component.ts) |
| [User info component](user-info.component.md) | Shows user information. | [Source](../../lib/core/userinfo/components/user-info.component.ts) |
| [Viewer component](viewer.component.md) | Displays content from an ACS repository. | [Source](../../lib/core/viewer/components/viewer.component.ts) |

## Directives

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Context menu directive](context-menu.directive.md) | Adds a context menu to a component. | [Source](../../lib/core/context-menu/context-menu.directive.ts) |
| [Highlight directive](highlight.directive.md) | Adds highlighting to selected sections of an HTML element's content. | [Source](../../lib/core/directives/highlight.directive.ts) |
| [Logout directive](logout.directive.md) | Logs the user out when the decorated element is clicked. | [Source](../../lib/core/directives/logout.directive.ts) |
| [Node delete directive](node-delete.directive.md) | Deletes multiple files and folders. | [Source](../../lib/core/directives/node-delete.directive.ts) |
| [Node favorite directive](node-favorite.directive.md) | Selectively toggles nodes as favorites. | [Source](../../lib/core/directives/node-favorite.directive.ts) |
| [Node permission directive](node-permission.directive.md) | Selectively disables an HTML element or Angular component. | [Source](../../lib/core/directives/node-permission.directive.ts) |
| [Node restore directive](node-restore.directive.md) | Restores deleted nodes to their original location. | [Source](../../lib/core/directives/node-restore.directive.ts) |
| [Upload directive](upload.directive.md) | Uploads content in response to file drag and drop. | [Source](../../lib/core/directives/upload.directive.ts) |

## Models

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Form field model](form-field.model.md) | Contains the value and metadata for a field of a Form component. | [Source](../../lib/core/form/components/widgets/core/form-field.model.ts) |
| [Product version model](product-version.model.md) | Contains version and license information classes for Alfresco products. | [Source](../../lib/core/models/product-version.model.ts) |
| [User process model](user-process.model.md) | Represents a Process Services user. | [Source](../../lib/core/models/user-process.model.ts) |
| [Bpm user model](bpm-user.model.md) | Contains information about a Process Services user. | [Source](../../lib/core/userinfo/models/bpm-user.model.ts) |
| [Ecm user model](ecm-user.model.md) | Contains information about a Content Services user. | [Source](../../lib/core/userinfo/models/ecm-user.model.ts) |

## Pipes

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [File size pipe](file-size.pipe.md) | Converts a number of bytes to the equivalent in KB, MB, etc. | [Source](../../lib/core/pipes/file-size.pipe.ts) |
| [Format space pipe](format-space.pipe.md) | Replaces all the white space in a string with a supplied character. | [Source](../../lib/core/pipes/format-space.pipe.ts) |
| [Full name pipe](full-name.pipe.md) | Joins the first and last name properties from a UserProcessModel object into a single string. | [Source](../../lib/core/pipes/full-name.pipe.ts) |
| [Mime type icon pipe](mime-type-icon.pipe.md) | Retrieves an icon to represent a MIME type. | [Source](../../lib/core/pipes/mime-type-icon.pipe.ts) |
| [Node name tooltip pipe](node-name-tooltip.pipe.md) | Formats the tooltip for a Node. | [Source](../../lib/core/pipes/node-name-tooltip.pipe.ts) |
| [Text highlight pipe](text-highlight.pipe.md) | Adds highlighting to words or sections of text that match a search string. | [Source](../../lib/core/pipes/text-highlight.pipe.ts) |
| [Time ago pipe](time-ago.pipe.md) | Converts a recent past date into a number of days ago. | [Source](../../lib/core/pipes/time-ago.pipe.ts) |
| [User initial pipe](user-initial.pipe.md) | Takes the name fields of a UserProcessModel object and extracts and formats the initials. | [Source](../../lib/core/pipes/user-initial.pipe.ts) |

## Services

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Card item types service](card-item-types.service.md) | Maps type names to field component types for the Card View component. | [Source](../../lib/core/card-view/services/card-item-types.service.ts) |
| [Card view update service](card-view-update.service.md) | Reports edits and clicks within fields of a Card View component. | [Source](../../lib/core/card-view/services/card-view-update.service.ts) |
| [Activiti alfresco service](activiti-alfresco.service.md) | Gets Alfresco Repository folder content based on a Repository account configured in Alfresco Process Services (APS). | [Source](../../lib/core/form/services/activiti-alfresco.service.ts) |
| [Form rendering service](form-rendering.service.md) | Maps a form field type string onto the corresponding form widget component type. | [Source](../../lib/core/form/services/form-rendering.service.ts) |
| [Form service](form.service.md) | Implements Process Services form methods | [Source](../../lib/core/form/services/form.service.ts) |
| [Node service](node.service.md) | Gets Alfresco Repository node metadata and creates nodes with metadata.  | [Source](../../lib/core/form/services/node.service.ts) |
| [Process content service](process-content.service.md) | Manipulates content related to a Process Instance or Task Instance in APS. | [Source](../../lib/core/form/services/process-content.service.ts) |
| [Alfresco api service](alfresco-api.service.md) | Provides access to an initialized **AlfrescoJSApi** instance. | [Source](../../lib/core/services/alfresco-api.service.ts) |
| [Apps process service](apps-process.service.md) | Gets details of the Process Services apps that are deployed for the user. | [Source](../../lib/core/services/apps-process.service.ts) |
| [Auth guard bpm service](auth-guard-bpm.service.md) | Adds authentication with Process Services to a route within the app. | [Source](../../lib/core/services/auth-guard-bpm.service.ts) |
| [Auth guard ecm service](auth-guard-ecm.service.md) | Adds authentication with Content Services to a route within the app. | [Source](../../lib/core/services/auth-guard-ecm.service.ts) |
| [Auth guard service](auth-guard.service.md) | Adds authentication to a route within the app. | [Source](../../lib/core/services/auth-guard.service.ts) |
| [Authentication service](authentication.service.md) | Provides authentication to ACS and APS. | [Source](../../lib/core/services/authentication.service.ts) |
| [Comment content service](comment-content.service.md) | Adds and retrieves comments for nodes in Content Services. | [Source](../../lib/core/services/comment-content.service.ts) |
| [Comment process service](comment-process.service.md) | Adds and retrieves comments for task and process instances in Process Services. | [Source](../../lib/core/services/comment-process.service.ts) |
| [Content service](content.service.md) | Accesses app-generated data objects via URLs and file downloads. | [Source](../../lib/core/services/content.service.ts) |
| [Cookie service](cookie.service.md) | Stores key-value data items as browser cookies. | [Source](../../lib/core/services/cookie.service.ts) |
| [Deleted nodes api service](deleted-nodes-api.service.md) | Gets a list of Content Services nodes currently in the trash. | [Source](../../lib/core/services/deleted-nodes-api.service.ts) |
| [Discovery api service](discovery-api.service.md) | Gets version and license information for Process Services and Content Services. | [Source](../../lib/core/services/discovery-api.service.ts) |
| [Favorites api service](favorites-api.service.md) | Gets a list of items a user has marked as their favorites. | [Source](../../lib/core/services/favorites-api.service.ts) |
| [Highlight transform service](highlight-transform.service.md) | Adds HTML to a string to highlight chosen sections. | [Source](../../lib/core/services/highlight-transform.service.ts) |
| [Log service](log.service.md) | Provides log functionality. | [Source](../../lib/core/services/log.service.ts) |
| [Login dialog service](login-dialog.service.md) | Manages login dialogs. | [Source](../../lib/core/services/login-dialog.service.ts) |
| [Nodes api service](nodes-api.service.md) | Accesses and manipulates ACS document nodes using their node IDs. | [Source](../../lib/core/services/nodes-api.service.ts) |
| [Notification service](notification.service.md) | Shows a notification message with optional feedback. | [Source](../../lib/core/services/notification.service.ts) |
| [Page title service](page-title.service.md) | Sets the page title. | [Source](../../lib/core/services/page-title.service.ts) |
| [People content service](people-content.service.md) | Gets information about a Content Services user.   | [Source](../../lib/core/services/people-content.service.ts) |
| [People process service](people-process.service.md) | Gets information about Process Services users. | [Source](../../lib/core/services/people-process.service.ts) |
| [Renditions service](renditions.service.md) ![Deprecated](../docassets/images/DeprecatedIcon.png) | Manages prearranged conversions of content to different formats. | [Source](../../lib/core/services/renditions.service.ts) |
| [Search configuration service](search-configuration.service.md) | Provides fine control of parameters to a search. | [Source](../../lib/core/services/search-configuration.service.ts) |
| [Shared links api service](shared-links-api.service.md) | Finds shared links to Content Services items. | [Source](../../lib/core/services/shared-links-api.service.ts) |
| [Sites service](sites.service.md) | Accesses and manipulates sites from a Content Services repository. | [Source](../../lib/core/services/sites.service.ts) |
| [Storage service](storage.service.md) | Stores items in the form of key-value pairs. | [Source](../../lib/core/services/storage.service.ts) |
| [Thumbnail service](thumbnail.service.md) | Retrieves an SVG thumbnail image to represent a document type. | [Source](../../lib/core/services/thumbnail.service.ts) |
| [Translation service](translation.service.md) | Supports localisation. | [Source](../../lib/core/services/translation.service.ts) |
| [Upload service](upload.service.md) | Provides access to various APIs related to file upload features. | [Source](../../lib/core/services/upload.service.ts) |
| [User preferences service](user-preferences.service.md) | Stores preferences for the app and for individual components. | [Source](../../lib/core/services/user-preferences.service.ts) |
| [Bpm user service](bpm-user.service.md) | Gets information about the current Process Services user. | [Source](../../lib/core/userinfo/services/bpm-user.service.ts) |
| [Ecm user service](ecm-user.service.md) | Gets information about a Content Services user. | [Source](../../lib/core/userinfo/services/ecm-user.service.ts) |
| _Jwt helper service_ | _Not currently documented_ | [Source](../../lib/core/services/jwt-helper.service.ts) |
| _Identity user service_ | _Not currently documented_ | [Source](../../lib/core/userinfo/services/identity-user.service.ts) |

## Widgets

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Content widget](content.widget.md) | Shows the content preview. | [Source](../../lib/core/form/components/widgets/content/content.widget.ts) |

<!--core end-->

## Other classes and interfaces

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Data Table Adapter interface](datatable-adapter.interface.md) | Defines how table data is supplied to DataTable and Tasklist components. | [Source](../../lib/core/datatable/data/datatable-adapter.ts) |
| [Form Field Validator interface](form-field-validator.interface.md) | Defines how the input fields of [`Form`](../../lib/process-services/task-list/models/form.model.ts) and Task Details components are validated. | [Source](../../lib/core/form/components/widgets/core/form-field-validator.ts) |
| [Search Configuration interface](search-configuration.interface.md) | Provides fine control of parameters to a search. | [Source](../../lib/core/services/search-configuration.service.ts) |

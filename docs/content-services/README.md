# ADF Content Services

Contains components related to Content Services.
See the library's
[README file](../../lib/content-services/README.md)
for more information about installing and using the source code.

<!--content-services start-->

## Components

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Breadcrumb component](breadcrumb.component.md) | Indicates the current position within a navigation hierarchy. | [Source](../../lib/content-services/breadcrumb/breadcrumb.component.ts) |
| [Dropdown breadcrumb component](dropdown-breadcrumb.component.md) | Indicates the current position within a navigation hierarchy using a dropdown menu. | [Source](../../lib/content-services/breadcrumb/dropdown-breadcrumb.component.ts) |
| [Content metadata component](content-metadata.component.md) | Allows a user to display and edit metadata related to a node. | [Source](../../lib/content-services/content-metadata/components/content-metadata/content-metadata.component.ts) |
| [Content node selector panel component](content-node-selector-panel.component.md) | Opens a Content Node Selector in its own dialog window. | [Source](../../lib/content-services/content-node-selector/content-node-selector-panel.component.ts) |
| [Content node selector component](content-node-selector.component.md) | Allows a user to select items from a Content Services repository. | [Source](../../lib/content-services/content-node-selector/content-node-selector.component.ts) |
| [Content action component](content-action.component.md) | Adds options to a Document List actions menu for a particular content type. | [Source](../../lib/content-services/document-list/components/content-action/content-action.component.ts) |
| [Document list component](document-list.component.md) | Displays the documents from a repository. | [Source](../../lib/content-services/document-list/components/document-list.component.ts) |
| [Permission list component](permission-list.component.md) | Shows node permissions as a table. | [Source](../../lib/content-services/permission-manager/components/permission-list/permission-list.component.ts) |
| [Search control component](search-control.component.md) | Displays a input text which shows find-as-you-type suggestions. | [Source](../../lib/content-services/search/components/search-control.component.ts) |
| [Search component](search.component.md) | Searches items for supplied search terms.  | [Source](../../lib/content-services/search/components/search.component.ts) |
| [Sites dropdown component](sites-dropdown.component.md) | Displays a dropdown menu to show and interact with the sites of the current user. | [Source](../../lib/content-services/site-dropdown/sites-dropdown.component.ts) |
| [Like component](like.component.md) | Allows a user to add "likes" to an item. | [Source](../../lib/content-services/social/like.component.ts) |
| [Rating component](rating.component.md) | Allows a user to add ratings to an item. | [Source](../../lib/content-services/social/rating.component.ts) |
| [Tag actions component](tag-actions.component.md) | Shows available actions for tags. | [Source](../../lib/content-services/tag/tag-actions.component.ts) |
| [Tag list component](tag-list.component.md) | Shows tags for an item. | [Source](../../lib/content-services/tag/tag-list.component.ts) |
| [Tag node list component](tag-node-list.component.md) | Shows tags for a node. | [Source](../../lib/content-services/tag/tag-node-list.component.ts) |
| [File uploading dialog component](file-uploading-dialog.component.md) | Shows a dialog listing all the files uploaded with the Upload Button or Drag Area components. | [Source](../../lib/content-services/upload/components/file-uploading-dialog.component.ts) |
| [Upload button component](upload-button.component.md) | Activates a file upload. | [Source](../../lib/content-services/upload/components/upload-button.component.ts) |
| [Upload drag area component](upload-drag-area.component.md) | Adds a drag and drop area to upload files to Alfresco. | [Source](../../lib/content-services/upload/components/upload-drag-area.component.ts) |
| [Upload version button component](upload-version-button.component.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Activates a file version upload. | [Source](../../lib/content-services/upload/components/upload-version-button.component.ts) |
| [Version list component](version-list.component.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Displays the version history of a node in a Version Manager component | [Source](../../lib/content-services/version-manager/version-list.component.ts) |
| [Version manager component](version-manager.component.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Displays the version history of a node with the ability to upload a new version. | [Source](../../lib/content-services/version-manager/version-manager.component.ts) |
| [Webscript component](webscript.component.md) | Provides access to Webscript features. | [Source](../../lib/content-services/webscript/webscript.component.ts) |

## Directives

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Node download directive](node-download.directive.md) | Allows folders and/or files to be downloaded. Multiple nodes are packed as a '.ZIP' archive. | [Source](../../lib/content-services/directives/node-download.directive.ts) |
| [Node share directive](node-share.directive.md) | Create and manage public shared links for files | [Source](../../lib/content-services/directives/node-share.directive.ts) |
| [Folder create directive](folder-create.directive.md) | Allows folders to be created. | [Source](../../lib/content-services/folder-directive/folder-create.directive.ts) |
| [Folder edit directive](folder-edit.directive.md) | Allows folders to be edited. | [Source](../../lib/content-services/folder-directive/folder-edit.directive.ts) |
| [Inherited button directive](inherited-button.directive.md) | Update the current node by adding/removing the inherited permissions. | [Source](../../lib/content-services/permission-manager/components/inherited-button.directive.ts) |
| [File draggable directive](file-draggable.directive.md) | Provide drag-and-drop features for an element such as a `div`. | [Source](../../lib/content-services/upload/directives/file-draggable.directive.ts) |
| [Node lock directive](node-lock.directive.md) | Open the node lock dialog on click. | [Source](../../lib/content-services/directives/node-lock.directive.ts) |

## Models

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Document library model](document-library.model.md) | Defines classes for use with the Content Services node API. | [Source](../../lib/content-services/document-list/models/document-library.model.ts) |
| [Permissions style model](permissions-style.model.md) | Sets custom CSS styles for rows of a Document List according to the item's permissions. | [Source](../../lib/content-services/document-list/models/permissions-style.model.ts) |

## Services

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Content node dialog service](content-node-dialog.service.md) | Displays and manages dialogs for selecting content to open, copy or upload. | [Source](../../lib/content-services/content-node-selector/content-node-dialog.service.ts) |
| [Document actions service](document-actions.service.md) | Implements the document menu actions for the Document List component. | [Source](../../lib/content-services/document-list/services/document-actions.service.ts) |
| [Document list service](document-list.service.md) | Implements node operations used by the Document List component. | [Source](../../lib/content-services/document-list/services/document-list.service.ts) |
| [Folder actions service](folder-actions.service.md) | Implements the folder menu actions for the Document List component. | [Source](../../lib/content-services/document-list/services/folder-actions.service.ts) |
| [Rating service](rating.service.md) | Manages ratings for items in Content Services. | [Source](../../lib/content-services/social/services/rating.service.ts) |
| [Tag service](tag.service.md) | Manages tags in Content Services. | [Source](../../lib/content-services/tag/services/tag.service.ts) |

<!--content-services end-->

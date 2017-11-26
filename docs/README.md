# Component Docs Index

Below is an index of the documentation for ADF. The [User Guide](#user-guide)
section discusses particular techniques in depth. The other sections are references for the ADF
libraries. Items marked with an asterisk (*) do not currently have documentation - the link leads
to the appropriate source file.

## Contents

- [User Guide](#user-guide)
- [ADF Core](#adf-core)
- [ADF Content Services](#adf-content-services)
- [ADF Process Services](#adf-process-services)
- [ADF Insights](#adf-insights)

## User guide

<!-- guide start -->
- [Form Extensibility and Customisation](extensibility.md)
- [Form Stencils with Angular 2](stencils.md)
- [Angular Material Design](angular-material-design.md)
- [Theming](theming.md)
- [Typography](typography.md)
- [Walkthrough: adding indicators to highlight information about a node](metadata-indicators.md)

<!-- guide end -->
[(Back to Contents)](#contents)

## ADF Core

Contains a variety of components used throughout ADF.
See the library's
[README file](../lib/core/README.md)
for more information about installing and using the source code.
<!-- core start -->

### Components

- [Card view component](card-view.component.md)
- [Accordion group component](accordion-group.component.md)
- [Accordion component](accordion.component.md)
- [Data column component](data-column.component.md)
- [Datatable component](datatable.component.md)
- [Form field component](form-field.component.md)
- [Form list component](form-list.component.md)
- [Form component](form.component.md)
- [Start form component](start-form.component.md)
- [Text mask component](text-mask.component.md)
- [Widget component](widget.component.md)
- [Info drawer layout component](info-drawer-layout.component.md)
- [Info drawer component](info-drawer.component.md)
- [Language menu component](language-menu.component.md)
- [Login component](login.component.md)
- [Infinite pagination component](infinite-pagination.component.md)
- [Pagination component](pagination.component.md)
- [Host settings component](host-settings.component.md)
- [Toolbar divider component](toolbar-divider.component.md)
- [Toolbar title component](toolbar-title.component.md)
- [Toolbar component](toolbar.component.md)
- [User info component](user-info.component.md)
- [Viewer component](viewer.component.md)

### Directives

- [Context menu directive](context-menu.directive.md)
- [Highlight directive](highlight.directive.md)
- [Logout directive](logout.directive.md)
- [Node delete directive](node-delete.directive.md)
- [Node favorite directive](node-favorite.directive.md)
- [Node permission directive](node-permission.directive.md)
- [Node restore directive](node-restore.directive.md)
- [Upload directive](upload.directive.md)

### Models

- [Form field model](form-field.model.md)
- [Comment process model](comment-process.model.md)
- [Product version model](product-version.model.md)
- [Site model](site.model.md)
- [User process model](user-process.model.md)
- [Bpm user model](bpm-user.model.md)
- [Ecm user model](ecm-user.model.md)

### Pipes

- [File size pipe](file-size.pipe.md)
- [Mime type icon pipe](mime-type-icon.pipe.md)
- [Node name tooltip pipe](node-name-tooltip.pipe.md)
- [Text highlight pipe](text-highlight.pipe.md)
- [Time ago pipe](time-ago.pipe.md)
- [User initial pipe](user-initial.pipe.md)

### Services

- [App config service](app-config.service.md)
- [Activiti alfresco service](activiti-alfresco.service.md)
- [Form rendering service](form-rendering.service.md)
- [Form service](form.service.md)
- [Node service](node.service.md)
- [Process content service](process-content.service.md)
- [Alfresco api service](alfresco-api.service.md)
- [Apps process service](apps-process.service.md)
- [Auth guard bpm service](auth-guard-bpm.service.md)
- [Auth guard ecm service](auth-guard-ecm.service.md)
- [Auth guard service](auth-guard.service.md)
- [Authentication service](authentication.service.md)
- [Card view update service](card-view-update.service.md)
- [Comment process service](comment-process.service.md)
- [Content service](content.service.md)
- [Cookie service](cookie.service.md)
- [Deleted nodes api service](deleted-nodes-api.service.md)
- [Discovery api service](discovery-api.service.md)
- [Favorites api service](favorites-api.service.md)
- [Highlight transform service](highlight-transform.service.md)
- [Log service](log.service.md)
- [Nodes api service](nodes-api.service.md)
- [Notification service](notification.service.md)
- [Page title service](page-title.service.md)
- [People content service](people-content.service.md)
- [People process service](people-process.service.md)
- [Renditions service](renditions.service.md)
- [Search api service](search-api.service.md)
- [Shared links api service](shared-links-api.service.md)
- [Sites api service](sites.service.md)
- [Storage service](storage.service.md)
- [Thumbnail service](thumbnail.service.md)
- [Translation service](translation.service.md)
- [Upload service](upload.service.md)
- [User preferences service](user-preferences.service.md)
- [Bpm user service](bpm-user.service.md)
- [Ecm user service](ecm-user.service.md)

### Widgets

- [Content widget](content.widget.md)
<!-- core end -->

### Other classes and interfaces

- [DataTableAdapter interface](DataTableAdapter.md)
- [FormFieldValidator interface](FormFieldValidator.md)

[(Back to Contents)](#contents)

## ADF Content Services

Contains components related to Content Services.
See the library's
[README file](../lib/content-services/README.md)
for more information about installing and using the source code.
<!-- content-services start -->

### Components

- [Breadcrumb component](breadcrumb.component.md)
- [Dropdown breadcrumb component](dropdown-breadcrumb.component.md)
- [Content node selector component](content-node-selector.component.md)
- [Content action component](content-action.component.md)
- [Document list component](document-list.component.md)
- [Search control component](search-control.component.md)
- [Search component](search.component.md)
- [Sites dropdown component](sites-dropdown.component.md)
- [Like component](like.component.md)
- [Rating component](rating.component.md)
- [Tag actions component](tag-actions.component.md)
- [Tag list component](tag-list.component.md)
- [Tag node list component](tag-node-list.component.md)
- [File uploading dialog component](file-uploading-dialog.component.md)
- [Upload button component](upload-button.component.md)
- [Upload drag area component](upload-drag-area.component.md)
- [Version list component](version-list.component.md)
- [Version manager component](version-manager.component.md)
- [Webscript component](webscript.component.md)
- [*Content metadata card component](../lib/content-services/content-metadata/content-metadata-card.component.ts)
- [*Content metadata component](../lib/content-services/content-metadata/content-metadata.component.ts)

### Directives

- [Folder create directive](folder-create.directive.md)
- [Folder edit directive](folder-edit.directive.md)
- [File draggable directive](file-draggable.directive.md)

### Models

- [Document library model](document-library.model.md)
- [Permissions style model](permissions-style.model.md)

### Services

- [Document actions service](document-actions.service.md)
- [Document list service](document-list.service.md)
- [Folder actions service](folder-actions.service.md)
- [Rating service](rating.service.md)
- [Tag service](tag.service.md)
- [*Content metadata service](../lib/content-services/content-metadata/content-metadata.service.ts)
<!-- content-services end -->

[(Back to Contents)](#contents)

## ADF Process Services

Contains components related to Process Services.
See the library's
[README file](../lib/process-services/README.md)
for more information about installing and using the source code.
<!-- process-services start -->

### Components

- [Apps list component](apps-list.component.md)
- [Create process attachment component](create-process-attachment.component.md)
- [Create task attachment component](create-task-attachment.component.md)
- [Process attachment list component](process-attachment-list.component.md)
- [Task attachment list component](task-attachment-list.component.md)
- [Comment list component](comment-list.component.md)
- [Comments component](comments.component.md)
- [Process comments component](process-comments.component.md)
- [People list component](people-list.component.md)
- [People search component](people-search.component.md)
- [People component](people.component.md)
- [Process filters component](process-filters.component.md)
- [Process instance details component](process-instance-details.component.md)
- [Process instance header component](process-instance-header.component.md)
- [Process instance tasks component](process-instance-tasks.component.md)
- [Process list component](process-list.component.md)
- [Start process component](start-process.component.md)
- [Checklist component](checklist.component.md)
- [Start task component](start-task.component.md)
- [Task details component](task-details.component.md)
- [Task filters component](task-filters.component.md)
- [Task header component](task-header.component.md)
- [Task list component](task-list.component.md)

### Directives

- [Process audit directive](process-audit.directive.md)
- [Task audit directive](task-audit.directive.md)

### Models

- [Filter model](filter.model.md)
- [Task details model](task-details.model.md)

### Services

- [Process filter service](process-filter.service.md)
- [Process service](process.service.md)
- [Task filter service](task-filter.service.md)
- [Tasklist service](tasklist.service.md)
<!-- process-services end -->

[(Back to Contents)](#contents)

## ADF Insights

Contains components for Process Services analytics and diagrams.
See the library's
[README file](../lib/insights/README.md)
for more information about installing and using the source code.
<!-- insights start -->

### Components

- [Analytics generator component](analytics-generator.component.md)
- [Analytics report list component](analytics-report-list.component.md)
- [Analytics component](analytics.component.md)
- [Widget component](widget.component.md)
- [Diagram component](diagram.component.md)
<!-- insights end -->

[(Back to Contents)](#contents)
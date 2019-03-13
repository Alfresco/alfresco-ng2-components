---
Title: Version index
---

# Version Index

Below are the details of all released versions of ADF since general
availability (v2.0.0). See the [main index page](README.md) for a list
of components organized by ADF libraries. See the
[version compatibility page](compatibility.md) for full details of which
backend services have been tested with each released version of ADF.

## Versions

-   [v3.0.0](#v300)
-   [v2.6.0](#v260)
-   [v2.5.0](#v250)
-   [v2.4.0](#v240)
-   [v2.3.0](#v230)
-   [v2.2.0](#v220)
-   [v2.1.0](#v210)
-   [v2.0.0](#v200)

## v3.0.0

**Release:** Forthcoming<br/>

### Components added

<!--v300 start-->

-   [App list cloud component](process-services-cloud/app-list-cloud.component.md)
-   [Apps process cloud service](process-services-cloud/apps-process-cloud.service.md)
-   [Dynamic component](extensions/dynamic.component.md)
-   [Edit process filter cloud component](process-services-cloud/edit-process-filter-cloud.component.md)
-   [Edit task filter cloud component](process-services-cloud/edit-task-filter-cloud.component.md)
-   [Extension service](extensions/extension.service.md)
-   [File upload error pipe](content-services/pipes/file-upload-error.pipe.md)
-   [Format space pipe](core/pipes/format-space.pipe.md)
-   [Full name pipe](core/pipes/full-name.pipe.md)
-   [Group cloud component](process-services-cloud/group-cloud.component.md)
-   [Group cloud service](process-services-cloud/group-cloud.service.md)
-   [Group initial pipe](process-services-cloud/group-initial.pipe.md)
-   [Icon component](core/components/icon.component.md)
-   [Identity user service](core/services/identity-user.service.md)
-   [Jwt helper service](core/services/jwt-helper.service.md)
-   [People cloud component](process-services-cloud/people-cloud.component.md)
-   [Process filter cloud service](process-services-cloud/process-filter-cloud.service.md)
-   [Process filters cloud component](process-services-cloud/process-filters-cloud.component.md)
-   [Process list cloud component](process-services-cloud/process-list-cloud.component.md)
-   [Process list cloud service](process-services-cloud/process-list-cloud.service.md)
-   [Start process cloud component](process-services-cloud/start-process-cloud.component.md)
-   [Start process cloud service](process-services-cloud/start-process-cloud.service.md)
-   [Start task cloud component](process-services-cloud/start-task-cloud.component.md)
-   [Start task cloud service](process-services-cloud/start-task-cloud.service.md)
-   [Task filter cloud service](process-services-cloud/task-filter-cloud.service.md)
-   [Task filters cloud component](process-services-cloud/task-filters-cloud.component.md)
-   [Task header cloud component](process-services-cloud/task-header-cloud.component.md)
-   [Task header cloud service](process-services-cloud/task-header-cloud.service.md)
-   [Task list cloud component](process-services-cloud/task-list-cloud.component.md)
-   [Task list cloud service](process-services-cloud/task-list-cloud.service.md)
-   [Tree view component](content-services/components/tree-view.component.md)

<!--v300 end-->

### Components retired

| Name | Reason | Alternative |
| -- | -- | -- |
| Accordion component | Superseded by Angular `<mat-accordion>` | See the [Angular Expansion Panel](https://material.angular.io/components/expansion/overview#accordion) component for details. |
| Accordion group component | Superseded by Angular `<mat-expansion-panel>` | See the [Angular Expansion Panel](https://material.angular.io/components/expansion/overview#accordion) component for details. |

([Back to top](#versions))

## v2.6.0

**Released:** 2018-10-04 ([Release notes](release-notes/RelNote260.md))<br/>
**APS compatible version:** v1.6.4+<br/>
**ACS compatible version:** v5.2.3<br/>

### Components added

<!--v260 start-->

-   [Login dialog panel component](core/components/login-dialog-panel.component.md)
-   [Login dialog component](core/components/login-dialog.component.md)
-   [Login dialog service](core/services/login-dialog.service.md)

<!--v260 end-->

([Back to top](#versions))

## v2.5.0

**Released:** 2018-08-14 ([Release notes](release-notes/RelNote250.md))<br/>
**APS compatible version:** v1.6.4+<br/>
**ACS compatible version:** v5.2.3<br/>

### Components added

<!--v250 start-->

-   [Header component](core/components/header.component.md)

<!--v250 end-->

([Back to top](#versions))

## v2.4.0

**Released:** 2018-06-21 ([Release notes](release-notes/RelNote240.md))<br/>
**APS compatible version:** v1.6.4+<br/>
**ACS compatible version:** v5.2.3<br/>

### Components added

<!--v240 start-->

-   [About component](core/components/about.component.md)
-   [Add permission dialog component](content-services/components/add-permission-dialog.component.md)
-   [Add permission panel component](content-services/components/add-permission-panel.component.md)
-   [Add permission component](content-services/components/add-permission.component.md)
-   [App config pipe](core/pipes/app-config.pipe.md)
-   [Buttons menu component](core/components/buttons-menu.component.md)
-   [Empty content component](core/components/empty-content.component.md)
-   [Error content component](core/components/error-content.component.md)
-   [Info drawer tab component](core/components/info-drawer-tab.component.md)
-   [Node permission dialog service](content-services/services/node-permission-dialog.service.md)
-   [Search check list component](content-services/components/search-check-list.component.md)
-   [Search date range component](content-services/components/search-date-range.component.md)
-   [Search filter service](content-services/services/search-filter.service.md)
-   [Search number range component](content-services/components/search-number-range.component.md)
-   [Search radio component](content-services/components/search-radio.component.md)
-   [Search slider component](content-services/components/search-slider.component.md)
-   [Search text component](content-services/components/search-text.component.md)
-   [Sorting picker component](core/components/sorting-picker.component.md)

<!--v240 end-->

([Back to top](#versions))

## v2.3.0

**Released:** 2018-04-17 ([Release notes](release-notes/RelNote230.md))<br/>
**APS compatible version:** v1.6.4+<br/>
**ACS compatible version:** v5.2.3<br/>

### Components added

<!--v230 start-->

-   [Comment content service](core/services/comment-content.service.md)
-   [Content node share directive](content-services/directives/content-node-share.directive.md)
-   [Custom resources service](content-services/services/custom-resources.service.md)
-   [Inherited button directive](content-services/directives/inherited-button.directive.md)
-   [Permission list component](content-services/components/permission-list.component.md)
-   [Search chip list component](content-services/components/search-chip-list.component.md)
-   [Search filter component](content-services/components/search-filter.component.md)
-   [Search query builder service](content-services/services/search-query-builder.service.md)
-   [Search sorting picker component](content-services/components/search-sorting-picker.component.md)
-   [Sidenav layout component](core/components/sidenav-layout.component.md)
-   [Upload version button component](content-services/components/upload-version-button.component.md)

<!--v230 end-->

([Back to top](#versions))

## v2.2.0

**Released:** 2018-03-05 ([Release notes](release-notes/RelNote220.md))<br/>
**APS compatible version:** v1.6.4+<br/>
**ACS compatible version:** v5.2.2<br/>

### Components added

<!--v220 start-->

-   [Node download directive](core/directives/node-download.directive.md)
-   [Node lock directive](content-services/directives/node-lock.directive.md)

<!--v220 end-->

([Back to top](#versions))

## v2.1.0

**Released:** 2018-01-29 ([Release notes](release-notes/RelNote210.md))<br/>
**APS compatible version:** v1.6.4+<br/>
**ACS compatible version:** v5.2.2<br/>

### Components added

<!--v210 start-->

-   [Content metadata card component](content-services/components/content-metadata-card.component.md)
-   [Content metadata component](content-services/components/content-metadata.component.md)
-   [Content node dialog service](content-services/services/content-node-dialog.service.md)
-   [Content node selector panel component](content-services/components/content-node-selector-panel.component.md)
-   [Search configuration service](core/services/search-configuration.service.md)
-   [Sidebar action menu component](core/components/sidebar-action-menu.component.md)

<!--v210 end-->

([Back to top](#versions))

## v2.0.0

**Released:** 2017-12-04 ([Release notes](release-notes/RelNote200.md))<br/>
**APS compatible version:** v1.6.4+<br/>
**ACS compatible version:** v5.2.2<br/>

### Components added

<!--v200 start-->

-   [Activiti alfresco service](core/services/activiti-alfresco.service.md)
-   [Alfresco api service](core/services/alfresco-api.service.md)
-   [Analytics generator component](insights/analytics-generator.component.md)
-   [Analytics report list component](insights/analytics-report-list.component.md)
-   [Analytics component](insights/analytics.component.md)
-   [App config service](core/services/app-config.service.md)
-   [Apps list component](process-services/components/apps-list.component.md)
-   [Apps process service](core/services/apps-process.service.md)
-   [Attach form component](process-services/components/attach-form.component.md)
-   [Auth guard bpm service](core/services/auth-guard-bpm.service.md)
-   [Auth guard ecm service](core/services/auth-guard-ecm.service.md)
-   [Auth guard service](core/services/auth-guard.service.md)
-   [Authentication service](core/services/authentication.service.md)
-   [Bpm user model](core/models/bpm-user.model.md)
-   [Bpm user service](core/services/bpm-user.service.md)
-   [Breadcrumb component](content-services/components/breadcrumb.component.md)
-   [Card item types service](core/services/card-item-types.service.md)
-   [Card view update service](core/services/card-view-update.service.md)
-   [Card view component](core/components/card-view.component.md)
-   [Check allowable operation directive](core/directives/check-allowable-operation.directive.md)
-   [Checklist component](process-services/components/checklist.component.md)
-   [Comment list component](core/components/comment-list.component.md)
-   [Comment process service](core/services/comment-process.service.md)
-   [Comments component](core/components/comments.component.md)
-   [Content action component](content-services/components/content-action.component.md)
-   [Content node selector component](content-services/components/content-node-selector.component.md)
-   [Content service](core/services/content.service.md)
-   [Content widget](core/widgets/content.widget.md)
-   [Context menu directive](core/directives/context-menu.directive.md)
-   [Cookie service](core/services/cookie.service.md)
-   [Create process attachment component](process-services/components/create-process-attachment.component.md)
-   [Create task attachment component](process-services/components/create-task-attachment.component.md)
-   [Data column component](core/components/data-column.component.md)
-   [Datatable component](core/components/datatable.component.md)
-   [Deleted nodes api service](core/services/deleted-nodes-api.service.md)
-   [Diagram component](insights/diagram.component.md)
-   [Discovery api service](core/services/discovery-api.service.md)
-   [Document actions service](content-services/services/document-actions.service.md)
-   [Document list component](content-services/components/document-list.component.md)
-   [Document list service](content-services/services/document-list.service.md)
-   [Download zip service](core/services/download-zip.service.md)
-   [Dropdown breadcrumb component](content-services/components/dropdown-breadcrumb.component.md)
-   [Ecm user model](core/models/ecm-user.model.md)
-   [Ecm user service](core/services/ecm-user.service.md)
-   [Empty list component](core/components/empty-list.component.md)
-   [Favorites api service](core/services/favorites-api.service.md)
-   [File draggable directive](content-services/directives/file-draggable.directive.md)
-   [File size pipe](core/pipes/file-size.pipe.md)
-   [File uploading dialog component](content-services/components/file-uploading-dialog.component.md)
-   [Folder actions service](content-services/services/folder-actions.service.md)
-   [Folder create directive](content-services/directives/folder-create.directive.md)
-   [Folder edit directive](content-services/directives/folder-edit.directive.md)
-   [Form field component](core/components/form-field.component.md)
-   [Form field model](core/models/form-field.model.md)
-   [Form list component](core/components/form-list.component.md)
-   [Form rendering service](core/services/form-rendering.service.md)
-   [Form component](core/components/form.component.md)
-   [Form service](core/services/form.service.md)
-   [Highlight transform service](core/services/highlight-transform.service.md)
-   [Highlight directive](core/directives/highlight.directive.md)
-   [Host settings component](core/components/host-settings.component.md)
-   [Image resolver model](content-services/models/image-resolver.model.md)
-   [Infinite pagination component](core/components/infinite-pagination.component.md)
-   [Info drawer layout component](core/components/info-drawer-layout.component.md)
-   [Info drawer component](core/components/info-drawer.component.md)
-   [Language menu component](core/components/language-menu.component.md)
-   [Like component](content-services/components/like.component.md)
-   [Log service](core/services/log.service.md)
-   [Login component](core/components/login.component.md)
-   [Logout directive](core/directives/logout.directive.md)
-   [Mime type icon pipe](core/pipes/mime-type-icon.pipe.md)
-   [Node delete directive](core/directives/node-delete.directive.md)
-   [Node favorite directive](core/directives/node-favorite.directive.md)
-   [Node name tooltip pipe](core/pipes/node-name-tooltip.pipe.md)
-   [Node permission service](content-services/services/node-permission.service.md)
-   [Node restore directive](core/directives/node-restore.directive.md)
-   [Node service](core/services/node.service.md)
-   [Nodes api service](core/services/nodes-api.service.md)
-   [Notification service](core/services/notification.service.md)
-   [Page title service](core/services/page-title.service.md)
-   [Pagination component](core/components/pagination.component.md)
-   [People content service](core/services/people-content.service.md)
-   [People list component](process-services/components/people-list.component.md)
-   [People process service](core/services/people-process.service.md)
-   [People search component](process-services/components/people-search.component.md)
-   [People component](process-services/components/people.component.md)
-   [Permissions style model](content-services/models/permissions-style.model.md)
-   [Process attachment list component](process-services/components/process-attachment-list.component.md)
-   [Process audit directive](process-services/directives/process-audit.directive.md)
-   [Process comments component](process-services/components/process-comments.component.md)
-   [Process content service](core/services/process-content.service.md)
-   [Process filter service](process-services/services/process-filter.service.md)
-   [Process filters component](process-services/components/process-filters.component.md)
-   [Process instance details component](process-services/components/process-instance-details.component.md)
-   [Process instance header component](process-services/components/process-instance-header.component.md)
-   [Process instance tasks component](process-services/components/process-instance-tasks.component.md)
-   [Process list component](process-services/components/process-list.component.md)
-   [Process service](process-services/services/process.service.md)
-   [Product version model](core/models/product-version.model.md)
-   [Rating component](content-services/components/rating.component.md)
-   [Rating service](content-services/services/rating.service.md)
-   [Renditions service](core/services/renditions.service.md)
-   [Row filter model](content-services/models/row-filter.model.md)
-   [Search control component](content-services/components/search-control.component.md)
-   [Search component](content-services/components/search.component.md)
-   [Search service](core/services/search.service.md)
-   [Select apps dialog component](process-services/components/select-apps-dialog.component.md)
-   [Shared links api service](core/services/shared-links-api.service.md)
-   [Sites dropdown component](content-services/components/sites-dropdown.component.md)
-   [Sites service](core/services/sites.service.md)
-   [Start form component](core/components/start-form.component.md)
-   [Start process component](process-services/components/start-process.component.md)
-   [Start task component](process-services/components/start-task.component.md)
-   [Storage service](core/services/storage.service.md)
-   [Tag actions component](content-services/components/tag-actions.component.md)
-   [Tag list component](content-services/components/tag-list.component.md)
-   [Tag node list component](content-services/components/tag-node-list.component.md)
-   [Tag service](content-services/services/tag.service.md)
-   [Task attachment list component](process-services/components/task-attachment-list.component.md)
-   [Task audit directive](process-services/directives/task-audit.directive.md)
-   [Task details component](process-services/components/task-details.component.md)
-   [Task filter service](process-services/services/task-filter.service.md)
-   [Task filters component](process-services/components/task-filters.component.md)
-   [Task header component](process-services/components/task-header.component.md)
-   [Task list component](process-services/components/task-list.component.md)
-   [Task standalone component](process-services/components/task-standalone.component.md)
-   [Tasklist service](process-services/services/tasklist.service.md)
-   [Text highlight pipe](core/pipes/text-highlight.pipe.md)
-   [Text mask component](core/components/text-mask.component.md)
-   [Thumbnail service](core/services/thumbnail.service.md)
-   [Time ago pipe](core/pipes/time-ago.pipe.md)
-   [Toolbar divider component](core/components/toolbar-divider.component.md)
-   [Toolbar title component](core/components/toolbar-title.component.md)
-   [Toolbar component](core/components/toolbar.component.md)
-   [Translation service](core/services/translation.service.md)
-   [Upload button component](content-services/components/upload-button.component.md)
-   [Upload drag area component](content-services/components/upload-drag-area.component.md)
-   [Upload directive](core/directives/upload.directive.md)
-   [Upload service](core/services/upload.service.md)
-   [User info component](core/components/user-info.component.md)
-   [User initial pipe](core/pipes/user-initial.pipe.md)
-   [User preferences service](core/services/user-preferences.service.md)
-   [User process model](core/models/user-process.model.md)
-   [Version list component](content-services/components/version-list.component.md)
-   [Version manager component](content-services/components/version-manager.component.md)
-   [Viewer component](core/components/viewer.component.md)
-   [Webscript component](content-services/components/webscript.component.md)
-   [Widget component](insights/widget.component.md)

<!--v200 end-->

([Back to top](#versions))

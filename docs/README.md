# Component Docs Index

Below is an index of the documentation for each component library. The [User Guide](#user-guide)
section discusses particular techniques in depth. The other sections are references for the ADF
components. Items marked with an asterisk (*) do not currently have documentation - the link leads
to the appropriate source file.

## Contents

- [User Guide](#user-guide)
- [ADF Analytics](#adf-analytics)
- [ADF Diagrams](#adf-diagrams)
- [ADF Form](#adf-form)
- [ADF Processlist](#adf-processlist)
- [ADF Tasklist](#adf-tasklist)
- [ADF Core](#adf-core)
- [ADF Datatable](#adf-datatable)
- [ADF Documentlist](#adf-documentlist)
- [ADF Login](#adf-login)
- [ADF Search](#adf-search)
- [ADF Social](#adf-social)
- [ADF Tag](#adf-tag)
- [ADF Upload](#adf-upload)
- [ADF Userinfo](#adf-userinfo)
- [ADF Viewer](#adf-viewer)
- [ADF Webscript](#adf-webscript)

## User guide

<!-- guide start -->
- [Form Extensibility and Customisation](extensibility.md)
- [Form Stencils with Angular 2](stencils.md)
- [Theming](theming.md)
- [Walkthrough: adding indicators to highlight information about a node](metadata-indicators.md)

<!-- guide end -->
[(Back to Contents)](#contents)

## ADF Analytics

Contains the Analytics component and other related items. See the library's
[README file](../ng2-components/ng2-activiti-analytics/README.md)
for more information about installing and using the source code.
<!-- ng2-activiti-analytics start -->

### Components

- [Analytics generator component](analytics-generator.component.md)
- [Analytics report list component](analytics-report-list.component.md)
- [Analytics component](analytics.component.md)
- [Widget component](widget.component.md)
- [*Analytics report heat map component](../ng2-components/ng2-activiti-analytics/src/components/analytics-report-heat-map.component.ts)
- [*Analytics report parameters component](../ng2-components/ng2-activiti-analytics/src/components/analytics-report-parameters.component.ts)

### Services

- [*Analytics service](../ng2-components/ng2-activiti-analytics/src/services/analytics.service.ts)

### Widgets

- [*Checkbox widget](../ng2-components/ng2-activiti-analytics/src/components/widgets/checkbox/checkbox.widget.ts)
- [*Date range widget](../ng2-components/ng2-activiti-analytics/src/components/widgets/date-range/date-range.widget.ts)
- [*Dropdown widget](../ng2-components/ng2-activiti-analytics/src/components/widgets/dropdown/dropdown.widget.ts)
- [*Duration widget](../ng2-components/ng2-activiti-analytics/src/components/widgets/duration/duration.widget.ts)
- [*Number widget](../ng2-components/ng2-activiti-analytics/src/components/widgets/number/number.widget.ts)
<!-- ng2-activiti-analytics end -->

[(Back to Contents)](#contents)

## ADF Diagrams

Contains the Diagram component and other related items. See the library's
[README file](../ng2-components/ng2-activiti-diagrams/README.md)
for more information about installing and using the source code.
<!-- ng2-activiti-diagrams start -->

### Components

- [Diagram component](diagram.component.md)
- [*Diagram alfresco publish task component](../ng2-components/ng2-activiti-diagrams/src/components/activities/diagram-alfresco-publish-task.component.ts)
- [*Diagram box publish task component](../ng2-components/ng2-activiti-diagrams/src/components/activities/diagram-box-publish-task.component.ts)
- [*Diagram business rule task component](../ng2-components/ng2-activiti-diagrams/src/components/activities/diagram-business-rule-task.component.ts)
- [*Diagram camel task component](../ng2-components/ng2-activiti-diagrams/src/components/activities/diagram-camel-task.component.ts)
- [*Diagram container service task component](../ng2-components/ng2-activiti-diagrams/src/components/activities/diagram-container-service-task.component.ts)
- [*Diagram google drive publish task component](../ng2-components/ng2-activiti-diagrams/src/components/activities/diagram-google-drive-publish-task.component.ts)
- [*Diagram manual task component](../ng2-components/ng2-activiti-diagrams/src/components/activities/diagram-manual-task.component.ts)
- [*Diagram mule task component](../ng2-components/ng2-activiti-diagrams/src/components/activities/diagram-mule-task.component.ts)
- [*Diagram receive task component](../ng2-components/ng2-activiti-diagrams/src/components/activities/diagram-receive-task.component.ts)
- [*Diagram rest call task component](../ng2-components/ng2-activiti-diagrams/src/components/activities/diagram-rest-call-task.component.ts)
- [*Diagram script task component](../ng2-components/ng2-activiti-diagrams/src/components/activities/diagram-script-task.component.ts)
- [*Diagram send task component](../ng2-components/ng2-activiti-diagrams/src/components/activities/diagram-send-task.component.ts)
- [*Diagram service task component](../ng2-components/ng2-activiti-diagrams/src/components/activities/diagram-service-task.component.ts)
- [*Diagram task component](../ng2-components/ng2-activiti-diagrams/src/components/activities/diagram-task.component.ts)
- [*Diagram user task component](../ng2-components/ng2-activiti-diagrams/src/components/activities/diagram-user-task.component.ts)
- [*Diagram boundary event component](../ng2-components/ng2-activiti-diagrams/src/components/boundary-events/diagram-boundary-event.component.ts)
- [*Diagram throw event component](../ng2-components/ng2-activiti-diagrams/src/components/boundary-events/diagram-throw-event.component.ts)
- [*Diagram sequence flow component](../ng2-components/ng2-activiti-diagrams/src/components/diagram-sequence-flow.component.ts)
- [*Diagram end event component](../ng2-components/ng2-activiti-diagrams/src/components/events/diagram-end-event.component.ts)
- [*Diagram event component](../ng2-components/ng2-activiti-diagrams/src/components/events/diagram-event.component.ts)
- [*Diagram start event component](../ng2-components/ng2-activiti-diagrams/src/components/events/diagram-start-event.component.ts)
- [*Diagram event gateway component](../ng2-components/ng2-activiti-diagrams/src/components/gateways/diagram-event-gateway.component.ts)
- [*Diagram exclusive gateway component](../ng2-components/ng2-activiti-diagrams/src/components/gateways/diagram-exclusive-gateway.component.ts)
- [*Diagram gateway component](../ng2-components/ng2-activiti-diagrams/src/components/gateways/diagram-gateway.component.ts)
- [*Diagram inclusive gateway component](../ng2-components/ng2-activiti-diagrams/src/components/gateways/diagram-inclusive-gateway.component.ts)
- [*Diagram parallel gateway component](../ng2-components/ng2-activiti-diagrams/src/components/gateways/diagram-parallel-gateway.component.ts)
- [*Diagram container icon event component](../ng2-components/ng2-activiti-diagrams/src/components/icons/diagram-container-icon-event.component.ts)
- [*Diagram icon alfresco publish task component](../ng2-components/ng2-activiti-diagrams/src/components/icons/diagram-icon-alfresco-publish-task.component.ts)
- [*Diagram icon box publish task component](../ng2-components/ng2-activiti-diagrams/src/components/icons/diagram-icon-box-publish-task.component.ts)
- [*Diagram icon business rule task component](../ng2-components/ng2-activiti-diagrams/src/components/icons/diagram-icon-business-rule-task.component.ts)
- [*Diagram icon camel task component](../ng2-components/ng2-activiti-diagrams/src/components/icons/diagram-icon-camel-task.component.ts)
- [*Diagram icon error component](../ng2-components/ng2-activiti-diagrams/src/components/icons/diagram-icon-error.component.ts)
- [*Diagram icon google drive publish task component](../ng2-components/ng2-activiti-diagrams/src/components/icons/diagram-icon-google-drive-publish-task.component.ts)
- [*Diagram icon manual task component](../ng2-components/ng2-activiti-diagrams/src/components/icons/diagram-icon-manual-task.component.ts)
- [*Diagram icon message component](../ng2-components/ng2-activiti-diagrams/src/components/icons/diagram-icon-message.component.ts)
- [*Diagram icon mule task component](../ng2-components/ng2-activiti-diagrams/src/components/icons/diagram-icon-mule-task.component.ts)
- [*Diagram icon receive task component](../ng2-components/ng2-activiti-diagrams/src/components/icons/diagram-icon-receive-task.component.ts)
- [*Diagram icon rest call task component](../ng2-components/ng2-activiti-diagrams/src/components/icons/diagram-icon-rest-call-task.component.ts)
- [*Diagram icon script task component](../ng2-components/ng2-activiti-diagrams/src/components/icons/diagram-icon-script-task.component.ts)
- [*Diagram icon send task component](../ng2-components/ng2-activiti-diagrams/src/components/icons/diagram-icon-send-task.component.ts)
- [*Diagram icon service task component](../ng2-components/ng2-activiti-diagrams/src/components/icons/diagram-icon-service-task.component.ts)
- [*Diagram icon signal component](../ng2-components/ng2-activiti-diagrams/src/components/icons/diagram-icon-signal.component.ts)
- [*Diagram icon timer component](../ng2-components/ng2-activiti-diagrams/src/components/icons/diagram-icon-timer.component.ts)
- [*Diagram icon user task component](../ng2-components/ng2-activiti-diagrams/src/components/icons/diagram-icon-user-task.component.ts)
- [*Diagram intermediate catching event component](../ng2-components/ng2-activiti-diagrams/src/components/intermediate-catching-events/diagram-intermediate-catching-event.component.ts)
- [*Raphael icon alfresco publish component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/icons/raphael-icon-alfresco-publish.component.ts)
- [*Raphael icon box publish component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/icons/raphael-icon-box-publish.component.ts)
- [*Raphael icon business rule component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/icons/raphael-icon-business-rule.component.ts)
- [*Raphael icon camel component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/icons/raphael-icon-camel.component.ts)
- [*Raphael icon error component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/icons/raphael-icon-error.component.ts)
- [*Raphael icon google drive publish component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/icons/raphael-icon-google-drive-publish.component.ts)
- [*Raphael icon manual component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/icons/raphael-icon-manual.component.ts)
- [*Raphael icon message component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/icons/raphael-icon-message.component.ts)
- [*Raphael icon mule component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/icons/raphael-icon-mule.component.ts)
- [*Raphael icon receive component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/icons/raphael-icon-receive.component.ts)
- [*Raphael icon rest call component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/icons/raphael-icon-rest-call.component.ts)
- [*Raphael icon script component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/icons/raphael-icon-script.component.ts)
- [*Raphael icon send component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/icons/raphael-icon-send.component.ts)
- [*Raphael icon service component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/icons/raphael-icon-service.component.ts)
- [*Raphael icon signal component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/icons/raphael-icon-signal.component.ts)
- [*Raphael icon timer component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/icons/raphael-icon-timer.component.ts)
- [*Raphael icon user component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/icons/raphael-icon-user.component.ts)
- [*Raphael circle component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/raphael-circle.component.ts)
- [*Raphael cross component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/raphael-cross.component.ts)
- [*Raphael flow arrow component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/raphael-flow-arrow.component.ts)
- [*Raphael multiline text component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/raphael-multiline-text.component.ts)
- [*Raphael pentagon component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/raphael-pentagon.component.ts)
- [*Raphael plus component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/raphael-plus.component.ts)
- [*Raphael rect component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/raphael-rect.component.ts)
- [*Raphael rhombus component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/raphael-rhombus.component.ts)
- [*Raphael text component](../ng2-components/ng2-activiti-diagrams/src/components/raphael/raphael-text.component.ts)
- [*Diagram event subprocess component](../ng2-components/ng2-activiti-diagrams/src/components/structural/diagram-event-subprocess.component.ts)
- [*Diagram subprocess component](../ng2-components/ng2-activiti-diagrams/src/components/structural/diagram-subprocess.component.ts)
- [*Diagram lane component](../ng2-components/ng2-activiti-diagrams/src/components/swimlanes/diagram-lane.component.ts)
- [*Diagram lanes component](../ng2-components/ng2-activiti-diagrams/src/components/swimlanes/diagram-lanes.component.ts)
- [*Diagram pool component](../ng2-components/ng2-activiti-diagrams/src/components/swimlanes/diagram-pool.component.ts)
- [*Diagram pools component](../ng2-components/ng2-activiti-diagrams/src/components/swimlanes/diagram-pools.component.ts)
- [*Diagram tooltip component](../ng2-components/ng2-activiti-diagrams/src/components/tooltip/diagram-tooltip.component.ts)

### Services

- [*Raphael service](../ng2-components/ng2-activiti-diagrams/src/components/raphael/raphael.service.ts)
- [*Diagram color service](../ng2-components/ng2-activiti-diagrams/src/services/diagram-color.service.ts)
- [*Diagrams service](../ng2-components/ng2-activiti-diagrams/src/services/diagrams.service.ts)
<!-- ng2-activiti-diagrams end -->

[(Back to Contents)](#contents)

## ADF Form

Contains the Form component and other related items. See the library's
[README file](../ng2-components/ng2-activiti-form/README.md)
for more information about installing and using the source code.
<!-- ng2-activiti-form start -->

### Components

- [Form list component](form-list.component.md)
- [Form component](form.component.md)
- [Widget component](widget.component.md)
- [*Form field component](../ng2-components/ng2-activiti-form/src/components/form-field/form-field.component.ts)
- [*Start form component](../ng2-components/ng2-activiti-form/src/components/start-form.component.ts)
- [*Error component](../ng2-components/ng2-activiti-form/src/components/widgets/error/error.component.ts)
- [*Text mask component](../ng2-components/ng2-activiti-form/src/components/widgets/text/text-mask.component.ts)

### Directives

- [*Form custom button directive](../ng2-components/ng2-activiti-form/src/components/form-custom-button.directive.ts)

### Models

- [Form field model](form-field.model.md)

### Services

- [Form rendering service](form-rendering.service.md)
- [Form service](form.service.md)
- [*Activiti alfresco service](../ng2-components/ng2-activiti-form/src/services/activiti-alfresco.service.ts)
- [*Node service](../ng2-components/ng2-activiti-form/src/services/node.service.ts)
- [*Widget visibility service](../ng2-components/ng2-activiti-form/src/services/widget-visibility.service.ts)

### Widgets

- [Content widget](content.widget.md)
- [*Amount widget](../ng2-components/ng2-activiti-form/src/components/widgets/amount/amount.widget.ts)
- [*Attach widget](../ng2-components/ng2-activiti-form/src/components/widgets/attach/attach.widget.ts)
- [*Checkbox widget](../ng2-components/ng2-activiti-form/src/components/widgets/checkbox/checkbox.widget.ts)
- [*Container widget](../ng2-components/ng2-activiti-form/src/components/widgets/container/container.widget.ts)
- [*Date widget](../ng2-components/ng2-activiti-form/src/components/widgets/date/date.widget.ts)
- [*Display text widget](../ng2-components/ng2-activiti-form/src/components/widgets/display-text/display-text.widget.ts)
- [*Document widget](../ng2-components/ng2-activiti-form/src/components/widgets/document/document.widget.ts)
- [*Dropdown widget](../ng2-components/ng2-activiti-form/src/components/widgets/dropdown/dropdown.widget.ts)
- [*Dynamic table widget](../ng2-components/ng2-activiti-form/src/components/widgets/dynamic-table/dynamic-table.widget.ts)
- [*Functional group widget](../ng2-components/ng2-activiti-form/src/components/widgets/functional-group/functional-group.widget.ts)
- [*Hyperlink widget](../ng2-components/ng2-activiti-form/src/components/widgets/hyperlink/hyperlink.widget.ts)
- [*Multiline text widget](../ng2-components/ng2-activiti-form/src/components/widgets/multiline-text/multiline-text.widget.ts)
- [*Number widget](../ng2-components/ng2-activiti-form/src/components/widgets/number/number.widget.ts)
- [*People widget](../ng2-components/ng2-activiti-form/src/components/widgets/people/people.widget.ts)
- [*Radio buttons widget](../ng2-components/ng2-activiti-form/src/components/widgets/radio-buttons/radio-buttons.widget.ts)
- [*Tabs widget](../ng2-components/ng2-activiti-form/src/components/widgets/tabs/tabs.widget.ts)
- [*Text widget](../ng2-components/ng2-activiti-form/src/components/widgets/text/text.widget.ts)
- [*Typeahead widget](../ng2-components/ng2-activiti-form/src/components/widgets/typeahead/typeahead.widget.ts)
- [*Unknown widget](../ng2-components/ng2-activiti-form/src/components/widgets/unknown/unknown.widget.ts)
- [*Upload widget](../ng2-components/ng2-activiti-form/src/components/widgets/upload/upload.widget.ts)
<!-- ng2-activiti-form end -->

### Other classes and interfaces

- [FormFieldValidator interface](FormFieldValidator.md)
[(Back to Contents)](#contents)

## ADF Processlist

Contains the Processlist component and other related items. See the library's
[README file](../ng2-components/ng2-activiti-processlist/README.md)
for more information about installing and using the source code.

<!-- ng2-activiti-processlist start -->

### Components

- [Create process attachment component](create-process-attachment.component.md)
- [Process attachment list component](process-attachment-list.component.md)
- [Process comments component](process-comments.component.md)
- [Process filters component](process-filters.component.md)
- [Process instance details component](process-instance-details.component.md)
- [Process instance header component](process-instance-header.component.md)
- [Process instance tasks component](process-instance-tasks.component.md)
- [Process list component](process-list.component.md)
- [Start process component](start-process.component.md)

### Directives

- [Process audit directive](process-audit.directive.md)

### Services

- [*Process upload service](../ng2-components/ng2-activiti-processlist/src/services/process-upload.service.ts)
- [*Process service](../ng2-components/ng2-activiti-processlist/src/services/process.service.ts)
<!-- ng2-activiti-processlist end -->

[(Back to Contents)](#contents)

## ADF Tasklist

Contains the Tasklist component and other related items. See the library's
[README file](../ng2-components/ng2-activiti-tasklist/README.md)
for more information about installing and using the source code.
<!-- ng2-activiti-tasklist start -->

### Components

- [Apps list component](apps-list.component.md)
- [Checklist component](checklist.component.md)
- [Comments component](comments.component.md)
- [Create task attachment component](create-task-attachment.component.md)
- [People search component](people-search.component.md)
- [People component](people.component.md)
- [Start task component](start-task.component.md)
- [Task attachment list component](task-attachment-list.component.md)
- [Task details component](task-details.component.md)
- [Task filters component](task-filters.component.md)
- [Task header component](task-header.component.md)
- [Tasklist component](task-list.component.md)
- [*Comment list component](../ng2-components/ng2-activiti-tasklist/src/components/comment-list.component.ts)
- [*People list component](../ng2-components/ng2-activiti-tasklist/src/components/people-list.component.ts)

### Directives

- [Task audit directive](task-audit.directive.md)
- [*No task detail template directive](../ng2-components/ng2-activiti-tasklist/src/components/no-task-detail-template.directive.ts)

### Models

- [Task details model](task-details.model.md)

### Services

- [*Process upload service](../ng2-components/ng2-activiti-tasklist/src/services/process-upload.service.ts)
- [*Tasklist service](../ng2-components/ng2-activiti-tasklist/src/services/tasklist.service.ts)
<!-- ng2-activiti-tasklist end -->

[(Back to Contents)](#contents)

## ADF Core

Contains a variety of components, directives and other classes used throughout ADF. See the library's
[README file](../ng2-components/ng2-alfresco-core/README.md)
for more information about installing and using the source code.
<!-- ng2-alfresco-core start -->

### Components

- [Accordion group component](accordion-group.component.md)
- [Accordion component](accordion.component.md)
- [Data column component](data-column.component.md)
- [Info drawer layout component](info-drawer-layout.component.md)
- [Info drawer component](info-drawer.component.md)
- [Language menu component](language-menu.component.md)
- [Pagination component](pagination.component.md)
- [Toolbar divider component](toolbar-divider.component.md)
- [Toolbar title component](toolbar-title.component.md)
- [Toolbar component](toolbar.component.md)
- [Card view component](card-view.component.md)
- [*Infinite pagination component](../ng2-components/ng2-alfresco-core/src/components/pagination/infinite-pagination.component.ts)

### Directives

- [Context menu directive](context-menu.directive.md)
- [Logout directive](logout.directive.md)
- [Node delete directive](node-delete.directive.md)
- [Node favorite directive](node-favorite.directive.md)
- [Node permission directive](node-permission.directive.md)
- [Node restore directive](node-restore.directive.md)
- [Upload directive](upload.directive.md)
- [*Card view content proxy directive](../ng2-components/ng2-alfresco-core/src/components/view/card-view-content-proxy.directive.ts)
- [*Highlight directive](../ng2-components/ng2-alfresco-core/src/directives/highlight.directive.ts)

### Pipes

- [Node name tooltip pipe](node-name-tooltip.pipe.md)
- [*File size pipe](../ng2-components/ng2-alfresco-core/src/pipes/file-size.pipe.ts)
- [*Mime type icon pipe](../ng2-components/ng2-alfresco-core/src/pipes/mime-type-icon.pipe.ts)
- [*Text highlight pipe](../ng2-components/ng2-alfresco-core/src/pipes/text-highlight.pipe.ts)
- [*Time ago pipe](../ng2-components/ng2-alfresco-core/src/pipes/time-ago.pipe.ts)
- [*User initial pipe](../ng2-components/ng2-alfresco-core/src/pipes/user-initial.pipe.ts)

### Services

- [Alfresco api service](alfresco-api.service.md)
- [App config service](app-config.service.md)
- [Authentication service](authentication.service.md)
- [Card view update service](card-view-update.service.md)
- [Notification service](notification.service.md)
- [Renditions service](renditions.service.md)
- [Translation service](translation.service.md)
- [Upload service](upload.service.md)
- [User preferences service](user-preferences.service.md)
- [*Context menu service](../ng2-components/ng2-alfresco-core/src/components/context-menu/context-menu.service.ts)
- [*Alfresco content service](../ng2-components/ng2-alfresco-core/src/services/alfresco-content.service.ts)
- [*Alfresco settings service](../ng2-components/ng2-alfresco-core/src/services/alfresco-settings.service.ts)
- [*Apps process service](../ng2-components/ng2-alfresco-core/src/services/apps-process.service.ts)
- [*Auth guard bpm service](../ng2-components/ng2-alfresco-core/src/services/auth-guard-bpm.service.ts)
- [*Auth guard ecm service](../ng2-components/ng2-alfresco-core/src/services/auth-guard-ecm.service.ts)
- [*Auth guard service](../ng2-components/ng2-alfresco-core/src/services/auth-guard.service.ts)
- [*Comment process service](../ng2-components/ng2-alfresco-core/src/services/comment-process.service.ts)
- [*Content service](../ng2-components/ng2-alfresco-core/src/services/content.service.ts)
- [*Cookie service](../ng2-components/ng2-alfresco-core/src/services/cookie.service.ts)
- [*Deleted nodes api service](../ng2-components/ng2-alfresco-core/src/services/deleted-nodes-api.service.ts)
- [*Discovery api service](../ng2-components/ng2-alfresco-core/src/services/discovery-api.service.ts)
- [*Favorites api service](../ng2-components/ng2-alfresco-core/src/services/favorites-api.service.ts)
- [*Highlight transform service](../ng2-components/ng2-alfresco-core/src/services/highlight-transform.service.ts)
- [Log service](log.service.md)
- [*Nodes api service](../ng2-components/ng2-alfresco-core/src/services/nodes-api.service.ts)
- [*Page title service](../ng2-components/ng2-alfresco-core/src/services/page-title.service.ts)
- [*People content service](../ng2-components/ng2-alfresco-core/src/services/people-content.service.ts)
- [*People process service](../ng2-components/ng2-alfresco-core/src/services/people-process.service.ts)
- [*Search api service](../ng2-components/ng2-alfresco-core/src/services/search-api.service.ts)
- [*Search service](../ng2-components/ng2-alfresco-core/src/services/search.service.ts)
- [*Shared links api service](../ng2-components/ng2-alfresco-core/src/services/shared-links-api.service.ts)
- [*Sites api service](../ng2-components/ng2-alfresco-core/src/services/sites-api.service.ts)
- [*Storage service](../ng2-components/ng2-alfresco-core/src/services/storage.service.ts)
- [*Thumbnail service](../ng2-components/ng2-alfresco-core/src/services/thumbnail.service.ts)
- [*Translate loader service](../ng2-components/ng2-alfresco-core/src/services/translate-loader.service.ts)
<!-- ng2-alfresco-core end -->  

[(Back to Contents)](#contents)

## ADF Datatable

Contains the Datatable component and other related items. See the library's
[README file](../ng2-components/ng2-alfresco-datatable/README.md)
for more information about installing and using the source code.
<!-- ng2-alfresco-datatable start -->

### Components

- [Datatable component](datatable.component.md)
- [*Datatable cell component](../ng2-components/ng2-alfresco-datatable/src/components/datatable/datatable-cell.component.ts)
- [*Date cell component](../ng2-components/ng2-alfresco-datatable/src/components/datatable/date-cell.component.ts)
- [*Filesize cell component](../ng2-components/ng2-alfresco-datatable/src/components/datatable/filesize-cell.component.ts)
- [*Location cell component](../ng2-components/ng2-alfresco-datatable/src/components/datatable/location-cell.component.ts)
<!-- ng2-alfresco-datatable end -->

### Other classes and interfaces

- [DataTableAdapter interface](DataTableAdapter.md)

[(Back to Contents)](#contents)

## ADF Documentlist

Contains the Document List component and other related items. See the library's
[README file](../ng2-components/ng2-alfresco-documentlist/README.md)
for more information about installing and using the source code.
<!-- ng2-alfresco-documentlist start -->

### Components

- [Breadcrumb component](breadcrumb.component.md)
- [Dropdown breadcrumb component](dropdown-breadcrumb.component.md)
- [Content action component](content-action.component.md)
- [Document list component](document-list.component.md)
- [Sites dropdown component](sites-dropdown.component.md)
- [*Content node selector component](../ng2-components/ng2-alfresco-documentlist/src/components/content-node-selector/content-node-selector.component.ts)

### Models

- [Permissions style model](permissions-style.model.md)

### Services

- [Document actions service](document-actions.service.md)
- [Folder actions service](folder-actions.service.md)
- [*Content node selector service](../ng2-components/ng2-alfresco-documentlist/src/components/content-node-selector/content-node-selector.service.ts)
- [*Document list service](../ng2-components/ng2-alfresco-documentlist/src/services/document-list.service.ts)
- [*Node actions service](../ng2-components/ng2-alfresco-documentlist/src/services/node-actions.service.ts)
<!-- ng2-alfresco-documentlist end -->

[(Back to Contents)](#contents)

## ADF Login

Contains the Login component and other related items. See the library's
[README file](../ng2-components/ng2-alfresco-login/README.md)
for more information about installing and using the source code.
<!-- ng2-alfresco-login start -->

### Components

- [Login component](login.component.md)

### Directives

- [*Login footer directive](../ng2-components/ng2-alfresco-login/src/directives/login-footer.directive.ts)
- [*Login header directive](../ng2-components/ng2-alfresco-login/src/directives/login-header.directive.ts)
<!-- ng2-alfresco-login end -->

[(Back to Contents)](#contents)

## ADF Search

Contains the Search component and other related items. See the library's
[README file](../ng2-components/ng2-alfresco-search/README.md)
for more information about installing and using the source code.
<!-- ng2-alfresco-search start -->

### Components

- [Search control component](search-control.component.md)
- [Search component](search.component.md)
- [*Search autocomplete component](../ng2-components/ng2-alfresco-search/src/components/search-autocomplete.component.ts)
<!-- ng2-alfresco-search end -->

[(Back to Contents)](#contents)

## ADF Social

Contains components for adding likes and ratings to items. See the library's
[README file](../ng2-components/ng2-alfresco-social/README.md)
for more information about installing and using the source code.
<!-- ng2-alfresco-social start -->

### Components

- [Like component](like.component.md)
- [Rating component](rating.component.md)

### Services

- [*Rating service](../ng2-components/ng2-alfresco-social/src/services/rating.service.ts)
<!-- ng2-alfresco-social end -->

[(Back to Contents)](#contents)

## ADF Tag

Contains components for adding tags to documents. See the library's
[README file](../ng2-components/ng2-alfresco-tag/README.md)
for more information about installing and using the source code.
<!-- ng2-alfresco-tag start -->

### Components

- [Tag actions component](tag-actions.component.md)
- [Tag list component](tag-list.component.md)
- [Tag node list component](tag-node-list.component.md)

### Services

- [*Tag service](../ng2-components/ng2-alfresco-tag/src/services/tag.service.ts)
<!-- ng2-alfresco-tag end -->

[(Back to Contents)](#contents)

## ADF Upload

Contains components for uploading files to Content Services. See the library's
[README file](../ng2-components/ng2-alfresco-upload/README.md)
for more information about installing and using the source code.
<!-- ng2-alfresco-upload start -->

### Components

- [File uploading dialog component](file-uploading-dialog.component.md)
- [Upload button component](upload-button.component.md)
- [Upload drag area component](upload-drag-area.component.md)
- [*File uploading list row component](../ng2-components/ng2-alfresco-upload/src/components/file-uploading-list-row.component.ts)
- [*File uploading list component](../ng2-components/ng2-alfresco-upload/src/components/file-uploading-list.component.ts)

### Directives

- [*File draggable directive](../ng2-components/ng2-alfresco-upload/src/directives/file-draggable.directive.ts)
<!-- ng2-alfresco-upload end -->

[(Back to Contents)](#contents)

## ADF Userinfo

Contains the User Info component and other related items. See the library's
[README file](../ng2-components/ng2-alfresco-userinfo/README.md)
for more information about installing and using the source code.
<!-- ng2-alfresco-userinfo start -->

### Components

- [User info component](user-info.component.md)

### Services

- [*Bpm user service](../ng2-components/ng2-alfresco-userinfo/src/services/bpm-user.service.ts)
- [*Ecm user service](../ng2-components/ng2-alfresco-userinfo/src/services/ecm-user.service.ts)
<!-- ng2-alfresco-userinfo end -->

[(Back to Contents)](#contents)

## ADF Viewer

Contains the Viewer component and other related items. See the library's
[README file](../ng2-components/ng2-alfresco-viewer/README.md)
for more information about installing and using the source code.
<!-- ng2-alfresco-viewer start -->

### Components

- [Viewer component](viewer.component.md)
- [*ImgViewer component](../ng2-components/ng2-alfresco-viewer/src/components/imgViewer.component.ts)
- [*MediaPlayer component](../ng2-components/ng2-alfresco-viewer/src/components/mediaPlayer.component.ts)
- [*PdfViewer component](../ng2-components/ng2-alfresco-viewer/src/components/pdfViewer.component.ts)
- [*TxtViewer component](../ng2-components/ng2-alfresco-viewer/src/components/txtViewer.component.ts)
- [*Unknown format component](../ng2-components/ng2-alfresco-viewer/src/components/unknown-format/unknown-format.component.ts)
- [*Viewer info drawer component](../ng2-components/ng2-alfresco-viewer/src/components/viewer-info-drawer.component.ts)
- [*Viewer toolbar component](../ng2-components/ng2-alfresco-viewer/src/components/viewer-toolbar.component.ts)

### Directives

- [*Extension viewer directive](../ng2-components/ng2-alfresco-viewer/src/directives/extension-viewer.directive.ts)
<!-- ng2-alfresco-viewer end -->

[(Back to Contents)](#contents)

## ADF Webscript

Contains the Webscript component. See the library's
[README file](../ng2-components/ng2-alfresco-webscript/README.md)
for more information about installing and using the source code.
<!-- ng2-alfresco-webscript start -->

### Components

- [Webscript component](webscript.component.md)
<!-- ng2-alfresco-webscript end -->
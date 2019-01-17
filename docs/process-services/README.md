---
Title: Process Services API
Github only: true
---

# Process Services API

Contains components related to Process Services.
See the library's
[README file](../../lib/process-services/README.md)
for more information about installing and using the source code.

<!--process-services start-->

## Components

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Apps list component](apps-list.component.md) | Shows all available apps. | [Source](../../lib/process-services/app-list/apps-list.component.ts) |
| [Create process attachment component](create-process-attachment.component.md) | Displays an Upload Component (Drag and Click) to upload the attachment to a specified process instance. | [Source](../../lib/process-services/attachment/create-process-attachment.component.ts) |
| [Create task attachment component](create-task-attachment.component.md) | Displays an Upload Component (Drag and Click) to upload the attachment to a specified task. | [Source](../../lib/process-services/attachment/create-task-attachment.component.ts) |
| [Process attachment list component](process-attachment-list.component.md) | Displays documents attached to a specified process instance. | [Source](../../lib/process-services/attachment/process-attachment-list.component.ts) |
| [Task attachment list component](task-attachment-list.component.md) | Displays documents attached to a specified task. | [Source](../../lib/process-services/attachment/task-attachment-list.component.ts) |
| [People component](people.component.md) | Displays users involved with a specified task | [Source](../../lib/process-services/people/components/people/people.component.ts) |
| [People list component](people-list.component.md) | Shows a list of users (people). | [Source](../../lib/process-services/people/components/people-list/people-list.component.ts) |
| [People search component](people-search.component.md) | Searches users/people. | [Source](../../lib/process-services/people/components/people-search/people-search.component.ts) |
| [Process comments component](process-comments.component.md) | Displays comments associated with a particular process instance and allows the user to add new comments. | [Source](../../lib/process-services/process-comments/process-comments.component.ts) |
| [Process filters component](process-filters.component.md) | Collection of criteria used to filter process instances, which may be customized by users. | [Source](../../lib/process-services/process-list/components/process-filters.component.ts) |
| [Process instance details component](process-instance-details.component.md) | Displays detailed information about a specified process instance | [Source](../../lib/process-services/process-list/components/process-instance-details.component.ts) |
| [Process instance header component](process-instance-header.component.md) | Sub-component of the process details component, which renders some general information about the selected process. | [Source](../../lib/process-services/process-list/components/process-instance-header.component.ts) |
| [Process instance tasks component](process-instance-tasks.component.md) | Lists both the active and completed tasks associated with a particular process instance | [Source](../../lib/process-services/process-list/components/process-instance-tasks.component.ts) |
| [Process list component](process-list.component.md) | Renders a list containing all the process instances matched by the parameters specified. | [Source](../../lib/process-services/process-list/components/process-list.component.ts) |
| [Start process component](start-process.component.md) | Starts a process. | [Source](../../lib/process-services/process-list/components/start-process.component.ts) |
| [Attach form component](attach-form.component.md) | This component can be used when there is no form attached to a task and you want to add one. | [Source](../../lib/process-services/task-list/components/attach-form.component.ts) |
| [Checklist component](checklist.component.md) | Shows the checklist task functionality. | [Source](../../lib/process-services/task-list/components/checklist.component.ts) |
| [Start task component](start-task.component.md) | Creates/Starts a new task for the specified app. | [Source](../../lib/process-services/task-list/components/start-task.component.ts) |
| [Task details component](task-details.component.md) | Shows the details of the task ID passed in as input. | [Source](../../lib/process-services/task-list/components/task-details.component.ts) |
| [Task filters component](task-filters.component.md) | Shows all available filters. | [Source](../../lib/process-services/task-list/components/task-filters.component.ts) |
| [Task header component](task-header.component.md) | Shows all the information related to a task. | [Source](../../lib/process-services/task-list/components/task-header.component.ts) |
| [Task list component](task-list.component.md) | Renders a list containing all the tasks matched by the parameters specified. | [Source](../../lib/process-services/task-list/components/task-list.component.ts) |
| [Task standalone component](task-standalone.component.md) | This component can be used when the task doesn't belong to any processes. | [Source](../../lib/process-services/task-list/components/task-standalone.component.ts) |

## Directives

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Process audit directive](process-audit.directive.md) | Fetches the Process Audit information in PDF or JSON format. | [Source](../../lib/process-services/process-list/components/process-audit.directive.ts) |
| [Task audit directive](task-audit.directive.md) | Fetches the Task Audit information in PDF or JSON format. | [Source](../../lib/process-services/task-list/components/task-audit.directive.ts) |

## Services

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Process filter service](process-filter.service.md) | Manage Process Filters, which are pre-configured Process Instance queries.  | [Source](../../lib/process-services/process-list/services/process-filter.service.ts) |
| [Process service](process.service.md) | Manages Process Instances, Process Variables, and Process Audit Log.  | [Source](../../lib/process-services/process-list/services/process.service.ts) |
| [Task filter service](task-filter.service.md) | Manage Task Filters, which are pre-configured Task Instance queries.  | [Source](../../lib/process-services/task-list/services/task-filter.service.ts) |
| [Tasklist service](tasklist.service.md) | Manages Task Instances. | [Source](../../lib/process-services/task-list/services/tasklist.service.ts) |

<!--process-services end-->

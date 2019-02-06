---
Title: Process Services Cloud API
Github only: true
---

# Process Services Cloud API

Contains components related to Process Services Cloud.
See the library's
[README file](../../lib/process-services-cloud/README.md)
for more information about installing and using the source code.

<!--process-services-cloud start-->

## Components

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [App list cloud component](app-list-cloud.component.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Shows all deployed cloud application instances. | [Source](../../lib/process-services-cloud/src/lib/app/components/app-list-cloud.component.ts) |
| [Group cloud component](group-cloud.component.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Searches Groups. | [Source](../../lib/process-services-cloud/src/lib/group/components/group-cloud.component.ts) |
| [Edit process filter cloud component](edit-process-filter-cloud.component.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Shows Process Filter Details. | [Source](../../lib/process-services-cloud/src/lib/process/process-filters/components/edit-process-filter-cloud.component.ts) |
| [Process filters cloud component](process-filters-cloud.component.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Lists all available process filters and allows to select a filter. | [Source](../../lib/process-services-cloud/src/lib/process/process-filters/components/process-filters-cloud.component.ts) |
| [Process list cloud component](process-list-cloud.component.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Renders a list containing all the process instances matched by the parameters specified. | [Source](../../lib/process-services-cloud/src/lib/process/process-list/components/process-list-cloud.component.ts) |
| [Start process cloud component](start-process-cloud.component.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Starts a process. | [Source](../../lib/process-services-cloud/src/lib/process/start-process/components/start-process-cloud.component.ts) |
| [People cloud component](people-cloud.component.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Allows one or more users to be selected (with auto-suggestion) based on the input parameters. | [Source](../../lib/process-services-cloud/src/lib/task/start-task/components/people-cloud/people-cloud.component.ts) |
| [Start task cloud component](start-task-cloud.component.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Creates/starts a new task for the specified app. | [Source](../../lib/process-services-cloud/src/lib/task/start-task/components/start-task-cloud.component.ts) |
| [Edit task filter cloud component](edit-task-filter-cloud.component.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Edits Task Filter Details. | [Source](../../lib/process-services-cloud/src/lib/task/task-filters/components/edit-task-filter-cloud.component.ts) |
| [Task filters cloud component](task-filters-cloud.component.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Shows all available filters. | [Source](../../lib/process-services-cloud/src/lib/task/task-filters/components/task-filters-cloud.component.ts) |
| [Task header cloud component](task-header-cloud.component.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Shows all the information related to a task. | [Source](../../lib/process-services-cloud/src/lib/task/task-header/components/task-header-cloud.component.ts) |
| [Task list cloud component](task-list-cloud.component.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Renders a list containing all the tasks matched by the parameters specified. | [Source](../../lib/process-services-cloud/src/lib/task/task-list/components/task-list-cloud.component.ts) |

## Pipes

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Group initial pipe](group-initial.pipe.md) | Extracts the initial character from a group name. | [Source](../../lib/process-services-cloud/src/lib/group/pipe/group-initial.pipe.ts) |

## Services

| Name | Description | Source link |
| ---- | ----------- | ----------- |
| [Apps process cloud service](apps-process-cloud.service.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Gets details of deployed apps for the current user.  | [Source](../../lib/process-services-cloud/src/lib/app/services/apps-process-cloud.service.ts) |
| [Group cloud service](group-cloud.service.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Searches and gets information for groups.  | [Source](../../lib/process-services-cloud/src/lib/group/services/group-cloud.service.ts) |
| [Process filter cloud service](process-filter-cloud.service.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Manage Process Filters, which are pre-configured Process Instance queries.  | [Source](../../lib/process-services-cloud/src/lib/process/process-filters/services/process-filter-cloud.service.ts) |
| [Process list cloud service](process-list-cloud.service.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Searches processes.  | [Source](../../lib/process-services-cloud/src/lib/process/process-list/services/process-list-cloud.service.ts) |
| [Start process cloud service](start-process-cloud.service.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Gets process definitions and starts processes.  | [Source](../../lib/process-services-cloud/src/lib/process/start-process/services/start-process-cloud.service.ts) |
| [Start task cloud service](start-task-cloud.service.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Starts standalone tasks.  | [Source](../../lib/process-services-cloud/src/lib/task/start-task/services/start-task-cloud.service.ts) |
| [Task filter cloud service](task-filter-cloud.service.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Manages task filters.  | [Source](../../lib/process-services-cloud/src/lib/task/task-filters/services/task-filter-cloud.service.ts) |
| [Task header cloud service](task-header-cloud.service.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Manages cloud tasks.  | [Source](../../lib/process-services-cloud/src/lib/task/task-header/services/task-header-cloud.service.ts) |
| [Task list cloud service](task-list-cloud.service.md) ![Experimental](../docassets/images/ExperimentalIcon.png) | Searches tasks.  | [Source](../../lib/process-services-cloud/src/lib/task/task-list/services/task-list-cloud.service.ts) |

<!--process-services-cloud end-->

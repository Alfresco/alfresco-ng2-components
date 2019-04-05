---
Title: Form service
Title: Form cloud service
Added: v3.2.0
Status: Active
Last reviewed: 2019-04-02
---

# [Form cloud service](../../../lib/process-services-cloud/src/lib/form/services/form-cloud.service.ts "Defined in form-cloud.service.ts")

Implements Process Services form methods

## Basic Usage

```ts
import { FormService } from '@alfresco/adf-core';

@Component(...)
class MyComponent {

    constructor(formService: FormService) {

}
```

### Methods

-   `parseForm(json: any, data?:`[`TaskVariableCloud,`](../../../lib/process-services-cloud/src/lib/form/models/task-variable-cloud.model.ts)`readOnly: boolean = false):`[`FormModel`](../../../lib/core/form/components/widgets/core/form.model.ts)  
    Parses JSON data to create a corresponding [`Form`](../../../lib/process-services-cloud/src/lib/form/models/form-cloud.model.ts) model.  
    -   `json` - JSON to create the form
    -   `data` - (Optional) [`Values`](../../../lib/process-services-cloud/src/lib/form/models/task-variable-cloud.model.ts) for the form fields
    -   `readOnly` - Should the form fields be read-only?

-   `saveTaskForm(appName: string, taskId: string, formId: string, formValues: FormValues):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Saves task [`form`](../../../lib/process-services-cloud/src/lib/form/models/form-cloud.model.ts).  
    -   `appName` - App Name
    -   `taskId` - Task Id
    -   `formId` - Form Id
    -   `formValues` - [`Form Values`](../../../lib/core/form/components/widgets/core/form-values.ts)

-   `completeTaskForm(appName: string, taskId: string, formId: string, formValues: FormValues, outcome: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Completes task [`form`](../../../lib/process-services-cloud/src/lib/form/models/form-cloud.model.ts)  
    -   `appName` - App Name
    -   `taskId` - Task Id
    -   `formId` - Form Id
    -   `formValues` - [`Form Values`](../../../lib/core/form/components/widgets/core/form-values.ts)
    -   `outcome` - (Optional) [`Form`](../../../lib/process-services-cloud/src/lib/form/models/form-cloud.model.ts) Outcome

-   `getTaskForm(appName: string, taskId: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Get form defintion of a task
    -   `appName` - App Name
    -   `taskId` - Task Id

-   `getForm(appName: string, formId: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Get a form definition
    -   `appName` - App Name
    -   `formId` - Form Id

-   `getTask(appName: string, taskId: string):`[`Observable`](http://reactivex.io/documentation/observable.html)<[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)>
    Gets details of a task.
    -   `appName` - App Name
    -   `taskId` - Task Id

-   `getTaskVariables(appName: string, taskId: string):`[`Observable`](http://reactivex.io/documentation/observable.html)<[`TaskVariableCloud`](../../../lib/process-services-cloud/src/lib/form/models/task-variable-cloud.model.ts)[]>
    Gets variables of a task.
    -   `appName` - App Name
    -   `taskId` - Task Id

---
Title: Form cloud service
Added: v3.2.0
Status: Active
Last reviewed: 2019-04-12
---

# [Form cloud service](../../../lib/testing/src/lib/form-cloud/actions/form-cloud.service.ts "Defined in form-cloud.service.ts")

Implements Process Services form methods

## Basic Usage

```ts
import { FormCloudService } from '@alfresco/adf-process-services-cloud';

@Component(...)
class MyComponent {

    constructor(formCloudService: FormCloudService) {}

}
```

## Class members

### Methods

-   **getForms**(appName: `string`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<any[]>`<br/>

    -   _appName:_ `string`  - 
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<any[]>` - 

-   **getIdByFormName**(appName: `string`, formName: `string`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<string>`<br/>

    -   _appName:_ `string`  - 
    -   _formName:_ `string`  - 
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<string>` - 

-   **submitForm**(formId: `any`, appName: `any`, taskId: `any`, processInstanceId: `any`, values: `any`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<any>`<br/>

    -   _formId:_ `any`  - 
    -   _appName:_ `any`  - 
    -   _taskId:_ `any`  - 
    -   _processInstanceId:_ `any`  - 
    -   _values:_ `any`  - 
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<any>` -

## See also

-   [Form cloud component](../components/form-cloud.component.md)

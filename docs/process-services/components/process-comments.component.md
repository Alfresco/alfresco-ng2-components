---
Title: Process Instance Comments component
Added: v2.0.0
Status: Active
---

# [Process Instance Comments component](../../../lib/process-services/src/lib/process-comments/process-comments.component.ts "Defined in process-comments.component.ts")

Displays comments associated with a particular process instance and allows the user to add new comments.

## Basic Usage

```html
<adf-process-instance-comments 
    processInstanceId="YOUR_PROCESS_INSTANCE_ID">
</adf-process-instance-comments>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| processInstanceId | `string` |  | (**required**) The numeric ID of the process instance to display comments for. |
| readOnly | `boolean` | true | Should the comments be read-only? |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs. |

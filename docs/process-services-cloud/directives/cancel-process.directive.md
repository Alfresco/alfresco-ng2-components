---
Title: Cancel Process Directive
Added: v3.7.0
Status: Experimental
Last reviewed: 2019-12-09
---

# [Cancel process directive](../../../lib/process-services-cloud/src/lib/process/directives/cancel-process.directive.ts "Defined in cancel-process.directive.ts")

Cancels a process

## Basic Usage

```html
<button adf-cloud-cancel-process (success)="onProcessCancelled()" (error)="onCancelProcessError()">Cancel</button>
```

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the process can not be cancelled. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the process is cancelled. |

---
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# Content widget

Shows an content preview for APS.

## Basic Usage

```html
<adf-content
    [contentId]="'1001'">
</adf-content>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| id | `string` |  | ID of the content to show. |
| showDocumentContent | `boolean` | true | Toggles visibility of the content preview. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| contentClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<Object>` | Emitted when the preview is clicked. |
| contentLoaded | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the content has loaded. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs. |
| thumbnailLoaded | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the content thumbnail has loaded. |

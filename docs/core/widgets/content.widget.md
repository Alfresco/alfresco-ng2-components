---
Title: APS Content Component
Added: v2.0.0
Status: Active
---

# [APS Content Component](../../../lib/core/form/components/widgets/content/content.widget.ts "Defined in content.widget.ts")

Shows the content preview.

## Basic Usage

```html
<adf-content
    [contentId]="'1001'">
</adf-content>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| id | `string` |  | The content id to show. |
| showDocumentContent | `boolean` | true | Toggles showing document content. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| contentClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the content is clicked. |
| contentLoaded | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the content has loaded. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs. |
| thumbnailLoaded | `EventEmitter<any>` | Emitted when the thumbnail has loaded. |

---
Title: APA Properties Viewer Widget
Added: v4.7.0
Status: Active
---

# [APA Properties Viewer Widget](../../../lib/process-services-cloud/src/lib/form/components/widgets/properties-viewer/properties-viewer.widget.ts "Defined in properties-viewer.widget.ts")

It makes use of the [content metadata card](../../content-services/components/content-metadata-card.component.md "content-metadata-card") to display the properties of the selected file in an attach [widget](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) in a form.

## Basic Usage

This a form [widget](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) so it receives the [`FormFieldModel`](../../core/models/form-field.model.md) form the form renderer with the following meanings:

| Accessor | Type | Description |
| -------- | ---- | ----------- |
| `field.value` | `string` | The nodeId of the node which properties are going to be displayed |
| `field.params.propertiesViewerOptions` | `object` | An object containing all the [properties of the content metadata card](../../content-services/components/content-metadata-card.component.md#properties "content-metadata-card properties") |

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| field | [`FormFieldModel`](../../core/models/form-field.model.md) |  | The field information |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| nodeContentLoaded | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<Node>` | Emitted when the properties to be displayed are retrieved from the [content service](../../core/services/content.service.md). |
| fieldChanged | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when the field changes |

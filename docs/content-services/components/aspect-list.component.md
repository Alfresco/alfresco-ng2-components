---
Title: Aspect List component
Added: v2.0.0
Status: Active
Last reviewed: 2021-01-20
---

# [Aspect List component](../../../lib/content-services/src/lib/aspect-list/aspect-list.component.ts "Defined in aspect-list.component.ts")

This component will show in an expandable row list with checkboxes all the aspect of a node, if a node id is given, or otherwise a complete list.
The aspect are filtered via the app.config.json in this way : 

```json
  "aspect-visible": {
    "default" : ["as:aspectThatWillBeShowedIfPresent"]
  }
```

## Basic Usage

```html
    <adf-aspect-list (valueChanged)="onValueChanged($event)" [nodeId]="nodeId">
    </adf-aspect-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| nodeId | `string` | "" | Node Id of the node that we want to update |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| valueChanged | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string[]>` | Emitted every time the user select a new aspect |

## See also

-   [Aspect List Dialog component](rating.component.md)
-   [Aspect List service](../services/rating.service.md)
-   [Node Aspect service](../services/rating.service.md)

---
Title: Aspect List component
Added: v2.0.0
Status: Active
Last reviewed: 2024-05-07
---

# Aspect List Component

`import { AspectListComponent } from '@alfresco/adf-content-services';`

This component will show in an expandable row list with checkboxes all the aspect of a node, if a node id is given, or otherwise a complete list.

The aspects are filtered via the `app.config.json` in the following way : 

```json
{
    "aspect-visible": {
        "default": [
            "as:aspectThatWillBeShowedIfPresent"
        ]
    }
}
```

## Basic Usage

```html
<adf-aspect-list
    [nodeId]="nodeId"
    (valueChanged)="onValueChanged($event)" 
    (updateCounter)="onUpdateCounter($event)">
</adf-aspect-list>
```

## Class members

### Properties

| Name            | Type       | Default value | Description                                         |
|-----------------|------------|---------------|-----------------------------------------------------|
| nodeId          | `string`   | ""            | Node Id of the node that we want to update          |
| excludedAspects | `string[]` | undefined     | List of aspects' ids which should not be displayed. |

### Events

| Name          | Type                                                                   | Description                                               |
|---------------|------------------------------------------------------------------------|-----------------------------------------------------------|
| valueChanged  | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string[]>` | Emitted every time the user select a new aspect           |
| updateCounter | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<number>`   | Emitted every time the number of selected aspects changes |

## See also

-   [Aspect List Dialog component](aspect-list-dialog.component.md)
-   [Aspect List service](../../../lib/content-services/src/lib/aspect-list/services/aspect-list.service.ts)
-   [Node Aspect service](../../../lib/content-services/src/lib/aspect-list/services/node-aspect.service.ts)

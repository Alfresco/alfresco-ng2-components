# ADF Like component

Allows a user to add "likes" to an item.

![Custom columns](docassets/images/social1.png)

## Basic Usage

```html
<adf-like [nodeId]="nodeId"></adf-like>
```

### Properties

| Attribute | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| nodeId | string |  | The identifier of a node. |

### Events

| Name | Description |
| ---- | ----------- |
| changeVote | Raised when vote gets changed |

## See also

-   [Rating component](rating.component.md)
-   [Rating service](rating.service.md)

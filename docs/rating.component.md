# ADF Rating component

Allows a user to add ratings to an item.

![Rating component screenshot](docassets/images/social2.png)

## Basic Usage

```html
<adf-rating  
    [nodeId]="'74cd8a96-8a21-47e5-9b3b-a1b3e296787d'">
</adf-rating>
``` 

### Properties

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| nodeId | string | | The identifier of a node |

### Events

| Name | Description |
| --- | --- |
| changeVote | Raised when vote gets changed |

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Like component](like.component.md)
- [Rating service](rating.service.md)
<!-- seealso end -->
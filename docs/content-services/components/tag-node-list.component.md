---
Title: Tag Node List component
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# [Tag Node List component](../../../lib/content-services/src/lib/tag/tag-node-list.component.ts "Defined in tag-node-list.component.ts")

Shows tags for a node.

![Custom columns](../../docassets/images/tag1.png)

## Basic Usage

```html
<adf-tag-node-list 
    [nodeId]="nodeId">
</adf-tag-node-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| limitTagsDisplayed | `boolean` | false | Should limit number of tags displayed |
| nodeId | `string` |  | The identifier of a node. |
| showDelete | `boolean` | true | Show delete button |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| results | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when a tag is selected. |

## Details

### Limit number of tags displayed initially

To limit number of tags initially displayed set `limitTagsDisplayed` to `true`.

```html
<adf-tag-node-list 
    [nodeId]="nodeId"
    [limitTagsDisplayed]="true">
</adf-tag-node-list>
```

Now when tag chips will exceed the size of the container number of displayed chips will be limited to as much as fits together with view more button. At least one tag will always be displayed, when one tag and view more button won't fit into one line the button will be displayed under the tag.

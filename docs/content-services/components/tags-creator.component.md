---
Title: Tags Creator component
Added: v6.0.0-A.3
Status: Active
Last reviewed: 2023-03-27
---

# [Tags Creator component](../../../lib/content-services/src/lib/tag/tags-creator/tags-creator.component.ts "Defined in tags-creator.component.ts")

Allows to create multiple tags. That component contains input and two lists. Top list is all created tags, bottom list is searched tags based on input's value. 

## Basic Usage

```html
<adf-tags-creator
    [(tagNameControlVisible)]="tagNameControlVisible"
    (tagsChange)="tags = $event"
    [mode]="tagsCreatorMode">
</adf-tags-creator>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| disabledTagsRemoving | `boolean` | false | False if tags can be removed from top list, true otherwise. |
| mode | `TagsCreatorMode` |  | Mode for component. In Create mode we can't select existing tags, we can only create them. In Create and Assign mode we can both - create tags and select existing tags. |
| tagNameControlVisible | `boolean` |  | Decides if input for tags creation/searching should be visible. When input is hidden then panel of existing tags is hidden as well. |
| tags | `string[]` |  | Default top list. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| existingTagsPanelVisibilityChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<boolean>` | Emitted when bottom list is showing or hiding. |
| tagNameControlVisibleChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<boolean>` | Emitted when input is showing or hiding. |
| tagsChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string[]>` | Emitted when tags in top list are changed. |

## Method: `get isNameTagsVisible(): boolean`

### Description
The `isNameTagsVisible` method is used within the Tags Creator Component to determine whether the tag name control should be visible. It calculates a boolean value based on specific conditions that take into account the visibility of the tag name control and the presence of tags in the component.

### Return Value
- Type: `boolean`
- `true` if the tag name control should be visible.
- `false` if the tag name control should not be visible.

### Usage
You can use this method to control the visibility of the tag name input field within the Tags creator Component. It provides a way to dynamically show or hide the input field based on certain criteria.

## Method: `get isTagsEmpty(): boolean`

### Description
The `isTagsEmpty` method is a utility method used within the Tags creator Component to check whether the list of tags is empty or not. It returns a boolean value, indicating whether there are tags present in the component.

### Return Value
- Type: `boolean`
- `true` if the list of tags is not empty.
- `false` if the list of tags is empty.

### Usage
You can use this method to programmatically determine whether there are tags available in the Tags creator Component. It is particularly useful when you need to conditionally display messages, elements, or take specific actions based on the presence or absence of tags.

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
